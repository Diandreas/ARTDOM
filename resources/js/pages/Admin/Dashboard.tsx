import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Bell,
    ChartBar,
    ChartLine,
    LifeBuoy,
    ShieldAlert,
    UserCheck2,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAppLocale } from '@/hooks/use-app-locale';
import AdminLayout from '@/layouts/admin-layout';

type Kpis = {
    users: {
        total: number;
        clients: number;
        artists: number;
        new: {
            last_24h: number;
            last_7d: number;
            last_30d: number;
        };
    };
    artists: {
        active: number;
        pending: number;
        suspended: number;
    };
    revenue: {
        day: number;
        week: number;
        month: number;
        year: number;
        total: number;
    };
    commissions: {
        day: number;
        week: number;
        month: number;
        year: number;
        total: number;
    };
    reservations: {
        confirmed: number;
        pending: number;
        completed: number;
    };
    contents: {
        albums: number;
        videos: number;
        courses: number;
    };
    reports_pending: number;
    tickets: {
        open: number;
        in_progress: number;
    };
};

type RevenueCurvePoint = {
    day: string;
    reservations: number;
    sales: number;
    subscriptions: number;
    total: number;
};

type SignupBarPoint = {
    day: string;
    clients: number;
    artists: number;
};

type CategoryPoint = {
    category: string;
    count: number;
};

type ConversionFunnel = {
    visitors: number | null;
    signups: number;
    buyers: number;
    signup_rate: number | null;
    buyer_rate_from_signup: number;
    tracking_enabled: boolean;
};

type Charts = {
    revenue_curve: RevenueCurvePoint[];
    signups_bar: SignupBarPoint[];
    category_donut: CategoryPoint[];
    conversion_funnel: ConversionFunnel;
    days: string[];
};

type TimelineEvent = {
    type: string;
    title: string;
    description: string;
    occurred_at: string;
};

type Alerts = {
    artists_pending_validation: number;
    urgent_reports: number;
    withdrawals_pending_over_48h: number;
    tickets_without_response_over_24h: number;
};

type QuickAction = {
    label: string;
    description: string;
    href: string;
};

type Props = {
    kpis: Kpis;
    charts: Charts;
    activityTimeline: TimelineEvent[];
    criticalAlerts: Alerts;
    quickActions: QuickAction[];
};

const formatMoney = (value: number): string => {
    return `${Math.round(value).toLocaleString()} FCFA`;
};

export default function Dashboard({
    kpis,
    charts,
    activityTimeline,
    criticalAlerts,
    quickActions,
}: Props) {
    const { t } = useAppLocale();
    const maxRevenue = Math.max(
        ...charts.revenue_curve.map((point) => point.total),
        1,
    );
    const maxSignup = Math.max(
        ...charts.signups_bar.map((point) => point.clients + point.artists),
        1,
    );
    const totalCategoryCount = charts.category_donut.reduce(
        (sum, item) => sum + item.count,
        0,
    );

    return (
        <AdminLayout
            title={t('Main dashboard')}
            subtitle={t('Global real-time monitoring of all modules.')}
        >
            <Head title={t('Main admin dashboard')} />

            <div className="space-y-8">
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            {t('1.1 Real-time KPIs')}
                        </h2>
                        <Badge variant="secondary">{t('Live update')}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    {t('Total users')}
                                </CardDescription>
                                <CardTitle>{kpis.users.total}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {t('Clients')}: {kpis.users.clients} -{' '}
                                {t('Artists')}: {kpis.users.artists}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    {t('New signups')}
                                </CardDescription>
                                <CardTitle>
                                    24h: {kpis.users.new.last_24h} - {t('7d')}:{' '}
                                    {kpis.users.new.last_7d}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {t('30d')}: {kpis.users.new.last_30d}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    {t('Artists')}
                                </CardDescription>
                                <CardTitle>{kpis.users.artists}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {t('Active')}: {kpis.artists.active} -{' '}
                                {t('Pending')}: {kpis.artists.pending} -{' '}
                                {t('Suspended')}: {kpis.artists.suspended}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    {t('Revenue')}
                                </CardDescription>
                                <CardTitle>
                                    {formatMoney(kpis.revenue.month)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {t('Day')}: {formatMoney(kpis.revenue.day)} -{' '}
                                {t('Week')}: {formatMoney(kpis.revenue.week)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    {t('Platform commissions')}
                                </CardDescription>
                                <CardTitle>
                                    {formatMoney(kpis.commissions.total)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {t('Month')}:{' '}
                                {formatMoney(kpis.commissions.month)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    {t('Reservations')}
                                </CardDescription>
                                <CardTitle>
                                    {kpis.reservations.confirmed}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {t('Pending')}: {kpis.reservations.pending} -{' '}
                                {t('Completed')}: {kpis.reservations.completed}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    {t('Published content')}
                                </CardDescription>
                                <CardTitle>
                                    {kpis.contents.albums +
                                        kpis.contents.videos +
                                        kpis.contents.courses}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {t('Albums')}: {kpis.contents.albums} -{' '}
                                {t('Videos')}: {kpis.contents.videos} -{' '}
                                {t('Courses')}: {kpis.contents.courses}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    {t('Reports / Tickets')}
                                </CardDescription>
                                <CardTitle>
                                    {kpis.reports_pending} / {kpis.tickets.open}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {t('Tickets in progress')}:{' '}
                                {kpis.tickets.in_progress}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">{t('1.2 Charts')}</h2>
                    <div className="grid gap-4 xl:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ChartLine className="h-4 w-4" />
                                    {t('Revenue curve')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'Reservations + Sales + Subscriptions (7d)',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {charts.revenue_curve.map((point) => (
                                    <div key={point.day} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span>{point.day}</span>
                                            <span>
                                                {formatMoney(point.total)}
                                            </span>
                                        </div>
                                        <div className="h-2 rounded bg-muted">
                                            <div
                                                className="h-2 rounded bg-primary"
                                                style={{
                                                    width: `${(point.total / maxRevenue) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ChartBar className="h-4 w-4" />
                                    {t('Client vs artist signups')}
                                </CardTitle>
                                <CardDescription>
                                    {t('Per day (7d)')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {charts.signups_bar.map((point) => {
                                    const total = point.clients + point.artists;

                                    return (
                                        <div
                                            key={point.day}
                                            className="space-y-1"
                                        >
                                            <div className="flex items-center justify-between text-xs">
                                                <span>{point.day}</span>
                                                <span>
                                                    C: {point.clients} - A:{' '}
                                                    {point.artists}
                                                </span>
                                            </div>
                                            <div className="flex h-2 overflow-hidden rounded bg-muted">
                                                <div
                                                    className="bg-primary"
                                                    style={{
                                                        width: `${(point.clients / maxSignup) * 100}%`,
                                                    }}
                                                />
                                                <div
                                                    className="bg-secondary"
                                                    style={{
                                                        width: `${(point.artists / maxSignup) * 100}%`,
                                                    }}
                                                />
                                                {total === 0 ? (
                                                    <div className="w-full bg-muted" />
                                                ) : null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t('Artist categories donut')}</CardTitle>
                                <CardDescription>
                                    {t('Breakdown of main categories')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {charts.category_donut.map((item) => (
                                    <div
                                        key={item.category}
                                        className="space-y-1"
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="capitalize">
                                                {item.category}
                                            </span>
                                            <span>{item.count}</span>
                                        </div>
                                        <div className="h-2 rounded bg-muted">
                                            <div
                                                className="h-2 rounded bg-primary/80"
                                                style={{
                                                    width: `${totalCategoryCount > 0 ? (item.count / totalCategoryCount) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {charts.category_donut.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        {t('No categories available.')}
                                    </p>
                                ) : null}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t('Conversion rate')}</CardTitle>
                                <CardDescription>
                                    {t('Visitors - Signups - Buyers')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="rounded border p-3">
                                    <p className="text-muted-foreground">
                                        {t('Visitors')}
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {charts.conversion_funnel.visitors ??
                                            t('Tracking not configured')}
                                    </p>
                                </div>
                                <div className="rounded border p-3">
                                    <p className="text-muted-foreground">
                                        {t('Signups')}
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {charts.conversion_funnel.signups}
                                    </p>
                                </div>
                                <div className="rounded border p-3">
                                    <p className="text-muted-foreground">
                                        {t('Buyers')}
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {charts.conversion_funnel.buyers}
                                    </p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {t('Signup to buyer conversion')}:{' '}
                                    {charts.conversion_funnel.buyer_rate_from_signup.toFixed(
                                        2,
                                    )}
                                    %
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('1.3 Recent activity')}</CardTitle>
                            <CardDescription>
                                {t(
                                    'Signups, reservations, reports, withdrawals, reviews.',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {activityTimeline.map((item) => (
                                <div
                                    key={`${item.type}-${item.occurred_at}-${item.description}`}
                                    className="rounded border p-3"
                                >
                                    <p className="text-sm font-medium">
                                        {t(item.title)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(
                                            item.occurred_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                            {activityTimeline.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    {t('No recent activity.')}
                                </p>
                            ) : null}
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                {t('1.4 Critical alerts')}
                            </CardTitle>
                            <CardDescription>
                                {t('Items to process first.')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between rounded border p-3">
                                <span className="flex items-center gap-2">
                                    <UserCheck2 className="h-4 w-4" />
                                    {t('Artists pending validation')}
                                </span>
                                <Badge>
                                    {criticalAlerts.artists_pending_validation}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between rounded border p-3">
                                <span className="flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4" />
                                    {t('Urgent reports')}
                                </span>
                                <Badge variant="destructive">
                                    {criticalAlerts.urgent_reports}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between rounded border p-3">
                                <span className="flex items-center gap-2">
                                    <Bell className="h-4 w-4" />
                                    {t('Withdrawals pending > 48h')}
                                </span>
                                <Badge variant="outline">
                                    {
                                        criticalAlerts.withdrawals_pending_over_48h
                                    }
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between rounded border p-3">
                                <span className="flex items-center gap-2">
                                    <LifeBuoy className="h-4 w-4" />
                                    {t('Tickets without response > 24h')}
                                </span>
                                <Badge variant="outline">
                                    {
                                        criticalAlerts.tickets_without_response_over_24h
                                    }
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('1.5 Quick shortcuts')}</CardTitle>
                            <CardDescription>
                                {t('Priority actions across admin modules.')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {quickActions.map((action) => (
                                <Card
                                    key={action.label}
                                    className="border-primary/20"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            {t(action.label)}
                                        </CardTitle>
                                        <CardDescription>
                                            {t(action.description)}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href={action.href}>
                                                {t('Open')}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AdminLayout>
    );
}
