import { Head } from '@inertiajs/react';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';

interface PageData {
    id: number;
    slug: string;
    title_fr: string;
    title_en: string;
    content_fr: string;
    content_en: string;
    image_url: string | null;
}

interface Props {
    page: PageData;
}

export default function ImpactSocial({ page }: Props) {
    const { locale } = useAppLocale();
    const title = locale === 'fr' ? page.title_fr : page.title_en;
    const content = locale === 'fr' ? page.content_fr : page.content_en;

    return (
        <MainLayout>
            <Head title={title} />

            {page.image_url && (
                <div className="relative h-72 w-full overflow-hidden">
                    <img src={page.image_url} alt={title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <h1 className="text-4xl font-bold font-heading text-white">{title}</h1>
                    </div>
                </div>
            )}

            <div className="container px-4 md:px-6 py-12 pb-24">
                {!page.image_url && (
                    <h1 className="text-4xl font-bold font-heading mb-8">{title}</h1>
                )}

                <article
                    className="prose prose-lg dark:prose-invert max-w-3xl mx-auto"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </MainLayout>
    );
}
