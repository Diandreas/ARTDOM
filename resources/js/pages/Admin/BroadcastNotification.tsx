import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Bell,
    CheckCircle2,
    Send,
    Users,
    Zap,
    Mail,
    Clock,
    AlertCircle,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppLocale } from '@/hooks/use-app-locale';
import AdminLayout from '@/layouts/admin-layout';

type AudienceStats = {
    all: number;
    client: number;
    artist: number;
    admin: number;
    with_fcm: number;
};

type Props = {
    audienceStats?: AudienceStats;
    flash?: { message?: string };
};

export default function BroadcastNotification({ audienceStats, flash }: Props) {
    const { t } = useAppLocale();

    const ROLE_LABELS: Record<string, string> = {
        all: t('All users'),
        client: t('Clients only'),
        artist: t('Artists only'),
        admin: t('Admins only'),
    };

    const page = usePage<any>();
    const flashMessage = flash?.message ?? page.props?.flash?.message;

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

    const audienceCount = audienceStats
        ? form.data.target_role === 'all'
            ? audienceStats.all
            : audienceStats[form.data.target_role as keyof AudienceStats] ?? 0
        : null;

    return (
        <AdminLayout title={t('Push Campaigns')} subtitle={t('Send targeted push notifications and emails to your users.')}>
            <Head title="Admin - Push Campaigns" />

            <div className="grid gap-6 xl:grid-cols-3">

                {/* Form */}
                <div className="xl:col-span-2 space-y-4">

                    {/* Success banner */}
                    {flashMessage && (
                        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                            <p className="text-sm font-medium text-green-800">{flashMessage}</p>
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-4 w-4 text-primary" />
                                {t('Compose campaign')}
                            </CardTitle>
                            <CardDescription>{t('Send in-app notifications + optional email.')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-5">

                                {/* Target audience */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">{t('Target audience')}</Label>
                                    <Select value={form.data.target_role} onValueChange={(v) => form.setData('target_role', v)}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {label}
                                                        {audienceStats && (
                                                            <span className="ml-1 text-xs text-muted-foreground">
                                                                ({value === 'all' ? audienceStats.all : audienceStats[value as keyof AudienceStats] ?? 0})
                                                            </span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {audienceCount !== null && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Users className="h-3 w-3" />
                                            <span><strong className="text-foreground">{audienceCount}</strong> {t('targeted user(s)')}</span>
                                            {audienceStats && (
                                                <span className="text-primary">· {audienceStats.with_fcm} {t('with FCM push')}</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-medium">{t('Notification title')} *</Label>
                                    <Input
                                        id="title"
                                        placeholder={t('Ex: New service available!')}
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        className="h-10"
                                        maxLength={80}
                                    />
                                    <div className="flex justify-between text-[10px] text-muted-foreground">
                                        {form.errors.title && <span className="text-destructive">{form.errors.title}</span>}
                                        <span className="ml-auto">{form.data.title.length}/80</span>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-sm font-medium">{t('Message body')} *</Label>
                                    <Textarea
                                        id="message"
                                        placeholder={t('Your message will appear in the push notification and in the notification center.')}
                                        rows={4}
                                        value={form.data.message}
                                        onChange={(e) => form.setData('message', e.target.value)}
                                        maxLength={300}
                                    />
                                    <div className="flex justify-between text-[10px] text-muted-foreground">
                                        {form.errors.message && <span className="text-destructive">{form.errors.message}</span>}
                                        <span className="ml-auto">{form.data.message.length}/300</span>
                                    </div>
                                </div>

                                {/* Action URL */}
                                <div className="space-y-2">
                                    <Label htmlFor="action_url" className="text-sm font-medium">
                                        {t('Action URL')} <span className="text-muted-foreground font-normal">({t('optional')})</span>
                                    </Label>
                                    <Input
                                        id="action_url"
                                        placeholder="/artstream"
                                        value={form.data.action_url}
                                        onChange={(e) => form.setData('action_url', e.target.value)}
                                        className="h-10"
                                    />
                                    <p className="text-[10px] text-muted-foreground">{t('Link opened when clicking the notification')}</p>
                                </div>

                                {/* Options */}
                                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('Options')}</p>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <Checkbox
                                            checked={form.data.only_active}
                                            onCheckedChange={(v) => form.setData('only_active', Boolean(v))}
                                            className="mt-0.5"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">{t('Active accounts only')}</p>
                                            <p className="text-xs text-muted-foreground">{t('Exclude suspended or inactive users')}</p>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <Checkbox
                                            checked={form.data.send_email}
                                            onCheckedChange={(v) => form.setData('send_email', Boolean(v))}
                                            className="mt-0.5"
                                        />
                                        <div>
                                            <p className="text-sm font-medium flex items-center gap-1.5">
                                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                {t('Also send by email')}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{t('Duplicate via email in addition to push')}</p>
                                        </div>
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={form.processing || !form.data.title || !form.data.message}
                                    className="w-full h-11 gap-2"
                                >
                                    {form.processing ? (
                                        <>
                                            <Clock className="h-4 w-4 animate-spin" />
                                            {t('Sending...')}
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            {t('Send campaign')}
                                            {audienceCount !== null && (
                                                <Badge variant="secondary" className="ml-1 text-xs">
                                                    {audienceCount} {t('recipients')}
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar info */}
                <div className="space-y-4">
                    {/* Preview card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">{t('Notification preview')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-xl border bg-muted/40 p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                        <Bell className="h-3 w-3 text-primary-foreground" />
                                    </div>
                                    <span className="text-xs font-semibold text-foreground">Artemo</span>
                                    <span className="text-[10px] text-muted-foreground ml-auto">{t('now')}</span>
                                </div>
                                <p className="text-sm font-semibold leading-tight">
                                    {form.data.title || <span className="text-muted-foreground italic">{t('Notification title')}</span>}
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {form.data.message || <span className="italic">{t('Your message will appear here...')}</span>}
                                </p>
                                {form.data.action_url && (
                                    <p className="text-[10px] text-primary">{form.data.action_url}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* FCM status */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                {t('FCM Push status')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{t('In-app notifications')}</span>
                                <Badge variant="default" className="text-xs bg-green-600">✓ {t('Active')}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{t('Firebase push (FCM)')}</span>
                                <Badge variant="outline" className="text-xs border-amber-400 text-amber-700">
                                    {t('Needs service account')}
                                </Badge>
                            </div>
                            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                                <div className="flex gap-2">
                                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-amber-800">{t('Service Account required')}</p>
                                        <p className="text-[10px] text-amber-700 mt-0.5">
                                            {t('To enable FCM push, download the Service Account JSON from Firebase Console → Project Settings → Service Accounts, and configure')} {' '}
                                            <code className="bg-amber-100 px-1 rounded">FIREBASE_CREDENTIALS</code> {t('in .env')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {audienceStats && (
                                <div className="pt-2 border-t space-y-1.5 text-xs text-muted-foreground">
                                    <p className="font-medium text-foreground">{t('Audience breakdown')}</p>
                                    <div className="flex justify-between"><span>{t('Total users')}</span><strong>{audienceStats.all}</strong></div>
                                    <div className="flex justify-between"><span>{t('Clients')}</span><strong>{audienceStats.client}</strong></div>
                                    <div className="flex justify-between"><span>{t('Artists')}</span><strong>{audienceStats.artist}</strong></div>
                                    <div className="flex justify-between"><span>{t('With FCM token')}</span><strong className="text-primary">{audienceStats.with_fcm}</strong></div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
