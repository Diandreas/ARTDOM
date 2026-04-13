import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, Eye, EyeOff, GripVertical, Plus, Trash2, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppLocale } from '@/hooks/use-app-locale';

interface User {
    id: string;
    name: string;
}

interface Slide {
    id: number;
    artist_id: string | null;
    type: string;
    title: string | null;
    subtitle: string | null;
    image_url: string;
    link_url: string | null;
    link_label: string | null;
    is_active: boolean;
    order: number;
    artist?: User | null;
}

interface Props {
    slides: Slide[];
    artists: User[];
    currentType: string;
}

function SlideForm({
    slide,
    artists,
    type,
    onClose,
}: {
    slide?: Slide;
    artists: User[];
    type: string;
    onClose: () => void;
}) {
    const { t } = useAppLocale();
    const form = useForm({
        artist_id: slide?.artist_id ?? '',
        type: slide?.type ?? type,
        title: slide?.title ?? '',
        subtitle: slide?.subtitle ?? '',
        image_url: slide?.image_url ?? '',
        link_url: slide?.link_url ?? '',
        link_label: slide?.link_label ?? '',
        is_active: slide?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (slide) {
            form.put(`/admin/carousel/${slide.id}`, {
                preserveScroll: true,
                onSuccess: onClose,
            });
        } else {
            form.post('/admin/carousel', {
                preserveScroll: true,
                onSuccess: onClose,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <Label htmlFor="artist_id">{t('Link to an artist (optional)')}</Label>
                    <Select
                        value={form.data.artist_id || 'none'}
                        onValueChange={(value) => form.setData('artist_id', value === 'none' ? '' : value)}
                    >
                        <SelectTrigger id="artist_id">
                            <SelectValue placeholder={t('Select an artist')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">{t('None (Manual)')}</SelectItem>
                            {artists.map((artist) => (
                                <SelectItem key={artist.id} value={artist.id}>
                                    {artist.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">{t("If linked, the artist's info will be used by default.")}</p>
                </div>
                
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <Label htmlFor="title">{t('Title')} {form.data.artist_id ? `(${t('Optional')})` : '*'}</Label>
                    <Input
                        id="title"
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                        placeholder={t('Discover our artists')}
                        required={!form.data.artist_id}
                    />
                    {form.errors.title && <p className="text-sm text-destructive">{form.errors.title}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <Label htmlFor="subtitle">{t('Subtitle')}</Label>
                    <Input
                        id="subtitle"
                        value={form.data.subtitle}
                        onChange={(e) => form.setData('subtitle', e.target.value)}
                        placeholder={t('African music everywhere')}
                    />
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <Label htmlFor="image_url">{t('Image URL')} {form.data.artist_id ? `(${t('Optional')})` : '*'}</Label>
                    <Input
                        id="image_url"
                        value={form.data.image_url}
                        onChange={(e) => form.setData('image_url', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        required={!form.data.artist_id}
                    />
                    {form.errors.image_url && <p className="text-sm text-destructive">{form.errors.image_url}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="link_url">{t('Link URL')}</Label>
                    <Input
                        id="link_url"
                        value={form.data.link_url}
                        onChange={(e) => form.setData('link_url', e.target.value)}
                        placeholder="/artstream"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="link_label">{t('Button text')}</Label>
                    <Input
                        id="link_label"
                        value={form.data.link_label}
                        onChange={(e) => form.setData('link_label', e.target.value)}
                        placeholder={t('Listen now')}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Switch
                        id="is_active"
                        checked={form.data.is_active}
                        onCheckedChange={(checked) => form.setData('is_active', checked)}
                    />
                    <Label htmlFor="is_active">{t('Active slide')}</Label>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={form.processing}>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? t('Saving...') : slide ? t('Update') : t('Add')}
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default function Carousel({ slides, artists, currentType }: Props) {
    const { t } = useAppLocale();
    const [showForm, setShowForm] = useState(false);
    const [editingSlide, setEditingSlide] = useState<Slide | null>(null);

    const handleDelete = (slide: Slide) => {
        if (confirm(`${t('Delete the slide')} "${slide.title || slide.artist?.name}" ?`)) {
            router.delete(`/admin/carousel/${slide.id}`, { preserveScroll: true });
        }
    };

    const handleToggle = (slide: Slide) => {
        router.patch(`/admin/carousel/${slide.id}/toggle`, {}, { preserveScroll: true });
    };

    const handleTypeChange = (type: string) => {
        router.get('/admin/carousel', { type }, { preserveState: true });
    };

    return (
        <AdminLayout 
            title={t('Homepage carousel')} 
            subtitle={t('Manage carousel slides (featured artists or hero section)')}
        >
            <Head title={`Admin — ${t('Homepage carousel')}`} />

            <div className="space-y-6">
                <Tabs value={currentType} onValueChange={handleTypeChange} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="main">{t('Featured artists')}</TabsTrigger>
                        <TabsTrigger value="hero">{t('Hero Section')}</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Add slide form */}
                {(showForm || editingSlide) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingSlide ? t('Edit slide') : t('New slide')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SlideForm
                                slide={editingSlide ?? undefined}
                                artists={artists}
                                type={currentType}
                                onClose={() => {
                                    setShowForm(false);
                                    setEditingSlide(null);
                                }}
                            />
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{t('Slides')} ({slides.length})</CardTitle>
                                <CardDescription>
                                    {currentType === 'main' 
                                        ? t('Artists featured in the main carousel.') 
                                        : t('Alternative content for the hero section carousel.')}
                                </CardDescription>
                            </div>
                            {!showForm && !editingSlide && (
                                <Button onClick={() => setShowForm(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    {t('Add a slide')}
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {slides.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-4 rounded-full bg-muted p-4">
                                    <Plus className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground">{t('No slides for this type. Add one to start.')}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {slides.map((slide) => (
                                    <div
                                        key={slide.id}
                                        className="flex items-center gap-4 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/30"
                                    >
                                        <GripVertical className="h-5 w-5 shrink-0 text-muted-foreground" />

                                        {slide.image_url ? (
                                            <img
                                                src={slide.image_url}
                                                alt={slide.title || 'Slide'}
                                                className="h-14 w-24 shrink-0 rounded object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/artemo-logo.png';
                                                }}
                                            />
                                        ) : (
                                            <div className="h-14 w-24 shrink-0 rounded bg-muted flex items-center justify-center">
                                                <UserIcon className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold truncate">
                                                    {slide.title || slide.artist?.name || t('Untitled')}
                                                </p>
                                                {slide.artist && (
                                                    <Badge variant="outline" className="text-[10px]">{t('Linked artist')}</Badge>
                                                )}
                                                <Badge variant={slide.is_active ? 'default' : 'secondary'}>
                                                    {slide.is_active ? t('Active') : t('Inactive')}
                                                </Badge>
                                            </div>
                                            {(slide.subtitle || (slide.artist && t('Artist Profile'))) && (
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {slide.subtitle || t('Artist Profile')}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleToggle(slide)}
                                                title={slide.is_active ? t('Deactivate') : t('Activate')}
                                            >
                                                {slide.is_active ? (
                                                    <Eye className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditingSlide(slide)}
                                                title={t('Update')}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(slide)}
                                                title={t('Delete')}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">{t('Tip')}:</strong> {t('Link a slide to an artist to promote their profile directly. The artist carousel appears at the bottom of the homepage, while the "Hero" carousel appears at the very top if enabled in settings.')}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
