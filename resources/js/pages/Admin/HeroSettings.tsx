import { Head, useForm } from '@inertiajs/react';
import { Image as ImageIcon, Layout, Play, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/layouts/admin-layout';
import { useAppLocale } from '@/hooks/use-app-locale';

interface HeroSettings {
    id: number;
    type: string;
    title: string | null;
    subtitle: string | null;
    image_url: string | null;
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
    const form = useForm({
        type: settings.type,
        title: settings.title ?? '',
        subtitle: settings.subtitle ?? '',
        image_url: settings.image_url ?? '',
        video_url: settings.video_url ?? '',
        link_url: settings.link_url ?? '',
        link_label: settings.link_label ?? '',
        is_active: settings.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put('/admin/hero-settings', {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout 
            title={t('Hero Section')} 
            subtitle={t('Customize the main banner on the homepage')}
        >
            <Head title={`Admin — ${t('Hero settings')}`} />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Settings */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('Banner content')}</CardTitle>
                                <CardDescription>{t('Modify the texts and links displayed on the banner.')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="title">{t('Main title')}</Label>
                                    <Input
                                        id="title"
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        placeholder={t('Discover talents...')}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="subtitle">{t('Subtitle / Description')}</Label>
                                    <Input
                                        id="subtitle"
                                        value={form.data.subtitle}
                                        onChange={(e) => form.setData('subtitle', e.target.value)}
                                        placeholder={t('Book your favorite artists...')}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="link_url">{t('Button URL')}</Label>
                                        <Input
                                            id="link_url"
                                            value={form.data.link_url}
                                            onChange={(e) => form.setData('link_url', e.target.value)}
                                            placeholder="/artists"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="link_label">{t('Button text')}</Label>
                                        <Input
                                            id="link_label"
                                            value={form.data.link_label}
                                            onChange={(e) => form.setData('link_label', e.target.value)}
                                            placeholder={t('Explore artists')}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t('Media type')}</CardTitle>
                                <CardDescription>{t('Choose what is displayed in the background.')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <RadioGroup
                                    value={form.data.type}
                                    onValueChange={(value) => form.setData('type', value)}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                    <div>
                                        <RadioGroupItem value="image" id="type-image" className="sr-only" />
                                        <Label
                                            htmlFor="type-image"
                                            className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                                                form.data.type === 'image' ? 'border-primary' : ''
                                            }`}
                                        >
                                            <ImageIcon className="mb-3 h-6 w-6" />
                                            <span>{t('Single image')}</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="carousel" id="type-carousel" className="sr-only" />
                                        <Label
                                            htmlFor="type-carousel"
                                            className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                                                form.data.type === 'carousel' ? 'border-primary' : ''
                                            }`}
                                        >
                                            <Layout className="mb-3 h-6 w-6" />
                                            <span>{t('Carousel')}</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="video" id="type-video" className="sr-only" />
                                        <Label
                                            htmlFor="type-video"
                                            className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                                                form.data.type === 'video' ? 'border-primary' : ''
                                            }`}
                                        >
                                            <Play className="mb-3 h-6 w-6" />
                                            <span>{t('Video')}</span>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {form.data.type === 'image' && (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="image_url">{t('Background image URL')}</Label>
                                        <Input
                                            id="image_url"
                                            value={form.data.image_url}
                                            onChange={(e) => form.setData('image_url', e.target.value)}
                                            placeholder="https://example.com/hero.jpg"
                                        />
                                        {form.data.image_url && (
                                            <div className="mt-2 relative h-40 w-full overflow-hidden rounded-lg">
                                                <img src={form.data.image_url} alt="Preview" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {form.data.type === 'video' && (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="video_url">{t('Video URL (MP4, Direct Link)')}</Label>
                                        <Input
                                            id="video_url"
                                            value={form.data.video_url}
                                            onChange={(e) => form.setData('video_url', e.target.value)}
                                            placeholder="https://example.com/hero.mp4"
                                        />
                                        <p className="text-xs text-muted-foreground">{t('The video will play in a loop and without sound.')}</p>
                                    </div>
                                )}

                                {form.data.type === 'carousel' && (
                                    <div className="rounded-lg bg-muted p-4">
                                        <p className="text-sm text-muted-foreground">
                                            {t('The carousel mode will use slides of type "Hero Section" configured in the')}
                                            <a href="/admin/carousel?type=hero" className="text-primary hover:underline ml-1 font-semibold">
                                                {t('Carousel Management')}
                                            </a>.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar / Status */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('Status')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_active">{t('Show banner')}</Label>
                                    <Switch
                                        id="is_active"
                                        checked={form.data.is_active}
                                        onCheckedChange={(checked) => form.setData('is_active', checked)}
                                    />
                                </div>
                                <Button type="submit" className="w-full gap-2" disabled={form.processing}>
                                    <Save className="h-4 w-4" />
                                    {form.processing ? t('Saving...') : t('Save changes')}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary text-primary-foreground">
                            <CardHeader>
                                <CardTitle className="text-lg">{t('Visual preview')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm opacity-90 italic">
                                    "{t('This section is the visual heart of your application. It uses the Sunset gradient to keep the ARTDOM identity.')}"
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
