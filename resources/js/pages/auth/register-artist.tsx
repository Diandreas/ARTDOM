
import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppLocale } from '@/hooks/use-app-locale';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
// Note: Using a placeholder route for now as register_artist might not exist in backend yet
// In a real scenario, this would post to a specific endpoint
import { store } from '@/routes/register';

export default function RegisterArtist() {
    const { t } = useAppLocale();

    return (
        <AuthLayout
            title={t('Artist registration')}
            description={t('Join the community of emotion creators')}
        >
            <Head title={t('Artist registration')} />

            <Form
                {...store.form()} // Temporarily using standard register route, needs backend update
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }: any) => (
                    <div className="grid gap-6">
                        {/* Personal Info */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                {t('Full legal name')}
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autoFocus
                                autoComplete="name"
                                placeholder="John Doe"
                            />
                            {/* @ts-ignore */}
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <input type="hidden" name="role" value="artist" />

                        {/* Artist Info */}
                        <div className="grid gap-2">
                            <Label htmlFor="stage_name">
                                {t('Stage name')}
                            </Label>
                            <Input
                                id="stage_name"
                                name="stage_name"
                                type="text"
                                placeholder="DJ Emotions"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">
                                {t('Main category')}
                            </Label>
                            <Select name="category">
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t('Select a category')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="singer">
                                        {t('Singing')}
                                    </SelectItem>
                                    <SelectItem value="dancer">
                                        {t('Dance')}
                                    </SelectItem>
                                    <SelectItem value="painter">
                                        {t('Painting')}
                                    </SelectItem>
                                    <SelectItem value="musician">
                                        {t('Instrumental music')}
                                    </SelectItem>
                                    <SelectItem value="dj">DJ</SelectItem>
                                    <SelectItem value="animator">
                                        {t('Hosting')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">
                                {t('Short bio (200 characters max)')}
                            </Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                placeholder={t(
                                    'Describe your art in a few words...',
                                )}
                                maxLength={200}
                            />
                        </div>

                        {/* Contact Info */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                {t('Professional email')}
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="contact@artist.com"
                            />
                            {/* @ts-ignore */}
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">{t('Phone')}</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                autoComplete="tel"
                                placeholder="+225 07..."
                            />
                        </div>

                        {/* Security */}
                        <div className="grid gap-2">
                            <Label htmlFor="password">{t('Password')}</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="new-password"
                            />
                            {/* @ts-ignore */}
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                {t('Confirm password')}
                            </Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing
                                ? t('Loading...')
                                : t('Sign up and create my profile')}
                        </Button>

                        <div className="text-center text-sm text-muted-foreground">
                            {t('Already have an account?')}{' '}
                            <Link href={login()} className="font-medium text-primary hover:underline">
                                {t('Log in')}
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
