import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Camera, User, Mail, Phone, MapPin, Star, Globe, Facebook, Instagram, Youtube, Music, Trash2, Upload } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { FormEvent, useState } from 'react';
import update from '@/actions/App/Http/Controllers/Artist/ProfileController/update';
import uploadMedia from '@/actions/App/Http/Controllers/Artist/ProfileController/uploadMedia';
import deleteMedia from '@/actions/App/Http/Controllers/Artist/ProfileController/deleteMedia';
import uploadAvatar from '@/actions/App/Http/Controllers/Artist/ProfileController/uploadAvatar';
import { ImageCropper } from '@/components/ImageCropper';
import { useRef } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
    profile_photo: string | null;
}

interface Profile {
    id: string;
    stage_name: string;
    bio: string | null;
    categories: string[];
    base_rate: number;
    social_links: Record<string, string>;
    portfolio_urls: string[];
    is_verified: boolean;
    rating: number;
    total_reviews: number;
}

interface EditProfileProps {
    user: User;
    profile: Profile;
    availableCategories: string[];
}

export default function EditProfile({ user, profile, availableCategories }: EditProfileProps) {
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);

    // States for Avatar cropper
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        name: user.name,
        stage_name: profile.stage_name,
        bio: profile.bio || '',
        categories: profile.categories,
        phone: user.phone || '',
        city: user.city || '',
        base_rate: profile.base_rate,
        social_links: {
            facebook: profile.social_links?.facebook || '',
            instagram: profile.social_links?.instagram || '',
            youtube: profile.social_links?.youtube || '',
            tiktok: profile.social_links?.tiktok || '',
            website: profile.social_links?.website || '',
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.submit(update());
    };

    const handleCategoryToggle = (category: string) => {
        const current = form.data.categories;
        if (current.includes(category)) {
            form.setData('categories', current.filter((c) => c !== category));
        } else {
            form.setData('categories', [...current, category]);
        }
    };

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingMedia(true);

        const formData = new FormData();
        formData.append('media', file);
        formData.append('type', file.type.startsWith('video/') ? 'video' : 'photo');

        try {
            // Using native fetch because Inertia form doesn't handle file uploads well with reload
            const response = await fetch(uploadMedia.url(), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: formData,
            });

            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploadingMedia(false);
        }
    };

    // Avatar handlers
    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageToCrop(reader.result?.toString() || '');
                setIsCropperOpen(true);
            });
            reader.readAsDataURL(file);
        }
        // Reset input so the same file could be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAvatarCropComplete = async (croppedBlob: Blob) => {
        setIsUploadingMedia(true);
        const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await fetch(uploadAvatar.url(), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: formData,
            });

            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Avatar upload failed:', error);
        } finally {
            setIsUploadingMedia(false);
        }
    };

    const handleDeleteMedia = (mediaUrl: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
            // Extract the media identifier from URL
            const mediaId = encodeURIComponent(mediaUrl);
            fetch(deleteMedia.url({ media: mediaId }), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            }).then((response) => {
                if (response.ok) {
                    window.location.reload();
                }
            });
        }
    };

    return (
        <MainLayout>
            <Head title="Modifier mon profil" />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading mb-2 text-foreground">Modifier mon profil</h1>
                    <p className="text-muted-foreground">Gérez vos informations professionnelles</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Profile Photo & Stats */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Profile Photo */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative mb-4">
                                            <Avatar className="w-32 h-32 text-4xl">
                                                <AvatarImage src={user.profile_photo || undefined} />
                                                <AvatarFallback>
                                                    {profile.stage_name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="secondary"
                                                className="absolute bottom-0 right-0 rounded-full cursor-pointer hover:bg-secondary/80"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploadingMedia}
                                            >
                                                <Camera className="w-4 h-4" />
                                            </Button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/jpeg,image/png,image/jpg"
                                                onChange={handleAvatarSelect}
                                            />
                                        </div>

                                        <h2 className="text-2xl font-bold mb-1">{profile.stage_name}</h2>
                                        <div className="flex items-center gap-2 mb-4">
                                            {profile.is_verified && (
                                                <Badge variant="default" className="text-xs">
                                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                                    Vérifié
                                                </Badge>
                                            )}
                                        </div>

                                        {profile.rating > 0 && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Star className="w-4 h-4 text-primary fill-primary" />
                                                <span className="font-bold">{profile.rating.toFixed(1)}</span>
                                                <span className="text-muted-foreground">
                                                    ({profile.total_reviews} avis)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Portfolio Gallery */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Portfolio</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        {profile.portfolio_urls.map((url, index) => (
                                            <div key={index} className="relative aspect-square group">
                                                <img
                                                    src={url}
                                                    alt={`Portfolio ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="destructive"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleDeleteMedia(url)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <Label htmlFor="portfolio-upload" className="cursor-pointer">
                                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                                                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    {isUploadingMedia ? 'Upload en cours...' : 'Ajouter des photos/vidéos'}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Max 10MB - JPEG, PNG, MP4, MOV
                                                </p>
                                            </div>
                                        </Label>
                                        <input
                                            id="portfolio-upload"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,video/mp4,video/quicktime"
                                            className="hidden"
                                            onChange={handleMediaUpload}
                                            disabled={isUploadingMedia}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informations de base</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Nom complet</Label>
                                            <Input
                                                id="name"
                                                value={form.data.name}
                                                onChange={(e) => form.setData('name', e.target.value)}
                                            />
                                            {form.errors.name && (
                                                <p className="text-sm text-destructive mt-1">{form.errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="stage_name">Nom de scène</Label>
                                            <Input
                                                id="stage_name"
                                                value={form.data.stage_name}
                                                onChange={(e) => form.setData('stage_name', e.target.value)}
                                            />
                                            {form.errors.stage_name && (
                                                <p className="text-sm text-destructive mt-1">{form.errors.stage_name}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={user.email} disabled />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            L'email ne peut pas être modifié ici
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={form.data.phone}
                                                onChange={(e) => form.setData('phone', e.target.value)}
                                            />
                                            {form.errors.phone && (
                                                <p className="text-sm text-destructive mt-1">{form.errors.phone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="city">Ville</Label>
                                            <Input
                                                id="city"
                                                value={form.data.city}
                                                onChange={(e) => form.setData('city', e.target.value)}
                                            />
                                            {form.errors.city && (
                                                <p className="text-sm text-destructive mt-1">{form.errors.city}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="bio">Biographie</Label>
                                        <Textarea
                                            id="bio"
                                            value={form.data.bio}
                                            onChange={(e) => form.setData('bio', e.target.value)}
                                            rows={5}
                                            placeholder="Parlez-nous de vous, votre parcours, vos spécialités..."
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {form.data.bio.length}/1000 caractères
                                        </p>
                                        {form.errors.bio && (
                                            <p className="text-sm text-destructive mt-1">{form.errors.bio}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="base_rate">Tarif de base (FCFA/prestation)</Label>
                                        <Input
                                            id="base_rate"
                                            type="number"
                                            value={form.data.base_rate}
                                            onChange={(e) => form.setData('base_rate', parseFloat(e.target.value))}
                                            min="0"
                                        />
                                        {form.errors.base_rate && (
                                            <p className="text-sm text-destructive mt-1">{form.errors.base_rate}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Categories */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Catégories artistiques</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {availableCategories.map((category) => (
                                            <div key={category} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`category-${category}`}
                                                    checked={form.data.categories.includes(category)}
                                                    onCheckedChange={() => handleCategoryToggle(category)}
                                                />
                                                <Label
                                                    htmlFor={`category-${category}`}
                                                    className="text-sm font-normal cursor-pointer"
                                                >
                                                    {category}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    {form.errors.categories && (
                                        <p className="text-sm text-destructive mt-2">{form.errors.categories}</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Social Links */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Réseaux sociaux</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="facebook" className="flex items-center gap-2">
                                            <Facebook className="w-4 h-4" />
                                            Facebook
                                        </Label>
                                        <Input
                                            id="facebook"
                                            type="url"
                                            placeholder="https://facebook.com/username"
                                            value={form.data.social_links.facebook}
                                            onChange={(e) =>
                                                form.setData('social_links', {
                                                    ...form.data.social_links,
                                                    facebook: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="instagram" className="flex items-center gap-2">
                                            <Instagram className="w-4 h-4" />
                                            Instagram
                                        </Label>
                                        <Input
                                            id="instagram"
                                            type="url"
                                            placeholder="https://instagram.com/username"
                                            value={form.data.social_links.instagram}
                                            onChange={(e) =>
                                                form.setData('social_links', {
                                                    ...form.data.social_links,
                                                    instagram: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="youtube" className="flex items-center gap-2">
                                            <Youtube className="w-4 h-4" />
                                            YouTube
                                        </Label>
                                        <Input
                                            id="youtube"
                                            type="url"
                                            placeholder="https://youtube.com/@username"
                                            value={form.data.social_links.youtube}
                                            onChange={(e) =>
                                                form.setData('social_links', {
                                                    ...form.data.social_links,
                                                    youtube: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="tiktok" className="flex items-center gap-2">
                                            <Music className="w-4 h-4" />
                                            TikTok
                                        </Label>
                                        <Input
                                            id="tiktok"
                                            type="url"
                                            placeholder="https://tiktok.com/@username"
                                            value={form.data.social_links.tiktok}
                                            onChange={(e) =>
                                                form.setData('social_links', {
                                                    ...form.data.social_links,
                                                    tiktok: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="website" className="flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            Site web
                                        </Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            placeholder="https://votresite.com"
                                            value={form.data.social_links.website}
                                            onChange={(e) =>
                                                form.setData('social_links', {
                                                    ...form.data.social_links,
                                                    website: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-4">
                                <Button type="submit" disabled={form.processing} className="min-w-[200px]">
                                    {form.processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <ImageCropper
                open={isCropperOpen}
                onOpenChange={setIsCropperOpen}
                imageSrc={imageToCrop}
                onCropComplete={handleAvatarCropComplete}
                aspectRatio={1}
            />
        </MainLayout>
    );
}
