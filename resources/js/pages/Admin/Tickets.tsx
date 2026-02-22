import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Ticket = {
    id: string;
    subject?: string;
    status: string;
};

type PaginatedTickets = {
    data: Ticket[];
};

type Props = {
    tickets: PaginatedTickets;
    filters?: {
        status?: string;
        type?: string;
    };
};

export default function Tickets({ tickets, filters }: Props) {
    const openCount = tickets.data.filter((ticket) => ticket.status === 'open').length;
    const inProgressCount = tickets.data.filter((ticket) => ticket.status === 'in_progress').length;
    const closedCount = tickets.data.filter((ticket) => ticket.status === 'closed').length;

    return (
        <AdminLayout
            title="Tickets Support"
            subtitle="Suivre les demandes client et traiter rapidement les incidents."
        >
            <Head title="Tickets Support" />

            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Ouverts</CardDescription>
                            <CardTitle>{openCount}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>En cours</CardDescription>
                            <CardTitle>{inProgressCount}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Fermes (page)</CardDescription>
                            <CardTitle>{closedCount}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link href="/admin/tickets" className="rounded-md border px-3 py-1 text-sm">
                        Tous
                    </Link>
                    <Link
                        href="/admin/tickets?status=open"
                        className="rounded-md border px-3 py-1 text-sm"
                    >
                        Ouverts
                    </Link>
                    <Link
                        href="/admin/tickets?status=in_progress"
                        className="rounded-md border px-3 py-1 text-sm"
                    >
                        En cours
                    </Link>
                    <Link
                        href="/admin/tickets?status=closed"
                        className="rounded-md border px-3 py-1 text-sm"
                    >
                        Fermes
                    </Link>
                    {filters?.status ? (
                        <Badge variant="outline">Filtre actif: {filters.status}</Badge>
                    ) : null}
                </div>

                <div className="space-y-3">
                    {tickets.data.map((ticket) => (
                        <Card key={ticket.id} className="transition-colors hover:bg-muted/20">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {ticket.subject ?? `Ticket ${ticket.id}`}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    Statut: <Badge variant="secondary">{ticket.status}</Badge>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link
                                    href={`/admin/tickets/${ticket.id}`}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Voir details et gerer le ticket
                                </Link>
                            </CardContent>
                        </Card>
                    ))}

                    {tickets.data.length === 0 && (
                        <Card>
                            <CardContent className="py-10 text-center text-sm text-muted-foreground">
                                Aucun ticket trouve.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

