
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Heart, MoreHorizontal, Shuffle } from 'lucide-react';

export default function MusicHub() {
    const featuredPlaylists = [
        { id: 1, title: "Afro Hits 2024", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&auto=format&fit=crop", artist: "ARTDOM Curated" },
        { id: 2, title: "Rumba Classics", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop", artist: "Koffi Olomide" },
        { id: 3, title: "Naija Vibes", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop", artist: "Burna Boy" },
        { id: 4, title: "Coupé Décalé", cover: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=400&auto=format&fit=crop", artist: "DJ Arafat" },
    ];

    const newReleases = [
        { id: 1, title: "Légende", artist: "Koffi Olomide", cover: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200&auto=format&fit=crop" },
        { id: 2, title: "Love Damini", artist: "Burna Boy", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop" },
        { id: 3, title: "Aya", artist: "Aya Nakamura", cover: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=200&auto=format&fit=crop" },
    ];

    return (
        <MainLayout>
            <Head title="ArtStream - Musique" />

            <div className="container px-4 md:px-6 py-8 pb-24">
                {/* Hero Section */}
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/20 to-secondary/20 p-6 md:p-12 mb-8">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                        <img
                            src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&auto=format&fit=crop"
                            alt="Featured Album"
                            className="w-48 h-48 object-cover rounded-lg shadow-2xl rotate-3 transition-transform hover:rotate-0"
                        />
                        <div className="text-center md:text-left space-y-4">
                            <h2 className="text-sm font-bold tracking-wider text-primary uppercase">Album de la semaine</h2>
                            <h1 className="text-4xl md:text-6xl font-black font-heading">AFRO VIBES</h1>
                            <p className="text-lg text-muted-foreground max-w-lg">
                                Découvrez les meilleurs sons du moment. Une sélection exclusive pour vibrer au rythme de l'Afrique.
                            </p>
                            <div className="flex gap-4 justify-center md:justify-start">
                                <Button size="lg" className="rounded-full px-8 gap-2">
                                    <Play className="w-5 h-5 fill-current" /> Écouter
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full px-8 gap-2">
                                    <Heart className="w-5 h-5" /> Favoris
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Playlists */}
                <div className="mb-10">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-bold font-heading">Playlists à la une</h2>
                        <Link href="#" className="text-sm text-primary hover:underline">Voir tout</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {featuredPlaylists.map(playlist => (
                            <div key={playlist.id} className="group cursor-pointer space-y-3">
                                <div className="aspect-square rounded-lg overflow-hidden relative">
                                    <img
                                        src={playlist.cover}
                                        alt={playlist.title}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold truncate">{playlist.title}</h3>
                                    <p className="text-sm text-muted-foreground truncate">{playlist.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* New Releases */}
                <div>
                    <h2 className="text-2xl font-bold font-heading mb-6">Nouveautés</h2>
                    <div className="space-y-4">
                        {newReleases.map((track, i) => (
                            <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                                <span className="w-6 text-center text-muted-foreground font-medium">{i + 1}</span>
                                <img src={track.cover} alt={track.title} className="w-12 h-12 rounded object-cover" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold truncate">{track.title}</h4>
                                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                                </div>
                                <div className="hidden md:flex text-sm text-muted-foreground">3:45</div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Heart className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
