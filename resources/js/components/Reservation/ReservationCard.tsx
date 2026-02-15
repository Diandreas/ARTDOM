import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, User, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Reservation {
    id: string;
    reservation_number: string;
    status: string;
    scheduled_at: string;
    location: string;
    total_amount: number;
    artist: {
        id: string;
        name: string;
        stage_name: string;
        profile_photo_url: string;
        artist_profile: {
            city: string;
        };
    };
    service: {
        id: string;
        title: string;
    };
    has_unread_messages?: boolean;
}

interface ReservationCardProps {
    reservation: Reservation;
}

const statusConfig = {
    pending: {
        label: 'En attente',
        variant: 'secondary' as const,
        color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    },
    confirmed: {
        label: 'Confirmée',
        variant: 'default' as const,
        color: 'bg-green-500/10 text-green-700 dark:text-green-400',
    },
    completed: {
        label: 'Terminée',
        variant: 'outline' as const,
        color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    },
    cancelled: {
        label: 'Annulée',
        variant: 'destructive' as const,
        color: 'bg-red-500/10 text-red-700 dark:text-red-400',
    },
    refunded: {
        label: 'Remboursée',
        variant: 'outline' as const,
        color: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
    },
};

export default function ReservationCard({ reservation }: ReservationCardProps) {
    const status = statusConfig[reservation.status as keyof typeof statusConfig] || statusConfig.pending;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    {/* Artist Photo */}
                    <div className="md:w-32 h-32 md:h-auto relative bg-muted flex-shrink-0">
                        <img
                            src={reservation.artist.profile_photo_url}
                            alt={reservation.artist.stage_name}
                            className="w-full h-full object-cover"
                        />
                        {reservation.has_unread_messages && (
                            <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full border-2 border-white" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-lg text-foreground mb-1">
                                    {reservation.artist.stage_name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {reservation.service.title}
                                </p>
                            </div>
                            <Badge className={status.color}>
                                {status.label}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {format(new Date(reservation.scheduled_at), 'PPP', { locale: fr })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {format(new Date(reservation.scheduled_at), 'HH:mm')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate">{reservation.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="w-4 h-4" />
                                <span>#{reservation.reservation_number}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold text-primary">
                                {reservation.total_amount.toLocaleString()} FCFA
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/client/reservations/${reservation.id}`}>
                                        Voir détails
                                    </Link>
                                </Button>
                                {reservation.has_unread_messages && (
                                    <Button variant="ghost" size="sm" className="relative">
                                        <MessageCircle className="w-4 h-4" />
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
