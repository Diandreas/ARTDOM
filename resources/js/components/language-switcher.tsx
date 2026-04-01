import { router } from '@inertiajs/react';
import { Languages } from 'lucide-react';
import { useAppLocale } from '@/hooks/use-app-locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
    className?: string;
    compact?: boolean;
};

export default function LanguageSwitcher({
    className,
    compact = false,
}: LanguageSwitcherProps) {
    const { locale, t } = useAppLocale();

    const updateLocale = (nextLocale: 'fr' | 'en') => {
        if (nextLocale === locale) {
            return;
        }

        router.put(
            '/language',
            { locale: nextLocale },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <div
            className={cn(
                'flex items-center gap-1 rounded-full border border-border/70 bg-background/80 p-1',
                className,
            )}
        >
            <span className="flex items-center gap-1 px-2 text-xs text-muted-foreground">
                <Languages className="h-3.5 w-3.5" />
                {!compact && t('Language')}
            </span>

            {(['fr', 'en'] as const).map((value) => (
                <Button
                    key={value}
                    type="button"
                    variant={locale === value ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-full px-3 text-xs uppercase"
                    onClick={() => updateLocale(value)}
                >
                    {value}
                </Button>
            ))}
        </div>
    );
}
