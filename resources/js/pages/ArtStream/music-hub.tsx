import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Heart, MoreHorizontal, Shuffle, Clock, TrendingUp } from 'lucide-react';
import { useAudio, type Track as AudioTrack } from '@/contexts/AudioContext';

interface Artist {
    id: string;
    name?: string;
    stage_name: string;
    profile_photo?: string;
}

interface Album {
    id: string;
    title: string;
    cover_url: string;
    genre: string;
    year: number;
    price?: number;
    total_plays?: number;
    tracks_count?: number;
    artist: Artist;
}

interface Track {
    id: string;
    title: string;
    duration_seconds: number;
    plays: number;
    file_url: string;
    album: {
        id: string;
        title: string;
        cover_url: string;
        artist: Artist;
    };
}

interface MusicHubProps {
    featuredAlbums: Album[];
    recentAlbums: Album[];
    topTracks: Track[];
    genres: string[];
}

export default function MusicHub({ featuredAlbums, recentAlbums, topTracks, genres }: MusicHubProps) {
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const { setQueue, playTrack } = useAudio();

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const formatPlays = (plays: number) => {
        if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
        if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
        return plays.toString();
    };

    const convertToAudioTrack = (track: Track): AudioTrack => ({
        id: parseInt(track.id),
        title: track.title,
        artist: track.album.artist.stage_name,
        image: track.album.cover_url,
        url: track.file_url,
        duration: track.duration_seconds,
        album: track.album.title,
    });

    const handlePlayTrack = (track: Track, allTracks?: Track[]) => {
        const audioTrack = convertToAudioTrack(track);

        if (allTracks && allTracks.length > 0) {
            // Set up queue with all tracks
            const audioTracks = allTracks.map(convertToAudioTrack);
            const trackIndex = allTracks.findIndex(t => t.id === track.id);
            setQueue(audioTracks, trackIndex);
        } else {
            // Just play this single track
            playTrack(audioTrack);
        }

        // Navigate to full player
        router.visit('/artstream/player');
    };

    const handlePlayAlbum = (albumId: string) => {
        // Navigate to album view which will handle playback
        router.visit(`/artstream/album/${albumId}`);
    };

    const featuredAlbum = featuredAlbums[0];

    return (
        <MainLayout>
            <Head title="ArtStream - Hub Musique" />

            <div className="pb-24 md:pb-6">
                {/* Hero Section - Featured Album */}
                {featuredAlbum && (
                    <div className="relative bg-gradient-earth overflow-hidden border-b border-border/40">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
                        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                                <div className="w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                                    <img
                                        src={featuredAlbum.cover_url}
                                        alt={featuredAlbum.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-center md:text-left space-y-4 flex-1">
                                    <Badge className="bg-primary text-primary-foreground">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Album le plus écouté
                                    </Badge>
                                    <h1 className="text-4xl md:text-6xl font-black font-heading text-foreground">
                                        {featuredAlbum.title}
                                    </h1>
                                    <p className="text-xl text-muted-foreground">
                                        {featuredAlbum.artist.stage_name}
                                    </p>
                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground justify-center md:justify-start">
                                        <span className="flex items-center gap-1">
                                            <Badge variant="outline">{featuredAlbum.genre}</Badge>
                                        </span>
                                        <span>•</span>
                                        <span>{featuredAlbum.year}</span>
                                        <span>•</span>
                                        <span>{featuredAlbum.tracks_count} titres</span>
                                        {featuredAlbum.total_plays && featuredAlbum.total_plays > 0 && (
                                            <>
                                                <span>•</span>
                                                <span>{formatPlays(featuredAlbum.total_plays)} écoutes</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex gap-4 justify-center md:justify-start pt-2">
                                        <Button
                                            size="lg"
                                            onClick={() => handlePlayAlbum(featuredAlbum.id)}
                                            className="rounded-full px-8 gap-2 bg-primary hover:bg-primary/90"
                                        >
                                            <Play className="w-5 h-5 fill-current" />
                                            Écouter
                                        </Button>
                                        <Button size="lg" variant="outline" className="rounded-full px-8 gap-2">
                                            <Heart className="w-5 h-5" />
                                            J'aime
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Genres Filter */}
                <section className="py-6 px-4 bg-muted/30 border-b border-border/40">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                            <Button
                                variant={selectedGenre === null ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedGenre(null)}
                                className="rounded-full whitespace-nowrap"
                            >
                                Tous les genres
                            </Button>
                            {genres.map((genre) => (
                                <Button
                                    key={genre}
                                    variant={selectedGenre === genre ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedGenre(genre)}
                                    className="rounded-full whitespace-nowrap capitalize"
                                >
                                    {genre}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tabs Section */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <Tabs defaultValue="albums" className="w-full">
                            <TabsList className="mb-6">
                                <TabsTrigger value="albums">Albums populaires</TabsTrigger>
                                <TabsTrigger value="recent">Nouveautés</TabsTrigger>
                                <TabsTrigger value="tracks">Top Titres</TabsTrigger>
                            </TabsList>

                            {/* Featured Albums Tab */}
                            <TabsContent value="albums" className="mt-0">
                                <Carousel
                                    opts={{
                                        align: 'start',
                                        loop: true,
                                    }}
                                    className="w-full"
                                >
                                    <CarouselContent>
                                        {featuredAlbums
                                            .filter((album) => !selectedGenre || album.genre === selectedGenre)
                                            .map((album) => (
                                                <CarouselItem key={album.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                                    <div className="group cursor-pointer space-y-3">
                                                        <div className="aspect-square rounded-lg overflow-hidden relative bg-muted">
                                                            <img
                                                                src={album.cover_url}
                                                                alt={album.title}
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <Button
                                                                    size="icon"
                                                                    onClick={() => handlePlayAlbum(album.id)}
                                                                    className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 scale-0 group-hover:scale-100 transition-transform"
                                                                >
                                                                    <Play className="w-6 h-6 text-primary-foreground fill-current ml-0.5" />
                                                                </Button>
                                                            </div>
                                                            {album.total_plays && album.total_plays > 0 && (
                                                                <Badge className="absolute top-3 right-3 bg-black/70 text-white border-none">
                                                                    {formatPlays(album.total_plays)} écoutes
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold truncate text-foreground">
                                                                {album.title}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground truncate">
                                                                {album.artist.stage_name}
                                                            </p>
                                                            <div className="flex items-center justify-between mt-1">
                                                                <Badge variant="outline" className="text-xs capitalize">
                                                                    {album.genre}
                                                                </Badge>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {album.year}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="hidden md:flex -left-4 bg-background border-border hover:bg-muted" />
                                    <CarouselNext className="hidden md:flex -right-4 bg-background border-border hover:bg-muted" />
                                </Carousel>
                            </TabsContent>

                            {/* Recent Albums Tab */}
                            <TabsContent value="recent" className="mt-0">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    {recentAlbums
                                        .filter((album) => !selectedGenre || album.genre === selectedGenre)
                                        .map((album) => (
                                            <div key={album.id} className="group cursor-pointer space-y-3">
                                                <div className="aspect-square rounded-lg overflow-hidden relative bg-muted">
                                                    <img
                                                        src={album.cover_url}
                                                        alt={album.title}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Button
                                                            size="icon"
                                                            onClick={() => handlePlayAlbum(album.id)}
                                                            className="rounded-full bg-primary hover:bg-primary/90"
                                                        >
                                                            <Play className="w-5 h-5 fill-current ml-0.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold truncate text-sm text-foreground">
                                                        {album.title}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {album.artist.stage_name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </TabsContent>

                            {/* Top Tracks Tab */}
                            <TabsContent value="tracks" className="mt-0">
                                <div className="space-y-2">
                                    {topTracks.map((track, index) => (
                                        <div
                                            key={track.id}
                                            onClick={() => handlePlayTrack(track, topTracks)}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
                                        >
                                            <span className="w-8 text-center text-muted-foreground font-medium">
                                                {index + 1}
                                            </span>
                                            <img
                                                src={track.album.cover_url}
                                                alt={track.album.title}
                                                className="w-12 h-12 rounded object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold truncate text-foreground">{track.title}</h4>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {track.album.artist.stage_name}
                                                </p>
                                            </div>
                                            <div className="hidden md:block text-sm text-muted-foreground">
                                                {track.album.title}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <TrendingUp className="w-4 h-4" />
                                                <span>{formatPlays(track.plays)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatDuration(track.duration_seconds)}</span>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handlePlayTrack(track, topTracks)}
                                                >
                                                    <Play className="w-4 h-4 fill-current" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Heart className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
