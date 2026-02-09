import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {

    const { t } = useTranslation();
    const [currentLang, setCurrentLang] = useState(i18n.language);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setCurrentLang(lang);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div style={{ padding: "20px" }}>
      <h1>{t("welcome")}</h1>

      <button style={{ marginRight: "10px" }}>
        {t("logout")}
      </button>

      <hr />

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => changeLanguage("fr")}
          disabled={currentLang === "fr"}
          style={{ marginRight: "10px" }}
        >
          🇫🇷 Français
        </button>

        <button
          onClick={() => changeLanguage("en")}
          disabled={currentLang === "en"}
        >
          🇬🇧 English
        </button>
      </div>
    </div>
        </AppLayout>
    );
}
