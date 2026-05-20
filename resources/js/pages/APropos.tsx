import { Head, Link } from '@inertiajs/react';
import { Target, Eye, Zap, ShieldCheck, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

const VALUES = [
    {
        icon: Target,
        color: 'bg-amber-500/10 border-amber-500/20',
        iconColor: 'text-amber-500',
        titleFr: 'Mission',
        titleEn: 'Mission',
        textFr: 'Donner à chaque artiste africain les outils pour rayonner, vivre de son art et toucher une audience mondiale.',
        textEn: 'Give every African artist the tools to shine, live from their art and reach a global audience.',
    },
    {
        icon: Eye,
        color: 'bg-blue-500/10 border-blue-500/20',
        iconColor: 'text-blue-500',
        titleFr: 'Vision',
        titleEn: 'Vision',
        textFr: 'Devenir la référence de la musique africaine en ligne — une plateforme qui respecte les artistes et leur culture.',
        textEn: 'Become the reference for African music online — a platform that respects artists and their culture.',
    },
    {
        icon: ShieldCheck,
        color: 'bg-green-500/10 border-green-500/20',
        iconColor: 'text-green-500',
        titleFr: 'Valeurs',
        titleEn: 'Values',
        textFr: 'Authenticité, transparence, équité. Chaque décision est prise en faveur des artistes et de leur communauté.',
        textEn: 'Authenticity, transparency, fairness. Every decision is made in favor of artists and their community.',
    },
];

const FEATURES = [
    { fr: 'Streaming et téléchargement d\'albums', en: 'Album streaming and download' },
    { fr: 'Déclaration IA transparente', en: 'Transparent AI declaration' },
    { fr: 'Système de badge artiste (5 niveaux)', en: 'Artist badge system (5 levels)' },
    { fr: 'Gestion de services et réservations', en: 'Service management and bookings' },
    { fr: 'Wallet et retraits sécurisés', en: 'Wallet and secure withdrawals' },
    { fr: 'ArtTube — vidéos artistiques', en: 'ArtTube — artistic videos' },
    { fr: 'Support multilingue FR / EN', en: 'Multilingual support FR / EN' },
    { fr: 'Scores de réputation automatisés', en: 'Automated reputation scores' },
];

export default function APropos({ page }: Props) {
    const { locale } = useAppLocale();
    const isFr = locale === 'fr';
    const title = isFr ? page.title_fr : page.title_en;
    const content = isFr ? page.content_fr : page.content_en;

    return (
        <MainLayout>
            <Head title={title} />

            {/* ── HERO ── */}
            <section className="relative overflow-hidden">
                {/* Diagonal gradient accent */}
                <div className="absolute inset-0 z-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/20 dark:from-primary/10 dark:to-secondary/10" />

                {/* Decorative circle */}
                <div
                    aria-hidden="true"
                    className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-primary/10 opacity-50"
                />
                <div
                    aria-hidden="true"
                    className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full border border-primary/20 opacity-40"
                />

                {/* Kente top strip */}
                <div
                    aria-hidden="true"
                    className="h-1.5 w-full"
                    style={{
                        background:
                            'repeating-linear-gradient(90deg,oklch(0.6 0.15 75) 0,oklch(0.6 0.15 75) 14px,transparent 14px,transparent 18px,#c0392b 18px,#c0392b 32px,transparent 32px,transparent 36px,#27ae60 36px,#27ae60 50px,transparent 50px,transparent 54px)',
                    }}
                />

                <div className="relative z-10 container mx-auto max-w-6xl px-4 py-20 md:py-28 md:px-6">
                    <div className="grid gap-12 md:grid-cols-2 md:items-center">
                        <div>
                            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs font-semibold tracking-widest uppercase">
                                {isFr ? 'Qui sommes-nous ?' : 'Who are we?'}
                            </Badge>
                            <h1 className="font-heading text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                                {title}
                            </h1>
                            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                                {isFr
                                    ? 'ARTDOM est née d\'une conviction simple : les artistes africains méritent une plateforme à la hauteur de leur talent.'
                                    : 'ARTDOM was born from a simple conviction: African artists deserve a platform worthy of their talent.'}
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button asChild size="lg" className="gap-2">
                                    <Link href="/impact-social">
                                        {isFr ? 'Notre impact' : 'Our impact'}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline">
                                    <Link href="/artists">
                                        {isFr ? 'Rencontrer les artistes' : 'Meet the artists'}
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Logo / visual block */}
                        <div className="flex justify-center md:justify-end">
                            <div className="relative">
                                <div className="flex h-64 w-64 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/30 shadow-2xl ring-1 ring-primary/20 md:h-80 md:w-80">
                                    <div className="text-center">
                                        <img
                                            src="/artemo-logo.png"
                                            alt="ARTEMO"
                                            className="mx-auto h-24 w-24 object-contain md:h-32 md:w-32"
                                        />
                                        <p className="mt-3 font-heading text-2xl font-black tracking-tight text-primary md:text-3xl">
                                            ARTEMO
                                        </p>
                                        <p className="text-xs text-muted-foreground">{isFr ? 'Musique africaine' : 'African music'}</p>
                                    </div>
                                </div>
                                {/* Floating badge */}
                                <div className="absolute -bottom-4 -right-4 flex items-center gap-1.5 rounded-full bg-card px-4 py-2 shadow-lg ring-1 ring-border">
                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                    <span className="text-xs font-bold text-foreground">{isFr ? 'Depuis 2024' : 'Since 2024'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VALUES ── */}
            <section className="border-y border-border bg-muted/30">
                <div className="container mx-auto max-w-6xl px-4 py-16 md:px-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        {VALUES.map(({ icon: Icon, color, iconColor, titleFr, titleEn, textFr, textEn }) => (
                            <div key={titleFr} className={`rounded-2xl border p-8 ${color}`}>
                                <div className={`mb-4 inline-flex rounded-xl bg-background p-3 shadow-sm`}>
                                    <Icon className={`h-6 w-6 ${iconColor}`} />
                                </div>
                                <h3 className="mb-3 font-heading text-xl font-bold text-foreground">
                                    {isFr ? titleFr : titleEn}
                                </h3>
                                <p className="leading-relaxed text-muted-foreground">
                                    {isFr ? textFr : textEn}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES LIST ── */}
            <section className="container mx-auto max-w-6xl px-4 py-20 md:px-6">
                <div className="grid gap-12 md:grid-cols-2 md:items-start">
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                {isFr ? 'Ce que nous offrons' : 'What we offer'}
                            </span>
                        </div>
                        <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                            {isFr ? 'Une plateforme complète pour les artistes africains' : 'A complete platform for African artists'}
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            {isFr
                                ? 'Tout ce dont un artiste a besoin pour se lancer, grandir et rayonner — sur une seule plateforme.'
                                : 'Everything an artist needs to launch, grow and shine — on a single platform.'}
                        </p>
                    </div>
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {FEATURES.map(({ fr, en }) => (
                            <li key={fr} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                <span className="text-sm text-foreground">{isFr ? fr : en}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── EDITORIAL CONTENT (from DB) ── */}
            {content && (
                <section className="border-t border-border">
                    <div className="container mx-auto max-w-4xl px-4 py-20 md:px-6">
                        <div className="mb-10 flex items-center gap-4">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                {isFr ? 'Notre histoire' : 'Our story'}
                            </span>
                            <div className="h-px flex-1 bg-border" />
                        </div>
                        <article
                            className="prose prose-neutral dark:prose-invert max-w-none
                                prose-headings:font-heading prose-headings:font-bold
                                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                prose-p:text-muted-foreground prose-p:leading-relaxed
                                prose-li:text-muted-foreground
                                prose-strong:text-foreground"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </section>
            )}

            {/* ── CTA ── */}
            <section className="border-t border-border bg-card">
                <div className="container mx-auto max-w-4xl px-4 py-16 text-center md:px-6">
                    <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                        {isFr ? 'Prêt à rejoindre ARTEMO ?' : 'Ready to join ARTEMO?'}
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        {isFr ? 'Inscrivez-vous gratuitement et commencez votre aventure artistique.' : 'Sign up for free and start your artistic journey.'}
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button asChild size="lg" className="gap-2">
                            <Link href="/register">
                                {isFr ? 'Commencer maintenant' : 'Get started'}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/impact-social">
                                {isFr ? 'Notre impact social' : 'Our social impact'}
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <div className="pb-24 md:pb-0" />
        </MainLayout>
    );
}
