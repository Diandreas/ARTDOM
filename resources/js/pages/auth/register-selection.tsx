
import { Link, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { User, Palette, Mic, Music } from 'lucide-react';
import AuthLayout from '@/layouts/auth-layout';
import { login, register } from '@/routes';

export default function RegisterSelection() {
    return (
        <AuthLayout
            title="Bienvenue sur ARTDOM"
            description="Choisissez votre profil pour commencer l'aventure"
        >
            <Head title="Choix du profil" />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Client Profile */}
                <Link href={register()} className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:border-primary hover:bg-muted/50 hover:shadow-md">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <User className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-heading text-xl font-bold">Je suis Client</h3>
                        <p className="text-sm text-muted-foreground">
                            Je souhaite réserver des artistes pour mes événements.
                        </p>
                    </div>
                    <Button className="w-full" variant="outline">
                        S'inscrire comme Client
                    </Button>
                </Link>

                {/* Artist Profile */}
                <Link href={register.artist()} className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:border-primary hover:bg-muted/50 hover:shadow-md">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                        <div className="flex gap-1">
                            <Palette className="h-6 w-6" />
                            <Mic className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-heading text-xl font-bold">Je suis Artiste</h3>
                        <p className="text-sm text-muted-foreground">
                            Je veux proposer mes services et partager mon talent.
                        </p>
                    </div>
                    <Button className="w-full" variant="outline">
                        S'inscrire comme Artiste
                    </Button>
                </Link>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                Vous avez déjà un compte ?{' '}
                <Link href={login()} className="font-medium text-primary hover:underline">
                    Se connecter
                </Link>
            </div>
        </AuthLayout>
    );
}
