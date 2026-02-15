import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Music, Mic, Palette, Video } from 'lucide-react';

export default function Welcome() {
    const stories = [
        { id: 1, name: "Koffi", image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=200&auto=format&fit=crop" },
        { id: 2, name: "Awa", image: "https://images.unsplash.com/photo-1529139574466-a302d2d3f9f4?q=80&w=200&auto=format&fit=crop" },
        { id: 3, name: "Fally", image: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?q=80&w=200&auto=format&fit=crop" },
        { id: 4, name: "Yemi", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop" },
        { id: 5, name: "Burna", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
        { id: 6, name: "Tiwa", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
    ];

    const categories = [
        { name: "Chant", icon: Mic, color: "bg-red-500" },
        { name: "Danse", icon: Music, color: "bg-blue-500" },
        { name: "Peinture", icon: Palette, color: "bg-yellow-500" },
        { name: "Théâtre", icon: Video, color: "bg-purple-500" },
        { name: "Instrument", icon: Music, color: "bg-green-500" },
        { name: "Comedy", icon: Mic, color: "bg-orange-500" },
    ];

    const trendingArtists = [
        { id: 1, name: "Sarkodie", category: "Rap", rating: 4.8, price: "500€", image: "https://images.unsplash.com/photo-1520342868574-5fa3804e551c?q=80&w=400&auto=format&fit=crop" },
        { id: 2, name: "Angelique", category: "Afro-Jazz", rating: 5.0, price: "1200€", image: "https://images.unsplash.com/photo-1515020617130-eca021a45a4d?q=80&w=400&auto=format&fit=crop" },
        { id: 3, name: "Wizkid", category: "Afrobeat", rating: 4.9, price: "2000€", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&auto=format&fit=crop" },
        { id: 4, name: "Tems", category: "R&B", rating: 4.7, price: "800€", image: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=400&auto=format&fit=crop" },
    ];

    return (
        <MainLayout>
            <Head title="Accueil - ARTDOM" />

            <div className="flex flex-col gap-8 pb-20">
                {/* Hero / Stories Section */}
                <section className="container px-4 md:px-6 py-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary w-2 h-6 rounded-full inline-block"></span>
                        Stories
                    </h2>
                    <Carousel className="w-full" opts={{ align: "start", dragFree: true }}>
                        <CarouselContent className="-ml-4">
                            {stories.map((story) => (
                                <CarouselItem key={story.id} className="pl-4 basis-[80px] md:basis-[100px]">
                                    <div className="flex flex-col items-center gap-2 cursor-pointer group">
                                        <div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] rounded-full p-[2px] bg-gradient-to-tr from-primary to-secondary group-hover:scale-105 transition-transform">
                                            <div className="w-full h-full rounded-full border-2 border-background overflow-hidden relative">
                                                <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium truncate w-full text-center">{story.name}</span>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </section>

                {/* Promotional Banner */}
                <section className="container px-4 md:px-6">
                    <div className="relative rounded-2xl overflow-hidden bg-muted h-[200px] md:h-[300px] flex items-center justify-center text-center p-6 isolate">
                        <img
                            src="https://images.unsplash.com/photo-1514525253440-b393452eeb25?q=80&w=1600&auto=format&fit=crop"
                            alt="Concert"
                            className="absolute inset-0 w-full h-full object-cover opacity-40 -z-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent -z-10" />

                        <div className="flex flex-col gap-4 items-center max-w-lg">
                            <Badge variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90">À la une</Badge>
                            <h1 className="text-3xl md:text-5xl font-bold font-heading text-foreground drop-shadow-md">
                                Vivez l'émotion <span className="text-primary">Live</span>
                            </h1>
                            <p className="text-muted-foreground md:text-lg text-balance">
                                Réservez vos artistes préférés pour des moments inoubliables.
                            </p>
                            <Button size="lg" className="rounded-full font-semibold" asChild>
                                <Link href="/splash">Découvrir les talents</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="container px-4 md:px-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="bg-secondary w-2 h-6 rounded-full inline-block"></span>
                            Catégories
                        </h2>
                        <Link href="#" className="text-sm text-primary hover:underline">Voir tout</Link>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {categories.map((category, idx) => (
                            <Link key={idx} href="#" className="flex flex-col items-center gap-3 group">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${category.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all shadow-sm group-hover:shadow-md border border-border/50`}>
                                    <category.icon className={`w-8 h-8 opacity-80 group-hover:scale-110 transition-transform ${category.color.replace('bg-', 'text-')}`} />
                                </div>
                                <span className="text-sm font-medium">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Trending Artists */}
                <section className="container px-4 md:px-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="bg-accent w-2 h-6 rounded-full inline-block"></span>
                            Artistes Tendances
                        </h2>
                        <Link href="#" className="text-sm text-primary hover:underline">Voir tout</Link>
                    </div>
                    <Carousel className="w-full" opts={{ align: "start" }}>
                        <CarouselContent className="-ml-4">
                            {trendingArtists.map((artist) => (
                                <CarouselItem key={artist.id} className="pl-4 basis-[280px] md:basis-[320px]">
                                    <Card className="overflow-hidden border-border/60 hover:border-primary/50 transition-colors h-full">
                                        <div className="relative aspect-[4/3]">
                                            <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                                            <div className="absolute top-2 right-2 bg-background/80 backdrop-blur px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <Star className="w-3 h-3 text-primary fill-primary" />
                                                {artist.rating}
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg">{artist.name}</h3>
                                                    <p className="text-muted-foreground text-sm">{artist.category}</p>
                                                </div>
                                                <Badge variant="outline" className="font-mono text-primary border-primary/30">
                                                    {artist.price}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <Button className="w-full rounded-full" size="sm">Réserver</Button>
                                                <Button variant="outline" size="icon" className="rounded-full shrink-0">
                                                    <Play className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="hidden md:block">
                            <CarouselPrevious />
                            <CarouselNext />
                        </div>
                    </Carousel>
                </section>

                {/* Mini Player Placeholder - fixed at bottom if needed, but per spec it's persistent. 
                     For now, maybe just a section "Nouveautés musique" */}
                <section className="container px-4 md:px-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary w-2 h-6 rounded-full inline-block"></span>
                        Nouveautés Musique
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((item) => (
                            <Card key={item} className="flex overflow-hidden group cursor-pointer hover:bg-muted/50 transition-colors">
                                <div className="w-24 h-24 bg-muted shrink-0 relative">
                                    <img
                                        src={`https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop&sig=${item}`}
                                        alt="Album"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="w-8 h-8 text-white fill-white" />
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col justify-center">
                                    <h3 className="font-bold">Titre de la chanson {item}</h3>
                                    <p className="text-sm text-muted-foreground">Artiste Inconnu</p>
                                    <p className="text-xs text-muted-foreground mt-1">3:45 • Afrobeat</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
