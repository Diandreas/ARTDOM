
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Calendar, Music, Video, Share2, MessageCircle } from 'lucide-react';

export default function ArtistProfile() {
    // Mock Data
    const artist = {
        name: "Koffi Olomide",
        stageName: "Le Grand Mopao",
        category: "Rumba Congolaise",
        location: "Kinshasa, RDC",
        rating: 4.8,
        reviews: 124,
        bio: "Légende de la musique africaine, Koffi Olomidé a marqué des générations avec son style unique mêlant Rumba et Soukous. Avec plus de 30 ans de carrière, il continue de faire vibrer les scènes internationales.",
        image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2000&auto=format&fit=crop",
        tags: ["Chanteur", "Compositeur", "Danseur"]
    };

    const services = [
        { id: 1, title: "Concert Privé", price: "5000€", duration: "2h", description: "Performance live exclusive pour vos événements privés." },
        { id: 2, title: "Apparition VIP", price: "2500€", duration: "1h", description: "Présence et meet & greet lors de votre soirée." },
    ];

    return (
        <MainLayout>
            <Head title={`${artist.stageName} - Profil`} />

            {/* Cover Image */}
            <div className="h-48 md:h-80 w-full relative overflow-hidden">
                <img src={artist.cover} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="container px-4 md:px-6 relative -mt-16 md:-mt-24 pb-12">
                {/* Header Profile */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
                    <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-background shadow-xl">
                        <AvatarImage src={artist.image} alt={artist.stageName} className="object-cover" />
                        <AvatarFallback>KO</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2 mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-3xl md:text-4xl font-bold font-heading">{artist.stageName}</h1>
                            <Badge variant="secondary" className="bg-primary text-primary-foreground">Vérifié</Badge>
                        </div>
                        <p className="text-lg text-muted-foreground">{artist.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {artist.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-primary fill-primary" />
                                <span className="font-bold text-foreground">{artist.rating}</span> ({artist.reviews} avis)
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button className="flex-1 md:flex-none">Réserver</Button>
                        <Button variant="outline" size="icon"><MessageCircle className="w-4 h-4" /></Button>
                        <Button variant="outline" size="icon"><Share2 className="w-4 h-4" /></Button>
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="bio" className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto">
                        <TabsTrigger value="bio">Biographie</TabsTrigger>
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                        <TabsTrigger value="avis">Avis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bio" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>À propos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-relaxed text-muted-foreground">{artist.bio}</p>

                                <div className="mt-6">
                                    <h4 className="font-semibold mb-2">Compétences</h4>
                                    <div className="flex gap-2">
                                        {artist.tags.map(tag => (
                                            <Badge key={tag} variant="outline">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="services" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            {services.map(service => (
                                <Card key={service.id}>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-start">
                                            <span>{service.title}</span>
                                            <span className="text-primary">{service.price}</span>
                                        </CardTitle>
                                        <CardDescription>{service.duration}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                                        <Button className="w-full" variant="outline">Choisir</Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="portfolio" className="mt-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div key={item} className="aspect-square rounded-lg overflow-hidden bg-muted relative group cursor-pointer">
                                    <img
                                        src={`https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop&sig=${item}`}
                                        alt="Portfolio"
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Video className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="avis" className="mt-6">
                        <Card>
                            <CardContent className="pt-6 text-center text-muted-foreground">
                                Aucun avis pour le moment.
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
