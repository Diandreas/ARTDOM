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
                'flex items-center gap-0.5 rounded-full border border-border/50 bg-background/50 p-0.5 shadow-sm',
                className,
            )}
        >
            <span className={cn(
                "items-center gap-1 px-1.5 text-xs text-muted-foreground",
                compact ? "hidden sm:flex" : "flex"
            )}>
                <Languages className="h-3 w-3" />
                {!compact && t('Language')}
            </span>

            {(['fr', 'en'] as const).map((value) => (
                <Button
                    key={value}
                    type="button"
                    variant={locale === value ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                        "h-7 rounded-full px-2 text-[10px] font-bold uppercase transition-all",
                        locale === value ? "shadow-inner" : "hover:bg-muted"
                    )}
                    onClick={() => updateLocale(value)}
                >
                    {value}
                </Button>
            ))}
        </div>
    );
}
