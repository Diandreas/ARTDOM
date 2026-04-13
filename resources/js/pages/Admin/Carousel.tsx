import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, Eye, EyeOff, GripVertical, Plus, Trash2, User as UserIcon, Upload, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
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
    title_en: string | null;
    subtitle: string | null;
    subtitle_en: string | null;
    image_url: string;
    image_url_en: string | null;
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
    const imageInputRef = useRef<HTMLInputElement>(null);
    const imageEnInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        artist_id: slide?.artist_id ?? '',
        type: slide?.type ?? type,
        title: slide?.title ?? '',
        title_en: slide?.title_en ?? '',
        subtitle: slide?.subtitle ?? '',
        subtitle_en: slide?.subtitle_en ?? '',
        image: null as File | null,
        image_en: null as File | null,
        image_url: slide?.image_url ?? '',
        image_url_en: slide?.image_url_en ?? '',
        link_url: slide?.link_url ?? '',
        link_label: slide?.link_label ?? '',
        is_active: slide?.is_active ?? true,
        _method: slide ? 'put' : 'post'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = slide ? `/admin/carousel/${slide.id}` : '/admin/carousel';
        
        // We use post with _method: put for file uploads in Laravel
        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: onClose,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="artist_id" className="text-xs">{t('Link to an artist (optional)')}</Label>
                    <Select
                        value={form.data.artist_id || 'none'}
                        onValueChange={(value) => form.setData('artist_id', value === 'none' ? '' : value)}
                    >
                        <SelectTrigger id="artist_id" className="h-9 text-sm">
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
                </div>
                
                <div className="space-y-1">
                    <Label htmlFor="title" className="text-xs">{t('Title')} (FR) {form.data.artist_id ? `(${t('Optional')})` : '*'}</Label>
                    <Input
                        id="title"
                        className="h-9 text-sm"
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                        placeholder={t('Discover our artists')}
                        required={!form.data.artist_id}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="title_en" className="text-xs">{t('Title')} (EN) {t('Optional')}</Label>
                    <Input
                        id="title_en"
                        className="h-9 text-sm"
                        value={form.data.title_en}
                        onChange={(e) => form.setData('title_en', e.target.value)}
                        placeholder="Discover our artists"
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="subtitle" className="text-xs">{t('Subtitle')} (FR)</Label>
                    <Input
                        id="subtitle"
                        className="h-9 text-sm"
                        value={form.data.subtitle}
                        onChange={(e) => form.setData('subtitle', e.target.value)}
                        placeholder={t('African music everywhere')}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="subtitle_en" className="text-xs">{t('Subtitle')} (EN)</Label>
                    <Input
                        id="subtitle_en"
                        className="h-9 text-sm"
                        value={form.data.subtitle_en}
                        onChange={(e) => form.setData('subtitle_en', e.target.value)}
                        placeholder="African music everywhere"
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="link_url" className="text-xs">{t('Link URL')}</Label>
                    <Input
                        id="link_url"
                        className="h-9 text-sm"
                        value={form.data.link_url}
                        onChange={(e) => form.setData('link_url', e.target.value)}
                        placeholder="/artstream"
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="link_label" className="text-xs">{t('Button text')}</Label>
                    <Input
                        id="link_label"
                        className="h-9 text-sm"
                        value={form.data.link_label}
                        onChange={(e) => form.setData('link_label', e.target.value)}
                        placeholder={t('Listen now')}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-2">
                    <Label className="text-xs">{t('Image')} (FR) {form.data.artist_id ? `(${t('Optional')})` : '*'}</Label>
                    <div className="flex flex-col gap-2">
                        {(form.data.image_url || form.data.image) && (
                            <div className="relative aspect-video w-full overflow-hidden rounded border">
                                <img 
                                    src={form.data.image ? URL.createObjectURL(form.data.image) : form.data.image_url} 
                                    className="h-full w-full object-cover" 
                                    alt="Preview" 
                                />
                            </div>
                        )}
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="w-full gap-2 h-9"
                            onClick={() => imageInputRef.current?.click()}
                        >
                            <Upload className="h-4 w-4" /> {t('Upload image')} (FR)
                        </Button>
                        <input 
                            type="file" 
                            ref={imageInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={e => form.setData('image', e.target.files?.[0] || null)}
                        />
                        <Input
                            placeholder={t('Or image URL...')}
                            value={form.data.image_url}
                            onChange={e => form.setData('image_url', e.target.value)}
                            className="h-8 text-xs"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs">{t('Image')} (EN) {t('Optional')}</Label>
                    <div className="flex flex-col gap-2">
                        {(form.data.image_url_en || form.data.image_en) && (
                            <div className="relative aspect-video w-full overflow-hidden rounded border">
                                <img 
                                    src={form.data.image_en ? URL.createObjectURL(form.data.image_en) : form.data.image_url_en} 
                                    className="h-full w-full object-cover" 
                                    alt="Preview EN" 
                                />
                            </div>
                        )}
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="w-full gap-2 h-9"
                            onClick={() => imageEnInputRef.current?.click()}
                        >
                            <Upload className="h-4 w-4" /> {t('Upload image')} (EN)
                        </Button>
                        <input 
                            type="file" 
                            ref={imageEnInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={e => form.setData('image_en', e.target.files?.[0] || null)}
                        />
                        <Input
                            placeholder={t('Or English image URL...')}
                            value={form.data.image_url_en}
                            onChange={e => form.setData('image_url_en', e.target.value)}
                            className="h-8 text-xs"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                    <Switch
                        id="is_active"
                        checked={form.data.is_active}
                        onCheckedChange={(checked) => form.setData('is_active', checked)}
                    />
                    <Label htmlFor="is_active" className="text-xs">{t('Active slide')}</Label>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={form.processing}>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" size="sm" disabled={form.processing}>
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

            <div className="space-y-4">
                <Tabs value={currentType} onValueChange={handleTypeChange} className="w-full">
                    <TabsList className="grid w-full max-w-xs grid-cols-2 h-9">
                        <TabsTrigger value="main" className="text-xs">{t('Featured artists')}</TabsTrigger>
                        <TabsTrigger value="hero" className="text-xs">{t('Hero Section')}</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Add slide form */}
                {(showForm || editingSlide) && (
                    <Card className="border-primary/20">
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-base">{editingSlide ? t('Edit slide') : t('New slide')}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
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
                    <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-base font-semibold">{t('Slides')} ({slides.length})</CardTitle>
                        </div>
                        {!showForm && !editingSlide && (
                            <Button onClick={() => setShowForm(true)} size="sm" className="gap-1.5 h-8">
                                <Plus className="h-3.5 w-3.5" />
                                {t('Add')}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4">
                        {slides.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <Plus className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                <p className="text-xs text-muted-foreground">{t('No slides for this type.')}</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {slides.map((slide) => (
                                    <div
                                        key={slide.id}
                                        className="flex items-center gap-3 rounded-lg border bg-card p-2 transition-colors hover:bg-muted/30"
                                    >
                                        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground cursor-grab" />

                                        <div className="h-12 w-20 shrink-0 rounded overflow-hidden bg-muted">
                                            <img
                                                src={slide.image_url}
                                                alt={slide.title || 'Slide'}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/artemo-logo.png';
                                                }}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <p className="text-sm font-semibold truncate leading-none">
                                                    {slide.title || slide.artist?.name || t('Untitled')}
                                                </p>
                                                {slide.is_active ? (
                                                    <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-green-50 text-green-700 border-green-100">{t('Active')}</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="h-4 px-1 text-[9px]">{t('Inactive')}</Badge>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground truncate mt-1">
                                                {slide.subtitle || (slide.artist ? t('Artist Profile') : '-')}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleToggle(slide)}
                                            >
                                                {slide.is_active ? (
                                                    <Eye className="h-3.5 w-3.5 text-primary" />
                                                ) : (
                                                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setEditingSlide(slide)}
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(slide)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="p-3 rounded-lg border border-primary/10 bg-primary/5">
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                        <strong className="text-primary font-bold">{t('Tip')}:</strong> {t('Link a slide to an artist to promote their profile directly.')} 
                        {t(' Upload different images for the English version if text is embedded in the graphics.')}
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
