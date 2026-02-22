import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function AdminLogin() {
    return (
        <AuthLayout
            title="Connexion administrateur"
            description="Acces reserve aux administrateurs ARTDOM"
        >
            <Head title="Connexion admin" />

            <Form
                action="/admin/login"
                method="post"
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email admin</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="admin@artdom.ci"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Mot de passe"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox id="remember" name="remember" tabIndex={3} />
                            <Label htmlFor="remember">Se souvenir de moi</Label>
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full"
                            tabIndex={4}
                            disabled={processing}
                            data-test="admin-login-button"
                        >
                            {processing && <Spinner />}
                            Se connecter (Admin)
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}

