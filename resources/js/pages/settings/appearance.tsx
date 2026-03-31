import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import LanguageSwitcher from '@/components/language-switcher';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';
import SettingsLayout from '@/layouts/settings/layout';

export default function Appearance() {
    const { t } = useAppLocale();

    return (
        <MainLayout>
            <Head title={t('Appearance settings')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('Appearance settings')}
                        description={t(
                            "Update your account's appearance settings",
                        )}
                    />
                    <AppearanceTabs />
                    <div className="space-y-3">
                        <Heading
                            variant="small"
                            title={t('Language')}
                            description={t('Choose language')}
                        />
                        <LanguageSwitcher />
                    </div>
                </div>
            </SettingsLayout>
        </MainLayout>
    );
}
