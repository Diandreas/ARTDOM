import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Play, Disc3, Download, GraduationCap, Lock, Globe, FileVideo } from 'lucide-react';

interface Playlist {
    id: number;
    title: string;
    cover_url: string | null;
    is_public: boolean;
    tracks_count: number;
    created_at: string;
}

interface Album {
    id: number;
    title: string;
    cover_url: string | null;
    artist: {
        id: number;
        stage_name: string;
    };
}

interface LibraryProps {
    playlists: Playlist[];
    albums: Album[];
}

export default function Library({ playlists, albums }: LibraryProps) {
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
            <Head title="Ma Bibliothèque" />

            <div className="pb-24 md:pb-6">
                {/* Header */}
                <div className="bg-gradient-to-b from-primary/10 to-background border-b border-border/40 px-4 py-8 md:py-12">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black font-heading text-foreground mb-2">
                                    Ma Bibliothèque
                                </h1>
                                <p className="text-muted-foreground">
                                    Vos musiques, formations et téléchargements
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <Tabs defaultValue="albums" className="w-full space-y-8">
                            <TabsList className="bg-muted p-1 rounded-full grid w-full grid-cols-4 sm:w-[600px] sm:mx-auto">
                                <TabsTrigger value="albums" className="rounded-full text-xs sm:text-sm">Albums achetés</TabsTrigger>
                                <TabsTrigger value="courses" className="rounded-full text-xs sm:text-sm">Cours en cours</TabsTrigger>
                                <TabsTrigger value="playlists" className="rounded-full text-xs sm:text-sm">Playlists</TabsTrigger>
                                <TabsTrigger value="downloads" className="rounded-full text-xs sm:text-sm">Téléchargements</TabsTrigger>
                            </TabsList>

                            {/* Albums Tab */}
                            <TabsContent value="albums" className="space-y-6 animate-in fade-in-50 duration-500">
                                {albums && albums.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {albums.map((album, index) => (
                                            <Card key={album.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                                                <CardContent className="p-0">
                                                    <div className="relative overflow-hidden bg-muted aspect-square">
                                                        {album.cover_url ? (
                                                            <img
                                                                src={album.cover_url}
                                                                alt={album.title}
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                                            />
                                                        ) : (
                                                            <div className={`w-full h-full ${getDefaultCover(index)} flex items-center justify-center`}>
                                                                <Disc3 className="w-16 h-16 text-white/80" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                            <Button
                                                                size="icon"
                                                                className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 scale-0 group-hover:scale-100 transition-transform delay-75"
                                                            >
                                                                <Play className="w-6 h-6 fill-current ml-0.5" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="default"
                                                                className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 scale-0 group-hover:scale-100 transition-transform delay-100"
                                                            >
                                                                <Download className="w-5 h-5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                                                            {album.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground truncate">{album.artist.stage_name}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                                            <Disc3 className="w-12 h-12 text-muted-foreground" />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2">Aucun album acheté</h2>
                                        <p className="text-muted-foreground mb-6 max-w-md">
                                            Explorez ArtStream pour découvrir et acheter de la musique.
                                        </p>
                                        <Button asChild className="gap-2">
                                            <Link href="/artstream">
                                                Découvrir ArtStream
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Courses Tab */}
                            <TabsContent value="courses" className="space-y-6 animate-in fade-in-50 duration-500">
                                {/* Placeholder for Courses */}
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                                        <GraduationCap className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Aucune formation en cours</h2>
                                    <p className="text-muted-foreground mb-6 max-w-md">
                                        Inscrivez-vous à des masterclasses pour développer vos talents.
                                    </p>
                                    <Button asChild className="gap-2">
                                        <Link href="/courses">
                                            Explorer le catalogue
                                        </Link>
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Playlists Tab */}
                            <TabsContent value="playlists" className="space-y-6 animate-in fade-in-50 duration-500">
                                {playlists && playlists.length > 0 ? (
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
                                                                >
                                                                    <Play className="w-6 h-6 fill-current ml-0.5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <div className="p-4">
                                                        <h3 className="font-semibold truncate text-foreground group-hover:text-primary transition-colors mb-1">
                                                            {playlist.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <span>{playlist.tracks_count} titre{playlist.tracks_count !== 1 ? 's' : ''}</span>
                                                            <span>•</span>
                                                            {playlist.is_public ? (
                                                                <Badge variant="outline" className="gap-1 text-[10px] px-1.5 py-0 h-4">
                                                                    <Globe className="w-2.5 h-2.5" />
                                                                    Public
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="gap-1 text-[10px] px-1.5 py-0 h-4">
                                                                    <Lock className="w-2.5 h-2.5" />
                                                                    Privé
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                                            <Music className="w-12 h-12 text-muted-foreground" />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2">Aucune playlist</h2>
                                        <p className="text-muted-foreground mb-6 max-w-md">
                                            Vous n'avez pas encore créé de playlist.
                                        </p>
                                        <Button asChild className="gap-2">
                                            <Link href="/playlists">
                                                Gérer mes playlists
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Downloads Tab */}
                            <TabsContent value="downloads" className="space-y-6 animate-in fade-in-50 duration-500">
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6 relative">
                                        <Download className="w-12 h-12 text-muted-foreground" />
                                        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full border-2 border-background">
                                            Beta
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Mode Hors-ligne Prochainement</h2>
                                    <p className="text-muted-foreground mb-6 max-w-md">
                                        Le téléchargement d'albums complets et de vidéos pour une écoute sans connexion internet (PWA) arrive bientôt.
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
