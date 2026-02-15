import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { home, login, register, logout } from '@/routes';
import profile from '@/routes/profile';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Menu, User, LogOut, Settings, Home, Music, Grid } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';

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

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                                    {user && (
                                        <Link href="/dashboard" className="text-lg font-semibold hover:text-primary transition-colors">
                                            Dashboard
                                        </Link>
                                    )}
                                    <Link href="#" className="text-lg font-semibold hover:text-primary transition-colors">
                                        Artistes
                                    </Link>
                                    <Link href="#" className="text-lg font-semibold hover:text-primary transition-colors">
                                        Catégories
                                    </Link>
                                    <Link href="/artstream" className="text-lg font-semibold hover:text-primary transition-colors">
                                        ArtStream
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>

                        <Link href={home()} className="flex items-center gap-2">
                            {/* Placeholder for Logo - maybe an SVG or Image */}
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold">A</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-primary font-heading hidden sm:inline-block">ARTDOM</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href={home()} className="text-sm font-medium hover:text-primary transition-colors">
                            Accueil
                        </Link>
                        {user && (
                            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                        )}
                        <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
                            Artistes
                        </Link>
                        <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
                            Catégories
                        </Link>
                        <Link href="/artstream" className="text-sm font-medium hover:text-primary transition-colors">
                            ArtStream
                        </Link>
                    </nav>

                    {/* Right Actions: Search & Profile */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Rechercher..."
                                className="w-[200px] lg:w-[300px] pl-9 bg-muted border-none focus-visible:ring-primary h-9"
                            />
                        </div>

                        <Button variant="ghost" size="icon" className="sm:hidden text-foreground">
                            <Search className="h-5 w-5" />
                        </Button>

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
                                        <Link href={profile.edit()} className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profil</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="#" className="cursor-pointer">
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
            <main className="flex-1">
                {children}
            </main>

            {/* Footer Placeholder */}
            <footer className="py-6 md:px-8 md:py-0 border-t border-border/40 bg-muted/30">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by ARTDOM Team.
                    </p>
                </div>
            </footer>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur z-40 pb-safe">
                <nav className="flex items-center justify-around h-16">
                    <Link
                        href={home()}
                        className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                            isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                        }`}
                    >
                        <Home className="h-5 w-5" />
                        <span>Accueil</span>
                    </Link>
                    <Link
                        href="/artists"
                        className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                            isActive('/artists') || isActive('/artist') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                        }`}
                    >
                        <Search className="h-5 w-5" />
                        <span>Artistes</span>
                    </Link>
                    <Link
                        href="/artstream"
                        className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                            isActive('/artstream') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                        }`}
                    >
                        <Music className="h-5 w-5" />
                        <span>ArtStream</span>
                    </Link>
                    {user ? (
                        <Link
                            href="/dashboard"
                            className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                                isActive('/dashboard') || isActive('/client') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                            }`}
                        >
                            <Grid className="h-5 w-5" />
                            <span>Dashboard</span>
                        </Link>
                    ) : (
                        <Link
                            href="/register/selection"
                            className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                                isActive('/register') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                            }`}
                        >
                            <Grid className="h-5 w-5" />
                            <span>Inscription</span>
                        </Link>
                    )}
                </nav>
            </div>
        </div>
    );
}
