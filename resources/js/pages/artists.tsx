import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star, TrendingUp } from 'lucide-react';

export default function Artists() {
    const featuredArtists = [
        { id: 1, name: "DJ Arafat", category: "Coupé Décalé", city: "Abidjan", rating: 4.9, image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&auto=format&fit=crop" },
        { id: 2, name: "Koffi Olomide", category: "Rumba", city: "Kinshasa", rating: 5.0, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop" },
        { id: 3, name: "Aya Nakamura", category: "Afropop", city: "Paris", rating: 4.8, image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=400&auto=format&fit=crop" },
        { id: 4, name: "Burna Boy", category: "Afrobeats", city: "Lagos", rating: 4.9, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop" },
    ];

    const categories = ["Tous", "Musiciens", "DJ", "Danseurs", "Chanteurs", "Producteurs"];

    return (
        <MainLayout>
            <Head title="Artistes" />
            <div className="container px-4 md:px-6 py-8 pb-24">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading mb-2">Découvrez nos Artistes</h1>
                    <p className="text-muted-foreground">Trouvez l'artiste parfait pour votre événement</p>
                </div>

                {/* Search & Filters */}
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Rechercher un artiste, une catégorie..."
                            className="pl-10 h-12"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={cat === "Tous" ? "default" : "outline"}
                                className="whitespace-nowrap"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Artists Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {featuredArtists.map((artist) => (
                        <Card key={artist.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="aspect-square relative overflow-hidden">
                                <img
                                    src={artist.image}
                                    alt={artist.name}
                                    className="w-full h-full object-cover transition-transform hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                                    <Star className="w-3 h-3 fill-primary text-primary" />
                                    {artist.rating}
                                </div>
                            </div>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">{artist.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {artist.city}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{artist.category}</span>
                                    <Button size="sm">Voir Profil</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Trending Section */}
                <div className="mt-12">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold font-heading">Tendances</h2>
                    </div>
                    <p className="text-center text-muted-foreground py-8">
                        Les artistes les plus populaires apparaîtront ici
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
