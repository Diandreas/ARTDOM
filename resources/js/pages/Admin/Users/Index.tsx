import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { MoreHorizontal } from 'lucide-react';

type UserRow = {
    id: string;
    avatar?: string | null;
    full_name: string;
    email: string;
    phone: string;
    type: string;
    status: string;
    registered_at: string | null;
    email_verified: boolean;
    city?: string | null;
};

type Pagination<T> = {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type Filters = {
    type: string;
    status: string;
    registered_from: string;
    registered_to: string;
    city: string;
    email_verified: string | boolean | null;
    search: string;
    sort: string;
    direction: string;
};

type Props = {
    users: Pagination<UserRow>;
    filters: Filters;
    cities: string[];
};

const statusLabel: Record<string, string> = {
    active: 'Actif',
    suspended: 'Suspendu',
    pending: 'En attente',
    banned: 'Banni',
};

export default function Index({ users, filters, cities }: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkEmailSubject, setBulkEmailSubject] = useState('');
    const [bulkEmailBody, setBulkEmailBody] = useState('');

    const filterForm = useForm({
        type: filters.type ?? 'all',
        status: filters.status ?? 'all',
        registered_from: filters.registered_from ?? '',
        registered_to: filters.registered_to ?? '',
        city: filters.city ?? '',
        email_verified:
            filters.email_verified === true || filters.email_verified === '1'
                ? '1'
                : filters.email_verified === false || filters.email_verified === '0'
                    ? '0'
                    : 'all',
        search: filters.search ?? '',
        sort: filters.sort ?? 'created_at',
        direction: filters.direction ?? 'desc',
    });

    const allVisibleSelected = useMemo(() => {
        if (users.data.length === 0) {
            return false;
        }

        return users.data.every((user) => selectedIds.includes(user.id));
    }, [users.data, selectedIds]);

    const applyFilters = () => {
        const payload: Record<string, string> = {
            type: filterForm.data.type,
            status: filterForm.data.status,
            registered_from: filterForm.data.registered_from,
            registered_to: filterForm.data.registered_to,
            city: filterForm.data.city,
            search: filterForm.data.search,
            sort: filterForm.data.sort,
            direction: filterForm.data.direction,
        };

        if (filterForm.data.email_verified !== 'all') {
            payload.email_verified = filterForm.data.email_verified;
        }

        router.get('/admin/users', payload, { preserveState: true, preserveScroll: true });
    };

    const resetFilters = () => {
        setSelectedIds([]);
        router.get('/admin/users');
    };

    const toggleSelected = (id: string, checked: boolean) => {
        setSelectedIds((prev) => {
            if (checked) {
                if (prev.includes(id)) {
                    return prev;
                }

                return [...prev, id];
            }

            return prev.filter((value) => value !== id);
        });
    };

    const toggleAllVisible = (checked: boolean) => {
        if (!checked) {
            setSelectedIds((prev) => prev.filter((id) => !users.data.some((user) => user.id === id)));

            return;
        }

        setSelectedIds((prev) => Array.from(new Set([...prev, ...users.data.map((user) => user.id)])));
    };

    const sendBulk = (action: 'suspend' | 'ban' | 'delete' | 'export_csv' | 'send_email') => {
        if (selectedIds.length === 0) {
            return;
        }

        router.post(
            '/admin/users/bulk',
            {
                ids: selectedIds,
                action,
                subject: bulkEmailSubject,
                body: bulkEmailBody,
            },
            {
                onSuccess: () => {
                    if (action !== 'export_csv') {
                        setSelectedIds([]);
                    }
                },
            },
        );
    };

    const sortBy = (column: 'id' | 'email' | 'created_at') => {
        const direction = filterForm.data.sort === column && filterForm.data.direction === 'asc' ? 'desc' : 'asc';

        filterForm.setData('sort', column);
        filterForm.setData('direction', direction);

        router.get('/admin/users', {
            ...filterForm.data,
            direction,
            sort: column,
            email_verified: filterForm.data.email_verified === 'all' ? undefined : filterForm.data.email_verified,
        });
    };

    const copy = async (value: string) => {
        if (!value) {
            return;
        }

        await navigator.clipboard.writeText(value);
    };

    return (
        <AdminLayout title="Gestion Utilisateurs" subtitle="Liste, filtres avances et actions en masse.">
            <Head title="Admin - Utilisateurs" />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Filtres avances</CardTitle>
                        <CardDescription>Type, statut, date, ville, verification email et recherche textuelle.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={filterForm.data.type} onValueChange={(value) => filterForm.setData('type', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous</SelectItem>
                                        <SelectItem value="client">Client</SelectItem>
                                        <SelectItem value="artist">Artiste</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="super_admin">Super admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Statut</Label>
                                <Select value={filterForm.data.status} onValueChange={(value) => filterForm.setData('status', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous</SelectItem>
                                        <SelectItem value="active">Actif</SelectItem>
                                        <SelectItem value="suspended">Suspendu</SelectItem>
                                        <SelectItem value="pending">En attente</SelectItem>
                                        <SelectItem value="banned">Banni</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Date inscription (debut)</Label>
                                <Input type="date" value={filterForm.data.registered_from} onChange={(event) => filterForm.setData('registered_from', event.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label>Date inscription (fin)</Label>
                                <Input type="date" value={filterForm.data.registered_to} onChange={(event) => filterForm.setData('registered_to', event.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label>Ville</Label>
                                <Select value={filterForm.data.city || 'all'} onValueChange={(value) => filterForm.setData('city', value === 'all' ? '' : value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes</SelectItem>
                                        {cities.map((city) => (
                                            <SelectItem key={city} value={city}>{city}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Email verifie</Label>
                                <Select value={filterForm.data.email_verified} onValueChange={(value) => filterForm.setData('email_verified', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous</SelectItem>
                                        <SelectItem value="1">Oui</SelectItem>
                                        <SelectItem value="0">Non</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 xl:col-span-2">
                                <Label>Recherche (nom, email, telephone)</Label>
                                <Input value={filterForm.data.search} onChange={(event) => filterForm.setData('search', event.target.value)} placeholder="Ex: jane@, +225..., Kone" />
                            </div>

                            <div className="flex items-end gap-2">
                                <Button onClick={applyFilters}>Filtrer</Button>
                                <Button variant="outline" onClick={resetFilters}>Reinitialiser</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Actions en masse</CardTitle>
                        <CardDescription>{selectedIds.length} utilisateur(s) selectionne(s).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" disabled={selectedIds.length === 0} onClick={() => sendBulk('suspend')}>Suspendre</Button>
                            <Button variant="outline" disabled={selectedIds.length === 0} onClick={() => sendBulk('ban')}>Bannir</Button>
                            <Button variant="outline" disabled={selectedIds.length === 0} onClick={() => sendBulk('export_csv')}>Exporter CSV</Button>
                            <Button variant="outline" disabled={selectedIds.length === 0} onClick={() => sendBulk('delete')}>Supprimer</Button>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                            <Input value={bulkEmailSubject} onChange={(event) => setBulkEmailSubject(event.target.value)} placeholder="Sujet email groupe" />
                            <Input value={bulkEmailBody} onChange={(event) => setBulkEmailBody(event.target.value)} placeholder="Message email groupe" />
                        </div>
                        <Button variant="outline" disabled={selectedIds.length === 0} onClick={() => sendBulk('send_email')}>Envoyer email groupe</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Liste utilisateurs</CardTitle>
                            <CardDescription>CRUD complet des comptes plateforme.</CardDescription>
                        </div>
                        <Button asChild>
                            <Link href="/admin/users/create">Creer utilisateur</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full min-w-[1050px] text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="py-2 pr-2">
                                        <Checkbox checked={allVisibleSelected} onCheckedChange={(value) => toggleAllVisible(Boolean(value))} />
                                    </th>
                                    <th className="py-2 pr-2">
                                        <button type="button" className="font-medium" onClick={() => sortBy('id')}>ID ↕</button>
                                    </th>
                                    <th className="py-2 pr-2">Avatar</th>
                                    <th className="py-2 pr-2">Nom complet</th>
                                    <th className="py-2 pr-2">
                                        <button type="button" className="font-medium" onClick={() => sortBy('email')}>Email ↕</button>
                                    </th>
                                    <th className="py-2 pr-2">Telephone</th>
                                    <th className="py-2 pr-2">Type</th>
                                    <th className="py-2 pr-2">Statut</th>
                                    <th className="py-2 pr-2">
                                        <button type="button" className="font-medium" onClick={() => sortBy('created_at')}>Inscription ↕</button>
                                    </th>
                                    <th className="py-2 pr-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user) => (
                                    <tr key={user.id} className="border-b align-top">
                                        <td className="py-3 pr-2">
                                            <Checkbox checked={selectedIds.includes(user.id)} onCheckedChange={(value) => toggleSelected(user.id, Boolean(value))} />
                                        </td>
                                        <td className="py-3 pr-2">{user.id.slice(0, 8)}</td>
                                        <td className="py-3 pr-2">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.full_name} className="h-10 w-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full border text-xs">
                                                    {user.full_name.slice(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 pr-2">{user.full_name}</td>
                                        <td className="py-3 pr-2">
                                            <div className="flex items-center gap-2">
                                                <span>{user.email}</span>
                                                <Button variant="ghost" size="sm" onClick={() => copy(user.email)}>Copier</Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {user.email_verified ? 'Email verifie' : 'Email non verifie'}
                                            </p>
                                        </td>
                                        <td className="py-3 pr-2">
                                            <div className="flex items-center gap-2">
                                                <span>{user.phone}</span>
                                                <Button variant="ghost" size="sm" onClick={() => copy(user.phone)}>Copier</Button>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-2"><Badge variant="outline">{user.type}</Badge></td>
                                        <td className="py-3 pr-2"><Badge>{statusLabel[user.status] ?? user.status}</Badge></td>
                                        <td className="py-3 pr-2">{user.registered_at ? new Date(user.registered_at).toLocaleDateString() : '-'}</td>
                                        <td className="py-3 pr-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild><Link href={`/admin/users/${user.id}`}>Voir details</Link></DropdownMenuItem>
                                                    <DropdownMenuItem asChild><Link href={`/admin/users/${user.id}/edit`}>Modifier</Link></DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => router.post(`/admin/users/${user.id}/impersonate`)}>Se connecter en tant que</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => router.post(`/admin/users/${user.id}/suspend`)}>Suspendre</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => router.post(`/admin/users/${user.id}/ban`)}>Bannir</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => router.delete(`/admin/users/${user.id}`)}>Supprimer</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users.data.length === 0 ? (
                            <p className="py-10 text-center text-sm text-muted-foreground">Aucun utilisateur trouve.</p>
                        ) : null}

                        <div className="mt-6 flex flex-wrap gap-2">
                            {users.links.map((link, index) => (
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
