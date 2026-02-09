import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { logout } from './routes';

i18n.use(initReactI18next).init({
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
        escapeValue: false,
    },
    resources: {
        fr: {
            translation: {
                welcome: 'Bienvenue',
                login: 'Connexion',
                logout: 'Déconnexion'
            },
        },
        en: {
            translation: {
                welcome: 'Welcome',
                login: 'Login',
                logout: 'Logout'
            },
        },
    },
});

export default i18n;
