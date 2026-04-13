import { Head, useForm } from '@inertiajs/react';
import { Image as ImageIcon, Layout, Play, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/layouts/admin-layout';

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
            title="Section Héros (Rouge)" 
            subtitle="Personnalisez la bannière principale de la page d'accueil"
        >
            <Head title="Admin — Réglages Héros" />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Settings */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contenu de la bannière</CardTitle>
                                <CardDescription>Modifiez les textes et les liens affichés sur la bannière.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="title">Titre principal</Label>
                                    <Input
                                        id="title"
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        placeholder="Découvrez les talents..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="subtitle">Sous-titre / Description</Label>
                                    <Input
                                        id="subtitle"
                                        value={form.data.subtitle}
                                        onChange={(e) => form.setData('subtitle', e.target.value)}
                                        placeholder="Réservez vos artistes préférés..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="link_url">URL du bouton</Label>
                                        <Input
                                            id="link_url"
                                            value={form.data.link_url}
                                            onChange={(e) => form.setData('link_url', e.target.value)}
                                            placeholder="/artists"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="link_label">Texte du bouton</Label>
                                        <Input
                                            id="link_label"
                                            value={form.data.link_label}
                                            onChange={(e) => form.setData('link_label', e.target.value)}
                                            placeholder="Explorer les artistes"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Type de média</CardTitle>
                                <CardDescription>Choisissez ce qui s'affiche en arrière-plan.</CardDescription>
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
                                            <span>Image unique</span>
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
                                            <span>Carrousel</span>
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
                                            <span>Vidéo</span>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {form.data.type === 'image' && (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="image_url">URL de l'image de fond</Label>
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
                                        <Label htmlFor="video_url">URL de la vidéo (MP4, Direct Link)</Label>
                                        <Input
                                            id="video_url"
                                            value={form.data.video_url}
                                            onChange={(e) => form.setData('video_url', e.target.value)}
                                            placeholder="https://example.com/hero.mp4"
                                        />
                                        <p className="text-xs text-muted-foreground">La vidéo sera jouée en boucle et sans son.</p>
                                    </div>
                                )}

                                {form.data.type === 'carousel' && (
                                    <div className="rounded-lg bg-muted p-4">
                                        <p className="text-sm text-muted-foreground">
                                            Le mode carrousel utilisera les slides de type "Section Héros" configurées dans la section 
                                            <a href="/admin/carousel?type=hero" className="text-primary hover:underline ml-1 font-semibold">
                                                Gestion des Carrousels
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
                                <CardTitle>Statut</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_active">Afficher la bannière</Label>
                                    <Switch
                                        id="is_active"
                                        checked={form.data.is_active}
                                        onCheckedChange={(checked) => form.setData('is_active', checked)}
                                    />
                                </div>
                                <Button type="submit" className="w-full gap-2" disabled={form.processing}>
                                    <Save className="h-4 w-4" />
                                    {form.processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary text-primary-foreground">
                            <CardHeader>
                                <CardTitle className="text-lg">Aperçu visuel</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm opacity-90 italic">
                                    "Cette section est le cœur visuel de votre application. Elle utilise le dégradé 'Sunset' pour garder l'identité ARTDOM."
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
