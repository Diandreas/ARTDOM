import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh bg-background overflow-hidden">

            {/* ── Decorative left panel (hidden on mobile) ── */}
            <div
                aria-hidden="true"
                className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col relative overflow-hidden"
            >
                {/* Kente strip top */}
                <div
                    className="absolute top-0 left-0 right-0 h-1 z-10"
                    style={{
                        background: 'repeating-linear-gradient(90deg,var(--color-primary) 0,var(--color-primary) 12px,transparent 12px,transparent 16px,#c0392b 16px,#c0392b 28px,transparent 28px,transparent 32px,#27ae60 32px,#27ae60 44px,transparent 44px,transparent 48px)',
                    }}
                />

                {/* Dark panel with gold glow */}
                <div className="absolute inset-0 bg-foreground dark:bg-card" />

                {/* African geometric pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M0 40L20 0L40 40L20 80Z' fill='none' stroke='%23d4a017' stroke-width='1'/%3E%3Cpath d='M40 40L60 0L80 40L60 80Z' fill='none' stroke='%23d4a017' stroke-width='1'/%3E%3Ccircle cx='40' cy='40' r='8' fill='none' stroke='%23d4a017' stroke-width='0.8'/%3E%3C/svg%3E")`,
                        backgroundSize: '80px 80px',
                    }}
                />

                {/* Gold radial glow */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse 70% 60% at 40% 50%, oklch(0.65 0.18 80 / 0.18) 0%, transparent 70%)',
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between h-full p-10">
                    {/* Logo */}
                    <Link href={home()} className="flex items-center gap-3">
                        <img src="/artemo-logo.png" alt="Artemo" className="h-12 w-12 object-contain" />
                        <span className="text-2xl font-black tracking-tight text-primary">ARTEMO</span>
                    </Link>

                    {/* Main tagline */}
                    <div className="space-y-4">
                        <p className="text-4xl font-black leading-tight text-background dark:text-foreground">
                            La musique africaine,{' '}
                            <span className="text-primary">partout avec toi.</span>
                        </p>
                        <p className="text-background/60 dark:text-muted-foreground text-base leading-relaxed max-w-sm">
                            Streaming, réservation d'artistes, découverte de talents — tout sur une seule plateforme.
                        </p>
                    </div>

                    {/* Bottom stats */}
                    <div className="flex gap-8">
                        {[
                            { value: '500+', label: 'Artistes' },
                            { value: '10K+', label: 'Titres' },
                            { value: '15+', label: 'Pays' },
                        ].map(({ value, label }) => (
                            <div key={label}>
                                <p className="text-2xl font-black text-primary">{value}</p>
                                <p className="text-xs text-background/50 dark:text-muted-foreground font-medium">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10 relative">

                {/* Mobile logo */}
                <Link href={home()} className="flex items-center gap-2 mb-8 lg:hidden">
                    <img src="/artemo-logo.png" alt="Artemo" className="h-10 w-10 object-contain" />
                    <span className="text-xl font-black text-primary">ARTEMO</span>
                </Link>

                {/* Subtle background decoration */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 30L15 0L30 30L15 60Z' fill='none' stroke='%23d4a017' stroke-width='0.8'/%3E%3Cpath d='M30 30L45 0L60 30L45 60Z' fill='none' stroke='%23d4a017' stroke-width='0.8'/%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Card */}
                <div className="relative w-full max-w-sm">
                    {/* Top gold accent line */}
                    <div className="h-0.5 w-16 bg-primary rounded-full mb-8 mx-auto" />

                    {/* Title block */}
                    <div className="text-center mb-8 space-y-1.5">
                        <h1 className="text-2xl font-black text-foreground tracking-tight">{title}</h1>
                        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
