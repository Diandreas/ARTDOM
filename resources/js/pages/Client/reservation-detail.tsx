import { Head, Link, router } from '@inertiajs/react';
import { FormEvent } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    ChevronLeft,
    Calendar,
    Clock,
    MapPin,
    CreditCard,
    Star,
    MessageCircle,
    XCircle,
} from 'lucide-react';

interface Reservation {
    id: string;
    reservation_number: string;
    status: string;
    scheduled_at: string;
    total_amount: number;
    service: {
        title: string;
        duration_minutes: number;
    };
    artist: {
        id: string;
        stage_name: string;
        profile_photo: string;
    };
}

interface ReservationDetailProps {
    reservation: Reservation;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    pending: { label: 'En attente', variant: 'secondary' },
    confirmed: { label: 'Confirmée', variant: 'default' },
    completed: { label: 'Terminée', variant: 'secondary' },
    cancelled: { label: 'Annulée', variant: 'destructive' },
};

export default function ReservationDetail({ reservation }: ReservationDetailProps) {
    const handleCancel = () => {
        if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
            router.post(`/client/reservations/${reservation.id}/cancel`, {});
        }
    };

    const handleReview = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        router.post(`/client/reservations/${reservation.id}/review`, {
            rating: formData.get('rating'),
            comment: formData.get('comment'),
        });
    };

    const scheduledDate = new Date(reservation.scheduled_at);
    const canCancel = reservation.status === 'pending' || reservation.status === 'confirmed';
    const canReview = reservation.status === 'completed';

    return (
        <MainLayout>
            <Head title={`Réservation ${reservation.reservation_number}`} />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                <Link
                    href="/client/reservations"
                    className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour aux réservations
                </Link>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Header */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-2xl mb-2">
                                            {reservation.service.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    statusLabels[reservation.status]?.variant || 'secondary'
                                                }
                                            >
                                                {statusLabels[reservation.status]?.label || reservation.status}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {reservation.reservation_number}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Artist Info */}
                                <Link href={`/artist/${reservation.artist.id}`}>
                                    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                                        <Avatar className="w-16 h-16">
                                            <AvatarImage src={reservation.artist.profile_photo} />
                                            <AvatarFallback>
                                                {reservation.artist.stage_name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-foreground">
                                                {reservation.artist.stage_name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Artiste</div>
                                        </div>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Détails de la réservation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Date</div>
                                            <div className="text-muted-foreground text-sm">
                                                {scheduledDate.toLocaleDateString('fr-FR', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Heure et durée</div>
                                            <div className="text-muted-foreground text-sm">
                                                {scheduledDate.toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}{' '}
                                                • {reservation.service.duration_minutes} minutes
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Montant</div>
                                            <div className="text-muted-foreground text-sm">
                                                {reservation.total_amount.toLocaleString()} FCFA
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Review Section */}
                        {canReview && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Laisser un avis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleReview} className="space-y-4">
                                        <div>
                                            <Label>Note</Label>
                                            <div className="flex gap-2 mt-2">
                                                {[1, 2, 3, 4, 5].map((rating) => (
                                                    <label key={rating} className="cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="rating"
                                                            value={rating}
                                                            className="sr-only peer"
                                                            required
                                                        />
                                                        <Star className="w-8 h-8 text-muted-foreground peer-checked:text-primary peer-checked:fill-primary hover:text-primary transition-colors" />
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="comment">Commentaire (optionnel)</Label>
                                            <Textarea
                                                id="comment"
                                                name="comment"
                                                placeholder="Partagez votre expérience..."
                                                rows={4}
                                                className="mt-2"
                                            />
                                        </div>

                                        <Button type="submit" className="w-full">
                                            Publier l'avis
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Actions */}
                            {canCancel && (
                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    onClick={handleCancel}
                                >
                                    <XCircle className="w-4 h-4" />
                                    Annuler la réservation
                                </Button>
                            )}

                            <Button variant="outline" className="w-full gap-2">
                                <MessageCircle className="w-4 h-4" />
                                Contacter l'artiste
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
