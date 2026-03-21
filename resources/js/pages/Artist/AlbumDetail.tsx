import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Music,
    Upload,
    Trash2,
    Eye,
    EyeOff,
    Plus,
    AlertCircle,
    TrendingUp,
    ShoppingBag,
    PlayCircle,
    Banknote,
    Pencil,
    X,
    Check,
} from 'lucide-react';
import { useState } from 'react';
import {
    show as albumShow,
    togglePublication,
    update as albumUpdate,
    addTrack,
    removeTrack,
} from '@/actions/App/Http/Controllers/Artist/AlbumUploadController';
import { index as albumsIndex } from '@/actions/App/Http/Controllers/Artist/AlbumUploadController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/layouts/MainLayout';

interface Track {
    id: string;
    title: string;
    track_number: number;
    duration_seconds: number;
    plays: number;
    file_url: string;
    lyrics: string | null;
}

interface Album {
    id: string;
    title: string;
    year: number;
    genre: string;
    cover_url: string;
    price: number;
    is_streamable: boolean;
    is_purchasable: boolean;
    total_plays: number;
    published_at: string | null;
    created_at: string;
    tracks: Track[];
}

interface Stats {
    total_plays: number;
    purchases: number;
    revenue_total: number;
    revenue_this_month: number;
}

interface Props {
    album: Album;
    stats: Stats;
}

function formatDuration(seconds: number): string {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AlbumDetail({ album, stats }: Props) {
    const [showAddTrack, setShowAddTrack] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState(false);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const trackForm = useForm({
        title: '',
        file: null as File | null,
        lyrics: '',
    });

    const albumForm = useForm({
        title: album.title,
        year: album.year,
        genre: album.genre,
        cover: null as File | null,
        price: album.price,
        is_free: !album.is_purchasable,
    });

    const handleAddTrack = (e: React.FormEvent) => {
        e.preventDefault();
        trackForm.post(addTrack(album.id).url, {
            forceFormData: true,
            onSuccess: () => {
                trackForm.reset();
                setShowAddTrack(false);
            },
        });
    };

    const handleUpdateAlbum = (e: React.FormEvent) => {
        e.preventDefault();
        albumForm.put(albumUpdate(album.id).url, {
            forceFormData: true,
            onSuccess: () => {
                setEditingAlbum(false);
                setCoverPreview(null);
            },
        });
    };

    const handleDeleteTrack = (trackId: string) => {
        if (confirm('Supprimer cette piste ?')) {
            router.delete(removeTrack({ album: album.id, track: trackId }).url);
        }
    };

    const handleTogglePublication = () => {
        router.patch(togglePublication(album.id).url);
    };

    return (
        <MainLayout>
            <Head title={`Gérer — ${album.title}`} />

            <div className="container px-4 md:px-6 py-8 pb-24">
                {/* Back + Header */}
                <div className="mb-6">
                    <Link
                        href={albumsIndex().url}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Mes albums
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={album.cover_url}
                                alt={album.title}
                                className="w-16 h-16 rounded-lg object-cover shadow"
                            />
                            <div>
                                <h1 className="text-2xl font-bold">{album.title}</h1>
                                <p className="text-muted-foreground text-sm">
                                    {album.year} · {album.genre}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingAlbum(!editingAlbum)}
                            >
                                {editingAlbum ? <X className="mr-1.5 h-4 w-4" /> : <Pencil className="mr-1.5 h-4 w-4" />}
                                {editingAlbum ? 'Annuler' : 'Modifier'}
                            </Button>
                            <Button
                                variant={album.published_at ? 'outline' : 'default'}
                                size="sm"
                                onClick={handleTogglePublication}
                            >
                                {album.published_at
                                    ? <><EyeOff className="mr-1.5 h-4 w-4" />Dépublier</>
                                    : <><Eye className="mr-1.5 h-4 w-4" />Publier</>
                                }
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <PlayCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Écoutes totales</p>
                                    <p className="text-xl font-bold">{stats.total_plays.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <ShoppingBag className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Achats</p>
                                    <p className="text-xl font-bold">{stats.purchases}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/10">
                                    <Banknote className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Revenus totaux</p>
                                    <p className="text-xl font-bold">{stats.revenue_total.toLocaleString()} FCFA</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                    <TrendingUp className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Ce mois-ci</p>
                                    <p className="text-xl font-bold">{stats.revenue_this_month.toLocaleString()} FCFA</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Edit album form */}
                {editingAlbum && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Modifier l'album</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateAlbum} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Pochette</Label>
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={coverPreview ?? album.cover_url}
                                                alt={album.title}
                                                className="w-24 h-24 rounded-lg object-cover"
                                            />
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        albumForm.setData('cover', file);
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setCoverPreview(reader.result as string);
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="edit-title">Titre</Label>
                                            <Input
                                                id="edit-title"
                                                value={albumForm.data.title}
                                                onChange={(e) => albumForm.setData('title', e.target.value)}
                                            />
                                            {albumForm.errors.title && (
                                                <p className="text-sm text-destructive flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />{albumForm.errors.title}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="edit-year">Année</Label>
                                                <Input
                                                    id="edit-year"
                                                    type="number"
                                                    value={albumForm.data.year}
                                                    onChange={(e) => albumForm.setData('year', parseInt(e.target.value))}
                                                    min="1900"
                                                    max={new Date().getFullYear() + 1}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="edit-genre">Genre</Label>
                                                <select
                                                    id="edit-genre"
                                                    value={albumForm.data.genre}
                                                    onChange={(e) => albumForm.setData('genre', e.target.value)}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                >
                                                    <option value="afrobeat">Afrobeat</option>
                                                    <option value="highlife">Highlife</option>
                                                    <option value="coupé-décalé">Coupé-Décalé</option>
                                                    <option value="zouglou">Zouglou</option>
                                                    <option value="gospel">Gospel</option>
                                                    <option value="makossa">Makossa</option>
                                                    <option value="rumba">Rumba</option>
                                                    <option value="hip-hop">Hip-Hop</option>
                                                    <option value="r&b">R&B</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="edit-is-free"
                                        checked={albumForm.data.is_free}
                                        onChange={(e) => albumForm.setData('is_free', e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="edit-is-free" className="cursor-pointer">Album gratuit</Label>
                                </div>

                                {!albumForm.data.is_free && (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="edit-price">Prix (FCFA)</Label>
                                        <Input
                                            id="edit-price"
                                            type="number"
                                            value={albumForm.data.price}
                                            onChange={(e) => albumForm.setData('price', parseFloat(e.target.value))}
                                            min="0"
                                            step="100"
                                        />
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={albumForm.processing}>
                                        <Check className="mr-1.5 h-4 w-4" />
                                        {albumForm.processing ? 'Enregistrement...' : 'Enregistrer'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setEditingAlbum(false)}>
                                        Annuler
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Tracks list */}
                    <div className="lg:col-span-2 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold">
                                Pistes
                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                    ({album.tracks.length})
                                </span>
                            </h2>
                            <Button size="sm" onClick={() => setShowAddTrack(!showAddTrack)}>
                                {showAddTrack
                                    ? <><X className="mr-1.5 h-4 w-4" />Annuler</>
                                    : <><Plus className="mr-1.5 h-4 w-4" />Ajouter une piste</>
                                }
                            </Button>
                        </div>

                        {/* Add track form */}
                        {showAddTrack && (
                            <Card className="mb-2">
                                <CardContent className="pt-5">
                                    <form onSubmit={handleAddTrack} className="space-y-3">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="track-title">Titre de la piste *</Label>
                                            <Input
                                                id="track-title"
                                                value={trackForm.data.title}
                                                onChange={(e) => trackForm.setData('title', e.target.value)}
                                                placeholder="Nom de la chanson"
                                            />
                                            {trackForm.errors.title && (
                                                <p className="text-sm text-destructive flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />{trackForm.errors.title}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="track-file">Fichier audio (MP3/WAV, max 50MB) *</Label>
                                            <Input
                                                id="track-file"
                                                type="file"
                                                accept=".mp3,.wav"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) trackForm.setData('file', file);
                                                }}
                                                className="cursor-pointer"
                                            />
                                            {trackForm.errors.file && (
                                                <p className="text-sm text-destructive flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />{trackForm.errors.file}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="track-lyrics">Paroles (optionnel)</Label>
                                            <textarea
                                                id="track-lyrics"
                                                value={trackForm.data.lyrics}
                                                onChange={(e) => trackForm.setData('lyrics', e.target.value)}
                                                rows={3}
                                                placeholder="Paroles de la chanson..."
                                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            {trackForm.progress && (
                                                <div className="flex-1 flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary transition-all"
                                                            style={{ width: `${trackForm.progress.percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {trackForm.progress.percentage}%
                                                    </span>
                                                </div>
                                            )}
                                            <Button type="submit" disabled={trackForm.processing} size="sm">
                                                <Upload className="mr-1.5 h-4 w-4" />
                                                {trackForm.processing ? 'Upload...' : 'Ajouter'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tracks */}
                        {album.tracks.length === 0 ? (
                            <Card>
                                <CardContent className="py-10 text-center">
                                    <Music className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                                    <p className="text-muted-foreground text-sm mb-3">
                                        Aucune piste pour l'instant
                                    </p>
                                    <Button size="sm" onClick={() => setShowAddTrack(true)}>
                                        <Plus className="mr-1.5 h-4 w-4" />
                                        Ajouter la première piste
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-2">
                                {album.tracks.map((track) => (
                                    <div
                                        key={track.id}
                                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                                    >
                                        <span className="text-muted-foreground text-sm w-6 text-center shrink-0">
                                            {track.track_number}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{track.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDuration(track.duration_seconds)} · {track.plays.toLocaleString()} écoutes
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDeleteTrack(track.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Album info sidebar */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Informations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Statut</span>
                                    {album.published_at
                                        ? <Badge className="bg-green-500 text-xs">Publié</Badge>
                                        : <Badge variant="outline" className="text-xs">Brouillon</Badge>
                                    }
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Prix</span>
                                    <span className="font-medium">
                                        {album.price > 0 ? `${Number(album.price).toLocaleString()} FCFA` : 'Gratuit'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Streaming</span>
                                    <span className="font-medium">{album.is_streamable ? 'Oui' : 'Non'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Achat</span>
                                    <span className="font-medium">{album.is_purchasable ? 'Oui' : 'Non'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Créé le</span>
                                    <span className="font-medium">{album.created_at}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Pistes</span>
                                    <span className="font-medium">{album.tracks.length}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {!album.published_at && album.tracks.length === 0 && (
                            <Card className="border-amber-500/30 bg-amber-500/5">
                                <CardContent className="pt-4 pb-4">
                                    <div className="flex gap-2 text-sm text-amber-600 dark:text-amber-400">
                                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                        <p>Ajoutez au moins une piste avant de publier cet album.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
