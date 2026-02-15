import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, Clock, MapPin, Calendar as CalendarIcon, Star, ChevronRight } from 'lucide-react';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    duration_minutes: number;
    location_type: string;
}

interface Artist {
    id: string;
    name: string;
    stage_name: string;
    profile_photo: string;
    city: string;
    is_verified: boolean;
}

interface TimeSlot {
    time: string;
    available: boolean;
}

interface BookingCalendarProps {
    service: Service;
    artist: Artist;
    availableSlots: TimeSlot[];
}

const locationTypes: Record<string, string> = {
    home: 'À domicile',
    online: 'En ligne',
    public: 'Lieu public',
    any: 'Flexible',
};

export default function BookingCalendar({ service, artist, availableSlots }: BookingCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedDate && selectedTime) {
            router.get('/booking/customize', {
                service: service.id,
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: selectedTime,
            });
        }
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h${mins}`;
        if (hours > 0) return `${hours}h`;
        return `${mins} min`;
    };

    return (
        <MainLayout>
            <Head title={`Réserver ${service.title}`} />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
                <Link
                    href={`/service/${service.id}`}
                    className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour au service
                </Link>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                1
                            </div>
                            <span className="ml-2 font-medium">Date & Heure</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <div className="flex items-center text-muted-foreground">
                            <div className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center">
                                2
                            </div>
                            <span className="ml-2">Personnalisation</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <div className="flex items-center text-muted-foreground">
                            <div className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center">
                                3
                            </div>
                            <span className="ml-2">Paiement</span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Calendar Section */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sélectionnez une date</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    locale={fr}
                                    disabled={(date) => date < new Date()}
                                    className="rounded-md border w-full"
                                />
                            </CardContent>
                        </Card>

                        {selectedDate && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Créneaux disponibles</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {availableSlots.map((slot) => (
                                            <Button
                                                key={slot.time}
                                                variant={selectedTime === slot.time ? 'default' : 'outline'}
                                                disabled={!slot.available}
                                                onClick={() => setSelectedTime(slot.time)}
                                                className="h-12"
                                            >
                                                {slot.time}
                                            </Button>
                                        ))}
                                    </div>
                                    {availableSlots.filter((s) => s.available).length === 0 && (
                                        <p className="text-center text-muted-foreground py-8">
                                            Aucun créneau disponible pour cette date.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="md:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Récapitulatif</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Artist Info */}
                                <div className="flex items-center gap-3 pb-4 border-b">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={artist.profile_photo} alt={artist.stage_name} />
                                        <AvatarFallback>{artist.stage_name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-sm">{artist.stage_name}</h3>
                                            {artist.is_verified && (
                                                <Badge className="bg-primary text-primary-foreground text-xs px-1 py-0">
                                                    <Star className="w-2 h-2 fill-current" />
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="w-3 h-3" />
                                            {artist.city}
                                        </div>
                                    </div>
                                </div>

                                {/* Service Info */}
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-sm font-medium mb-1">Service</div>
                                        <div className="text-sm text-muted-foreground">{service.title}</div>
                                    </div>

                                    {selectedDate && (
                                        <div>
                                            <div className="text-sm font-medium mb-1">Date</div>
                                            <div className="text-sm text-muted-foreground">
                                                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                                            </div>
                                        </div>
                                    )}

                                    {selectedTime && (
                                        <div>
                                            <div className="text-sm font-medium mb-1">Heure</div>
                                            <div className="text-sm text-muted-foreground">{selectedTime}</div>
                                        </div>
                                    )}

                                    <div>
                                        <div className="text-sm font-medium mb-1">Durée</div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDuration(service.duration_minutes)}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium mb-1">Lieu</div>
                                        <div className="text-sm text-muted-foreground">
                                            {locationTypes[service.location_type]}
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm">Prix du service</span>
                                        <span className="font-semibold">{service.price.toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Frais de plateforme ajoutés à l'étape suivante
                                    </div>
                                </div>

                                {/* Continue Button */}
                                <Button
                                    className="w-full"
                                    disabled={!selectedDate || !selectedTime}
                                    onClick={handleContinue}
                                >
                                    Continuer
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
