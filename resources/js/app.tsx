import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { toast, Toaster } from 'sonner';
import { AudioProvider } from '@/contexts/AudioContext';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';
import { syncLocale } from './i18n';
import './echo';
import { requestPermissionAndGetToken, onMessageListener } from './firebase-messaging';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx');
        const importPage = pages[`./pages/${name}.tsx`];
        if (!importPage) {
            throw new Error(`Page not found: ${name}`);
        }
        return importPage().then((m: any) => m.default || m);
    },
    setup({ el, App, props }) {
        syncLocale(props.initialPage.props.locale as string | undefined);

        const root = createRoot(el);

        root.render(
            <StrictMode>
                <AudioProvider>
                    <App {...props} />
                    <Toaster richColors position="bottom-right" />
                </AudioProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Register service worker and FCM token (attempt). This is safe to run on page load;
// it will POST the token to /api/fcm-token using cookie-based auth (Sanctum).
async function registerFCM() {
    if (typeof window === 'undefined') return;

    try {
        // register the service worker for background notifications
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            } catch (e) {
                // ignore SW registration errors
                console.warn('Service worker registration failed', e);
            }
        }

        const token = await requestPermissionAndGetToken();
        if (token) {
            const xsrf = document.cookie
                .split('; ')
                .find((c) => c.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            await fetch('/api/fcm-token', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(xsrf ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrf) } : {}),
                },
                body: JSON.stringify({ token }),
            });
        }

        onMessageListener((payload) => {
            const title = payload?.notification?.title ?? payload?.data?.title ?? 'Notification';
            const body = payload?.notification?.body ?? payload?.data?.body ?? '';
            const actionUrl = payload?.data?.action_url ?? '/notifications';

            toast.info(title, {
                description: body,
                action: {
                    label: 'Voir',
                    onClick: () => { window.location.href = actionUrl; },
                },
            });
        });
    } catch (e) {
        console.warn('FCM registration error', e);
    }
}

registerFCM();
