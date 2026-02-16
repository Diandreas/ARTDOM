import { useState, useEffect } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListMusic, Plus, Music, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Playlist {
    id: number;
    title: string;
    cover_url: string | null;
    tracks_count: number;
}

interface AddToPlaylistDialogProps {
    trackId: number;
    trackTitle?: string;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export default function AddToPlaylistDialog({
    trackId,
    trackTitle,
    trigger,
    onSuccess,
}: AddToPlaylistDialogProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const [isOpen, setIsOpen] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [addingToPlaylist, setAddingToPlaylist] = useState<number | null>(null);

    const createForm = useForm({
        title: '',
        is_public: false,
    });

    // Load playlists when dialog opens
    useEffect(() => {
        if (isOpen && auth?.user) {
            loadPlaylists();
        }
    }, [isOpen]);

    const loadPlaylists = async () => {
        setIsLoadingPlaylists(true);
        try {
            const response = await fetch('/playlists', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPlaylists(data.playlists || []);
            }
        } catch (error) {
            console.error('Failed to load playlists:', error);
            toast.error('Impossible de charger les playlists');
        } finally {
            setIsLoadingPlaylists(false);
        }
    };

    const handleAddToPlaylist = (playlistId: number) => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        setAddingToPlaylist(playlistId);

        // Use Inertia router for proper CSRF handling
        router.post(
            `/playlists/${playlistId}/tracks/${trackId}`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    const playlist = playlists.find(p => p.id === playlistId);
                    toast.success(`Ajouté à "${playlist?.title}"`);
                    if (onSuccess) onSuccess();
                    setIsOpen(false);
                    setAddingToPlaylist(null);
                },
                onError: (errors) => {
                    const errorMessage = Object.values(errors)[0] as string || 'Erreur lors de l\'ajout';
                    toast.error(errorMessage);
                    setAddingToPlaylist(null);
                },
            }
        );
    };

    const handleCreatePlaylist = (e: React.FormEvent) => {
        e.preventDefault();

        createForm.post('/playlists', {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
                loadPlaylists();
                toast.success('Playlist créée');
            },
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && !auth?.user) {
            router.visit('/login');
            return;
        }
        setIsOpen(open);
        if (!open) {
            setShowCreateForm(false);
            createForm.reset();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <ListMusic className="w-5 h-5" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {!showCreateForm ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Ajouter à une playlist</DialogTitle>
                            <DialogDescription>
                                {trackTitle && `Ajouter "${trackTitle}" à une playlist`}
                            </DialogDescription>
                        </DialogHeader>

                        {isLoadingPlaylists ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : playlists.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Music className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Vous n'avez pas encore de playlist
                                </p>
                                <Button onClick={() => setShowCreateForm(true)} className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Créer une playlist
                                </Button>
                            </div>
                        ) : (
                            <>
                                <ScrollArea className="max-h-[300px] pr-4">
                                    <div className="space-y-2">
                                        {playlists.map((playlist) => (
                                            <button
                                                key={playlist.id}
                                                onClick={() => handleAddToPlaylist(playlist.id)}
                                                disabled={addingToPlaylist === playlist.id}
                                                className={cn(
                                                    'w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left',
                                                    addingToPlaylist === playlist.id && 'opacity-50'
                                                )}
                                            >
                                                <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                                                    {playlist.cover_url ? (
                                                        <img
                                                            src={playlist.cover_url}
                                                            alt={playlist.title}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    ) : (
                                                        <Music className="w-6 h-6 text-white/80" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold truncate">{playlist.title}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {playlist.tracks_count} titre{playlist.tracks_count !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                {addingToPlaylist === playlist.id && (
                                                    <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>

                                <Button
                                    variant="outline"
                                    onClick={() => setShowCreateForm(true)}
                                    className="w-full gap-2 mt-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Créer une nouvelle playlist
                                </Button>
                            </>
                        )}
                    </>
                ) : (
                    <form onSubmit={handleCreatePlaylist}>
                        <DialogHeader>
                            <DialogTitle>Créer une playlist</DialogTitle>
                            <DialogDescription>
                                Créez une nouvelle playlist et ajoutez-y ce morceau
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
                                        Visible à tous les utilisateurs
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
                                onClick={() => setShowCreateForm(false)}
                                disabled={createForm.processing}
                            >
                                Retour
                            </Button>
                            <Button type="submit" disabled={createForm.processing || !createForm.data.title}>
                                {createForm.processing ? 'Création...' : 'Créer et ajouter'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
