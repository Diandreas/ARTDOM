import { Head, useForm } from '@inertiajs/react';
import { Image as ImageIcon, Layout, Play, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/layouts/admin-layout';
import { useAppLocale } from '@/hooks/use-app-locale';
import { useRef } from 'react';

interface HeroSettings {
    id: number;
    type: string;
    title: string | null;
    title_en: string | null;
    subtitle: string | null;
    subtitle_en: string | null;
    image_url: string | null;
    image_url_en: string | null;
    video_url: string | null;
    link_url: string | null;
    link_label: string | null;
    is_active: boolean;
}

interface Props {
    settings: HeroSettings;
}

export default function HeroSettings({ settings }: Props) {
    const { t } = useAppLocale();
    const imageInputRef = useRef<HTMLInputElement>(null);
    const imageEnInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        type: settings.type,
        title: settings.title ?? '',
        title_en: settings.title_en ?? '',
        subtitle: settings.subtitle ?? '',
        subtitle_en: settings.subtitle_en ?? '',
        image: null as File | null,
        image_en: null as File | null,
        image_url: settings.image_url ?? '',
        image_url_en: settings.image_url_en ?? '',
        video_url: settings.video_url ?? '',
        link_url: settings.link_url ?? '',
        link_label: settings.link_label ?? '',
        is_active: settings.is_active,
        _method: 'put'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/hero-settings', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout 
            title={t('Hero Section')} 
            subtitle={t('Customize the main banner on the homepage')}
        >
            <Head title={`Admin — ${t('Hero settings')}`} />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Settings */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader className="py-3 px-4">
                                <CardTitle className="text-base">{t('Banner content')}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="title" className="text-xs">{t('Main title')} (FR)</Label>
                                        <Input
                                            id="title"
                                            className="h-9 text-sm"
                                            value={form.data.title}
                                            onChange={(e) => form.setData('title', e.target.value)}
                                            placeholder={t('Discover talents...')}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="title_en" className="text-xs">{t('Main title')} (EN)</Label>
                                        <Input
                                            id="title_en"
                                            className="h-9 text-sm"
                                            value={form.data.title_en}
                                            onChange={(e) => form.setData('title_en', e.target.value)}
                                            placeholder="Discover talents..."
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="subtitle" className="text-xs">{t('Subtitle')} (FR)</Label>
                                        <Input
                                            id="subtitle"
                                            className="h-9 text-sm"
                                            value={form.data.subtitle}
                                            onChange={(e) => form.setData('subtitle', e.target.value)}
                                            placeholder={t('Book your favorite artists...')}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="subtitle_en" className="text-xs">{t('Subtitle')} (EN)</Label>
                                        <Input
                                            id="subtitle_en"
                                            className="h-9 text-sm"
                                            value={form.data.subtitle_en}
                                            onChange={(e) => form.setData('subtitle_en', e.target.value)}
                                            placeholder="Book your favorite artists..."
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="link_url" className="text-xs">{t('Button URL')}</Label>
                                        <Input
                                            id="link_url"
                                            className="h-9 text-sm"
                                            value={form.data.link_url}
                                            onChange={(e) => form.setData('link_url', e.target.value)}
                                            placeholder="/artists"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="link_label" className="text-xs">{t('Button text')}</Label>
                                        <Input
                                            id="link_label"
                                            className="h-9 text-sm"
                                            value={form.data.link_label}
                                            onChange={(e) => form.setData('link_label', e.target.value)}
                                            placeholder={t('Explore artists')}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="py-3 px-4">
                                <CardTitle className="text-base">{t('Media type')}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-4">
                                <RadioGroup
                                    value={form.data.type}
                                    onValueChange={(value) => form.setData('type', value)}
                                    className="grid grid-cols-3 gap-2"
                                >
                                    <div>
                                        <RadioGroupItem value="image" id="type-image" className="sr-only" />
                                        <Label
                                            htmlFor="type-image"
                                            className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all ${
                                                form.data.type === 'image' ? 'border-primary bg-primary/5' : ''
                                            }`}
                                        >
                                            <ImageIcon className="mb-1 h-5 w-5" />
                                            <span className="text-[10px] uppercase font-bold">{t('Image')}</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="carousel" id="type-carousel" className="sr-only" />
                                        <Label
                                            htmlFor="type-carousel"
                                            className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all ${
                                                form.data.type === 'carousel' ? 'border-primary bg-primary/5' : ''
                                            }`}
                                        >
                                            <Layout className="mb-1 h-5 w-5" />
                                            <span className="text-[10px] uppercase font-bold">{t('Carousel')}</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="video" id="type-video" className="sr-only" />
                                        <Label
                                            htmlFor="type-video"
                                            className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all ${
                                                form.data.type === 'video' ? 'border-primary bg-primary/5' : ''
                                            }`}
                                        >
                                            <Play className="mb-1 h-5 w-5" />
                                            <span className="text-[10px] uppercase font-bold">{t('Video')}</span>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {form.data.type === 'image' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs">{t('Background image')} (FR)</Label>
                                            <div className="flex flex-col gap-2">
                                                {(form.data.image_url || form.data.image) && (
                                                    <div className="relative aspect-video w-full overflow-hidden rounded border">
                                                        <img 
                                                            src={form.data.image ? URL.createObjectURL(form.data.image) : form.data.image_url || ''} 
                                                            className="h-full w-full object-cover" 
                                                            alt="Preview" 
                                                        />
                                                    </div>
                                                )}
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="w-full gap-2 h-8 text-xs"
                                                    onClick={() => imageInputRef.current?.click()}
                                                >
                                                    <Upload className="h-3.5 w-3.5" /> {t('Upload')} (FR)
                                                </Button>
                                                <input 
                                                    type="file" 
                                                    ref={imageInputRef} 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={e => form.setData('image', e.target.files?.[0] || null)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">{t('Background image')} (EN)</Label>
                                            <div className="flex flex-col gap-2">
                                                {(form.data.image_url_en || form.data.image_en) && (
                                                    <div className="relative aspect-video w-full overflow-hidden rounded border">
                                                        <img 
                                                            src={form.data.image_en ? URL.createObjectURL(form.data.image_en) : form.data.image_url_en || ''} 
                                                            className="h-full w-full object-cover" 
                                                            alt="Preview EN" 
                                                        />
                                                    </div>
                                                )}
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="w-full gap-2 h-8 text-xs"
                                                    onClick={() => imageEnInputRef.current?.click()}
                                                >
                                                    <Upload className="h-3.5 w-3.5" /> {t('Upload')} (EN)
                                                </Button>
                                                <input 
                                                    type="file" 
                                                    ref={imageEnInputRef} 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={e => form.setData('image_en', e.target.files?.[0] || null)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {form.data.type === 'video' && (
                                    <div className="space-y-1.5 border-t pt-4">
                                        <Label htmlFor="video_url" className="text-xs">{t('Video URL (MP4, Direct Link)')}</Label>
                                        <Input
                                            id="video_url"
                                            className="h-9 text-sm"
                                            value={form.data.video_url}
                                            onChange={(e) => form.setData('video_url', e.target.value)}
                                            placeholder="https://example.com/hero.mp4"
                                        />
                                        <p className="text-[10px] text-muted-foreground">{t('The video will play in a loop and without sound.')}</p>
                                    </div>
                                )}

                                {form.data.type === 'carousel' && (
                                    <div className="rounded-lg bg-muted p-3 border-t">
                                        <p className="text-xs text-muted-foreground">
                                            {t('The carousel mode will use slides of type "Hero Section" configured in the')}
                                            <Link href="/admin/carousel?type=hero" className="text-primary hover:underline ml-1 font-semibold">
                                                {t('Carousel Management')}
                                            </Link>.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar / Status */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="py-3 px-4">
                                <CardTitle className="text-base">{t('Status')}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">{t('Show banner')}</Label>
                                    <Switch
                                        id="is_active"
                                        checked={form.data.is_active}
                                        onCheckedChange={(checked) => form.setData('is_active', checked)}
                                    />
                                </div>
                                <Button type="submit" className="w-full gap-2 h-10" disabled={form.processing}>
                                    <Save className="h-4 w-4" />
                                    {form.processing ? t('Saving...') : t('Save changes')}
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="p-4 rounded-lg bg-primary text-primary-foreground shadow-lg">
                            <h4 className="font-bold text-sm mb-1">{t('Pro Tip')}</h4>
                            <p className="text-xs opacity-90 leading-relaxed">
                                {t('Use high-quality media (1920x600px) for the best impact. Image uploads are automatically optimized.')}
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
