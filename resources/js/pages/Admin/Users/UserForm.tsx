import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type CategoryOption = {
    value: string;
    label: string;
};

type InitialUser = {
    first_name?: string | null;
    last_name?: string | null;
    email?: string;
    phone?: string;
    city?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    profile_photo?: string | null;
    role?: 'client' | 'artist' | 'admin' | 'super_admin';
    status?: 'active' | 'pending' | 'suspended' | 'banned';
    stage_name?: string | null;
    level?: string | null;
    category?: string | null;
    bio?: string | null;
    base_rate?: string | number | null;
    portfolio_urls?: string[];
    email_verified?: boolean;
};

type Props = {
    mode: 'create' | 'edit';
    endpoint: string;
    categories: CategoryOption[];
    user?: InitialUser;
};

const levelOptions = [
    { value: 'talent', label: 'Talent' },
    { value: 'rising_star', label: 'Artiste perçant' },
    { value: 'emerging_star', label: 'Star en émergence' },
];

export default function UserForm({ mode, endpoint, categories, user }: Props) {
    const form = useForm({
        first_name: user?.first_name ?? '',
        last_name: user?.last_name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        city: user?.city ?? '',
        date_of_birth: user?.date_of_birth ?? '',
        gender: user?.gender ?? '',
        profile_photo: user?.profile_photo ?? '',
        role: (user?.role ?? 'client') as 'client' | 'artist' | 'admin' | 'super_admin',
        status: (user?.status ?? 'active') as 'active' | 'pending' | 'suspended' | 'banned',
        stage_name: user?.stage_name ?? '',
        level: user?.level ?? '',
        category: user?.category ?? '',
        bio: user?.bio ?? '',
        base_rate: String(user?.base_rate ?? ''),
        portfolio_urls: user?.portfolio_urls?.join('\n') ?? '',
        password: '',
        password_confirmation: '',
        mark_email_verified: user?.email_verified ?? false,
        force_password_change: false,
        create_and_new: false,
    });

    const isArtist = useMemo(() => form.data.role === 'artist', [form.data.role]);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            level: data.level === '' ? null : data.level,
            base_rate: data.base_rate === '' ? null : Number(data.base_rate),
            portfolio_urls: data.portfolio_urls
                .split('\n')
                .map((url) => url.trim())
                .filter((url) => url.length > 0),
        }));

        if (mode === 'create') {
            form.post(endpoint);

            return;
        }

        form.put(endpoint);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informations de base</CardTitle>
                    <CardDescription>Identite et type de compte.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="first_name">Prenom *</Label>
                        <Input id="first_name" value={form.data.first_name} onChange={(event) => form.setData('first_name', event.target.value)} />
                        {form.errors.first_name ? <p className="text-sm text-destructive">{form.errors.first_name}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="last_name">Nom *</Label>
                        <Input id="last_name" value={form.data.last_name} onChange={(event) => form.setData('last_name', event.target.value)} />
                        {form.errors.last_name ? <p className="text-sm text-destructive">{form.errors.last_name}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} />
                        {form.errors.email ? <p className="text-sm text-destructive">{form.errors.email}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telephone *</Label>
                        <Input id="phone" value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} />
                        {form.errors.phone ? <p className="text-sm text-destructive">{form.errors.phone}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input id="city" value={form.data.city} onChange={(event) => form.setData('city', event.target.value)} />
                        {form.errors.city ? <p className="text-sm text-destructive">{form.errors.city}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="profile_photo">Photo profil (URL)</Label>
                        <Input id="profile_photo" value={form.data.profile_photo} onChange={(event) => form.setData('profile_photo', event.target.value)} />
                        {form.errors.profile_photo ? <p className="text-sm text-destructive">{form.errors.profile_photo}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label>Type compte *</Label>
                        <Select value={form.data.role} onValueChange={(value) => form.setData('role', value as 'client' | 'artist' | 'admin' | 'super_admin')}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="client">Client</SelectItem>
                                <SelectItem value="artist">Artiste</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="super_admin">Super admin</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.errors.role ? <p className="text-sm text-destructive">{form.errors.role}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label>Statut *</Label>
                        <Select value={form.data.status} onValueChange={(value) => form.setData('status', value as 'active' | 'pending' | 'suspended' | 'banned')}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Actif</SelectItem>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="suspended">Suspendu</SelectItem>
                                <SelectItem value="banned">Banni</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.errors.status ? <p className="text-sm text-destructive">{form.errors.status}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date_of_birth">Date naissance</Label>
                        <Input id="date_of_birth" type="date" value={form.data.date_of_birth} onChange={(event) => form.setData('date_of_birth', event.target.value)} />
                        {form.errors.date_of_birth ? <p className="text-sm text-destructive">{form.errors.date_of_birth}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gender">Genre</Label>
                        <Input id="gender" value={form.data.gender} onChange={(event) => form.setData('gender', event.target.value)} />
                        {form.errors.gender ? <p className="text-sm text-destructive">{form.errors.gender}</p> : null}
                    </div>
                </CardContent>
            </Card>

            {isArtist ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Informations artiste</CardTitle>
                        <CardDescription>Utilise uniquement pour les comptes artiste.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="stage_name">Nom de scene *</Label>
                            <Input id="stage_name" value={form.data.stage_name} onChange={(event) => form.setData('stage_name', event.target.value)} />
                            {form.errors.stage_name ? <p className="text-sm text-destructive">{form.errors.stage_name}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label>Niveau Artiste</Label>
                            <Select value={form.data.level || 'none'} onValueChange={(value) => form.setData('level', value === 'none' ? '' : value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Automatique" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Automatique</SelectItem>
                                    {levelOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.errors.level ? <p className="text-sm text-destructive">{form.errors.level}</p> : null}
                            <p className="text-[10px] text-muted-foreground">Si vide, le niveau sera calcule automatiquement.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Categorie principale</Label>
                            <Select value={form.data.category || 'none'} onValueChange={(value) => form.setData('category', value === 'none' ? '' : value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Aucune</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.errors.category ? <p className="text-sm text-destructive">{form.errors.category}</p> : null}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="bio">Bio (1000 max)</Label>
                            <Textarea id="bio" rows={4} value={form.data.bio} onChange={(event) => form.setData('bio', event.target.value)} maxLength={1000} />
                            {form.errors.bio ? <p className="text-sm text-destructive">{form.errors.bio}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="base_rate">Tarif horaire de base</Label>
                            <Input id="base_rate" type="number" min={0} value={form.data.base_rate} onChange={(event) => form.setData('base_rate', event.target.value)} />
                            {form.errors.base_rate ? <p className="text-sm text-destructive">{form.errors.base_rate}</p> : null}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="portfolio_urls">Portfolio (1 URL par ligne)</Label>
                            <Textarea id="portfolio_urls" rows={4} value={form.data.portfolio_urls} onChange={(event) => form.setData('portfolio_urls', event.target.value)} />
                            {form.errors.portfolio_urls ? <p className="text-sm text-destructive">{form.errors.portfolio_urls}</p> : null}
                        </div>
                    </CardContent>
                </Card>
            ) : null}

            <Card>
                <CardHeader>
                    <CardTitle>Securite</CardTitle>
                    <CardDescription>Gestion du mot de passe et verification email.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe {mode === 'create' ? '*' : '(optionnel)'}</Label>
                        <Input id="password" type="password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} />
                        {form.errors.password ? <p className="text-sm text-destructive">{form.errors.password}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirmation</Label>
                        <Input id="password_confirmation" type="password" value={form.data.password_confirmation} onChange={(event) => form.setData('password_confirmation', event.target.value)} />
                        {form.errors.password_confirmation ? <p className="text-sm text-destructive">{form.errors.password_confirmation}</p> : null}
                    </div>

                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={form.data.mark_email_verified} onCheckedChange={(value) => form.setData('mark_email_verified', Boolean(value))} />
                        Marquer email comme verifie
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked={form.data.force_password_change} onCheckedChange={(value) => form.setData('force_password_change', Boolean(value))} />
                        Forcer changement mot de passe a la prochaine connexion
                    </label>

                    {mode === 'create' ? (
                        <label className="flex items-center gap-2 text-sm md:col-span-2">
                            <Checkbox checked={form.data.create_and_new} onCheckedChange={(value) => form.setData('create_and_new', Boolean(value))} />
                            Creer et en creer un autre
                        </label>
                    ) : null}
                </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={form.processing}>
                    {mode === 'create' ? 'Creer l\'utilisateur' : 'Mettre a jour'}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href="/admin/users">Annuler</Link>
                </Button>
            </div>
        </form>
    );
}
