import { Head, Link } from '@inertiajs/react';
import { Heart, Users, Globe, TrendingUp, Music, ArrowRight, Star, Mic2, Headphones } from 'lucide-react';
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

const STATS = [
    { icon: Users,      value: '500+',   labelFr: 'Artistes accompagnés',    labelEn: 'Artists supported',     color: 'text-amber-500' },
    { icon: Headphones, value: '50K+',   labelFr: 'Écoutes par mois',        labelEn: 'Monthly streams',       color: 'text-green-500' },
    { icon: Globe,      value: '20+',    labelFr: 'Pays représentés',         labelEn: 'Countries represented', color: 'text-blue-500' },
    { icon: TrendingUp, value: '3x',     labelFr: 'Revenus artistes / an',    labelEn: 'Artist revenue growth', color: 'text-purple-500' },
];

const PILLARS = [
    {
        icon: Music,
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        titleFr: 'Diffusion musicale',
        titleEn: 'Music distribution',
        descFr: 'Chaque artiste bénéficie d\'une vitrine digitale pour toucher des millions d\'auditeurs à travers l\'Afrique et la diaspora.',
        descEn: 'Every artist gets a digital storefront to reach millions of listeners across Africa and the diaspora.',
    },
    {
        icon: Heart,
        color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        titleFr: 'Soutien aux créateurs',
        titleEn: 'Creator support',
        descFr: 'Des outils concrets — monétisation, gestion de services, paiements — pour que chaque artiste vive de son art.',
        descEn: 'Concrete tools — monetization, service management, payments — so every artist can live from their craft.',
    },
    {
        icon: Star,
        color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        titleFr: 'Valorisation culturelle',
        titleEn: 'Cultural preservation',
        descFr: 'Afrobeat, Zouglou, Coupé-Décalé, Makossa… Nous préservons et promouvons la richesse de la musique africaine.',
        descEn: 'Afrobeat, Zouglou, Coupé-Décalé, Makossa… We preserve and promote the richness of African music.',
    },
    {
        icon: Mic2,
        color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
        titleFr: 'Communauté & réseau',
        titleEn: 'Community & network',
        descFr: 'Une plateforme de mise en relation entre artistes, clients et fans pour créer des connexions durables.',
        descEn: 'A platform connecting artists, clients and fans to build lasting connections.',
    },
];

export default function ImpactSocial({ page }: Props) {
    const { locale } = useAppLocale();
    const isFr = locale === 'fr';
    const title = isFr ? page.title_fr : page.title_en;
    const content = isFr ? page.content_fr : page.content_en;

    return (
        <MainLayout>
            <Head title={title} />

            {/* ── HERO BANNER ── */}
            <section className="relative overflow-hidden">
                {/* African pattern overlay */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.04]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23d4a017' stroke-width='1.5'/%3E%3Ccircle cx='30' cy='30' r='8' fill='none' stroke='%23d4a017' stroke-width='1'/%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Gradient background */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-rose-500/10 dark:from-amber-500/10 dark:via-orange-500/5 dark:to-rose-500/5" />

                {/* Kente strip top */}
                <div
                    aria-hidden="true"
                    className="h-1.5 w-full"
                    style={{
                        background:
                            'repeating-linear-gradient(90deg,oklch(0.6 0.15 75) 0,oklch(0.6 0.15 75) 14px,transparent 14px,transparent 18px,#c0392b 18px,#c0392b 32px,transparent 32px,transparent 36px,#27ae60 36px,#27ae60 50px,transparent 50px,transparent 54px)',
                    }}
                />

                <div className="relative z-10 container mx-auto max-w-6xl px-4 py-20 md:py-28 md:px-6">
                    <div className="max-w-3xl">
                        <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs font-semibold tracking-widest uppercase">
                            {isFr ? 'Notre Mission' : 'Our Mission'}
                        </Badge>
                        <h1 className="font-heading text-4xl font-black leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
                            {title}
                        </h1>
                        <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
                            {isFr
                                ? 'ARTDOM transforme la façon dont les artistes africains créent, partagent et monétisent leur art.'
                                : 'ARTDOM transforms how African artists create, share and monetize their art.'}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button asChild size="lg" className="gap-2">
                                <Link href="/artists">
                                    {isFr ? 'Découvrir les artistes' : 'Discover artists'}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/a-propos">
                                    {isFr ? 'À propos de nous' : 'About us'}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS BAR ── */}
            <section className="border-y border-border bg-card">
                <div className="container mx-auto max-w-6xl px-4 md:px-6">
                    <div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
                        {STATS.map(({ icon: Icon, value, labelFr, labelEn, color }) => (
                            <div key={value} className="flex flex-col items-center gap-2 px-6 py-8 text-center">
                                <Icon className={`h-6 w-6 ${color}`} />
                                <span className="text-3xl font-black text-foreground md:text-4xl">{value}</span>
                                <span className="text-xs text-muted-foreground">{isFr ? labelFr : labelEn}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PILLARS ── */}
            <section className="container mx-auto max-w-6xl px-4 py-20 md:px-6">
                <div className="mb-12 text-center">
                    <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                        {isFr ? 'Les 4 piliers de notre impact' : 'The 4 pillars of our impact'}
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        {isFr ? 'Comment ARTDOM change concrètement la vie des artistes' : 'How ARTDOM concretely changes artists\' lives'}
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {PILLARS.map(({ icon: Icon, color, titleFr, titleEn, descFr, descEn }) => (
                        <div
                            key={titleFr}
                            className={`rounded-2xl border p-6 transition-shadow hover:shadow-lg ${color}`}
                        >
                            <div className={`mb-4 inline-flex rounded-xl p-3 ${color}`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-base font-bold text-foreground">{isFr ? titleFr : titleEn}</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">{isFr ? descFr : descEn}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── EDITORIAL CONTENT (from DB) ── */}
            {content && (
                <section className="border-t border-border bg-muted/30">
                    <div className="container mx-auto max-w-4xl px-4 py-20 md:px-6">
                        {/* decorative line */}
                        <div className="mb-10 flex items-center gap-4">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                {isFr ? 'En détail' : 'In detail'}
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

            {/* ── CTA BANNER ── */}
            <section className="relative overflow-hidden bg-primary">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='10' fill='none' stroke='white' stroke-width='1'/%3E%3Cpath d='M0 20 L40 20 M20 0 L20 40' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px',
                    }}
                />
                <div className="relative z-10 container mx-auto max-w-4xl px-4 py-16 text-center md:px-6">
                    <h2 className="font-heading text-3xl font-black text-primary-foreground md:text-4xl">
                        {isFr ? 'Rejoignez le mouvement' : 'Join the movement'}
                    </h2>
                    <p className="mt-4 text-lg text-primary-foreground/80">
                        {isFr
                            ? 'Que vous soyez artiste ou fan de musique africaine, ARTDOM est fait pour vous.'
                            : 'Whether you\'re an artist or a fan of African music, ARTDOM is made for you.'}
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" variant="secondary" className="gap-2 font-bold">
                            <Link href="/register">
                                {isFr ? 'Créer un compte' : 'Create an account'}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                            <Link href="/artstream">
                                {isFr ? 'Explorer la musique' : 'Explore music'}
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* bottom padding for mobile nav */}
            <div className="pb-24 md:pb-0" />
        </MainLayout>
    );
}
