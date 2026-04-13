import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { CheckCircle2, MoreHorizontal, XCircle } from 'lucide-react';
import { useAppLocale } from '@/hooks/use-app-locale';

type Artist = {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    city?: string | null;
    profile_photo?: string | null;
    registered_at: string;
    stage_name?: string | null;
    base_rate: number;
    bio?: string | null;
    portfolio_urls: string[];
};

type Props = {
    artists: Artist[];
    rejectionReasons: { value: string; label: string }[];
};

export default function ArtistValidation({ artists, rejectionReasons }: Props) {
    const { t } = useAppLocale();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
    const [activeLightboxMedia, setActiveLightboxMedia] = useState<string | null>(null);
    const [activeLightboxLabel, setActiveLightboxLabel] = useState('');

    const filteredArtists = useMemo(() => {
        if (!artists) return [];
        return artists.filter(
            (artist) =>
                artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                artist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                artist.stage_name?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [artists, searchTerm]);

    const rejectionForm = useForm({
        reason: '',
        custom_reason: '',
    });

    const handleApprove = (artistId: string) => {
        if (confirm(t('Are you sure you want to approve this artist?'))) {
            router.post(route('admin.artists.approve', artistId));
        }
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedArtist) {
            rejectionForm.post(route('admin.artists.reject', selectedArtist.id), {
                onSuccess: () => {
                    setIsRejectionDialogOpen(false);
                    setSelectedArtist(null);
                    rejectionForm.reset();
                },
            });
        }
    };

    return (
        <AdminLayout title={t('Artist validation')} subtitle={t('Review pending artist applications.')}>
            <Head title={`Admin - ${t('Artist validation')}`} />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('Search')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input
                            placeholder={t('Search by name, email or stage name...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    {filteredArtists.map((artist) => {
                        const registrationDate = new Date(artist.registered_at).toLocaleDateString();

                        return (
                            <Card key={artist.id} className="overflow-hidden">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 bg-muted/30 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-background shadow-sm">
                                            <img
                                                src={artist.profile_photo || '/artemo-logo.png'}
                                                alt={artist.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {artist.stage_name || artist.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {t('Registered on')} {registrationDate}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => handleApprove(artist.id)}
                                                className="text-green-600"
                                            >
                                                <CheckCircle2 className="mr-2 h-4 w-4" /> {t('Approve')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setSelectedArtist(artist);
                                                    setIsRejectionDialogOpen(true);
                                                }}
                                                className="text-destructive"
                                            >
                                                <XCircle className="mr-2 h-4 w-4" /> {t('Reject')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('Full name')}</p>
                                            <p className="text-sm font-medium">{artist.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('Email address')}</p>
                                            <p className="text-sm font-medium">{artist.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('Phone')}</p>
                                            <p className="text-sm font-medium">{artist.phone || t('Not provided')}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('City')}</p>
                                            <p className="text-sm font-medium">{artist.city || t('Not provided')}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('Biography')}</h4>
                                        <p className="text-sm leading-relaxed">{artist.bio || t('No biography provided.')}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('Portfolio / Works')}</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {artist.portfolio_urls.length > 0 ? (
                                                artist.portfolio_urls.map((url, i) => {
                                                    const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i);
                                                    return (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            className="group relative aspect-square overflow-hidden rounded-md border bg-muted transition-all hover:border-primary"
                                                            onClick={() => {
                                                                setActiveLightboxMedia(url);
                                                                setActiveLightboxLabel(`${t('Portfolio item')} ${i + 1}`);
                                                            }}
                                                        >
                                                            {isVideo ? (
                                                                <div className="flex h-full w-full items-center justify-center">
                                                                    <div className="rounded-full bg-primary/20 p-2 group-hover:bg-primary/30">
                                                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={url}
                                                                    alt={`Portfolio ${i}`}
                                                                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                                                />
                                                            )}
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <p className="col-span-3 text-sm italic text-muted-foreground">
                                                    {t('No portfolio media provided.')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {filteredArtists.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 rounded-full bg-muted p-6">
                            <UserCheck className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold">{t('All caught up!')}</h3>
                        <p className="text-muted-foreground">
                            {searchTerm ? t('No artists found matching your search.') : t('No pending artist applications at the moment.')}
                        </p>
                    </div>
                )}
            </div>

            <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('Reject artist application')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleReject} className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t('Reason for rejection')}</Label>
                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                value={rejectionForm.data.reason}
                                onChange={(e) => rejectionForm.setData('reason', e.target.value)}
                                required
                            >
                                <option value="">{t('Select a reason...')}</option>
                                {rejectionReasons.map((reason) => (
                                    <option key={reason.value} value={reason.value}>
                                        {reason.label}
                                    </option>
                                ))}
                                <option value="other">{t('Other')}</option>
                            </select>
                        </div>

                        {rejectionForm.data.reason === 'other' && (
                            <div className="space-y-2">
                                <Label htmlFor="custom_reason">{t('Custom reason')}</Label>
                                <Textarea
                                    id="custom_reason"
                                    placeholder={t('Explain why the application is rejected...')}
                                    value={rejectionForm.data.custom_reason}
                                    onChange={(e) => rejectionForm.setData('custom_reason', e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsRejectionDialogOpen(false)}
                            >
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" variant="destructive" disabled={rejectionForm.processing}>
                                {t('Confirm rejection')}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!activeLightboxMedia}
                onOpenChange={(open) => {
                    if (!open) {
                        setActiveLightboxMedia(null);
                        setActiveLightboxLabel('');
                    }
                }}
            >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{activeLightboxLabel}</DialogTitle>
                    </DialogHeader>
                    {activeLightboxMedia ? (
                        activeLightboxMedia.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                            <video src={activeLightboxMedia} controls className="max-h-[70vh] w-full rounded" />
                        ) : (
                            <img src={activeLightboxMedia} alt={activeLightboxLabel} className="max-h-[70vh] w-full rounded object-contain" />
                        )
                    ) : null}
                </DialogContent>
            </Dialog>

        </AdminLayout>
    );
}
