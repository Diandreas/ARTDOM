import { Link, router, usePage } from '@inertiajs/react';
import { Search, Menu, User, LogOut, Settings, Home, Music, Grid, Bell, Calendar } from 'lucide-react';
import type { PropsWithChildren, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MiniPlayer from '@/components/Player/MiniPlayer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { home, login, register, logout } from '@/routes';
import { index as artistsIndex } from '@/routes/artists';
import profile from '@/routes/profile';

export default function MainLayout({ children }: PropsWithChildren) {
    const user = (usePage().props as any).auth.user;
    const { url } = usePage();

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
            router.get(artistsIndex.url(), { search: headerSearch.trim() }, { preserveState: false });
        }
    };

    useEffect(() => {
        if (user && typeof window !== 'undefined' && (window as any).Echo) {
            const channel = (window as any).Echo.private(`App.Models.User.${user.id}`);

            channel.notification((notification: any) => {
                setUnreadNotifications(prev => prev + 1);

                const titles: Record<string, string> = {
                    new_message: `Message de ${notification.sender_name ?? 'quelqu\'un'}`,
                    new_reservation: 'Nouvelle réservation',
                    reservation_confirmed: 'Réservation confirmée 🎉',
                    reservation_declined: 'Réservation refusée',
                    new_track_comment: 'Nouveau commentaire',
                    new_album_released: 'Nouvel album disponible 🎵',
                    artist_validation_approved: 'Compte validé ✅',
                    artist_validation_rejected: 'Validation refusée',
                    admin_global_message: notification.title ?? 'Message Artemo',
                };

                const actionUrl = notification.action_url
                    ?? (notification.conversation_id ? `/messages/${notification.conversation_id}` : '/notifications');

                toast.info(titles[notification.type] ?? notification.title ?? 'Notification', {
                    description: notification.message ?? notification.content ?? '',
                    action: {
                        label: 'Voir',
                        onClick: () => { window.location.href = actionUrl; },
                    },
                });
            });

            return () => {
                channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated');
                (window as any).Echo.leave(`App.Models.User.${user.id}`);
            };
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans relative">
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
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    {/* Logo & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-primary">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px] border-r border-border bg-card">
                                <nav className="flex flex-col gap-4 mt-8">
                                    <Link href={home()} className="text-lg font-semibold hover:text-primary transition-colors">
                                        Accueil
                                    </Link>
                                    {user ? (
                                        user.role === 'artist' ? (
                                            <>
                                                <Link href="/artist/dashboard" className="text-lg font-semibold hover:text-primary transition-colors">
                                                    Dashboard Artiste
                                                </Link>
                                                <Link href="/artist/albums" className="text-lg font-semibold hover:text-primary transition-colors">
                                                    Mes Albums
                                                </Link>
                                                <Link href="/artist/services" className="text-lg font-semibold hover:text-primary transition-colors">
                                                    Mes Services
                                                </Link>
                                                <Link href="/artist/wallet" className="text-lg font-semibold hover:text-primary transition-colors">
                                                    Portefeuille
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/dashboard" className="text-lg font-semibold hover:text-primary transition-colors">
                                                    Dashboard Client
                                                </Link>
                                                <Link href={artistsIndex.url()} className="text-lg font-semibold hover:text-primary transition-colors">
                                                    Artistes
                                                </Link>
                                                <Link href="/artstream" className="text-lg font-semibold hover:text-primary transition-colors">
                                                    ArtStream
                                                </Link>
                                                <Link href="/client/reservations" className="text-lg font-semibold hover:text-primary transition-colors">
                                                    Mes Réservations
                                                </Link>
                                            </>
                                        )
                                    ) : (
                                        <>
                                            <Link href={artistsIndex.url()} className="text-lg font-semibold hover:text-primary transition-colors">
                                                Artistes
                                            </Link>
                                            <Link href="/artstream" className="text-lg font-semibold hover:text-primary transition-colors">
                                                ArtStream
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </SheetContent>
                        </Sheet>

                        <Link href={home()} className="flex items-center gap-2">
                            <img
                                src="/artemo-logo.png"
                                alt="Artemo"
                                className="h-9 w-9 object-contain"
                            />
                            <span className="text-xl font-bold tracking-tight text-primary font-heading hidden sm:inline-block">ARTEMO</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href={home()} className="text-sm font-medium hover:text-primary transition-colors">
                            Accueil
                        </Link>
                        {user ? (
                            <>
                                {user.role === 'artist' ? (
                                    <>
                                        <Link href="/artist/dashboard" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/artist/dashboard') ? 'text-primary' : ''}`}>
                                            Dashboard Artiste
                                        </Link>
                                        <Link href="/artist/albums" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/artist/albums') ? 'text-primary' : ''}`}>
                                            Mes Albums
                                        </Link>
                                        <Link href="/artist/services" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/artist/services') ? 'text-primary' : ''}`}>
                                            Mes Services
                                        </Link>
                                        <Link href="/artist/wallet" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/artist/wallet') ? 'text-primary' : ''}`}>
                                            Portefeuille
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/dashboard" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/dashboard') ? 'text-primary' : ''}`}>
                                            Dashboard Client
                                        </Link>
                                        <Link href={artistsIndex.url()} className={`text-sm font-medium hover:text-primary transition-colors ${isActive(artistsIndex.url()) ? 'text-primary' : ''}`}>
                                            Artistes
                                        </Link>
                                        <Link href="/artstream" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/artstream') ? 'text-primary' : ''}`}>
                                            ArtStream
                                        </Link>
                                        <Link href="/client/reservations" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/client/reservations') ? 'text-primary' : ''}`}>
                                            Mes Réservations
                                        </Link>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Link href={artistsIndex.url()} className="text-sm font-medium hover:text-primary transition-colors">
                                    Artistes
                                </Link>
                                <Link href="/artstream" className="text-sm font-medium hover:text-primary transition-colors">
                                    ArtStream
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Right Actions: Search & Profile */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <form onSubmit={handleHeaderSearch} className="relative hidden sm:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Rechercher un artiste..."
                                className="w-[200px] lg:w-[300px] pl-9 bg-muted border-none focus-visible:ring-primary h-9"
                                value={headerSearch}
                                onChange={(e) => setHeaderSearch(e.target.value)}
                            />
                        </form>

                        <Button variant="ghost" size="icon" className="sm:hidden text-foreground" onClick={() => router.get('/artists')}>
                            <Search className="h-5 w-5" />
                        </Button>

                        {user && (
                            <Link href="/notifications" className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted text-foreground transition-colors">
                                <Bell className="h-5 w-5" />
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background"></span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                        <Avatar className="h-9 w-9 border border-border">
                                            <AvatarImage src={user.profile_photo_url} alt={user.name} />
                                            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={user.role === 'artist' ? '/artist/profile' : '/client/profile'} className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Mon Profil</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/library" className="cursor-pointer">
                                            <Music className="mr-2 h-4 w-4" />
                                            <span>Ma Bibliothèque</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={user.role === 'artist' ? '/artist/orders' : '/client/reservations'} className="cursor-pointer">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            <span>{user.role === 'artist' ? 'Mes Commandes' : 'Mes réservations'}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Paramètres</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={logout()} method="post" as="button" className="cursor-pointer w-full">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Déconnexion</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" asChild className="hidden sm:inline-flex">
                                    <Link href={login()}>Connexion</Link>
                                </Button>
                                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Link href="/register/selection">Inscription</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10">
                {children}
            </main>

            {/* Footer Placeholder */}
            <footer className="py-6 md:px-8 md:py-0 border-t border-border/40 bg-muted/30 relative z-10">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by ARTEMO Team.
                    </p>
                </div>
            </footer>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur z-50 pb-safe">
                <nav className="flex items-center justify-around h-16">
                    <Link
                        href={home()}
                        className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                            }`}
                    >
                        <Home className="h-5 w-5" />
                        <span>Accueil</span>
                    </Link>
                    <Link
                        href="/artists"
                        className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isActive('/artists') || isActive('/artist') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                            }`}
                    >
                        <Search className="h-5 w-5" />
                        <span>Artistes</span>
                    </Link>
                    <Link
                        href="/artstream"
                        className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isActive('/artstream') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                            }`}
                    >
                        <Music className="h-5 w-5" />
                        <span>ArtStream</span>
                    </Link>
                    {user ? (
                        <Link
                            href={user.role === 'artist' ? '/artist/dashboard' : '/dashboard'}
                            className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isActive('/dashboard') || isActive('/artist/dashboard') || isActive('/client') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                                }`}
                        >
                            <Grid className="h-5 w-5" />
                            <span>Dashboard</span>
                        </Link>
                    ) : (
                        <Link
                            href="/register/selection"
                            className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isActive('/register') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                                }`}
                        >
                            <Grid className="h-5 w-5" />
                            <span>Inscription</span>
                        </Link>
                    )}
                </nav>
            </div>
            <MiniPlayer />
        </div>
    );
}
