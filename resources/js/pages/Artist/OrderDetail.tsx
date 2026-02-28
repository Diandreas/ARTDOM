import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    ChevronLeft,
    Calendar,
    Clock,
    MapPin,
    CreditCard,
    CheckCircle2,
    XCircle,
    PlayCircle,
    StopCircle,
    MessageCircle,
    User,
    Timer,
} from 'lucide-react';
import { format, parseISO, differenceInSeconds } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface Client {
    id: string;
    clientProfile?: {
        avatar?: string;
    };
    name: string;
    email: string;
    phone: string;
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
}

interface Reservation {
    id: string;
    reservation_number: string;
    status: string;
    scheduled_at: string;
    duration_minutes: number;
    total_amount: number;
    artist_earnings: number;
    location_type: string;
    location_address: string | null;
    recipient_name: string | null;
    emotion_type: string | null;
    custom_message: string | null;
    created_at: string;
    checkin_at: string | null;
    service: Service;
    client: Client;
    payment: Payment | null;
}

interface OrderDetailProps {
    reservation: Reservation;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Nouvelle demande', variant: 'secondary' },
    confirmed: { label: 'Confirmée', variant: 'default' },
    in_progress: { label: 'En cours', variant: 'default' },
    completed: { label: 'Terminée', variant: 'outline' },
    cancelled: { label: 'Annulée', variant: 'destructive' },
};

export default function OrderDetail({ reservation }: OrderDetailProps) {
    const [isDeclining, setIsDeclining] = useState(false);
    const [elapsedTime, setElapsedTime] = useState('00:00:00');

    // Live timer logic
    useEffect(() => {
        if (reservation.status !== 'in_progress' || !reservation.checkin_at) return;

        const interval = setInterval(() => {
            const seconds = differenceInSeconds(new Date(), parseISO(reservation.checkin_at!));
            if (seconds < 0) return;

            const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            setElapsedTime(`${h}:${m}:${s}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [reservation.status, reservation.checkin_at]);

    const { data, setData, post: postForm, processing: processingDecline } = useForm({
        reason: '',
    });

    const handleAccept = () => {
        router.post(route('artist.orders.accept', reservation.id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Réservation acceptée'),
        });
    };

    const handleDeclineSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postForm(route('artist.orders.decline', reservation.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Réservation refusée');
                setIsDeclining(false);
            },
        });
    };

    const handleCheckIn = () => {
        if (!navigator.geolocation) {
            toast.error('La géolocalisation n\'est pas supportée par votre navigateur');
            submitCheckIn(null, null);
            return;
        }

        toast.info('Recherche de votre position...', { duration: 2000 });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                submitCheckIn(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.warn('Geolocation error:', error);
                toast.warning('Check-in sans GPS enregistré');
                submitCheckIn(null, null);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const submitCheckIn = (lat: number | null, lng: number | null) => {
        if (confirm('Êtes-vous sûr de vouloir démarrer cette prestation maintenant ?')) {
            router.post(route('artist.orders.checkin', reservation.id), {
                latitude: lat,
                longitude: lng
            }, {
                preserveScroll: true,
                onSuccess: () => toast.success('Check-in effectué avec succès'),
            });
        }
    };

    const handleCheckOut = () => {
        if (confirm('Avez-vous terminé la prestation ?')) {
            router.post(route('artist.orders.checkout', reservation.id), {}, {
                preserveScroll: true,
                onSuccess: () => toast.success('Check-out effectué, prestation terminée'),
            });
        }
    };

    const scheduledDate = parseISO(reservation.scheduled_at);

    return (
        <MainLayout>
            <Head title={`Commande ${reservation.reservation_number}`} />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                <Link
                    href={route('artist.orders.index')}
                    className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour aux commandes
                </Link>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
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
                                                N° {reservation.reservation_number}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-muted-foreground">Gains estimatifs</div>
                                        <div className="text-2xl font-bold text-primary">
                                            {reservation.artist_earnings.toLocaleString('fr-FR')} FCFA
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src={reservation.client.clientProfile?.avatar || undefined} />
                                        <AvatarFallback>
                                            <User className="w-8 h-8 text-muted-foreground" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold text-foreground">
                                            {reservation.client.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Client enregistré
                                        </div>
                                    </div>
                                    <div className="ml-auto">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <MessageCircle className="w-4 h-4" />
                                            Contacter
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Détails de la prestation</CardTitle>
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
                                            <div className="text-sm text-muted-foreground">{reservation.location_type}</div>
                                        </div>
                                    </div>
                                )}

                                {reservation.recipient_name && (
                                    <div className="pt-4 border-t">
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Dédié à</div>
                                        <div className="font-medium">{reservation.recipient_name}</div>
                                    </div>
                                )}

                                {reservation.custom_message && (
                                    <div className="pt-4 border-t">
                                        <div className="text-sm font-medium text-muted-foreground mb-2">
                                            Message / Instructions du client
                                        </div>
                                        <div className="text-sm bg-muted/50 p-4 rounded-lg italic">
                                            "{reservation.custom_message}"
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {reservation.status === 'pending' && !isDeclining && (
                                <>
                                    <Button className="w-full gap-2" size="lg" onClick={handleAccept}>
                                        <CheckCircle2 className="w-5 h-5" />
                                        Accepter la demande
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2 text-destructive hover:text-destructive"
                                        onClick={() => setIsDeclining(true)}
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Refuser
                                    </Button>
                                </>
                            )}

                            {reservation.status === 'pending' && isDeclining && (
                                <Card className="border-destructive/50">
                                    <CardHeader>
                                        <CardTitle className="text-sm">Motif du refus</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleDeclineSubmit} className="space-y-4">
                                            <div>
                                                <Textarea
                                                    value={data.reason}
                                                    onChange={e => setData('reason', e.target.value)}
                                                    placeholder="Expliquez brièvement pourquoi vous refusez cette demande..."
                                                    className="text-sm"
                                                    required
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsDeclining(false)}>
                                                    Annuler
                                                </Button>
                                                <Button type="submit" variant="destructive" className="flex-1" disabled={processingDecline}>
                                                    Confirmer le refus
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {reservation.status === 'confirmed' && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-muted-foreground mb-4 text-center">
                                            Le jour J, une fois arrivé sur place, signalez votre présence pour démarrer la prestation.
                                        </p>
                                        <Button className="w-full gap-2" size="lg" onClick={handleCheckIn}>
                                            <PlayCircle className="w-5 h-5" />
                                            Faire le Check-in
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {reservation.status === 'in_progress' && (
                                <Card className="border-primary/50 bg-primary/5">
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col items-center justify-center mb-6">
                                            <div className="animate-pulse flex items-center gap-2 text-primary font-medium text-sm mb-2">
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                                </span>
                                                Prestation en cours
                                            </div>
                                            <div className="flex items-center text-4xl font-mono font-bold text-primary tracking-wider">
                                                <Timer className="w-8 h-8 mr-3 text-primary/70" />
                                                {elapsedTime}
                                            </div>
                                        </div>
                                        <Button className="w-full gap-2" variant="default" size="lg" onClick={handleCheckOut}>
                                            <StopCircle className="w-5 h-5" />
                                            Terminer (Check-out)
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {reservation.payment && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                                            Paiement client
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Statut</span>
                                            <Badge variant={reservation.payment.status === 'completed' ? 'default' : 'secondary'}>
                                                {reservation.payment.status}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
