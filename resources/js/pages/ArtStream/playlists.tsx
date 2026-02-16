import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Music, Lock, Globe, Trash2, Play, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Playlist {
    id: number;
    title: string;
    cover_url: string | null;
    is_public: boolean;
    tracks_count: number;
    created_at: string;
}

interface PlaylistsProps {
    playlists: Playlist[];
}

export default function Playlists({ playlists }: PlaylistsProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);

    const createForm = useForm({
        title: '',
        is_public: false,
    });

    const handleCreatePlaylist = (e: React.FormEvent) => {
        e.preventDefault();

        createForm.post('/playlists', {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                setIsCreateDialogOpen(false);
            },
        });
    };

    const handleDeletePlaylist = () => {
        if (!playlistToDelete) return;

        router.delete(`/playlists/${playlistToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setPlaylistToDelete(null);
            },
        });
    };

    const getDefaultCover = (index: number) => {
        const colors = [
            'bg-gradient-to-br from-purple-500 to-pink-500',
            'bg-gradient-to-br from-blue-500 to-cyan-500',
            'bg-gradient-to-br from-green-500 to-teal-500',
            'bg-gradient-to-br from-orange-500 to-red-500',
            'bg-gradient-to-br from-indigo-500 to-purple-500',
        ];
        return colors[index % colors.length];
    };

    return (
        <MainLayout>
            <Head title="Mes Playlists - ArtStream" />

            <div className="pb-24 md:pb-6">
                {/* Header */}
                <div className="bg-gradient-to-b from-primary/10 to-background border-b border-border/40 px-4 py-8 md:py-12">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black font-heading text-foreground mb-2">
                                    Mes Playlists
                                </h1>
                                <p className="text-muted-foreground">
                                    {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <Plus className="w-5 h-5" />
                                        <span className="hidden sm:inline">Créer une playlist</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <form onSubmit={handleCreatePlaylist}>
                                        <DialogHeader>
                                            <DialogTitle>Créer une playlist</DialogTitle>
                                            <DialogDescription>
                                                Donnez un nom à votre nouvelle playlist musicale
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Nom de la playlist</Label>
                                                <Input
                                                    id="title"
                                                    placeholder="Ma super playlist..."
                                                    value={createForm.data.title}
                                                    onChange={(e) => createForm.setData('title', e.target.value)}
                                                    className={createForm.errors.title ? 'border-destructive' : ''}
                                                    autoFocus
                                                />
                                                {createForm.errors.title && (
                                                    <p className="text-sm text-destructive">{createForm.errors.title}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="is_public">Playlist publique</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Rendre visible à tous les utilisateurs
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="is_public"
                                                    checked={createForm.data.is_public}
                                                    onCheckedChange={(checked) => createForm.setData('is_public', checked)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsCreateDialogOpen(false)}
                                                disabled={createForm.processing}
                                            >
                                                Annuler
                                            </Button>
                                            <Button type="submit" disabled={createForm.processing || !createForm.data.title}>
                                                {createForm.processing ? 'Création...' : 'Créer'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Playlists Grid */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        {playlists.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                                    <Music className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Aucune playlist</h2>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    Créez votre première playlist pour organiser vos morceaux préférés
                                </p>
                                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                                    <Plus className="w-5 h-5" />
                                    Créer une playlist
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {playlists.map((playlist, index) => (
                                    <Card key={playlist.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                                        <CardContent className="p-0">
                                            <Link href={`/playlists/${playlist.id}`}>
                                                <div className="aspect-square relative overflow-hidden bg-muted">
                                                    {playlist.cover_url ? (
                                                        <img
                                                            src={playlist.cover_url}
                                                            alt={playlist.title}
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                                        />
                                                    ) : (
                                                        <div className={`w-full h-full ${getDefaultCover(index)} flex items-center justify-center`}>
                                                            <Music className="w-16 h-16 text-white/80" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Button
                                                            size="icon"
                                                            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 scale-0 group-hover:scale-100 transition-transform"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                router.visit(`/playlists/${playlist.id}`);
                                                            }}
                                                        >
                                                            <Play className="w-6 h-6 fill-current ml-0.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <Link href={`/playlists/${playlist.id}`} className="flex-1 min-w-0">
                                                        <h3 className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                                                            {playlist.title}
                                                        </h3>
                                                    </Link>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 -mt-1"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/playlists/${playlist.id}`}>
                                                                    <Play className="w-4 h-4 mr-2" />
                                                                    Lire
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => setPlaylistToDelete(playlist)}
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Supprimer
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span>{playlist.tracks_count} titre{playlist.tracks_count !== 1 ? 's' : ''}</span>
                                                    <span>•</span>
                                                    {playlist.is_public ? (
                                                        <Badge variant="outline" className="gap-1 text-xs">
                                                            <Globe className="w-3 h-3" />
                                                            Public
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="gap-1 text-xs">
                                                            <Lock className="w-3 h-3" />
                                                            Privé
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!playlistToDelete} onOpenChange={(open) => !open && setPlaylistToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer la playlist ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer "{playlistToDelete?.title}" ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePlaylist} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </MainLayout>
    );
}
