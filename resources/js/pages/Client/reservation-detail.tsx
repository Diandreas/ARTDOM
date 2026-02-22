import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
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
    Download,
    QrCode as QrCodeIcon,
    CheckCircle2,
    Circle,
} from 'lucide-react';
import { format, parseISO, differenceInSeconds } from 'date-fns';
import { fr } from 'date-fns/locale';
import cancel from '@/actions/App/Http/Controllers/Client/ReservationController/cancel';

interface Artist {
    id: string;
    stage_name: string;
    profile_photo: string | null;
    city: string;
}

interface Service {
    id: string;
    title: string;
    duration_minutes: number;
}

interface Payment {
    id: string;
    method: string;
    status: string;
    paid_at: string | null;
}

interface Reservation {
    id: string;
    reservation_number: string;
    status: string;
    scheduled_at: string;
    duration_minutes: number;
    total_amount: number;
    commission_amount: number;
    location_type: string;
    location_address: string | null;
    recipient_name: string | null;
    emotion_type: string | null;
    custom_message: string | null;
    qr_code: string | null;
    created_at: string;
    service: Service;
    artist: Artist;
    payment: Payment | null;
}

interface ReservationDetailProps {
    reservation: Reservation;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'En attente', variant: 'secondary' },
    confirmed: { label: 'Confirmée', variant: 'default' },
    completed: { label: 'Terminée', variant: 'outline' },
    cancelled: { label: 'Annulée', variant: 'destructive' },
};

const emotionLabels: Record<string, string> = {
    Joie: 'Joie / Célébration',
    Amour: 'Amour / Romance',
    Soutien: 'Tristesse / Soutien',
    Hommage: 'Hommage',
    Fierté: 'Fierté',
};

export default function ReservationDetail({ reservation }: ReservationDetailProps) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (reservation.status !== 'upcoming' && reservation.status !== 'confirmed' && reservation.status !== 'pending') {
            return;
        }

        const interval = setInterval(() => {
            const seconds = differenceInSeconds(parseISO(reservation.scheduled_at), new Date());

            if (seconds <= 0) {
                setTimeLeft('Événement en cours');
                clearInterval(interval);
                return;
            }

            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);

            if (days > 0) {
                setTimeLeft(`${days}j ${hours}h ${minutes}m`);
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`${minutes}m`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [reservation.scheduled_at, reservation.status]);

    const handleCancel = () => {
        if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ? Vous serez remboursé sous 3-5 jours ouvrés.')) {
            router.post(cancel({ id: reservation.id }));
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

    const handleDownloadReceipt = () => {
        window.location.href = `/booking/${reservation.id}/receipt`;
    };

    const scheduledDate = parseISO(reservation.scheduled_at);
    const canCancel = ['pending', 'confirmed'].includes(reservation.status);
    const canReview = reservation.status === 'completed';

    // Timeline steps
    const timelineSteps = [
        { key: 'pending', label: 'Demande envoyée', completed: true },
        {
            key: 'confirmed',
            label: 'Confirmée',
            completed: ['confirmed', 'completed'].includes(reservation.status),
        },
        { key: 'completed', label: 'Terminée', completed: reservation.status === 'completed' },
    ];

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
                                        <CardTitle className="text-2xl mb-2">{reservation.service.title}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={statusLabels[reservation.status]?.variant || 'secondary'}>
                                                {statusLabels[reservation.status]?.label || reservation.status}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {reservation.reservation_number}
                                            </span>
                                        </div>
                                    </div>
                                    {timeLeft && (
                                        <div className="text-right">
                                            <div className="text-sm text-muted-foreground">Dans</div>
                                            <div className="text-2xl font-bold text-primary">{timeLeft}</div>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Artist Info */}
                                <Link href={`/artist/${reservation.artist.id}`}>
                                    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                                        <Avatar className="w-16 h-16">
                                            <AvatarImage src={reservation.artist.profile_photo || undefined} />
                                            <AvatarFallback>{reservation.artist.stage_name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-foreground">
                                                {reservation.artist.stage_name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{reservation.artist.city}</div>
                                        </div>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        {reservation.status !== 'cancelled' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statut de la réservation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {timelineSteps.map((step, index) => (
                                            <div key={step.key} className="flex items-center gap-4">
                                                <div className="flex-shrink-0">
                                                    {step.completed ? (
                                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                                    ) : (
                                                        <Circle className="w-6 h-6 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div
                                                        className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}
                                                    >
                                                        {step.label}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* QR Code */}
                        {reservation.qr_code && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col md:flex-row gap-6 items-center">
                                        <div className="flex-shrink-0 bg-white p-4 rounded-lg">
                                            <img src={reservation.qr_code} alt="QR Code" className="w-[150px] h-[150px]" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex items-center gap-2 text-lg font-semibold mb-2 justify-center md:justify-start">
                                                <QrCodeIcon className="w-5 h-5 text-primary" />
                                                QR Code de réservation
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Présentez ce QR code à l'artiste le jour de la prestation.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Détails de la réservation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            {format(scheduledDate, 'EEEE d MMMM yyyy', { locale: fr })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            {format(scheduledDate, 'HH:mm')} • {reservation.duration_minutes} minutes
                                        </div>
                                    </div>
                                </div>

                                {reservation.location_address && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">{reservation.location_address}</div>
                                        </div>
                                    </div>
                                )}

                                {reservation.recipient_name && (
                                    <div className="pt-4 border-t">
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Destinataire</div>
                                        <div className="font-medium">{reservation.recipient_name}</div>
                                    </div>
                                )}

                                {reservation.emotion_type && (
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Type d'émotion</div>
                                        <div className="font-medium">{emotionLabels[reservation.emotion_type] || reservation.emotion_type}</div>
                                    </div>
                                )}

                                {reservation.custom_message && (
                                    <div className="pt-4 border-t">
                                        <div className="text-sm font-medium text-muted-foreground mb-2">
                                            Message personnalisé
                                        </div>
                                        <div className="text-sm bg-muted/50 p-4 rounded-lg italic">
                                            "{reservation.custom_message}"
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Montant de la prestation</span>
                                        <span className="font-medium">
                                            {(reservation.total_amount - reservation.commission_amount).toLocaleString('fr-FR')} FCFA
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-muted-foreground">Frais de plateforme</span>
                                        <span className="font-medium">
                                            {reservation.commission_amount.toLocaleString('fr-FR')} FCFA
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center font-bold text-lg pt-3 mt-3 border-t">
                                        <span>Total payé</span>
                                        <span className="text-primary">
                                            {reservation.total_amount.toLocaleString('fr-FR')} FCFA
                                        </span>
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
                            <Button variant="default" className="w-full gap-2" onClick={handleDownloadReceipt}>
                                <Download className="w-4 h-4" />
                                Télécharger le reçu
                            </Button>

                            <Button variant="outline" className="w-full gap-2">
                                <MessageCircle className="w-4 h-4" />
                                Contacter l'artiste
                            </Button>

                            {canCancel && (
                                <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive" onClick={handleCancel}>
                                    <XCircle className="w-4 h-4" />
                                    Annuler la réservation
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
