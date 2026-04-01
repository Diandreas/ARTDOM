import { usePage } from '@inertiajs/react';
import { enUS, fr } from 'date-fns/locale';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { syncLocale } from '@/i18n';
import type { SharedData } from '@/types';

export function useAppLocale() {
    const { locale } = usePage<SharedData>().props;
    const { t, i18n } = useTranslation();

    useEffect(() => {
        syncLocale(locale);
    }, [locale]);

    return {
        locale,
        t,
        i18n,
        dateLocale: locale === 'en' ? enUS : fr,
        isFrench: locale === 'fr',
        isEnglish: locale === 'en',
    };
}
