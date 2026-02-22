import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Artist = {
    id: string;
    avatar?: string | null;
    stage_name?: string | null;
    category: string;
    city?: string | null;
    verification_status: string;
    full_name: string;
    email: string;
    phone?: string | null;
    registered_at?: string | null;
    base_rate: number;
    bio?: string | null;
    portfolio_urls: string[];
    id_document_front?: string | null;
    id_document_back?: string | null;
};

type PaginatedArtists = {
    data: Artist[];
};

type RejectionReason = {
    value: string;
    label: string;
};

type Props = {
    artists: PaginatedArtists;
    rejectionReasons: RejectionReason[];
};

const isVideo = (url: string): boolean => {
    return /\.(mp4|webm|ogg)$/i.test(url);
};

export default function ArtistValidation({ artists, rejectionReasons }: Props) {
    const [activeLightboxMedia, setActiveLightboxMedia] = useState<string | null>(null);
    const [activeLightboxLabel, setActiveLightboxLabel] = useState<string>('');

    const rejectForm = useForm({
        reason: rejectionReasons[0]?.value ?? 'incomplete_information',
        custom_message: '',
        allow_resubmission: false,
    });

    const [rejectArtistId, setRejectArtistId] = useState<string | null>(null);
    const [approveArtistId, setApproveArtistId] = useState<string | null>(null);

    const rejectTarget = useMemo(
        () => artists.data.find((artist) => artist.id === rejectArtistId) ?? null,
        [artists.data, rejectArtistId],
    );

    const approveTarget = useMemo(
        () => artists.data.find((artist) => artist.id === approveArtistId) ?? null,
        [artists.data, approveArtistId],
    );

    const onApprove = () => {
        if (!approveArtistId) {
            return;
        }

        router.post(`/admin/artists/${approveArtistId}/approve`, { confirm: true }, {
            onSuccess: () => {
                setApproveArtistId(null);
            },
        });
    };

    const onReject = () => {
        if (!rejectArtistId) {
            return;
        }

        rejectForm.post(`/admin/artists/${rejectArtistId}/reject`, {
            onSuccess: () => {
                rejectForm.reset();
                setRejectArtistId(null);
            },
        });
    };

    return (
        <AdminLayout
            title="Validation des artistes"
            subtitle="Queue de validation des profils artistes en attente."
        >
            <Head title="Validation Artistes" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Demandes en attente</h2>
                    <Badge variant="outline">{artists.data.length} dossier(s)</Badge>
                </div>

                <div className="grid gap-4">
                    {artists.data.map((artist) => {
                        const medias = artist.portfolio_urls ?? [];
                        const previewMedias = medias.slice(0, 4);

                        return (
                            <Card key={artist.id}>
                                <CardHeader className="space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {artist.avatar ? (
                                                <img src={artist.avatar} alt={artist.stage_name ?? artist.full_name} className="h-14 w-14 rounded-full object-cover" />
                                            ) : (
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full border text-sm font-medium">
                                                    {(artist.stage_name ?? artist.full_name).slice(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <CardTitle className="text-lg">{artist.stage_name ?? artist.full_name}</CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    {artist.category} • {artist.city ?? 'Ville non renseignee'}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge>En attente</Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        <div className="space-y-2">
                                            <h4 className="font-medium">Informations personnelles</h4>
                                            <p className="text-sm">Nom complet: {artist.full_name}</p>
                                            <p className="text-sm">Email: {artist.email}</p>
                                            <p className="text-sm">Telephone: {artist.phone ?? '-'}</p>
                                            <p className="text-sm">
                                                Date inscription: {artist.registered_at ? new Date(artist.registered_at).toLocaleDateString() : '-'}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-medium">Informations artistiques</h4>
                                            <p className="text-sm">Categorie: {artist.category}</p>
                                            <p className="text-sm">Tarif horaire: {Math.round(artist.base_rate).toLocaleString()} FCFA</p>
                                            <p className="text-sm text-muted-foreground">{artist.bio || 'Aucune bio fournie.'}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-medium">Actions</h4>
                                            <div className="flex flex-wrap gap-2">
                                                <Button variant="outline" asChild>
                                                    <Link href={`/artist/${artist.id}`}>Voir profil complet</Link>
                                                </Button>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="destructive" onClick={() => {
                                                            setRejectArtistId(artist.id);
                                                            rejectForm.reset();
                                                            rejectForm.setData('reason', rejectionReasons[0]?.value ?? 'incomplete_information');
                                                        }}>
                                                            Refuser
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Refuser la validation</DialogTitle>
                                                            <DialogDescription>
                                                                Choisissez un motif, puis ajoutez un message personnalise.
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label>Raison du refus</Label>
                                                                <Select value={rejectForm.data.reason} onValueChange={(value) => rejectForm.setData('reason', value)}>
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        {rejectionReasons.map((reason) => (
                                                                            <SelectItem key={reason.value} value={reason.value}>{reason.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                {rejectForm.errors.reason ? <p className="text-xs text-destructive">{rejectForm.errors.reason}</p> : null}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>Message personnalise</Label>
                                                                <Textarea
                                                                    rows={4}
                                                                    value={rejectForm.data.custom_message}
                                                                    onChange={(event) => rejectForm.setData('custom_message', event.target.value)}
                                                                    placeholder="Precisez les points a corriger..."
                                                                />
                                                                {rejectForm.errors.custom_message ? <p className="text-xs text-destructive">{rejectForm.errors.custom_message}</p> : null}
                                                            </div>

                                                            <label className="flex items-center gap-2 text-sm">
                                                                <Checkbox
                                                                    checked={rejectForm.data.allow_resubmission}
                                                                    onCheckedChange={(value) => rejectForm.setData('allow_resubmission', Boolean(value))}
                                                                />
                                                                Autoriser resoumission
                                                            </label>
                                                        </div>

                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={() => setRejectArtistId(null)}>Annuler</Button>
                                                            <Button variant="destructive" disabled={rejectForm.processing || rejectArtistId !== artist.id} onClick={onReject}>
                                                                Confirmer le refus
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button onClick={() => setApproveArtistId(artist.id)}>Approuver</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Confirmer l'approbation</DialogTitle>
                                                            <DialogDescription>
                                                                Cette action active le badge verifie, rend le profil visible publiquement et declenche email + notification.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={() => setApproveArtistId(null)}>Annuler</Button>
                                                            <Button disabled={approveArtistId !== artist.id} onClick={onApprove}>Confirmer</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium">Portfolio</h4>
                                        {previewMedias.length > 0 ? (
                                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                                {previewMedias.map((mediaUrl, index) => (
                                                    <button
                                                        key={`${artist.id}-portfolio-${index}`}
                                                        type="button"
                                                        className="overflow-hidden rounded border"
                                                        onClick={() => {
                                                            setActiveLightboxMedia(mediaUrl);
                                                            setActiveLightboxLabel('Portfolio');
                                                        }}
                                                    >
                                                        {isVideo(mediaUrl) ? (
                                                            <video src={mediaUrl} className="h-32 w-full object-cover" />
                                                        ) : (
                                                            <img src={mediaUrl} alt="Portfolio" className="h-32 w-full object-cover" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Aucun media portfolio.</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium">Documents d'identite</h4>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {[{ label: 'Recto', url: artist.id_document_front }, { label: 'Verso', url: artist.id_document_back }].map((doc) => (
                                                <button
                                                    key={`${artist.id}-${doc.label}`}
                                                    type="button"
                                                    className="overflow-hidden rounded border p-2 text-left"
                                                    onClick={() => {
                                                        if (!doc.url) {
                                                            return;
                                                        }
                                                        setActiveLightboxMedia(doc.url);
                                                        setActiveLightboxLabel(`Document ${doc.label}`);
                                                    }}
                                                >
                                                    <p className="mb-2 text-sm font-medium">{doc.label}</p>
                                                    {doc.url ? (
                                                        <img src={doc.url} alt={doc.label} className="h-40 w-full rounded object-cover" />
                                                    ) : (
                                                        <div className="flex h-40 items-center justify-center rounded bg-muted text-sm text-muted-foreground">
                                                            Non fourni
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {artists.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-10 text-center text-sm text-muted-foreground">
                                Aucun artiste en attente.
                            </CardContent>
                        </Card>
                    ) : null}
                </div>
            </div>

            <Dialog open={activeLightboxMedia !== null} onOpenChange={(open) => {
                if (!open) {
                    setActiveLightboxMedia(null);
                    setActiveLightboxLabel('');
                }
            }}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{activeLightboxLabel}</DialogTitle>
                    </DialogHeader>
                    {activeLightboxMedia ? (
                        isVideo(activeLightboxMedia) ? (
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
