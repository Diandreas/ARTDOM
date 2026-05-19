import { Head, useForm } from '@inertiajs/react';
import { Save, Image as ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppLocale } from '@/hooks/use-app-locale';
import AdminLayout from '@/layouts/admin-layout';

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

export default function PageContent({ page }: Props) {
    const { t } = useAppLocale();
    const imageRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(page.image_url);

    const form = useForm({
        title_fr: page.title_fr,
        title_en: page.title_en,
        content_fr: page.content_fr,
        content_en: page.content_en,
        image: null as File | null,
        _method: 'put',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/admin/pages/${page.slug}`, { forceFormData: true });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const pageTitle = page.slug === 'impact-social' ? t('Impact Social') : t('À Propos');

    return (
        <AdminLayout title={pageTitle} subtitle={t('Edit page content')}>
            <Head title={pageTitle} />

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('Page titles')}</CardTitle>
                        <CardDescription>{t('Title displayed in French and English')}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title_fr">{t('Title (French)')}</Label>
                            <Input
                                id="title_fr"
                                value={form.data.title_fr}
                                onChange={(e) => form.setData('title_fr', e.target.value)}
                            />
                            {form.errors.title_fr && <p className="text-sm text-destructive">{form.errors.title_fr}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title_en">{t('Title (English)')}</Label>
                            <Input
                                id="title_en"
                                value={form.data.title_en}
                                onChange={(e) => form.setData('title_en', e.target.value)}
                            />
                            {form.errors.title_en && <p className="text-sm text-destructive">{form.errors.title_en}</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('Content')}</CardTitle>
                        <CardDescription>{t('HTML content displayed on the page (supports HTML tags)')}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="content_fr">{t('Content (French)')}</Label>
                            <Textarea
                                id="content_fr"
                                rows={14}
                                value={form.data.content_fr}
                                onChange={(e) => form.setData('content_fr', e.target.value)}
                                className="font-mono text-xs"
                            />
                            {form.errors.content_fr && <p className="text-sm text-destructive">{form.errors.content_fr}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content_en">{t('Content (English)')}</Label>
                            <Textarea
                                id="content_en"
                                rows={14}
                                value={form.data.content_en}
                                onChange={(e) => form.setData('content_en', e.target.value)}
                                className="font-mono text-xs"
                            />
                            {form.errors.content_en && <p className="text-sm text-destructive">{form.errors.content_en}</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('Page image')}</CardTitle>
                        <CardDescription>{t('Optional hero image for the page')}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-6">
                        {imagePreview ? (
                            <img src={imagePreview} alt={t('Preview')} className="h-32 w-48 rounded-md object-cover" />
                        ) : (
                            <div className="flex h-32 w-48 items-center justify-center rounded-md bg-muted">
                                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            </div>
                        )}
                        <div className="flex-1 space-y-2">
                            <Input
                                ref={imageRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="cursor-pointer"
                            />
                            {form.errors.image && <p className="text-sm text-destructive">{form.errors.image}</p>}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        <Save className="mr-2 h-4 w-4" />
                        {form.processing ? t('Saving...') : t('Save changes')}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
