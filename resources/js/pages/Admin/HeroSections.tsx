import { Head, router, useForm } from '@inertiajs/react';
import {
    Edit2,
    Eye,
    EyeOff,
    GripVertical,
    Image as ImageIcon,
    Music2,
    Plus,
    Trash2,
    Upload,
    User as UserIcon,
    Video,
    Youtube,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/layouts/admin-layout';
import { useAppLocale } from '@/hooks/use-app-locale';

interface Artist {
    id: string;
    name: string;
}

interface HeroSection {
    id: number;
    media_type: 'image' | 'video_upload' | 'video_youtube' | 'artist';
    title: string | null;
    title_en: string | null;
    subtitle: string | null;
    subtitle_en: string | null;
    image_url: string | null;
    image_url_en: string | null;
    video_url: string | null;
    youtube_url: string | null;
    link_url: string | null;
    link_label: string | null;
    link_label_en: string | null;
    artist_id: string | null;
    order: number;
    is_active: boolean;
    artist?: Artist | null;
}

interface Props {
    sections: HeroSection[];
    artists: Artist[];
}

const MEDIA_TYPES = [
    { value: 'image', label: 'Image', icon: ImageIcon },
    { value: 'video_upload', label: 'Vidéo uploadée', icon: Video },
    { value: 'video_youtube', label: 'YouTube', icon: Youtube },
    { value: 'artist', label: 'Profil artiste', icon: UserIcon },
];

function SectionForm({
    section,
    artists,
    onClose,
}: {
    section?: HeroSection;
    artists: Artist[];
    onClose: () => void;
}) {
    const { t } = useAppLocale();
    const imageRef = useRef<HTMLInputElement>(null);
    const imageEnRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        media_type: section?.media_type ?? 'image',
        title: section?.title ?? '',
        title_en: section?.title_en ?? '',
        subtitle: section?.subtitle ?? '',
        subtitle_en: section?.subtitle_en ?? '',
        image: null as File | null,
        image_en: null as File | null,
        image_url: section?.image_url ?? '',
        image_url_en: section?.image_url_en ?? '',
        video: null as File | null,
        video_url: section?.video_url ?? '',
        youtube_url: section?.youtube_url ?? '',
        link_url: section?.link_url ?? '',
        link_label: section?.link_label ?? '',
        link_label_en: section?.link_label_en ?? '',
        artist_id: section?.artist_id ?? '',
        is_active: section?.is_active ?? true,
        _method: section ? 'put' : 'post',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = section ? `/admin/hero-sections/${section.id}` : '/admin/hero-sections';
        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: onClose,
        });
    };

    const mediaType = form.data.media_type;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Media type selector */}
            <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('Media type')}
                </Label>
                <RadioGroup
                    value={mediaType}
                    onValueChange={(v) => form.setData('media_type', v as typeof mediaType)}
                    className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                    {MEDIA_TYPES.map(({ value, label, icon: Icon }) => (
                        <div key={value}>
                            <RadioGroupItem value={value} id={`mt-${value}`} className="sr-only" />
                            <Label
                                htmlFor={`mt-${value}`}
                                className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 p-3 transition-all hover:bg-accent ${
                                    mediaType === value ? 'border-primary bg-primary/5' : 'border-muted'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-[10px] font-bold uppercase">{label}</span>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Artist picker */}
            {mediaType === 'artist' && (
                <div className="space-y-1">
                    <Label htmlFor="artist_id" className="text-xs">
                        {t('Artist')} *
                    </Label>
                    <Select
                        value={form.data.artist_id || ''}
                        onValueChange={(v) => form.setData('artist_id', v)}
                    >
                        <SelectTrigger id="artist_id" className="h-9 text-sm">
                            <SelectValue placeholder={t('Select an artist')} />
                        </SelectTrigger>
                        <SelectContent>
                            {artists.map((a) => (
                                <SelectItem key={a.id} value={a.id}>
                                    {a.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Image fields */}
            {(mediaType === 'image' || mediaType === 'artist') && (
                <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2">
                    {[
                        { lang: 'FR', ref: imageRef, field: 'image' as const, urlField: 'image_url' as const, preview: form.data.image_url },
                        { lang: 'EN', ref: imageEnRef, field: 'image_en' as const, urlField: 'image_url_en' as const, preview: form.data.image_url_en },
                    ].map(({ lang, ref, field, urlField, preview }) => (
                        <div key={lang} className="space-y-2">
                            <Label className="text-xs">
                                {t('Background image')} ({lang})
                                {lang === 'EN' && <span className="ml-1 text-muted-foreground">({t('Optional')})</span>}
                            </Label>
                            {(preview || form.data[field]) && (
                                <div className="relative aspect-video w-full overflow-hidden rounded border">
                                    <img
                                        src={form.data[field] ? URL.createObjectURL(form.data[field]!) : preview || ''}
                                        className="h-full w-full object-cover"
                                        alt="Preview"
                                    />
                                </div>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 w-full gap-2 text-xs"
                                onClick={() => ref.current?.click()}
                            >
                                <Upload className="h-3.5 w-3.5" /> {t('Upload')} ({lang})
                            </Button>
                            <input
                                type="file"
                                ref={ref}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => form.setData(field, e.target.files?.[0] || null)}
                            />
                            <Input
                                placeholder={t('Or image URL...')}
                                value={form.data[urlField]}
                                onChange={(e) => form.setData(urlField, e.target.value)}
                                className="h-8 text-xs"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Video upload */}
            {mediaType === 'video_upload' && (
                <div className="space-y-2 border-t pt-4">
                    <Label className="text-xs">{t('Video file')} (MP4 / WebM — max 100 Mo)</Label>
                    {form.data.video_url && !form.data.video && (
                        <p className="truncate rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                            {form.data.video_url}
                        </p>
                    )}
                    {form.data.video && (
                        <p className="truncate rounded bg-muted px-2 py-1 text-xs text-green-600">
                            {form.data.video.name}
                        </p>
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-full gap-2 text-xs"
                        onClick={() => videoRef.current?.click()}
                    >
                        <Video className="h-3.5 w-3.5" /> {t('Upload video')}
                    </Button>
                    <input
                        type="file"
                        ref={videoRef}
                        className="hidden"
                        accept="video/mp4,video/webm"
                        onChange={(e) => form.setData('video', e.target.files?.[0] || null)}
                    />
                    <p className="text-[10px] text-muted-foreground">
                        {t('The video will play in a loop without sound.')}
                    </p>
                </div>
            )}

            {/* YouTube URL */}
            {mediaType === 'video_youtube' && (
                <div className="space-y-1 border-t pt-4">
                    <Label htmlFor="youtube_url" className="text-xs">
                        URL YouTube
                    </Label>
                    <Input
                        id="youtube_url"
                        className="h-9 text-sm"
                        value={form.data.youtube_url}
                        onChange={(e) => form.setData('youtube_url', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-[10px] text-muted-foreground">
                        {t('Accepts youtube.com/watch and youtu.be links.')}
                    </p>
                </div>
            )}

            {/* Text content */}
            <div className="grid grid-cols-1 gap-3 border-t pt-4 md:grid-cols-2">
                {[
                    { id: 'title', label: `${t('Title')} (FR)`, field: 'title' as const },
                    { id: 'title_en', label: `${t('Title')} (EN)`, field: 'title_en' as const },
                    { id: 'subtitle', label: `${t('Subtitle')} (FR)`, field: 'subtitle' as const },
                    { id: 'subtitle_en', label: `${t('Subtitle')} (EN)`, field: 'subtitle_en' as const },
                    { id: 'link_url', label: t('Button URL'), field: 'link_url' as const },
                    { id: 'link_label', label: `${t('Button text')} (FR)`, field: 'link_label' as const },
                    { id: 'link_label_en', label: `${t('Button text')} (EN)`, field: 'link_label_en' as const },
                ].map(({ id, label, field }) => (
                    <div key={id} className="space-y-1">
                        <Label htmlFor={id} className="text-xs">
                            {label}
                        </Label>
                        <Input
                            id={id}
                            className="h-9 text-sm"
                            value={form.data[field] as string}
                            onChange={(e) => form.setData(field, e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                    <Switch
                        id="is_active"
                        checked={form.data.is_active}
                        onCheckedChange={(v) => form.setData('is_active', v)}
                    />
                    <Label htmlFor="is_active" className="text-xs">
                        {t('Active')}
                    </Label>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={form.processing}>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" size="sm" disabled={form.processing}>
                        {form.processing ? t('Saving...') : section ? t('Update') : t('Add')}
                    </Button>
                </div>
            </div>
        </form>
    );
}

const MEDIA_TYPE_ICON: Record<string, React.ElementType> = {
    image: ImageIcon,
    video_upload: Video,
    video_youtube: Youtube,
    artist: UserIcon,
};

export default function HeroSections({ sections, artists }: Props) {
    const { t } = useAppLocale();
    const [showForm, setShowForm] = useState(false);
    const [editingSection, setEditingSection] = useState<HeroSection | null>(null);

    const handleDelete = (section: HeroSection) => {
        if (confirm(`${t('Delete this section')} "${section.title || section.artist?.name || '#' + section.id}" ?`)) {
            router.delete(`/admin/hero-sections/${section.id}`, { preserveScroll: true });
        }
    };

    const handleToggle = (section: HeroSection) => {
        router.patch(`/admin/hero-sections/${section.id}/toggle`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout
            title={t('Hero Sections')}
            subtitle={t('Manage the hero carousel sections displayed horizontally on the homepage')}
        >
            <Head title={`Admin — ${t('Hero Sections')}`} />

            <div className="space-y-4">
                <div className="rounded-lg border border-primary/10 bg-primary/5 p-3">
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                        <strong className="text-primary">{t('How it works')}:</strong>{' '}
                        {t('These sections scroll horizontally in the hero carousel. Each can contain an image, an uploaded video, a YouTube embed, or highlight an artist profile.')}
                    </p>
                </div>

                {(showForm || editingSection) && (
                    <Card className="border-primary/20">
                        <CardHeader className="px-4 py-3">
                            <CardTitle className="text-base">
                                {editingSection ? t('Edit section') : t('New hero section')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <SectionForm
                                section={editingSection ?? undefined}
                                artists={artists}
                                onClose={() => {
                                    setShowForm(false);
                                    setEditingSection(null);
                                }}
                            />
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
                        <CardTitle className="text-base font-semibold">
                            {t('Sections')} ({sections.length})
                        </CardTitle>
                        {!showForm && !editingSection && (
                            <Button onClick={() => setShowForm(true)} size="sm" className="h-8 gap-1.5">
                                <Plus className="h-3.5 w-3.5" />
                                {t('Add section')}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4">
                        {sections.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Music2 className="mb-3 h-10 w-10 text-muted-foreground/20" />
                                <p className="text-sm font-medium text-muted-foreground">{t('No hero sections yet.')}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{t('Add your first section to customize the homepage hero carousel.')}</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {sections.map((section) => {
                                    const Icon = MEDIA_TYPE_ICON[section.media_type] ?? ImageIcon;
                                    const preview = section.image_url || section.artist?.name;
                                    return (
                                        <div
                                            key={section.id}
                                            className="flex items-center gap-3 rounded-lg border bg-card p-2 transition-colors hover:bg-muted/30"
                                        >
                                            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />

                                            <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded bg-muted">
                                                {section.image_url ? (
                                                    <img
                                                        src={section.image_url}
                                                        alt={section.title || ''}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/artemo-logo.png';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <p className="truncate text-sm font-semibold leading-none">
                                                        {section.title || section.artist?.name || `Section #${section.id}`}
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className="h-4 px-1 text-[9px] capitalize"
                                                    >
                                                        <Icon className="mr-0.5 h-2.5 w-2.5" />
                                                        {section.media_type.replace('_', ' ')}
                                                    </Badge>
                                                    {section.is_active ? (
                                                        <Badge variant="secondary" className="h-4 border-green-100 bg-green-50 px-1 text-[9px] text-green-700">
                                                            {t('Active')}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="h-4 px-1 text-[9px]">
                                                            {t('Inactive')}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="mt-1 truncate text-[10px] text-muted-foreground">
                                                    {section.subtitle || (section.youtube_url ? 'YouTube' : section.video_url ? t('Uploaded video') : preview || '—')}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleToggle(section)}
                                                >
                                                    {section.is_active ? (
                                                        <Eye className="h-3.5 w-3.5 text-primary" />
                                                    ) : (
                                                        <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setEditingSection(section)}
                                                >
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => handleDelete(section)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
