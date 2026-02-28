import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Ticket, ArrowRight, MessageSquareWarning } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SupportTicket {
    id: string;
    ticket_number: string;
    type: string;
    subject: string;
    status: string;
    created_at: string;
}

export default function SupportIndex({ auth, tickets }: { auth: any; tickets: SupportTicket[] }) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <Badge className="bg-emerald-500 hover:bg-emerald-600">Ouvert</Badge>;
            case 'pending':
                return <Badge variant="outline" className="text-amber-500 border-amber-500">En attente</Badge>;
            case 'closed':
                return <Badge variant="secondary">Fermé</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'suggestion': 'Suggestion',
            'bug': 'Rapport de bug',
            'complaint': 'Réclamation',
            'other': 'Autre demande'
        };
        return types[type] || type;
    };

    return (
        <MainLayout>
            <Head title="Support & Assistance" />
            <div className="container max-w-4xl mx-auto py-8 px-4 pb-24">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-heading">Support & Assistance</h1>
                        <p className="text-muted-foreground mt-1">Gérez vos demandes et suggestions pour ARTDOM.</p>
                    </div>
                    <Button asChild className="bg-primary text-primary-foreground">
                        <Link href="/support/create">
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle demande
                        </Link>
                    </Button>
                </div>

                <Card className="mb-8 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquareWarning className="w-5 h-5 text-primary" />
                            Besoin d'aide rapide ?
                        </CardTitle>
                        <CardDescription>
                            Avant d'ouvrir un ticket, pensez à consulter notre FAQ ou à vérifier si votre problème n'est pas déjà connu de nos services.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Vos demandes récentes</h2>

                    {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                            <Link key={ticket.id} href={`/support/${ticket.id}`} className="block">
                                <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-border/50">
                                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                <Ticket className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-foreground">{ticket.subject}</h3>
                                                    <span className="text-xs text-muted-foreground border px-1.5 py-0.5 rounded">
                                                        {ticket.ticket_number}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                                    <span>{getTypeLabel(ticket.type)}</span>
                                                    <span>•</span>
                                                    <span>Créé {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: fr })}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-4 pl-14 sm:pl-0">
                                            {getStatusBadge(ticket.status)}
                                            <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <Card className="border-dashed bg-transparent p-12 flex flex-col items-center justify-center text-center">
                            <Ticket className="w-12 h-12 text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-medium text-foreground">Aucune demande</h3>
                            <p className="text-muted-foreground mt-1 mb-4">Vous n'avez pas encore créé de demande de support.</p>
                            <Button variant="outline" asChild>
                                <Link href="/support/create">Créer une demande</Link>
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
