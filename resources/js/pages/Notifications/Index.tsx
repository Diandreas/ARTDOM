import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trash2, MessageCircle, CalendarDays, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationData {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: string;
    data: any;
    read_at: string | null;
    created_at: string;
}

export default function NotificationsIndex({ auth, notifications, unreadCount }: { auth: any; notifications: NotificationData[]; unreadCount: number }) {

    // Mark a single notification as read
    const { post: postRead } = useForm();
    const markAsRead = (id: string) => {
        postRead(`/notifications/${id}/mark-read`, { preserveScroll: true });
    };

    // Mark all as read
    const { post: postAllRead } = useForm();
    const markAllAsRead = () => {
        postAllRead(`/notifications/mark-all-read`, { preserveScroll: true });
    };

    // Delete a notification
    const { delete: deleteNotification } = useForm();
    const handleDelete = (id: string) => {
        deleteNotification(`/notifications/${id}`, { preserveScroll: true });
    };

    const getIcon = (type: string) => {
        if (type === 'new_message') return <MessageCircle className="w-5 h-5 text-blue-500" />;
        if (type === 'booking') return <CalendarDays className="w-5 h-5 text-emerald-500" />;
        return <Info className="w-5 h-5 text-primary" />;
    };

    const getLink = (notification: NotificationData) => {
        if (notification.data.type === 'new_message' && notification.data.conversation_id) {
            return `/messages/${notification.data.conversation_id}`;
        }
        return "#";
    };

    return (
        <MainLayout>
            <Head title="Notifications" />
            <div className="container max-w-3xl mx-auto py-8 px-4 pb-24">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold font-heading">Notifications</h1>
                        {unreadCount > 0 && (
                            <Badge className="bg-primary text-primary-foreground">
                                {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllAsRead}>
                            <Check className="w-4 h-4 mr-2" />
                            Tout marquer comme lu
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`overflow-hidden transition-all ${!notification.read_at ? 'bg-primary/5 border-primary/20' : ''}`}
                            >
                                <CardContent className="p-4 sm:p-6 flex gap-4">
                                    <div className="mt-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.read_at ? 'bg-muted' : 'bg-primary/10'}`}>
                                            {getIcon(notification.data.type || 'info')}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <Link
                                            href={getLink(notification)}
                                            onClick={() => !notification.read_at && markAsRead(notification.id)}
                                            className="block"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                                                <h3 className={`text-base ${!notification.read_at ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>
                                                    {notification.data.type === 'new_message' ? `Nouveau message de ${notification.data.sender_name}` : 'Notification'}
                                                </h3>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${!notification.read_at ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                                                {notification.data.content || "Vous avez reçu une nouvelle notification."}
                                            </p>
                                        </Link>
                                    </div>

                                    <div className="flex flex-col gap-2 justify-start items-end pl-2">
                                        {!notification.read_at && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2"></div>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive mt-auto transition-opacity opacity-0 group-hover:opacity-100 sm:opacity-100"
                                            onClick={() => handleDelete(notification.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground">Vous n'avez aucune notification pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
