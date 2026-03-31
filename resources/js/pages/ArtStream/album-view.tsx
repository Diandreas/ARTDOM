import { Head, Link, router, usePage } from '@inertiajs/react';
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
    MessageCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AddToPlaylistDialog from '@/components/Player/AddToPlaylistDialog';
import CommentsSidebar from '@/components/Player/CommentsSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';

interface Track {
    id: string;
    title: string;
    duration_seconds: number;
    plays: number;
    file_url: string;
    track_number: number;
    is_favorited?: boolean;
    comments?: any[];
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

export default function AlbumView({
    album,
    tracks,
    isPurchased = false,
    isInLibrary = false,
}: AlbumViewProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const { t } = useAppLocale();
    const [inLibrary, setInLibrary] = useState(isInLibrary);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const totalDuration = tracks.reduce(
        (sum, track) => sum + track.duration_seconds,
        0,
    );
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
        if (!auth?.user) {
            router.visit('/login');
            return;
        }
        router.post(
            `/albums/${album.id}/favorite`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setInLibrary(!inLibrary);
                    toast.success(
                        inLibrary
                            ? t('Removed from favorites')
                            : t('Added to favorites'),
                    );
                },
            },
        );
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${album.title} - ${album.artist.stage_name}`,
                text: `${t('Listen to')} ${album.title} ${t('on ARTEMO')}`,
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

            <div className="container mx-auto max-w-7xl px-4 py-8 pb-24 md:px-6 md:py-12 md:pb-12">
                {/* Album Header */}
                <div className="mb-8 grid gap-8 md:grid-cols-3">
                    {/* Album Cover */}
                    <div className="md:col-span-1">
                        <Card className="overflow-hidden">
                            <div className="group relative aspect-square">
                                <img
                                    src={
                                        album.cover_url ||
                                        '/images/default-album.jpg'
                                    }
                                    alt={album.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                        size="lg"
                                        className="h-16 w-16 rounded-full p-0"
                                        onClick={handlePlayAll}
                                    >
                                        <Play className="h-8 w-8 fill-current" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Album Info */}
                    <div className="flex flex-col justify-between md:col-span-2">
                        <div>
                            <Badge className="mb-3 text-xs uppercase">
                                {album.genre}
                            </Badge>
                            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                                {album.title}
                            </h1>

                            {/* Artist */}
                            <Link href={`/artist/${album.artist.id}`}>
                                <div className="mb-6 flex w-fit items-center gap-3 transition-opacity hover:opacity-80">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={album.artist.profile_photo}
                                            alt={album.artist.stage_name}
                                        />
                                        <AvatarFallback>
                                            {album.artist.stage_name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">
                                            {album.artist.stage_name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {t('Artist')}
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Stats */}
                            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span>{album.year}</span>
                                <span>•</span>
                                <span>
                                    {tracks.length}{' '}
                                    {tracks.length > 1
                                        ? t('tracks')
                                        : t('track')}
                                </span>
                                <span>•</span>
                                <span>{totalDurationFormatted}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Headphones className="h-4 w-4" />
                                    <span>
                                        {album.total_plays.toLocaleString()}{' '}
                                        {t('plays')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                size="lg"
                                className="gap-2"
                                onClick={handlePlayAll}
                            >
                                <Play className="h-5 w-5 fill-current" />
                                {t('Play')}
                            </Button>

                            <Button
                                size="lg"
                                variant={inLibrary ? 'default' : 'outline'}
                                className="gap-2"
                                onClick={handleToggleLibrary}
                            >
                                <Heart
                                    className={`h-5 w-5 ${inLibrary ? 'fill-current' : ''}`}
                                />
                                {inLibrary ? t('In my library') : t('Add')}
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="gap-2"
                                onClick={handleShare}
                            >
                                <Share2 className="h-5 w-5" />
                                {t('Share')}
                            </Button>

                            {!isPurchased && album.price > 0 && (
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="gap-2"
                                    onClick={handlePurchase}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {t(
                                        'Buy',
                                    )} {album.price.toLocaleString()} FCFA
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tracks List */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="mb-4 flex items-center gap-2">
                            <ListMusic className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold">{t('Tracks')}</h2>
                        </div>

                        <div className="space-y-1">
                            {tracks.map((track, index) => (
                                <div
                                    key={track.id}
                                    className="group flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                                    onClick={() => handlePlayTrack(track.id)}
                                >
                                    {/* Track Number / Play Button */}
                                    <div className="w-8 text-center">
                                        <span className="text-muted-foreground group-hover:hidden">
                                            {track.track_number || index + 1}
                                        </span>
                                        <Play className="mx-auto hidden h-4 w-4 fill-current text-primary group-hover:block" />
                                    </div>

                                    {/* Track Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate font-medium">
                                            {track.title}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {track.plays.toLocaleString()}{' '}
                                            {t('plays')}
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        {formatDuration(track.duration_seconds)}
                                    </div>

                                    {/* Actions Menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <Heart className="mr-2 h-4 w-4" />
                                                {t('Add to favorites')}
                                            </DropdownMenuItem>
                                            <CommentsSidebar
                                                trackId={track.id}
                                                comments={track.comments || []}
                                                trigger={
                                                    <DropdownMenuItem
                                                        onSelect={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        <MessageCircle className="mr-2 h-4 w-4" />
                                                        {t('Comments')} (
                                                        {track.comments
                                                            ?.length || 0}
                                                        )
                                                    </DropdownMenuItem>
                                                }
                                            />
                                            <AddToPlaylistDialog
                                                trackId={parseInt(track.id)}
                                                trackTitle={track.title}
                                                trigger={
                                                    <DropdownMenuItem
                                                        onSelect={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        <ListMusic className="mr-2 h-4 w-4" />
                                                        {t('Add to playlist')}
                                                    </DropdownMenuItem>
                                                }
                                            />
                                            {isPurchased && (
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    {t('Download')}
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem>
                                                <Share2 className="mr-2 h-4 w-4" />
                                                {t('Share')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>

                        {/* Total Duration */}
                        <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                            <span>
                                {tracks.length}{' '}
                                {tracks.length > 1 ? t('tracks') : t('track')}
                            </span>
                            <span>
                                {t('Total duration')}: {totalDurationFormatted}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Album Info Section */}
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="mb-4 font-bold">
                                {t('About this album')}
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {t('Artist')}:
                                    </span>
                                    <Link
                                        href={`/artist/${album.artist.id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {album.artist.stage_name}
                                    </Link>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {t('Year')}:
                                    </span>
                                    <span className="font-medium">
                                        {album.year}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {t('Genre')}:
                                    </span>
                                    <span className="font-medium capitalize">
                                        {album.genre}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {t('Total plays')}:
                                    </span>
                                    <span className="font-medium">
                                        {album.total_plays.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {!isPurchased && album.price > 0 && (
                        <Card className="border-primary/20">
                            <CardContent className="pt-6">
                                <h3 className="mb-4 font-bold">
                                    {t('Buy this album')}
                                </h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    {t(
                                        'Buy this album to download it and listen offline in HD quality.',
                                    )}
                                </p>
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-2xl font-bold text-primary">
                                        {album.price.toLocaleString()} FCFA
                                    </span>
                                </div>
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handlePurchase}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    {t('Buy now')}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
