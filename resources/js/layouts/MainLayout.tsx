import { Link, router, usePage } from '@inertiajs/react';
import {
    Search,
    Menu,
    User,
    LogOut,
    Settings,
    Home,
    Music,
    Grid,
    Bell,
    Calendar,
} from 'lucide-react';
import React from 'react';
import type { PropsWithChildren, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MiniPlayer from '@/components/Player/MiniPlayer';
import LanguageSwitcher from '@/components/language-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAppLocale } from '@/hooks/use-app-locale';
import { home, login, logout } from '@/routes';
import { index as artistsIndex } from '@/routes/artists';

export default function MainLayout({ children }: PropsWithChildren) {
    const user = (usePage().props as any).auth.user;
    const { url } = usePage();
    const { t } = useAppLocale();

    // Helper function to check if link is active
    const isActive = (path: string) => {
        if (path === '/') {
            return url === '/';
        }
        return url.startsWith(path);
    };

    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [headerSearch, setHeaderSearch] = useState('');

    const handleHeaderSearch = (e: FormEvent) => {
        e.preventDefault();
        if (headerSearch.trim()) {
            router.get(
                artistsIndex.url(),
                { search: headerSearch.trim() },
                { preserveState: false },
            );
        }
    };

    useEffect(() => {
        if (user && typeof window !== 'undefined' && (window as any).Echo) {
            const channel = (window as any).Echo.private(
                `App.Models.User.${user.id}`,
            );

            channel.notification((notification: any) => {
                setUnreadNotifications((prev) => prev + 1);

                const titles: Record<string, string> = {
                    new_message: `${t('Message from')} ${notification.sender_name ?? t('someone')}`,
                    new_reservation: t('New reservation'),
                    reservation_confirmed: t('Reservation confirmed'),
                    reservation_declined: t('Reservation declined'),
                    new_track_comment: t('New comment'),
                    new_album_released: t('New album available'),
                    artist_validation_approved: t('Account approved'),
                    artist_validation_rejected: t('Validation rejected'),
                    admin_global_message:
                        notification.title ?? t('Artemo message'),
                };

                const actionUrl =
                    notification.action_url ??
                    (notification.conversation_id
                        ? `/messages/${notification.conversation_id}`
                        : '/notifications');

                toast.info(
                    titles[notification.type] ??
                        notification.title ??
                        t('Notification'),
                    {
                        description:
                            notification.message ?? notification.content ?? '',
                        action: {
                            label: t('View'),
                            onClick: () => {
                                window.location.href = actionUrl;
                            },
                        },
                    },
                );
            });

            return () => {
                channel.stopListening(
                    '.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated',
                );
                (window as any).Echo.leave(`App.Models.User.${user.id}`);
            };
        }
    }, [t, user]);

    return (
        <div className="relative min-h-screen bg-background font-sans text-foreground">
            {/* African Pattern Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cdefs%3E%3Cpattern id='kente' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Crect width='40' height='40' fill='none'/%3E%3Cpath d='M0 20 L10 0 L20 20 L10 40 Z' fill='none' stroke='%23d4a017' stroke-width='0.6' opacity='0.18'/%3E%3Cpath d='M20 20 L30 0 L40 20 L30 40 Z' fill='none' stroke='%23d4a017' stroke-width='0.6' opacity='0.18'/%3E%3Ccircle cx='20' cy='20' r='4' fill='none' stroke='%23d4a017' stroke-width='0.5' opacity='0.12'/%3E%3Cpath d='M0 0 L10 10 M40 0 L30 10 M0 40 L10 30 M40 40 L30 30' stroke='%23d4a017' stroke-width='0.5' opacity='0.1'/%3E%3Crect x='15' y='15' width='10' height='10' fill='none' stroke='%23d4a017' stroke-width='0.4' opacity='0.1' transform='rotate(45 20 20)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='80' height='80' fill='url(%23kente)'/%3E%3C/svg%3E")`,
                    backgroundSize: '80px 80px',
                    opacity: 1,
                }}
            />
            {/* Header / Navbar */}
            <header className="relative sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    {/* Logo & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-primary md:hidden"
                                >
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">{t('Menu')}</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex flex-col w-[300px] border-r border-border bg-card sm:w-[400px]"
                            >
                                <div className="mt-8 flex items-center gap-2 px-2">
                                    <img
                                        src="/artemo-logo.png"
                                        alt="Artemo"
                                        className="h-8 w-8 object-contain"
                                    />
                                    <span className="font-heading text-lg font-bold tracking-tight text-primary">
                                        ARTEMO
                                    </span>
                                </div>
                                <nav className="mt-8 flex flex-col gap-4 overflow-y-auto px-2">
                                    <Link
                                        href={home()}
                                        className="text-lg font-semibold transition-colors hover:text-primary"
                                    >
                                        {t('Home')}
                                    </Link>
                                    {user ? (
                                        user.role === 'artist' ? (
                                            <>
                                                <Link
                                                    href="/artist/dashboard"
                                                    className="text-lg font-semibold transition-colors hover:text-primary"
                                                >
                                                    {t('Artist Dashboard')}
                                                </Link>
                                                <Link
                                                    href="/artist/albums"
                                                    className="text-lg font-semibold transition-colors hover:text-primary"
                                                >
                                                    {t('My Albums')}
                                                </Link>
                                                <Link
                                                    href="/artist/services"
                                                    className="text-lg font-semibold transition-colors hover:text-primary"
                                                >
                                                    {t('My Services')}
                                                </Link>
                                                <Link
                                                    href="/artist/wallet"
                                                    className="text-lg font-semibold transition-colors hover:text-primary"
                                                >
                                                    {t('Wallet')}
                                                </Link>
                                                <Link
                                                    href="/artist/withdrawals"
                                                    className="text-lg font-semibold transition-colors hover:text-primary"
                                                >
                                                    {t('Withdrawals')}
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href="/dashboard"
                                                    className="text-lg font-semibold transition-colors hover:text-primary"
                                                >
                                                    {t('Client Dashboard')}
                                                </Link>
                                                <Link
                                                    href={artistsIndex.url()}
                                                    className="text-lg font-semibold transition-colors hover:text-primary"
                                                >
                                                    {t('Artists')}
                                                </Link>
                                                <Link
                                                    href="/artstream"
                                                    className="text-lg font-semibold transition-colors hover:text-primary"
                                                >
                                                    ArtStream
                                                </Link>
                                                <Link
                                                    href="/client/reservations"
                                                    className="text-lg font-semibold transition-colors hover:text-primary"
                                                >
                                                    {t('My Reservations')}
                                                </Link>
                                            </>
                                        )
                                    ) : (
                                        <>
                                            <Link
                                                href={artistsIndex.url()}
                                                className="text-lg font-semibold transition-colors hover:text-primary"
                                            >
                                                {t('Artists')}
                                            </Link>
                                            <Link
                                                href="/artstream"
                                                className="text-lg font-semibold transition-colors hover:text-primary"
                                            >
                                                ArtStream
                                            </Link>
                                        </>
                                    )}
                                </nav>

                                <div className="mt-auto border-t border-border/40 pt-6 pb-10 px-2">
                                    <p className="mb-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        {t('Language')}
                                    </p>
                                    <LanguageSwitcher className="w-full justify-between bg-muted/50" />
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Link href={home()} className="flex items-center gap-2">
                            <img
                                src="/artemo-logo.png"
                                alt="Artemo"
                                className="h-9 w-9 object-contain"
                            />
                            <span className="font-heading hidden text-xl font-bold tracking-tight text-primary sm:inline-block">
                                ARTEMO
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            href={home()}
                            className="text-sm font-medium transition-colors hover:text-primary"
                        >
                            {t('Home')}
                        </Link>
                        {user ? (
                            <>
                                {user.role === 'artist' ? (
                                    <>
                                        <Link
                                            href="/artist/dashboard"
                                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/artist/dashboard') ? 'text-primary' : ''}`}
                                        >
                                            {t('Artist Dashboard')}
                                        </Link>
                                        <Link
                                            href="/artist/albums"
                                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/artist/albums') ? 'text-primary' : ''}`}
                                        >
                                            {t('My Albums')}
                                        </Link>
                                        <Link
                                            href="/artist/services"
                                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/artist/services') ? 'text-primary' : ''}`}
                                        >
                                            {t('My Services')}
                                        </Link>
                                        <Link
                                            href="/artist/wallet"
                                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/artist/wallet') ? 'text-primary' : ''}`}
                                        >
                                            {t('Wallet')}
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/dashboard') ? 'text-primary' : ''}`}
                                        >
                                            {t('Client Dashboard')}
                                        </Link>
                                        <Link
                                            href={artistsIndex.url()}
                                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive(artistsIndex.url()) ? 'text-primary' : ''}`}
                                        >
                                            {t('Artists')}
                                        </Link>
                                        <Link
                                            href="/artstream"
                                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/artstream') ? 'text-primary' : ''}`}
                                        >
                                            ArtStream
                                        </Link>
                                        <Link
                                            href="/client/reservations"
                                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/client/reservations') ? 'text-primary' : ''}`}
                                        >
                                            {t('My Reservations')}
                                        </Link>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Link
                                    href={artistsIndex.url()}
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    {t('Artists')}
                                </Link>
                                <Link
                                    href="/artstream"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    ArtStream
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Right Actions: Search & Profile */}
                    <div className="flex items-center gap-1.5 md:gap-4">
                        <LanguageSwitcher compact className="scale-90 sm:scale-100" />

                        <form
                            onSubmit={handleHeaderSearch}
                            className="relative hidden sm:block"
                        >
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={t('Search for music, artists...')}
                                className="h-9 w-[200px] border-none bg-muted pl-9 focus-visible:ring-primary lg:w-[300px]"
                                value={headerSearch}
                                onChange={(e) =>
                                    setHeaderSearch(e.target.value)
                                }
                            />
                        </form>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-foreground sm:hidden"
                            onClick={() => router.get('/artists')}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {user && (
                            <Link
                                href="/notifications"
                                className="relative hidden h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted sm:flex"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background"></span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-9 w-9 rounded-full"
                                    >
                                        <Avatar className="h-9 w-9 border border-border">
                                            <AvatarImage
                                                src={user.profile_photo_url}
                                                alt={user.name}
                                            />
                                            <AvatarFallback>
                                                {user?.name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="end"
                                    forceMount
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm leading-none font-medium">
                                                {user.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={
                                                user.role === 'artist'
                                                    ? '/artist/profile'
                                                    : '/client/profile'
                                            }
                                            className="cursor-pointer"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>{t('My profile')}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/library"
                                            className="cursor-pointer"
                                        >
                                            <Music className="mr-2 h-4 w-4" />
                                            <span>{t('My library')}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={
                                                user.role === 'artist'
                                                    ? '/artist/orders'
                                                    : '/client/reservations'
                                            }
                                            className="cursor-pointer"
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            <span>
                                                {user.role === 'artist'
                                                    ? t('My orders')
                                                    : t('My reservations')}
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/settings"
                                            className="cursor-pointer"
                                        >
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>{t('Settings')}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={logout()}
                                            method="post"
                                            as="button"
                                            className="w-full cursor-pointer"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>{t('Log out')}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    asChild
                                    className="hidden sm:inline-flex"
                                >
                                    <Link href={login()}>{t('Log in')}</Link>
                                </Button>
                                <Button
                                    asChild
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <Link href="/register/selection">
                                        {t('Register')}
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1">{children}</main>

            {/* Footer Placeholder */}
            <footer className="relative z-10 border-t border-border/40 bg-muted/30 py-6 md:px-8 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-balance text-muted-foreground md:text-left">
                        {t('Built by ARTEMO Team.')}
                    </p>
                </div>
            </footer>

            {/* Mobile Bottom Navigation */}
            <div className="pb-safe fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-background/95 backdrop-blur md:hidden">
                <nav className="flex h-16 items-center justify-around px-2">
                    <BottomNavItem
                        href={home()}
                        active={isActive('/')}
                        icon={<Home className="h-5 w-5" />}
                        label={t('Home')}
                    />
                    <BottomNavItem
                        href="/artists"
                        active={isActive('/artists') || isActive('/artist')}
                        icon={<Search className="h-5 w-5" />}
                        label={t('Artists')}
                    />
                    <BottomNavItem
                        href="/artstream"
                        active={isActive('/artstream')}
                        icon={<Music className="h-5 w-5" />}
                        label="ArtStream"
                    />
                    {user ? (
                        <BottomNavItem
                            href="/notifications"
                            active={isActive('/notifications')}
                            icon={
                                <div className="relative">
                                    <Bell className="h-5 w-5" />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-background">
                                            {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                        </span>
                                    )}
                                </div>
                            }
                            label={t('Alerts')}
                        />
                    ) : null}
                    {user ? (
                        <BottomNavItem
                            href={user.role === 'artist' ? '/artist/dashboard' : '/dashboard'}
                            active={isActive('/dashboard') || isActive('/artist/dashboard') || isActive('/client')}
                            icon={<Grid className="h-5 w-5" />}
                            label={t('Dashboard')}
                        />
                    ) : (
                        <BottomNavItem
                            href="/register/selection"
                            active={isActive('/register')}
                            icon={<Grid className="h-5 w-5" />}
                            label={t('Register')}
                        />
                    )}
                </nav>
            </div>
            <MiniPlayer />
        </div>
    );
}

function BottomNavItem({
    href,
    active,
    icon,
    label,
}: {
    href: string;
    active: boolean;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <Link
            href={href}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
        >
            {active && (
                <span className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
            )}
            {icon}
            <span>{label}</span>
        </Link>
    );
}
