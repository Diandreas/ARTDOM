import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AddToPlaylistDialog from '@/components/Player/AddToPlaylistDialog';
import {
    Play,
    Heart,
    Share2,
    ShoppingCart,
    MoreHorizontal,
    Clock,
    Download,
    ListMusic,
    Headphones,
} from 'lucide-react';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Track {
    id: string;
    title: string;
    duration_seconds: number;
    plays: number;
    file_url: string;
    track_number: number;
}

interface Artist {
    id: string;
    name: string;
    stage_name: string;
    profile_photo: string;
}

interface Album {
    id: string;
    title: string;
    cover_url: string;
    genre: string;
    year: number;
    price: number;
    total_plays: number;
    artist: Artist;
}

interface AlbumViewProps {
    album: Album;
    tracks: Track[];
    isPurchased?: boolean;
    isInLibrary?: boolean;
}

export default function AlbumView({ album, tracks, isPurchased = false, isInLibrary = false }: AlbumViewProps) {
    const [inLibrary, setInLibrary] = useState(isInLibrary);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const totalDuration = tracks.reduce((sum, track) => sum + track.duration_seconds, 0);
    const totalDurationFormatted = formatDuration(totalDuration);

    const handlePlayAll = () => {
        router.get(`/artstream/player`, {
            album: album.id,
            track: tracks[0]?.id,
        });
    };

    const handlePlayTrack = (trackId: string) => {
        router.get(`/artstream/player`, {
            album: album.id,
            track: trackId,
        });
    };

    const handleToggleLibrary = () => {
        // API call to add/remove from library
        setInLibrary(!inLibrary);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${album.title} - ${album.artist.stage_name}`,
                text: `Écoutez ${album.title} sur ARTDOM`,
                url: window.location.href,
            });
        }
    };

    const handlePurchase = () => {
        // Redirect to purchase flow
        router.get(`/artstream/purchase/${album.id}`);
    };

    return (
        <MainLayout>
            <Head title={`${album.title} - ${album.artist.stage_name}`} />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
                {/* Album Header */}
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Album Cover */}
                    <div className="md:col-span-1">
                        <Card className="overflow-hidden">
                            <div className="aspect-square relative group">
                                <img
                                    src={album.cover_url || '/images/default-album.jpg'}
                                    alt={album.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        size="lg"
                                        className="rounded-full h-16 w-16 p-0"
                                        onClick={handlePlayAll}
                                    >
                                        <Play className="w-8 h-8 fill-current" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Album Info */}
                    <div className="md:col-span-2 flex flex-col justify-between">
                        <div>
                            <Badge className="mb-3 uppercase text-xs">{album.genre}</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{album.title}</h1>

                            {/* Artist */}
                            <Link href={`/artist/${album.artist.id}`}>
                                <div className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity w-fit">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={album.artist.profile_photo} alt={album.artist.stage_name} />
                                        <AvatarFallback>{album.artist.stage_name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">{album.artist.stage_name}</div>
                                        <div className="text-sm text-muted-foreground">Artiste</div>
                                    </div>
                                </div>
                            </Link>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                                <span>{album.year}</span>
                                <span>•</span>
                                <span>{tracks.length} pistes</span>
                                <span>•</span>
                                <span>{totalDurationFormatted}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Headphones className="w-4 h-4" />
                                    <span>{album.total_plays.toLocaleString()} écoutes</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button size="lg" className="gap-2" onClick={handlePlayAll}>
                                <Play className="w-5 h-5 fill-current" />
                                Lire
                            </Button>

                            <Button
                                size="lg"
                                variant={inLibrary ? 'default' : 'outline'}
                                className="gap-2"
                                onClick={handleToggleLibrary}
                            >
                                <Heart className={`w-5 h-5 ${inLibrary ? 'fill-current' : ''}`} />
                                {inLibrary ? 'Dans ma bibliothèque' : 'Ajouter'}
                            </Button>

                            <Button size="lg" variant="outline" className="gap-2" onClick={handleShare}>
                                <Share2 className="w-5 h-5" />
                                Partager
                            </Button>

                            {!isPurchased && album.price > 0 && (
                                <Button size="lg" variant="secondary" className="gap-2" onClick={handlePurchase}>
                                    <ShoppingCart className="w-5 h-5" />
                                    Acheter {album.price.toLocaleString()} FCFA
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tracks List */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ListMusic className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Pistes</h2>
                        </div>

                        <div className="space-y-1">
                            {tracks.map((track, index) => (
                                <div
                                    key={track.id}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
                                    onClick={() => handlePlayTrack(track.id)}
                                >
                                    {/* Track Number / Play Button */}
                                    <div className="w-8 text-center">
                                        <span className="group-hover:hidden text-muted-foreground">
                                            {track.track_number || index + 1}
                                        </span>
                                        <Play className="w-4 h-4 hidden group-hover:block text-primary fill-current mx-auto" />
                                    </div>

                                    {/* Track Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{track.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {track.plays.toLocaleString()} écoutes
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <Clock className="w-4 h-4" />
                                        {formatDuration(track.duration_seconds)}
                                    </div>

                                    {/* Actions Menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Heart className="w-4 h-4 mr-2" />
                                                Ajouter aux favoris
                                            </DropdownMenuItem>
                                            <AddToPlaylistDialog
                                                trackId={parseInt(track.id)}
                                                trackTitle={track.title}
                                                trigger={
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <ListMusic className="w-4 h-4 mr-2" />
                                                        Ajouter à une playlist
                                                    </DropdownMenuItem>
                                                }
                                            />
                                            {isPurchased && (
                                                <DropdownMenuItem>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Télécharger
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem>
                                                <Share2 className="w-4 h-4 mr-2" />
                                                Partager
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>

                        {/* Total Duration */}
                        <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm text-muted-foreground">
                            <span>{tracks.length} pistes</span>
                            <span>Durée totale : {totalDurationFormatted}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Album Info Section */}
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-bold mb-4">À propos de cet album</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Artiste:</span>
                                    <Link
                                        href={`/artist/${album.artist.id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {album.artist.stage_name}
                                    </Link>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Année:</span>
                                    <span className="font-medium">{album.year}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Genre:</span>
                                    <span className="font-medium capitalize">{album.genre}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Écoutes totales:</span>
                                    <span className="font-medium">{album.total_plays.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {!isPurchased && album.price > 0 && (
                        <Card className="border-primary/20">
                            <CardContent className="pt-6">
                                <h3 className="font-bold mb-4">Acheter cet album</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Achetez cet album pour le télécharger et l'écouter hors ligne en qualité HD.
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold text-primary">
                                        {album.price.toLocaleString()} FCFA
                                    </span>
                                </div>
                                <Button className="w-full" size="lg" onClick={handlePurchase}>
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Acheter maintenant
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
