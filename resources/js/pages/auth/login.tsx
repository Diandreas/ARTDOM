import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAppLocale } from '@/hooks/use-app-locale';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const { t } = useAppLocale();

    return (
        <AuthLayout
            title={`${t('Welcome back')} 👋`}
            description={t('Log in to access your Artemo space')}
        >
            <Head title={`${t('Log in')} - Artemo`} />

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp 0.4s ease both; }
                .fade-up-1 { animation-delay: 0.05s; }
                .fade-up-2 { animation-delay: 0.10s; }
                .fade-up-3 { animation-delay: 0.15s; }
                .fade-up-4 { animation-delay: 0.20s; }
                .fade-up-5 { animation-delay: 0.25s; }
                .fade-up-6 { animation-delay: 0.30s; }
                .auth-input {
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .auth-input:focus {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 3px oklch(from var(--color-primary) l c h / 0.15);
                }
            `}</style>

            {status && (
                <div className="mb-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-center text-sm font-medium text-green-600 dark:text-green-400">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="fade-up fade-up-1 grid gap-1.5">
                            <Label
                                htmlFor="email"
                                className="text-sm font-semibold"
                            >
                                {t('Email')}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="auth-input h-11 rounded-xl"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="fade-up fade-up-2 grid gap-1.5">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-semibold"
                                >
                                    {t('Password')}
                                </Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-xs text-primary hover:underline"
                                        tabIndex={5}
                                    >
                                        {t('Forgot password?')}
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="auth-input h-11 rounded-xl"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="fade-up fade-up-3 flex items-center gap-2.5">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                            />
                            <Label
                                htmlFor="remember"
                                className="cursor-pointer text-sm text-muted-foreground"
                            >
                                {t('Remember me')}
                            </Label>
                        </div>

                        <div className="fade-up fade-up-4 pt-1">
                            <Button
                                type="submit"
                                className="h-11 w-full rounded-xl text-sm font-bold shadow-md shadow-primary/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-primary/30"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                {t('Log in')}
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="fade-up fade-up-5 flex items-center gap-3">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs font-medium text-muted-foreground">
                                {t('or')}
                            </span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        {/* Google OAuth */}
                        <div className="fade-up fade-up-5">
                            <a
                                href="/auth/google"
                                className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-muted hover:shadow-sm"
                            >
                                <svg
                                    className="h-4.5 w-4.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                {t('Continue with Google')}
                            </a>
                        </div>

                        {canRegister && (
                            <p className="fade-up fade-up-6 text-center text-sm text-muted-foreground">
                                {t("Don't have an account yet?")}{' '}
                                <TextLink
                                    href="/register/selection"
                                    tabIndex={6}
                                    className="font-semibold text-primary hover:underline"
                                >
                                    {t('Register')}
                                </TextLink>
                            </p>
                        )}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
