import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/layouts/admin-layout';

interface Slide {
    id: number;
    title: string;
    subtitle: string | null;
    image_url: string;
    link_url: string | null;
    link_label: string | null;
    is_active: boolean;
    order: number;
}

interface Props {
    slides: Slide[];
}

function SlideForm({
    slide,
    onClose,
}: {
    slide?: Slide;
    onClose: () => void;
}) {
    const form = useForm({
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
                <div className="space-y-1.5">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                        id="title"
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                        placeholder="Découvrez nos artistes"
                        required
                    />
                    {form.errors.title && <p className="text-sm text-destructive">{form.errors.title}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="subtitle">Sous-titre</Label>
                    <Input
                        id="subtitle"
                        value={form.data.subtitle}
                        onChange={(e) => form.setData('subtitle', e.target.value)}
                        placeholder="La musique africaine en streaming"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="image_url">URL de l'image *</Label>
                <Input
                    id="image_url"
                    value={form.data.image_url}
                    onChange={(e) => form.setData('image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    required
                />
                {form.errors.image_url && <p className="text-sm text-destructive">{form.errors.image_url}</p>}
                {form.data.image_url && (
                    <img
                        src={form.data.image_url}
                        alt="Preview"
                        className="mt-2 h-24 w-full rounded-lg object-cover"
                        onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                    />
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="link_url">URL du lien</Label>
                    <Input
                        id="link_url"
                        value={form.data.link_url}
                        onChange={(e) => form.setData('link_url', e.target.value)}
                        placeholder="/artstream"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="link_label">Texte du bouton</Label>
                    <Input
                        id="link_label"
                        value={form.data.link_label}
                        onChange={(e) => form.setData('link_label', e.target.value)}
                        placeholder="Écouter maintenant"
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
                    <Label htmlFor="is_active">Slide active</Label>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={form.processing}>
                        Annuler
                    </Button>
                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Enregistrement...' : slide ? 'Mettre à jour' : 'Ajouter'}
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default function Carousel({ slides }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editingSlide, setEditingSlide] = useState<Slide | null>(null);

    const handleDelete = (slide: Slide) => {
        if (confirm(`Supprimer la slide "${slide.title}" ?`)) {
            router.delete(`/admin/carousel/${slide.id}`, { preserveScroll: true });
        }
    };

    const handleToggle = (slide: Slide) => {
        router.patch(`/admin/carousel/${slide.id}/toggle`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Carousel accueil" subtitle="Gérez les slides du carousel sur la page d'accueil">
            <Head title="Admin — Carousel" />

            <div className="space-y-6">
                {/* Add slide form */}
                {(showForm || editingSlide) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingSlide ? 'Modifier la slide' : 'Nouvelle slide'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SlideForm
                                slide={editingSlide ?? undefined}
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
                                <CardTitle>Slides ({slides.length})</CardTitle>
                                <CardDescription>Les slides sont affichées dans l'ordre ci-dessous sur la page d'accueil</CardDescription>
                            </div>
                            {!showForm && !editingSlide && (
                                <Button onClick={() => setShowForm(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Ajouter une slide
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
                                <p className="text-muted-foreground">Aucune slide. Ajoutez-en une pour commencer.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {slides.map((slide) => (
                                    <div
                                        key={slide.id}
                                        className="flex items-center gap-4 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/30"
                                    >
                                        <GripVertical className="h-5 w-5 shrink-0 text-muted-foreground" />

                                        <img
                                            src={slide.image_url}
                                            alt={slide.title}
                                            className="h-14 w-24 shrink-0 rounded object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/artemo-logo.png';
                                            }}
                                        />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold truncate">{slide.title}</p>
                                                <Badge variant={slide.is_active ? 'default' : 'secondary'}>
                                                    {slide.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                            {slide.subtitle && (
                                                <p className="text-sm text-muted-foreground truncate">{slide.subtitle}</p>
                                            )}
                                            {slide.link_url && (
                                                <p className="text-xs text-primary truncate">{slide.link_url}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleToggle(slide)}
                                                title={slide.is_active ? 'Désactiver' : 'Activer'}
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
                                                title="Modifier"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(slide)}
                                                title="Supprimer"
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

                {/* Preview note */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Note :</strong> Les slides actives s'affichent sur la page d'accueil dans la section héros.
                            Assurez-vous d'utiliser des images de haute qualité (1920×600px recommandé).
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
