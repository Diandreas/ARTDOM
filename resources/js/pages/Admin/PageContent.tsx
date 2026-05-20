import { Head, useForm } from '@inertiajs/react';
import { Save, Image as ImageIcon, Eye, Code2, Globe, FileText } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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

function PreviewPane({ html, title }: { html: string; title: string }) {
    return (
        <div className="rounded-xl border border-border bg-background p-6 min-h-40">
            {title && <h1 className="mb-4 text-2xl font-bold text-foreground">{title}</h1>}
            {html ? (
                <div
                    className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-muted-foreground prose-li:text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            ) : (
                <p className="text-sm text-muted-foreground italic">Aucun contenu…</p>
            )}
        </div>
    );
}

export default function PageContent({ page }: Props) {
    const { t } = useAppLocale();
    const imageRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(page.image_url);
    const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
    const [showPreview, setShowPreview] = useState(false);

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

    const pageLabel = page.slug === 'impact-social'
        ? { fr: 'Impact Social', en: 'Social Impact' }
        : { fr: 'À Propos', en: 'About' };
    const pageTitle = pageLabel.fr;

    const publicUrl = page.slug === 'impact-social' ? '/impact-social' : '/a-propos';

    return (
        <AdminLayout title={pageTitle} subtitle={t('Edit page content')}>
            <Head title={pageTitle} />

            <form onSubmit={handleSubmit}>
                {/* Top bar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">{pageTitle}</h2>
                            <p className="text-xs text-muted-foreground">{publicUrl}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            {t('Published')}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview((v) => !v)}
                            className="gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            {showPreview ? t('Hide preview') : t('Preview')}
                        </Button>
                        <Button type="submit" disabled={form.processing} className="gap-2">
                            <Save className="h-4 w-4" />
                            {form.processing ? t('Saving...') : t('Save changes')}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main editing panel */}
                    <div className="space-y-6 lg:col-span-2">

                        {/* Language tabs */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">{t('Page content')}</CardTitle>
                                    <div className="flex rounded-lg border border-border overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('fr')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                                                activeTab === 'fr'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            <Globe className="h-3 w-3" />
                                            Français
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('en')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                                                activeTab === 'en'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            <Globe className="h-3 w-3" />
                                            English
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {activeTab === 'fr' ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="title_fr">{t('Title (French)')}</Label>
                                            <Input
                                                id="title_fr"
                                                value={form.data.title_fr}
                                                onChange={(e) => form.setData('title_fr', e.target.value)}
                                                placeholder="Titre de la page…"
                                            />
                                            {form.errors.title_fr && <p className="text-xs text-destructive">{form.errors.title_fr}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="content_fr">{t('Content (French)')}</Label>
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Code2 className="h-3 w-3" />
                                                    HTML
                                                </span>
                                            </div>
                                            <Textarea
                                                id="content_fr"
                                                rows={16}
                                                value={form.data.content_fr}
                                                onChange={(e) => form.setData('content_fr', e.target.value)}
                                                className="font-mono text-xs leading-relaxed"
                                                placeholder="<h2>Titre section</h2><p>Votre contenu ici…</p>"
                                            />
                                            {form.errors.content_fr && <p className="text-xs text-destructive">{form.errors.content_fr}</p>}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="title_en">{t('Title (English)')}</Label>
                                            <Input
                                                id="title_en"
                                                value={form.data.title_en}
                                                onChange={(e) => form.setData('title_en', e.target.value)}
                                                placeholder="Page title…"
                                            />
                                            {form.errors.title_en && <p className="text-xs text-destructive">{form.errors.title_en}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="content_en">{t('Content (English)')}</Label>
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Code2 className="h-3 w-3" />
                                                    HTML
                                                </span>
                                            </div>
                                            <Textarea
                                                id="content_en"
                                                rows={16}
                                                value={form.data.content_en}
                                                onChange={(e) => form.setData('content_en', e.target.value)}
                                                className="font-mono text-xs leading-relaxed"
                                                placeholder="<h2>Section title</h2><p>Your content here…</p>"
                                            />
                                            {form.errors.content_en && <p className="text-xs text-destructive">{form.errors.content_en}</p>}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Live preview */}
                        {showPreview && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                        {t('Preview')} — {activeTab === 'fr' ? 'Français' : 'English'}
                                    </CardTitle>
                                    <CardDescription>{t('Rendered HTML output')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PreviewPane
                                        html={activeTab === 'fr' ? form.data.content_fr : form.data.content_en}
                                        title={activeTab === 'fr' ? form.data.title_fr : form.data.title_en}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Hero image */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">{t('Hero image')}</CardTitle>
                                <CardDescription>{t('Optional — shown at the top of the page')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {imagePreview ? (
                                    <div className="group relative overflow-hidden rounded-xl">
                                        <img
                                            src={imagePreview}
                                            alt={t('Preview')}
                                            className="h-40 w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => { setImagePreview(null); form.setData('image', null); }}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 text-white text-xs font-medium"
                                        >
                                            {t('Remove')}
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                                        onClick={() => imageRef.current?.click()}
                                    >
                                        <ImageIcon className="h-8 w-8" />
                                        <span className="text-xs">{t('Click to upload')}</span>
                                        <span className="text-xs opacity-60">JPG, PNG, WebP · max 5MB</span>
                                    </div>
                                )}
                                <Input
                                    ref={imageRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {imagePreview && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => imageRef.current?.click()}
                                    >
                                        {t('Change image')}
                                    </Button>
                                )}
                                {form.errors.image && <p className="text-xs text-destructive">{form.errors.image}</p>}
                            </CardContent>
                        </Card>

                        {/* Info box */}
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="pt-5 space-y-3">
                                <p className="text-xs font-semibold text-primary uppercase tracking-wide">{t('Tips')}</p>
                                <ul className="space-y-2 text-xs text-muted-foreground">
                                    <li>• Utilisez <code className="rounded bg-muted px-1">&lt;h2&gt;</code> pour les titres de section</li>
                                    <li>• <code className="rounded bg-muted px-1">&lt;p&gt;</code> pour les paragraphes</li>
                                    <li>• <code className="rounded bg-muted px-1">&lt;ul&gt;&lt;li&gt;</code> pour les listes</li>
                                    <li>• <code className="rounded bg-muted px-1">&lt;strong&gt;</code> pour le texte en gras</li>
                                    <li>• Activez la prévisualisation pour vérifier le rendu</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Public link */}
                        <Card>
                            <CardContent className="pt-5">
                                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('Public page')}</p>
                                <a
                                    href={publicUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-primary hover:bg-muted transition-colors"
                                >
                                    <Globe className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{publicUrl}</span>
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Bottom save bar */}
                <div className="mt-6 flex justify-end border-t border-border pt-6">
                    <Button type="submit" disabled={form.processing} size="lg" className="gap-2 min-w-36">
                        <Save className="h-4 w-4" />
                        {form.processing ? t('Saving...') : t('Save changes')}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
