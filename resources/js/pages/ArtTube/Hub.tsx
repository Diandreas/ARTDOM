import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Eye, Clock, TrendingUp, Heart } from 'lucide-react';

interface Artist {
    id: string;
    name?: string;
    stage_name: string;
    profile_photo?: string;
}

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    video_url: string;
    duration_seconds: number;
    views: number;
    likes: number;
    category: string;
    published_at: string;
    artist: {
        id: string;
        artist_profile: Artist;
    };
}

interface HubProps {
    trending: Video[];
    following: Video[];
    categories: string[];
}

export default function ArtTubeHub({ trending, following, categories }: HubProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const formatViews = (views: number) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'À l\'instant';
        if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
        if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const filteredTrending = selectedCategory
        ? trending.filter(v => v.category === selectedCategory)
        : trending;

    return (
        <MainLayout>
            <Head title="ArtTube - Vidéos & Tutoriels" />

            <div className="pb-24 md:pb-6">
                {/* Hero Section */}
                <div className="relative bg-gradient-earth overflow-hidden border-b border-border/40">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
                    <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
                        <div className="relative z-10 text-center space-y-4">
                            <Badge className="bg-primary text-primary-foreground">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Vidéos & Tutoriels
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-black font-heading text-foreground">
                                ArtTube
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Découvrez des tutoriels, performances et contenus exclusifs de vos artistes préférés
                            </p>
                        </div>
                    </div>
                </div>

                {/* Categories Filter */}
                <section className="py-6 px-4 bg-muted/30 border-b border-border/40">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                            <Button
                                variant={selectedCategory === null ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory(null)}
                                className="rounded-full whitespace-nowrap"
                            >
                                Toutes les catégories
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className="rounded-full whitespace-nowrap capitalize"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tabs Section */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <Tabs defaultValue="trending" className="w-full">
                            <TabsList className="mb-6">
                                <TabsTrigger value="trending">Tendances</TabsTrigger>
                                {following.length > 0 && (
                                    <TabsTrigger value="following">Abonnements</TabsTrigger>
                                )}
                            </TabsList>

                            {/* Trending Videos */}
                            <TabsContent value="trending" className="mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredTrending.map((video) => (
                                        <Link
                                            key={video.id}
                                            href={`/arttube/videos/${video.id}`}
                                            className="group cursor-pointer space-y-3"
                                        >
                                            <div className="aspect-video rounded-lg overflow-hidden relative bg-muted">
                                                <img
                                                    src={video.thumbnail_url || 'https://picsum.photos/640/360'}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform">
                                                        <Play className="w-6 h-6 text-primary-foreground fill-current ml-0.5" />
                                                    </div>
                                                </div>
                                                <Badge className="absolute bottom-3 right-3 bg-black/70 text-white border-none text-xs">
                                                    {formatDuration(video.duration_seconds)}
                                                </Badge>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                                                    {video.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {video.artist.artist_profile.stage_name}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3" />
                                                        {formatViews(video.views)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="w-3 h-3" />
                                                        {formatViews(video.likes)}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{formatTimeAgo(video.published_at)}</span>
                                                </div>
                                                <Badge variant="outline" className="text-xs capitalize">
                                                    {video.category}
                                                </Badge>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                {filteredTrending.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">Aucune vidéo disponible dans cette catégorie</p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Following Videos */}
                            {following.length > 0 && (
                                <TabsContent value="following" className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {following.map((video) => (
                                            <Link
                                                key={video.id}
                                                href={`/arttube/videos/${video.id}`}
                                                className="group cursor-pointer space-y-3"
                                            >
                                                <div className="aspect-video rounded-lg overflow-hidden relative bg-muted">
                                                    <img
                                                        src={video.thumbnail_url || 'https://picsum.photos/640/360'}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform">
                                                            <Play className="w-6 h-6 text-primary-foreground fill-current ml-0.5" />
                                                        </div>
                                                    </div>
                                                    <Badge className="absolute bottom-3 right-3 bg-black/70 text-white border-none text-xs">
                                                        {formatDuration(video.duration_seconds)}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                                                        {video.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {video.artist.artist_profile.stage_name}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            {formatViews(video.views)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="w-3 h-3" />
                                                            {formatViews(video.likes)}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{formatTimeAgo(video.published_at)}</span>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs capitalize">
                                                        {video.category}
                                                    </Badge>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </TabsContent>
                            )}
                        </Tabs>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
