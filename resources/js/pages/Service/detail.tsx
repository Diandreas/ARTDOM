import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, Clock, MapPin, Calendar as CalendarIcon, CreditCard, Star } from 'lucide-react';

interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    price_type: string;
    duration_minutes: number;
    notice_period_hours: number;
    location_type: string;
    category: string;
    is_active: boolean;
}

interface Artist {
    id: string;
    name: string;
    stage_name: string;
    city: string;
    profile_photo: string;
    is_verified: boolean;
    rating: number;
    total_reviews: number;
    categories: string[];
}

interface ServiceDetailProps {
    service: Service;
    artist: Artist;
}

const locationTypes: Record<string, string> = {
    home: 'À domicile',
    online: 'En ligne',
    public: 'Lieu public',
    any: 'Flexible',
};

const priceTypes: Record<string, string> = {
    fixed: 'Prix fixe',
    hourly: 'Par heure',
    negotiable: 'Négociable',
};

export default function ServiceDetail({ service, artist }: ServiceDetailProps) {
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h${mins}`;
        if (hours > 0) return `${hours}h`;
        return `${mins} min`;
    };

    const formatNotice = (hours: number) => {
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days} jour${days > 1 ? 's' : ''}`;
        return `${hours}h`;
    };

    return (
        <MainLayout>
            <Head title={`${service.title} - ${artist.stage_name}`} />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
                <Link
                    href={`/artist/${artist.id}`}
                    className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour au profil
                </Link>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Service Header */}
                        <div>
                            <Badge className="mb-3 capitalize">{service.category}</Badge>
                            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">
                                {service.title}
                            </h1>

                            {/* Artist Info */}
                            <Link href={`/artist/${artist.id}`}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-16 h-16">
                                                <AvatarImage src={artist.profile_photo} alt={artist.stage_name} />
                                                <AvatarFallback>{artist.stage_name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-lg">{artist.stage_name}</h3>
                                                    {artist.is_verified && (
                                                        <Badge className="bg-primary text-primary-foreground text-xs">
                                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                                            Vérifié
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {artist.city}
                                                    </div>
                                                    {artist.rating > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 text-primary fill-primary" />
                                                            <span className="font-medium text-foreground">
                                                                {artist.rating.toFixed(1)}
                                                            </span>
                                                            <span>({artist.total_reviews})</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Description du service</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {service.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Service Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Détails pratiques</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Durée</div>
                                            <div className="text-muted-foreground text-sm">
                                                {formatDuration(service.duration_minutes)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Localisation</div>
                                            <div className="text-muted-foreground text-sm">
                                                {locationTypes[service.location_type] || service.location_type}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <CalendarIcon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Préavis</div>
                                            <div className="text-muted-foreground text-sm">
                                                {formatNotice(service.notice_period_hours)} minimum
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Type de tarif</div>
                                            <div className="text-muted-foreground text-sm">
                                                {priceTypes[service.price_type] || service.price_type}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="md:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Réservation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="border-b pb-4">
                                    <div className="text-sm text-muted-foreground mb-1">Prix du service</div>
                                    <div className="text-3xl font-bold text-primary">
                                        {service.price.toLocaleString()} FCFA
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {priceTypes[service.price_type]}
                                    </div>
                                </div>

                                {service.is_active ? (
                                    <>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-primary mt-2" />
                                                <span className="text-muted-foreground">
                                                    Réservation sous {formatNotice(service.notice_period_hours)}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-primary mt-2" />
                                                <span className="text-muted-foreground">
                                                    Paiement sécurisé après confirmation
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-primary mt-2" />
                                                <span className="text-muted-foreground">Annulation gratuite 48h avant</span>
                                            </div>
                                        </div>

                                        <Button className="w-full text-lg h-12 bg-primary hover:bg-primary/90">
                                            Réserver maintenant
                                        </Button>

                                        <p className="text-xs text-center text-muted-foreground">
                                            Vous ne serez débité qu'après confirmation de l'artiste.
                                        </p>
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <Badge variant="secondary" className="mb-2">
                                            Service indisponible
                                        </Badge>
                                        <p className="text-sm text-muted-foreground">
                                            Ce service n'est pas disponible pour le moment.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
