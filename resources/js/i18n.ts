import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

type TranslationModule = {
    default: Record<string, string>;
};

const modules = import.meta.glob('../../lang/*.json', {
    eager: true,
}) as Record<string, TranslationModule>;

const resources = Object.entries(modules).reduce<
    Record<string, { translation: Record<string, string> }>
>((carry, [path, module]) => {
    const locale = path.match(/\/([a-z]{2})\.json$/)?.[1];

    if (locale) {
        carry[locale] = {
            translation: module.default,
        };
    }

    return carry;
}, {});

if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        lng: 'fr',
        fallbackLng: 'fr',
        interpolation: {
            escapeValue: false,
        },
        resources,
    });
}

export function syncLocale(locale?: string): void {
    if (locale && i18n.language !== locale) {
        void i18n.changeLanguage(locale);
    }
}

export default i18n;
