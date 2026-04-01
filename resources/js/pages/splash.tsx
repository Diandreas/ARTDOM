
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useAppLocale } from '@/hooks/use-app-locale';
import { onboarding } from '@/routes/index';

export default function Splash() {
    const { t } = useAppLocale();

    useEffect(() => {
        const timer = setTimeout(() => {
            // Check if user is authenticated or has seen onboarding (mock logic)
            // For now, redirect to Onboarding
            router.visit(onboarding.url());
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
            <Head title={t('Welcome')} />

            <div className="flex flex-col items-center animate-pulse">
                {/* Logo Placeholder */}
                <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                    <span className="text-primary-foreground font-bold text-4xl">A</span>
                </div>

                <h1 className="text-4xl font-heading font-bold text-primary tracking-tight mb-2">
                    ARTEMO
                </h1>

                <p className="text-lg text-muted-foreground font-medium italic">
                    "{t('Artists of emotion, messengers of hearts')}"
                </p>
            </div>
        </div>
    );
}
