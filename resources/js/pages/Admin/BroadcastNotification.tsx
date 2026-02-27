import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormEvent } from 'react';

export default function BroadcastNotification() {
    const form = useForm({
        title: '',
        message: '',
        target_role: 'all',
        action_url: '',
        only_active: false,
        send_email: false,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/admin/broadcast');
    };

    return (
        <AdminLayout title="Notification globale" subtitle="Diffuser un message a tous les utilisateurs cible.">
            <Head title="Admin - Notification globale" />

            <Card>
                <CardHeader>
                    <CardTitle>Composer une diffusion</CardTitle>
                    <CardDescription>Envoi en base notifications + option email.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Titre *</Label>
                            <Input id="title" value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} />
                            {form.errors.title ? <p className="text-xs text-destructive">{form.errors.title}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message *</Label>
                            <Textarea id="message" rows={6} value={form.data.message} onChange={(event) => form.setData('message', event.target.value)} />
                            {form.errors.message ? <p className="text-xs text-destructive">{form.errors.message}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label>Cible</Label>
                            <Select value={form.data.target_role} onValueChange={(value) => form.setData('target_role', value)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    <SelectItem value="client">Clients</SelectItem>
                                    <SelectItem value="artist">Artistes</SelectItem>
                                    <SelectItem value="admin">Admins</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="action_url">Lien d'action (optionnel)</Label>
                            <Input id="action_url" placeholder="/dashboard" value={form.data.action_url} onChange={(event) => form.setData('action_url', event.target.value)} />
                        </div>

                        <label className="flex items-center gap-2 text-sm">
                            <Checkbox
                                checked={form.data.only_active}
                                onCheckedChange={(value) => form.setData('only_active', Boolean(value))}
                            />
                            Envoyer seulement aux comptes actifs
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                            <Checkbox
                                checked={form.data.send_email}
                                onCheckedChange={(value) => form.setData('send_email', Boolean(value))}
                            />
                            Doubler l'envoi par email
                        </label>

                        <Button type="submit" disabled={form.processing}>Envoyer la diffusion</Button>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
