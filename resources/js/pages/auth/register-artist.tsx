
import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
// Note: Using a placeholder route for now as register_artist might not exist in backend yet
// In a real scenario, this would post to a specific endpoint
import { store } from '@/routes/register';

export default function RegisterArtist() {
    return (
        <AuthLayout
            title="Inscription Artiste"
            description="Rejoignez la communauté des créateurs d'émotions"
        >
            <Head title="Inscription Artiste" />

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
                            <Label htmlFor="name">Nom complet (État Civil)</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autoFocus
                                autoComplete="name"
                                placeholder="Jean Dupont"
                            />
                            {/* @ts-ignore */}
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        {/* Artist Info */}
                        <div className="grid gap-2">
                            <Label htmlFor="stage_name">Nom de scène</Label>
                            <Input
                                id="stage_name"
                                name="stage_name"
                                type="text"
                                placeholder="DJ Emotions"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Catégorie principale</Label>
                            <Select name="category">
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="singer">Chant</SelectItem>
                                    <SelectItem value="dancer">Danse</SelectItem>
                                    <SelectItem value="painter">Peinture</SelectItem>
                                    <SelectItem value="musician">Musique instrumentale</SelectItem>
                                    <SelectItem value="dj">DJ</SelectItem>
                                    <SelectItem value="animator">Animation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio courte (200 caractères max)</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                placeholder="Décrivez votre art en quelques mots..."
                                maxLength={200}
                            />
                        </div>

                        {/* Contact Info */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email professionnel</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="contact@artiste.com"
                            />
                            {/* @ts-ignore */}
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Téléphone</Label>
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
                            <Label htmlFor="password">Mot de passe</Label>
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
                            <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? 'Chargement...' : "S'inscrire et créer mon profil"}
                        </Button>

                        <div className="text-center text-sm text-muted-foreground">
                            Vous avez déjà un compte ?{' '}
                            <Link href={login()} className="font-medium text-primary hover:underline">
                                Se connecter
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
