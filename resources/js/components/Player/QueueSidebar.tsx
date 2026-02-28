import { useState, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ListMusic, X, Play, Pause, Trash2, Save, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface QueueSidebarProps {
    trigger?: React.ReactNode;
}

export default function QueueSidebar({ trigger }: QueueSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
    const [formData, setFormData] = useState({ title: '', is_public: false });
    const { queue, currentTrack, isPlaying, playTrack, clearQueue } = useAudio();
    const queueRef = useRef(queue);
    queueRef.current = queue;

    const formatDuration = (seconds?: number) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleClearQueue = () => {
        clearQueue();
        toast.success('File d\'attente effacée');
    };

    const handleSaveAsPlaylist = (e: React.FormEvent) => {
        e.preventDefault();

        if (queue.length === 0) {
            toast.error('La file d\'attente est vide');
            return;
        }

        if (!formData.title.trim()) {
            toast.error('Veuillez entrer un nom pour la playlist');
            return;
        }

        setIsCreatingPlaylist(true);

        router.post('/playlists', formData, {
            preserveScroll: true,
            onSuccess: (page) => {
                const flashPlaylist = (page.props as any).playlist;

                if (!flashPlaylist) {
                    setIsCreatingPlaylist(false);
                    return;
                }

                const playlistId = flashPlaylist.id;
                const playlistTitle = flashPlaylist.title;
                const tracksToAdd = [...queueRef.current];

                const addTracksSequentially = async () => {
                    let successCount = 0;

                    for (const track of tracksToAdd) {
                        try {
                            await new Promise<void>((resolve) => {
                                router.post(
                                    `/playlists/${playlistId}/tracks/${track.id}`,
                                    {},
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => { successCount++; resolve(); },
                                        onError: () => resolve(),
                                    },
                                );
                            });
                        } catch (error) {
                            console.error('Failed to add track:', error);
                        }
                    }

                    toast.success(`Playlist "${playlistTitle}" créée avec ${successCount} titres`);
                    setIsSaveDialogOpen(false);
                    setIsCreatingPlaylist(false);
                    setFormData({ title: '', is_public: false });

                    setTimeout(() => {
                        router.visit(`/playlists/${playlistId}`);
                    }, 500);
                };

                addTracksSequentially();
            },
            onError: (errors) => {
                console.error('Failed to create playlist:', errors);
                toast.error('Erreur lors de la création de la playlist');
                setIsCreatingPlaylist(false);
            },
        });
    };

    const isCurrentTrack = (trackId: string) => {
        return currentTrack?.id === trackId;
    };

    const currentIndex = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
    const upcomingTracks = currentIndex >= 0 ? queue.slice(currentIndex + 1) : queue;

    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    {trigger || (
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <ListMusic className="w-5 h-5" />
                        </Button>
                    )}
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
                    <SheetHeader className="px-6 py-4 border-b">
                        <SheetTitle>File d'attente</SheetTitle>
                        <SheetDescription>
                            {queue.length} titre{queue.length !== 1 ? 's' : ''}
                        </SheetDescription>
                    </SheetHeader>

                    {queue.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Music className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">File d'attente vide</h3>
                            <p className="text-sm text-muted-foreground">
                                Lancez une chanson pour commencer
                            </p>
                        </div>
                    ) : (
                        <>
                            <ScrollArea className="flex-1 px-6 py-4">
                                <div className="space-y-1">
                                    {/* Current Track */}
                                    {currentTrack && (
                                        <div className="mb-6">
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                                En cours
                                            </h4>
                                            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative shrink-0">
                                                        <img
                                                            src={currentTrack.image}
                                                            alt={currentTrack.title}
                                                            className="w-12 h-12 rounded object-cover"
                                                        />
                                                        {isPlaying && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                                                                <div className="flex gap-0.5">
                                                                    <span className="w-0.5 h-3 bg-white animate-pulse" />
                                                                    <span className="w-0.5 h-4 bg-white animate-pulse" style={{ animationDelay: '150ms' }} />
                                                                    <span className="w-0.5 h-3 bg-white animate-pulse" style={{ animationDelay: '300ms' }} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-semibold truncate text-primary">
                                                            {currentTrack.title}
                                                        </h5>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {currentTrack.artist}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground shrink-0">
                                                        {formatDuration(currentTrack.duration)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Upcoming Tracks */}
                                    {upcomingTracks.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                                À suivre ({upcomingTracks.length})
                                            </h4>
                                            <div className="space-y-1">
                                                {upcomingTracks.map((track, index) => (
                                                    <div
                                                        key={`${track.id}-${index}`}
                                                        className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                                        onClick={() => playTrack(track)}
                                                    >
                                                        <span className="w-6 text-center text-sm text-muted-foreground shrink-0">
                                                            {index + 1}
                                                        </span>
                                                        <img
                                                            src={track.image}
                                                            alt={track.title}
                                                            className="w-10 h-10 rounded object-cover shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-sm font-medium truncate">
                                                                {track.title}
                                                            </h5>
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {track.artist}
                                                            </p>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground shrink-0">
                                                            {formatDuration(track.duration)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Actions */}
                            <div className="px-6 py-4 border-t space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    onClick={() => setIsSaveDialogOpen(true)}
                                >
                                    <Save className="w-4 h-4" />
                                    Sauvegarder comme playlist
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full gap-2 text-destructive hover:text-destructive"
                                    onClick={handleClearQueue}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Effacer la file d'attente
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Save as Playlist Dialog */}
            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSaveAsPlaylist}>
                        <DialogHeader>
                            <DialogTitle>Sauvegarder comme playlist</DialogTitle>
                            <DialogDescription>
                                Créez une playlist avec les {queue.length} titres de la file d'attente
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="playlist-title">Nom de la playlist</Label>
                                <Input
                                    id="playlist-title"
                                    placeholder="Ma file d'attente..."
                                    value={formData.title}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                    autoFocus
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="playlist-public">Playlist publique</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Visible à tous les utilisateurs
                                    </p>
                                </div>
                                <Switch
                                    id="playlist-public"
                                    checked={formData.is_public}
                                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_public: checked }))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsSaveDialogOpen(false)}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={!formData.title}>
                                Créer la playlist
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
