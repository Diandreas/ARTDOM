import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, MessageSquare, Clock } from 'lucide-react';

interface Conversation {
    id: string;
    last_message: string;
    last_message_at: string;
    participants: any[];
    messages: any[];
}

export default function MessagesIndex({ auth, conversations }: { auth: any, conversations: Conversation[] }) {
    const user = auth.user;

    const getOtherParticipant = (conversation: Conversation) => {
        return conversation.participants.find(p => p.id !== user.id);
    };

    return (
        <MainLayout>
            <Head title="Messages" />

            <div className="container max-w-4xl mx-auto py-8 px-4 pb-24">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold font-heading">Messages</h1>
                </div>

                <div className="space-y-4">
                    {conversations.length > 0 ? (
                        conversations.map((conversation) => {
                            const other = getOtherParticipant(conversation);
                            const lastMessage = conversation.messages[0];
                            const unreadCount = other?.pivot?.unread_count || 0;

                            return (
                                <Link key={conversation.id} href={`/messages/${conversation.id}`}>
                                    <Card className={`hover:bg-muted/50 transition-colors cursor-pointer mb-4 ${unreadCount > 0 ? 'border-primary' : ''}`}>
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative">
                                                    {other?.profile_photo_url ? (
                                                        <img
                                                            src={other.profile_photo_url}
                                                            className="w-full h-full rounded-full object-cover"
                                                            alt={other.name}
                                                        />
                                                    ) : (
                                                        <User className="w-6 h-6 text-primary" />
                                                    )}
                                                    {unreadCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-semibold text-foreground">{other?.name || 'Inconnu'}</p>
                                                    <p className="text-sm text-muted-foreground truncate max-w-[200px] md:max-w-md">
                                                        {conversation.last_message || "Aucun message"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-1">
                                                <div className="flex items-center text-[10px] text-muted-foreground">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {new Date(conversation.last_message_at).toLocaleDateString()}
                                                </div>
                                                {unreadCount > 0 && (
                                                    <Badge className="bg-primary text-primary-foreground h-4 px-1.5 text-[10px]">
                                                        Nouveau
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground">Vous n'avez pas encore de conversations.</p>
                            <Link href="/artists" className="text-primary hover:underline mt-2 inline-block">
                                Parcourez les artistes pour commencer une conversation
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
