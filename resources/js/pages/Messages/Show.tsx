import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User, Send, ChevronLeft, Calendar } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
    id: string;
    sender_id: string;
    content: string;
    sent_at: string;
    sender: any;
}

interface Conversation {
    id: string;
    participants: any[];
    messages: Message[];
    reservation: any;
}

export default function MessagesShow({ auth, conversation }: { auth: any, conversation: Conversation }) {
    const user = auth.user;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [localMessages, setLocalMessages] = useState<Message[]>(conversation.messages);

    const other = conversation.participants.find(p => p.id !== user.id);

    const { data, setData, post, processing, reset } = useForm({
        content: '',
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [localMessages]);

    useEffect(() => {
        // Only works if Laravel Echo is configured globally as window.Echo
        if (typeof window !== 'undefined' && (window as any).Echo) {
            const channel = (window as any).Echo.private(`conversation.${conversation.id}`);

            channel.listen('MessageSent', (e: any) => {
                setLocalMessages(prev => [...prev, e.message]);

                // If the message is from the other person, mark it as read optionally via an API call
            });

            return () => {
                channel.stopListening('MessageSent');
                (window as any).Echo.leave(`conversation.${conversation.id}`);
            };
        }
    }, [conversation.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.content.trim() === '') return;

        post(`/messages/${conversation.id}`, {
            onSuccess: () => reset('content'),
        });
    };

    return (
        <MainLayout>
            <Head title={`Discussion avec ${other?.name}`} />

            <div className="flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] container max-w-4xl mx-auto py-4 px-4 pb-24 md:pb-4">
                {/* Chat Header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                    <div className="flex items-center gap-3">
                        <Link href="/messages" className="md:hidden">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {other?.profile_photo_url ? (
                                <img src={other.profile_photo_url} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="w-5 h-5 text-primary" />
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-foreground">{other?.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                {other?.role === 'artist' ? 'Artiste' : 'Client'}
                            </p>
                        </div>
                    </div>

                    {conversation.reservation && (
                        <Link href={`/client/reservations/${conversation.reservation.id}`}>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Réservation #{conversation.reservation.reservation_number.substring(0, 8)}
                            </Badge>
                        </Link>
                    )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4 scrollbar-hide">
                    {localMessages.map((msg) => {
                        const isMe = msg.sender_id === user.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-3 px-4 ${isMe
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-muted text-foreground rounded-tl-none'
                                    } shadow-sm`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'opacity-70' : 'text-muted-foreground'}`}>
                                        {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="mt-auto">
                    <form onSubmit={handleSubmit} className="relative">
                        <Textarea
                            placeholder="Écrivez votre message..."
                            className="min-h-[80px] pr-12 pt-4 bg-background border-muted shadow-lg resize-none"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            disabled={processing || data.content.trim() === ''}
                            size="icon"
                            className="absolute bottom-3 right-3 rounded-full bg-primary hover:bg-primary/90 shadow-md"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </Button>
                    </form>
                    <p className="text-[10px] text-muted-foreground mt-2 text-center">
                        Appuyez sur Entrée pour envoyer
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}

function Badge({ children, variant = 'default', className = '' }: any) {
    const variants: any = {
        default: 'bg-primary text-primary-foreground',
        outline: 'border border-muted text-muted-foreground bg-transparent'
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
