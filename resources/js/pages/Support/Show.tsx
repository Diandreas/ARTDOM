import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Ticket, Calendar, Paperclip, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SupportTicket {
    id: string;
    ticket_number: string;
    type: string;
    subject: string;
    message: string;
    status: string;
    attachments: string[] | null;
    admin_response: string | null;
    created_at: string;
    closed_at: string | null;
}

export default function SupportShow({ auth, ticket }: { auth: any; ticket: SupportTicket }) {

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <Badge className="bg-emerald-500">Ouvert</Badge>;
            case 'pending':
                return <Badge variant="outline" className="text-amber-500 border-amber-500">En cours de traitement</Badge>;
            case 'closed':
                return <Badge variant="secondary">Clôturé</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'suggestion': 'Suggestion d\'amélioration',
            'bug': 'Rapport de bug',
            'complaint': 'Réclamation',
            'other': 'Autre demande'
        };
        return types[type] || type;
    };

    return (
        <MainLayout>
            <Head title={`Ticket ${ticket.ticket_number}`} />
            <div className="container max-w-4xl mx-auto py-8 px-4 pb-24">
                <Link href="/support" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour aux demandes
                </Link>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold font-heading">{ticket.subject}</h1>
                            {getStatusBadge(ticket.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Ticket className="w-4 h-4" />
                                {ticket.ticket_number}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(ticket.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Demande initiale */}
                    <Card>
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold text-sm">{auth.user.name.charAt(0)}</span>
                                    </div>
                                    <span>Vous</span>
                                </CardTitle>
                                <Badge variant="outline">{getTypeLabel(ticket.type)}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed mb-6">
                                {ticket.message}
                            </p>

                            {ticket.attachments && Array.isArray(ticket.attachments) && ticket.attachments.length > 0 && (
                                <div className="mt-8 pt-6 border-t">
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <Paperclip className="w-4 h-4" />
                                        Pièces jointes ({ticket.attachments.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {ticket.attachments.map((attachment, idx) => (
                                            <a
                                                key={idx}
                                                href={attachment}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center bg-muted hover:bg-muted/80 px-3 py-2 rounded-md text-sm transition-colors"
                                            >
                                                <Paperclip className="w-3 h-3 mr-2 text-muted-foreground" />
                                                Document {idx + 1}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Réponse de l'admin */}
                    {ticket.admin_response ? (
                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader className="border-b border-primary/10 pb-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                        <span className="text-primary-foreground font-bold text-sm">A</span>
                                    </div>
                                    <span className="text-primary font-semibold">Service Support ARTDOM</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                                    {ticket.admin_response}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="text-center py-10 bg-muted/10 rounded-xl border border-dashed text-muted-foreground">
                            <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                            <p>Notre équipe traite actuellement votre demande.</p>
                            <p className="text-sm mt-1">Vous recevrez une notification dès que nous aurons répondu.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
