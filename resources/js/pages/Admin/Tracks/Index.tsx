import { Head, Link, router, useForm } from '@inertiajs/react';
import { Ban, MoreHorizontal, Music, Play, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

interface Track {
    id: string;
    title: string;
    plays: number;
    is_banned: boolean;
    ban_reason: string | null;
    album?: {
        title: string;
        artist?: {
            name: string;
            artist_profile?: {
                stage_name: string;
            }
        }
    }
}

interface Props {
    tracks: {
        data: Track[];
        links: any[];
    };
    filters: {
        search: string;
    };
}

export default function Index({ tracks, filters }: Props) {
    const form = useForm({
        search: filters.search ?? '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/tracks', { search: form.data.search }, { preserveState: true });
    };

    const handleBan = (track: Track) => {
        const reason = prompt('Raison du bannissement (optionnel) :');
        if (reason !== null) {
            router.post(`/admin/tracks/${track.id}/ban`, { reason }, { preserveScroll: true });
        }
    };

    const handleUnban = (track: Track) => {
        if (confirm(`Lever le bannissement de "${track.title}" ?`)) {
            router.post(`/admin/tracks/${track.id}/unban`, {}, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Gestion des Musiques" subtitle="Modérez les pistes audio de la plateforme.">
            <Head title="Admin - Musiques" />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recherche</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1 space-y-1.5">
                                <Input
                                    value={form.data.search}
                                    onChange={(e) => form.setData('search', e.target.value)}
                                    placeholder="Rechercher par titre..."
                                />
                            </div>
                            <Button type="submit">Rechercher</Button>
                            <Button variant="outline" type="button" onClick={() => router.get('/admin/tracks')}>
                                Réinitialiser
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des musiques</CardTitle>
                        <CardDescription>Tous les morceaux importés par les artistes.</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="py-2 pr-2">Titre</th>
                                    <th className="py-2 pr-2">Artiste</th>
                                    <th className="py-2 pr-2">Album</th>
                                    <th className="py-2 pr-2 text-center">Écoutes</th>
                                    <th className="py-2 pr-2">Statut</th>
                                    <th className="py-2 pr-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tracks.data.map((track) => (
                                    <tr key={track.id} className="border-b align-middle">
                                        <td className="py-3 pr-2">
                                            <div className="flex items-center gap-2">
                                                <Music className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{track.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-2 text-muted-foreground">
                                            {track.album?.artist?.artist_profile?.stage_name || track.album?.artist?.name || 'Inconnu'}
                                        </td>
                                        <td className="py-3 pr-2 text-muted-foreground italic">
                                            {track.album?.title || '-'}
                                        </td>
                                        <td className="py-3 pr-2 text-center">
                                            <Badge variant="outline" className="gap-1">
                                                <Play className="h-3 w-3" /> {track.plays}
                                            </Badge>
                                        </td>
                                        <td className="py-3 pr-2">
                                            {track.is_banned ? (
                                                <Badge variant="destructive" title={track.ban_reason || ''}>Bannie</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                                            )}
                                        </td>
                                        <td className="py-3 pr-2 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {track.is_banned ? (
                                                        <DropdownMenuItem onClick={() => handleUnban(track)} className="text-green-600">
                                                            <RotateCcw className="mr-2 h-4 w-4" /> Lever le bannissement
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleBan(track)} className="text-destructive">
                                                            <Ban className="mr-2 h-4 w-4" /> Bannir la musique
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {tracks.data.length === 0 && (
                            <div className="py-10 text-center text-muted-foreground">Aucune musique trouvée.</div>
                        )}

                        <div className="mt-6 flex flex-wrap gap-2">
                            {tracks.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
