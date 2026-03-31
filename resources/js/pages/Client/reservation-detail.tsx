import { Head, Link, router } from '@inertiajs/react';
import { format, parseISO, differenceInSeconds } from 'date-fns';
import {
    ChevronLeft,
    Calendar,
    Clock,
    MapPin,
    Star,
    MessageCircle,
    XCircle,
    Download,
    QrCode as QrCodeIcon,
    CheckCircle2,
    Circle,
    AlertTriangle,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { report } from '@/manual-actions/ArtistReportController';
import { cancel } from '@/actions/App/Http/Controllers/Client/ReservationController';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';

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
    auth: {
        user: {
            id: string;
            name: string;
            role: string;
        } | null;
    };
    reservation: Reservation;
}

export default function ReservationDetail({
    auth,
    reservation,
}: ReservationDetailProps) {
    const { t, dateLocale } = useAppLocale();
    const [timeLeft, setTimeLeft] = useState('');
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [isReporting, setIsReporting] = useState(false);
    const statusLabels: Record<
        string,
        {
            label: string;
            variant: 'default' | 'secondary' | 'destructive' | 'outline';
        }
    > = {
        pending: { label: t('Pending'), variant: 'secondary' },
        confirmed: { label: t('Confirmed'), variant: 'default' },
        completed: { label: t('Completed'), variant: 'outline' },
        cancelled: { label: t('Cancelled'), variant: 'destructive' },
    };
    const emotionLabels: Record<string, string> = {
        Joie: t('Joy / Celebration'),
        Amour: t('Love / Romance'),
        Soutien: t('Sadness / Support'),
        Hommage: t('Tribute'),
        Fierté: t('Pride'),
    };

    const showReportButton = auth.user?.role === 'client';

    useEffect(() => {
        if (
            reservation.status !== 'upcoming' &&
            reservation.status !== 'confirmed' &&
            reservation.status !== 'pending'
        ) {
            return;
        }

        const interval = setInterval(() => {
            const seconds = differenceInSeconds(
                parseISO(reservation.scheduled_at),
                new Date(),
            );

            if (seconds <= 0) {
                setTimeLeft(t('Event in progress'));
                clearInterval(interval);
                return;
            }

            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);

            if (days > 0) {
                setTimeLeft(
                    `${days}${t('d')} ${hours}${t('h')} ${minutes}${t('m')}`,
                );
            } else if (hours > 0) {
                setTimeLeft(`${hours}${t('h')} ${minutes}${t('m')}`);
            } else {
                setTimeLeft(`${minutes}${t('m')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [reservation.scheduled_at, reservation.status, t]);

    const handleCancel = () => {
        if (
            confirm(
                t(
                    'Are you sure you want to cancel this reservation? You will be refunded within 3-5 business days.',
                ),
            )
        ) {
            router.post(cancel({ id: reservation.id }));
        }
    };

    const handleReportSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsReporting(true);
        router.post(
            report({ artist: reservation.artist.id }),
            {
                reason: reportReason,
            },
            {
                onSuccess: () => {
                    setIsReportDialogOpen(false);
                    setReportReason('');
                    setIsReporting(false);
                },
                onError: () => {
                    setIsReporting(false);
                },
            },
        );
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
        { key: 'pending', label: t('Request sent'), completed: true },
        {
            key: 'confirmed',
            label: t('Confirmed'),
            completed: ['confirmed', 'completed'].includes(reservation.status),
        },
        {
            key: 'completed',
            label: t('Completed'),
            completed: reservation.status === 'completed',
        },
    ];

    return (
        <MainLayout>
            <Head
                title={`${t('Reservation')} ${reservation.reservation_number}`}
            />

            <div className="container mx-auto max-w-7xl px-4 py-8 pb-24 md:px-6 md:pb-12">
                <Link
                    href="/client/reservations"
                    className="mb-6 flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    {t('Back to reservations')}
                </Link>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 md:col-span-2">
                        {/* Header */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="mb-2 text-2xl">
                                            {reservation.service.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    statusLabels[
                                                        reservation.status
                                                    ]?.variant || 'secondary'
                                                }
                                            >
                                                {statusLabels[
                                                    reservation.status
                                                ]?.label || reservation.status}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {reservation.reservation_number}
                                            </span>
                                        </div>
                                    </div>
                                    {timeLeft && (
                                        <div className="text-right">
                                            <div className="text-sm text-muted-foreground">
                                                {t('In')}
                                            </div>
                                            <div className="text-2xl font-bold text-primary">
                                                {timeLeft}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Artist Info */}
                                <Link href={`/artist/${reservation.artist.id}`}>
                                    <div className="flex cursor-pointer items-center gap-4 rounded-lg bg-muted p-4 transition-colors hover:bg-muted/80">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage
                                                src={
                                                    reservation.artist
                                                        .profile_photo ||
                                                    undefined
                                                }
                                            />
                                            <AvatarFallback>
                                                {reservation.artist.stage_name.charAt(
                                                    0,
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-foreground">
                                                {reservation.artist.stage_name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {reservation.artist.city}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        {reservation.status !== 'cancelled' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {t('Reservation status')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {timelineSteps.map((step) => (
                                            <div
                                                key={step.key}
                                                className="flex items-center gap-4"
                                            >
                                                <div className="flex-shrink-0">
                                                    {step.completed ? (
                                                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                                                    ) : (
                                                        <Circle className="h-6 w-6 text-muted-foreground" />
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
                                    <div className="flex flex-col items-center gap-6 md:flex-row">
                                        <div className="flex-shrink-0 rounded-lg bg-white p-4">
                                            <img
                                                src={reservation.qr_code}
                                                alt={t('QR code')}
                                                className="h-[150px] w-[150px]"
                                            />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="mb-2 flex items-center justify-center gap-2 text-lg font-semibold md:justify-start">
                                                <QrCodeIcon className="h-5 w-5 text-primary" />
                                                {t('Reservation QR code')}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {t(
                                                    'Show this QR code to the artist on the day of the service.',
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('Reservation details')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            {format(
                                                scheduledDate,
                                                'EEEE d MMMM yyyy',
                                                { locale: dateLocale },
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            {format(scheduledDate, 'HH:mm')} •{' '}
                                            {reservation.duration_minutes}{' '}
                                            {t('minutes')}
                                        </div>
                                    </div>
                                </div>

                                {reservation.location_address && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">
                                                {reservation.location_address}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {reservation.recipient_name && (
                                    <div className="border-t pt-4">
                                        <div className="mb-1 text-sm font-medium text-muted-foreground">
                                            {t('Recipient')}
                                        </div>
                                        <div className="font-medium">
                                            {reservation.recipient_name}
                                        </div>
                                    </div>
                                )}

                                {reservation.emotion_type && (
                                    <div>
                                        <div className="mb-1 text-sm font-medium text-muted-foreground">
                                            {t('Emotion type')}
                                        </div>
                                        <div className="font-medium">
                                            {emotionLabels[
                                                reservation.emotion_type
                                            ] || reservation.emotion_type}
                                        </div>
                                    </div>
                                )}

                                {reservation.custom_message && (
                                    <div className="border-t pt-4">
                                        <div className="mb-2 text-sm font-medium text-muted-foreground">
                                            {t('Custom message')}
                                        </div>
                                        <div className="rounded-lg bg-muted/50 p-4 text-sm italic">
                                            "{reservation.custom_message}"
                                        </div>
                                    </div>
                                )}

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            {t('Service amount')}
                                        </span>
                                        <span className="font-medium">
                                            {(
                                                reservation.total_amount -
                                                reservation.commission_amount
                                            ).toLocaleString('fr-FR')}{' '}
                                            FCFA
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            {t('Platform fee')}
                                        </span>
                                        <span className="font-medium">
                                            {reservation.commission_amount.toLocaleString(
                                                'fr-FR',
                                            )}{' '}
                                            FCFA
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between border-t pt-3 text-lg font-bold">
                                        <span>{t('Total paid')}</span>
                                        <span className="text-primary">
                                            {reservation.total_amount.toLocaleString(
                                                'fr-FR',
                                            )}{' '}
                                            FCFA
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Review Section */}
                        {canReview && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('Leave a review')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleReview}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <Label>{t('Rating')}</Label>
                                            <div className="mt-2 flex gap-2">
                                                {[1, 2, 3, 4, 5].map(
                                                    (rating) => (
                                                        <label
                                                            key={rating}
                                                            className="cursor-pointer"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="rating"
                                                                value={rating}
                                                                className="peer sr-only"
                                                                required
                                                            />
                                                            <Star className="h-8 w-8 text-muted-foreground transition-colors peer-checked:fill-primary peer-checked:text-primary hover:text-primary" />
                                                        </label>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="comment">
                                                {t('Comment (optional)')}
                                            </Label>
                                            <Textarea
                                                id="comment"
                                                name="comment"
                                                placeholder={t(
                                                    'Share your experience...',
                                                )}
                                                rows={4}
                                                className="mt-2"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                        >
                                            {t('Publish review')}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <Button
                                variant="default"
                                className="w-full gap-2"
                                onClick={handleDownloadReceipt}
                            >
                                <Download className="h-4 w-4" />
                                {t('Download receipt')}
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                disabled
                            >
                                <MessageCircle className="h-4 w-4" />
                                {t('Contact artist')}
                            </Button>

                            {showReportButton && (
                                <Dialog
                                    open={isReportDialogOpen}
                                    onOpenChange={setIsReportDialogOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full gap-2 text-muted-foreground hover:text-destructive"
                                        >
                                            <AlertTriangle className="h-4 w-4" />
                                            {t('Report artist')}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                {t('Report artist')}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {t(
                                                    'Please explain the reason for your report. An administrator will review your request.',
                                                )}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleReportSubmit}>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="reason">
                                                        {t('Reason for report')}
                                                    </Label>
                                                    <Textarea
                                                        id="reason"
                                                        placeholder={t(
                                                            'Describe the issue you encountered with this artist...',
                                                        )}
                                                        value={reportReason}
                                                        onChange={(e) =>
                                                            setReportReason(
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                        rows={5}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setIsReportDialogOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    {t('Cancel')}
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="destructive"
                                                    disabled={
                                                        isReporting ||
                                                        !reportReason.trim()
                                                    }
                                                >
                                                    {isReporting
                                                        ? t('Sending...')
                                                        : t('Send report')}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}

                            {canCancel && (
                                <Button
                                    variant="outline"
                                    className="w-full gap-2 text-destructive hover:text-destructive"
                                    onClick={handleCancel}
                                >
                                    <XCircle className="h-4 w-4" />
                                    {t('Cancel reservation')}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
