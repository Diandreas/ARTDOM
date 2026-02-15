import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    CheckCircle2,
    Download,
    MessageCircle,
    Home,
    Calendar,
    Clock,
    MapPin,
    Star,
    QrCode as QrCodeIcon,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';

interface Artist {
    id: string;
    stage_name: string;
    profile_photo: string;
    city: string;
}

interface Service {
    id: string;
    title: string;
}

interface Reservation {
    id: string;
    reservation_number: string;
    scheduled_at: string;
    total_amount: number;
    customer_location: string;
    emotion_type: string;
    recipient_name?: string;
    special_message?: string;
}

interface ConfirmationProps {
    reservation: Reservation;
    artist: Artist;
    service: Service;
}

const emotionLabels: Record<string, string> = {
    joy: 'Joie / Célébration',
    love: 'Amour / Romance',
    sadness: 'Tristesse / Soutien',
    surprise: 'Surprise / Humour',
    gratitude: 'Gratitude / Merci',
};

export default function BookingConfirmation({ reservation, artist, service }: ConfirmationProps) {
    const scheduledDate = parseISO(reservation.scheduled_at);

    const handleDownloadReceipt = () => {
        window.print();
    };

    const handleAddToCalendar = () => {
        // Create calendar event (ICS format)
        const event = {
            title: `${service.title} avec ${artist.stage_name}`,
            start: reservation.scheduled_at,
            location: reservation.customer_location || 'En ligne',
        };
        // Implementation would generate ICS file
        console.log('Add to calendar:', event);
    };

    return (
        <MainLayout>
            <Head title="Réservation confirmée" />

            <div className="container max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4 animate-in zoom-in duration-500">
                        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Réservation confirmée !</h1>
                    <p className="text-muted-foreground text-lg">
                        Votre demande a été envoyée à l'artiste
                    </p>
                </div>

                {/* Reservation Number */}
                <Card className="mb-6 border-2 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Numéro de réservation</div>
                            <div className="text-2xl font-bold font-mono tracking-wider text-primary">
                                {reservation.reservation_number}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* QR Code */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-shrink-0 bg-white p-4 rounded-lg">
                                <QRCodeSVG
                                    value={`ARTDOM-${reservation.reservation_number}`}
                                    size={150}
                                    level="H"
                                    includeMargin
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center gap-2 text-lg font-semibold mb-2 justify-center md:justify-start">
                                    <QrCodeIcon className="w-5 h-5 text-primary" />
                                    QR Code de réservation
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Présentez ce QR code à l'artiste le jour de la prestation.
                                    Il peut être scanné pour confirmer votre réservation.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reservation Details */}
                <Card className="mb-6">
                    <CardContent className="pt-6 space-y-6">
                        {/* Artist */}
                        <div className="flex items-center gap-4 pb-6 border-b">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={artist.profile_photo} alt={artist.stage_name} />
                                <AvatarFallback>{artist.stage_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg">{artist.stage_name}</h3>
                                    <Badge variant="secondary" className="text-xs">
                                        <Star className="w-3 h-3 fill-current mr-1" />
                                        Vérifié
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    {artist.city}
                                </div>
                            </div>
                        </div>

                        {/* Service Info */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Prestation</div>
                                <div className="font-semibold">{service.title}</div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Émotion</div>
                                <div className="font-semibold">{emotionLabels[reservation.emotion_type]}</div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                                    <Calendar className="w-4 h-4" />
                                    Date
                                </div>
                                <div className="font-semibold">
                                    {format(scheduledDate, 'EEEE d MMMM yyyy', { locale: fr })}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                                    <Clock className="w-4 h-4" />
                                    Heure
                                </div>
                                <div className="font-semibold">{format(scheduledDate, 'HH:mm')}</div>
                            </div>

                            <div className="sm:col-span-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                                    <MapPin className="w-4 h-4" />
                                    Lieu
                                </div>
                                <div className="font-semibold">
                                    {reservation.customer_location || 'En ligne'}
                                </div>
                            </div>

                            {reservation.recipient_name && (
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Destinataire</div>
                                    <div className="font-semibold">{reservation.recipient_name}</div>
                                </div>
                            )}
                        </div>

                        {/* Special Message */}
                        {reservation.special_message && (
                            <div className="pt-4 border-t">
                                <div className="text-sm font-medium text-muted-foreground mb-2">Message spécial</div>
                                <div className="text-sm bg-muted/50 p-4 rounded-lg">
                                    {reservation.special_message}
                                </div>
                            </div>
                        )}

                        {/* Amount */}
                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Montant payé</span>
                                <span className="text-2xl font-bold text-primary">
                                    {reservation.total_amount.toLocaleString()} FCFA
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <Button variant="outline" onClick={handleDownloadReceipt} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger le reçu
                    </Button>
                    <Button variant="outline" onClick={handleAddToCalendar} className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Ajouter au calendrier
                    </Button>
                </div>

                {/* Primary Actions */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <Link href={`/client/reservations/${reservation.id}`}>
                        <Button variant="default" className="w-full">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contacter l'artiste
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="w-full">
                            <Home className="w-4 h-4 mr-2" />
                            Retour à l'accueil
                        </Button>
                    </Link>
                </div>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Prochaines étapes
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• L'artiste recevra une notification de votre demande</li>
                        <li>• Vous recevrez un email et un SMS de confirmation</li>
                        <li>• L'artiste a 48h pour accepter ou vous proposer une alternative</li>
                        <li>• Vous pouvez suivre l'état de votre réservation dans votre profil</li>
                    </ul>
                </div>
            </div>
        </MainLayout>
    );
}
