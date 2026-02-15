import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import StatusTimeline from '@/components/Reservation/StatusTimeline';
import QRCodeDisplay from '@/components/Reservation/QRCodeDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    MapPin,
    Clock,
    User,
    MessageCircle,
    Download,
    X,
    Star,
    Edit,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Reservation {
    id: string;
    reservation_number: string;
    status: string;
    scheduled_at: string;
    location: string;
    total_amount: number;
    recipient_name: string;
    custom_message: string;
    emotion_type: string;
    artist: {
        id: string;
        name: string;
        stage_name: string;
        profile_photo_url: string;
        email: string;
        phone: string;
    };
    service: {
        id: string;
        title: string;
        description: string;
    };
    payment: {
        amount: number;
        service_fee: number;
        total: number;
        payment_method: string;
    };
}

interface ReservationShowProps {
    reservation: Reservation;
}

export default function Show({ reservation }: ReservationShowProps) {
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const canCancel = reservation.status === 'pending' || reservation.status === 'confirmed';
    const canModify = reservation.status === 'pending';
    const canReview = reservation.status === 'completed';

    const handleCancel = () => {
        router.post(`/client/reservations/${reservation.id}/cancel`, {}, {
            onSuccess: () => setShowCancelDialog(false),
        });
    };

    const handleDownloadReceipt = () => {
        window.open(`/client/reservations/${reservation.id}/receipt`, '_blank');
    };

    return (
        <MainLayout>
            <Head title={`Réservation #${reservation.reservation_number}`} />

            <div className="container max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/client/reservations"
                        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
                    >
                        ← Retour aux réservations
                    </Link>
                    <h1 className="text-3xl font-bold font-heading text-foreground">
                        Réservation #{reservation.reservation_number}
                    </h1>
                </div>

                {/* Status Timeline */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Statut de la réservation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StatusTimeline currentStatus={reservation.status} />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Artist Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Artiste</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <img
                                        src={reservation.artist.profile_photo_url}
                                        alt={reservation.artist.stage_name}
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">
                                            {reservation.artist.stage_name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {reservation.artist.name}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/artist/${reservation.artist.id}`}>
                                                    <User className="w-4 h-4 mr-2" />
                                                    Voir profil
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Contacter
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reservation Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Détails de la prestation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-1">{reservation.service.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {reservation.service.description}
                                    </p>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground text-xs">Date</p>
                                            <p className="font-medium">
                                                {format(new Date(reservation.scheduled_at), 'PPP', { locale: fr })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground text-xs">Heure</p>
                                            <p className="font-medium">
                                                {format(new Date(reservation.scheduled_at), 'HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 col-span-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-muted-foreground text-xs">Lieu</p>
                                            <p className="font-medium">{reservation.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-medium mb-2">Personnalisation</h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Destinataire : </span>
                                            <span className="font-medium">{reservation.recipient_name}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Type d'émotion : </span>
                                            <Badge variant="secondary">{reservation.emotion_type}</Badge>
                                        </div>
                                        {reservation.custom_message && (
                                            <div>
                                                <p className="text-muted-foreground mb-1">Message personnalisé :</p>
                                                <p className="p-3 bg-muted rounded-md italic">
                                                    "{reservation.custom_message}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Détails du paiement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Montant de la prestation</span>
                                    <span className="font-medium">
                                        {reservation.payment.amount.toLocaleString()} FCFA
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Frais de service</span>
                                    <span className="font-medium">
                                        {reservation.payment.service_fee.toLocaleString()} FCFA
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total payé</span>
                                    <span className="text-primary">
                                        {reservation.payment.total.toLocaleString()} FCFA
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Méthode de paiement</span>
                                    <span className="font-medium">{reservation.payment.payment_method}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* QR Code */}
                        {(reservation.status === 'confirmed' || reservation.status === 'in_progress') && (
                            <QRCodeDisplay reservationNumber={reservation.reservation_number} />
                        )}

                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {canModify && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={`/client/reservations/${reservation.id}/edit`}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Modifier
                                        </Link>
                                    </Button>
                                )}
                                {canCancel && (
                                    <Button
                                        variant="outline"
                                        className="w-full text-destructive hover:text-destructive"
                                        onClick={() => setShowCancelDialog(true)}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Annuler la réservation
                                    </Button>
                                )}
                                {canReview && (
                                    <Button variant="default" className="w-full" asChild>
                                        <Link href={`/client/reservations/${reservation.id}/review`}>
                                            <Star className="w-4 h-4 mr-2" />
                                            Laisser un avis
                                        </Link>
                                    </Button>
                                )}
                                <Button variant="outline" className="w-full" onClick={handleDownloadReceipt}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Télécharger le reçu
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Dialog */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
                            Selon notre politique d'annulation, vous pourriez être remboursé partiellement ou
                            totalement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Non, garder</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Oui, annuler
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </MainLayout>
    );
}
