export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    locale: 'fr' | 'en';
    availableLocales: Array<'fr' | 'en'>;
    [key: string]: unknown;
};
