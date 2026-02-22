import { Form, Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Ticket = {
    id: string;
    ticket_number?: string;
    type?: string;
    subject?: string;
    status: string;
    message?: string;
    admin_response?: string | null;
    user?: {
        id: string;
        email?: string;
    };
};

type Props = {
    ticket: Ticket;
};

export default function TicketDetail({ ticket }: Props) {
    return (
        <AdminLayout
            title="Detail du ticket"
            subtitle="Repondre au client, suivre et cloturer les demandes."
        >
            <Head title="Detail Ticket" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            {ticket.subject ?? `Ticket ${ticket.id}`}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {ticket.ticket_number ? `${ticket.ticket_number} - ` : ''}
                            {ticket.user?.email ?? 'Utilisateur inconnu'}
                        </p>
                    </div>
                    <Badge variant="secondary">{ticket.status}</Badge>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Message client</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm">
                                {ticket.message ?? 'Aucun contenu'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Reponse admin actuelle</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm">
                                {ticket.admin_response ?? 'Aucune reponse pour le moment'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Actions CRUD sur le ticket</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 lg:grid-cols-2">
                        <Form action={`/admin/tickets/${ticket.id}/respond`} method="post">
                            {({ processing, errors }) => (
                                <div className="space-y-3">
                                    <Label htmlFor="admin_response">Repondre au client</Label>
                                    <Textarea
                                        id="admin_response"
                                        name="admin_response"
                                        rows={5}
                                        placeholder="Saisissez votre reponse..."
                                        required
                                        defaultValue={ticket.admin_response ?? ''}
                                    />
                                    {errors.admin_response ? (
                                        <p className="text-xs text-destructive">
                                            {errors.admin_response}
                                        </p>
                                    ) : null}
                                    <Button type="submit" disabled={processing}>
                                        Enregistrer la reponse
                                    </Button>
                                </div>
                            )}
                        </Form>

                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Cloturez le ticket lorsqu'il est resolu.
                            </p>
                            <Form action={`/admin/tickets/${ticket.id}/close`} method="patch">
                                {({ processing }) => (
                                    <Button type="submit" variant="outline" disabled={processing}>
                                        Fermer ce ticket
                                    </Button>
                                )}
                            </Form>
                            <Button variant="ghost" asChild>
                                <Link href="/admin/tickets">Retour a la liste</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

