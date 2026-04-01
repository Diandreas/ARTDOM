import { Link, Head } from '@inertiajs/react';
import { User, Palette, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppLocale } from '@/hooks/use-app-locale';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import register from '@/routes/register';

export default function RegisterSelection() {
    const { t } = useAppLocale();

    return (
        <AuthLayout
            title={t('Welcome to ARTEMO')}
            description={t('Choose your profile to begin the adventure')}
        >
            <Head title={t('Profile selection')} />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Client Profile */}
                <Link
                    href={register.store.url()}
                    className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:border-primary hover:bg-muted/50 hover:shadow-md"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <User className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-heading text-xl font-bold">
                            {t('I am a Client')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {t('I want to book artists for my events.')}
                        </p>
                    </div>
                    <Button className="w-full" variant="outline">
                        {t('Sign up as Client')}
                    </Button>
                </Link>

                {/* Artist Profile */}
                <Link
                    href={register.artist.url()}
                    className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:border-primary hover:bg-muted/50 hover:shadow-md"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                        <div className="flex gap-1">
                            <Palette className="h-6 w-6" />
                            <Mic className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-heading text-xl font-bold">
                            {t('I am an Artist')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {t(
                                'I want to offer my services and share my talent.',
                            )}
                        </p>
                    </div>
                    <Button className="w-full" variant="outline">
                        {t('Sign up as Artist')}
                    </Button>
                </Link>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                {t('Already have an account?')}{' '}
                <Link
                    href={login()}
                    className="font-medium text-primary hover:underline"
                >
                    {t('Log in')}
                </Link>
            </div>
        </AuthLayout>
    );
}
