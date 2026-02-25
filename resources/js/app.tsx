import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { AudioProvider } from '@/contexts/AudioContext';
import MiniPlayer from '@/components/Player/MiniPlayer';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';
import "./i18n";
import './echo';

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
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <AudioProvider>
                    <App {...props} />
                    <MiniPlayer />
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
