import { useForm, usePage } from '@inertiajs/react';
import { MessageCircle, Send, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Comment {
    id: string;
    user: {
        id: string;
        name: string;
        profile_photo?: string;
    };
    content: string;
    created_at: string;
    replies?: Comment[];
}

interface TrackCommentsProps {
    trackId: string;
    comments: Comment[];
}

export default function TrackComments({ trackId, comments }: TrackCommentsProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.content.trim()) return;

        post(`/tracks/${trackId}/comments`, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 px-1">
                <MessageCircle className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Commentaires ({comments.length})</h3>
            </div>

            {/* Add Comment Form */}
            {auth?.user ? (
                <form onSubmit={handleSubmit} className="mb-6 space-y-2">
                    <div className="flex gap-3">
                        <Avatar className="w-8 h-8 shrink-0">
                            <AvatarImage src={auth.user.profile_photo} />
                            <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Textarea
                                placeholder="Ajouter un commentaire..."
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="min-h-[80px] text-sm resize-none"
                            />
                            {errors.content && (
                                <p className="text-xs text-destructive">{errors.content}</p>
                            )}
                            <div className="flex justify-end">
                                <Button 
                                    type="submit" 
                                    size="sm" 
                                    disabled={processing || !data.content.trim()}
                                    className="gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Commenter
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-muted/50 rounded-lg p-4 text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-2">
                        Connectez-vous pour laisser un commentaire
                    </p>
                    <Button variant="outline" size="sm" asChild>
                        <a href="/login">Se connecter</a>
                    </Button>
                </div>
            )}

            {/* Comments List */}
            <ScrollArea className="flex-1 -mx-1 px-1">
                {comments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Aucun commentaire pour le moment.</p>
                        <p className="text-sm">Soyez le premier à donner votre avis !</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment.id} className="space-y-3">
                                <div className="flex gap-3">
                                    <Avatar className="w-8 h-8 shrink-0">
                                        <AvatarImage src={comment.user.profile_photo} />
                                        <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold">{comment.user.name}</span>
                                            <span className="text-xs text-muted-foreground">{comment.created_at}</span>
                                        </div>
                                        <p className="text-sm text-foreground/90 leading-relaxed">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>

                                {/* Replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="ml-11 space-y-4 pt-1">
                                        {comment.replies.map((reply) => (
                                            <div key={reply.id} className="flex gap-3">
                                                <Avatar className="w-6 h-6 shrink-0">
                                                    <AvatarImage src={reply.user.profile_photo} />
                                                    <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold">{reply.user.name}</span>
                                                        <span className="text-xs text-muted-foreground">{reply.created_at}</span>
                                                    </div>
                                                    <p className="text-xs text-foreground/80 leading-relaxed">
                                                        {reply.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
