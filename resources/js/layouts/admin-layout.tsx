import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Banknote, BarChart3, Database, LogOut, ShieldCheck, ShoppingCart, Ticket, UserCheck, Users } from 'lucide-react';

type AdminLayoutProps = PropsWithChildren<{
    title: string;
    subtitle?: string;
}>;

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
    const { url, props } = usePage<any>();
    const currentRole = props?.auth?.user?.role;

    const navItems = [
        {
            label: 'Dashboard',
            href: '/admin/dashboard',
            icon: BarChart3,
        },
        {
            label: 'Validation artistes',
            href: '/admin/artists/pending',
            icon: UserCheck,
        },
        {
            label: 'Tickets support',
            href: '/admin/tickets',
            icon: Ticket,
        },
        {
            label: 'Utilisateurs',
            href: '/admin/users',
            icon: Users,
        },
        {
            label: 'Volet client',
            href: '/admin/client-activity',
            icon: ShoppingCart,
        },
        {
            label: 'Stats financieres',
            href: '/admin/financial-overview',
            icon: Banknote,
        },
        ...(currentRole === 'super_admin'
            ? [
                {
                    label: 'Super CRUD',
                    href: '/admin/super-crud',
                    icon: Database,
                },
            ]
            : []),
    ];

    const isActive = (href: string): boolean => {
        if (href === '/admin/dashboard') {
            return url === '/admin' || url === '/admin/dashboard';
        }

        return url.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto flex w-full max-w-[1600px]">
                <aside className="hidden min-h-screen w-72 border-r bg-card/50 p-5 md:block">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Espace</p>
                            <h2 className="text-lg font-bold">Administration</h2>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                        active
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-8 rounded-lg border bg-background p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Statut
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-medium">Session admin</span>
                            <Badge variant="default">Active</Badge>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/admin/logout" method="post" as="button">
                                <LogOut className="mr-2 h-4 w-4" />
                                Deconnexion
                            </Link>
                        </Button>
                    </div>
                </aside>

                <main className="flex-1">
                    <header className="border-b bg-background/90 px-4 py-4 backdrop-blur md:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">{title}</h1>
                                {subtitle ? (
                                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                                ) : null}
                            </div>
                            <Badge variant="secondary" className="hidden md:inline-flex">
                                Admin Panel
                            </Badge>
                        </div>
                    </header>
                    <section className="p-4 md:p-8">{children}</section>
                </main>
            </div>
        </div>
    );
}

