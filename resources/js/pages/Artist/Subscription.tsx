import MainLayout from '@/layouts/MainLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

interface SubscriptionProps {
    currentSubscription: any;
    plans: Array<{
        id: string;
        name: string;
        price: number;
        currency: string;
        interval: string;
        features: string[];
        is_popular?: boolean;
    }>;
}

export default function Subscription({ currentSubscription, plans }: SubscriptionProps) {
    const handleSubscribe = (priceId: string) => {
        router.post('/artist/subscription/checkout', { price_id: priceId });
    };

    const handleCancel = () => {
        if (confirm('Voulez-vous vraiment annuler votre abonnement Premium ? Vous perdrez l\'accès aux avantages à la fin de la période en cours.')) {
            router.post('/artist/subscription/cancel');
        }
    };

    const handleResume = () => {
        router.post('/artist/subscription/resume');
    };

    return (
        <MainLayout>
            <Head title="Abonnement Premium" />

            <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">ArtPass Premium</h1>
                    <p className="text-muted-foreground">Boostez votre visibilité et débloquez des fonctionnalités avancées.</p>
                </div>

                {currentSubscription && currentSubscription.active ? (
                    <Card className="border-primary bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="w-5 h-5 fill-primary text-primary" />
                                Votre abonnement est actif
                            </CardTitle>
                            <CardDescription>
                                Vous êtes actuellement sur le plan Premium.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <p><strong>Date de renouvellement :</strong> {new Date(currentSubscription.ends_at || currentSubscription.next_billing_date).toLocaleDateString()}</p>
                                <p><strong>Statut :</strong> {currentSubscription.on_grace_period ? 'Annulé (actif jusqu\'à la fin de la période)' : 'Actif (renouvellement automatique)'}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {currentSubscription.on_grace_period ? (
                                <Button onClick={handleResume}>Reprendre l'abonnement</Button>
                            ) : (
                                <Button variant="destructive" onClick={handleCancel}>Annuler l'abonnement</Button>
                            )}
                        </CardFooter>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {plans.map((plan) => (
                            <Card key={plan.id} className={`relative flex flex-col ${plan.is_popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                                {plan.is_popular && (
                                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                                        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            Le plus choisi
                                        </span>
                                    </div>
                                )}
                                <CardHeader className="text-center pb-2">
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <div className="mt-4 flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-xl font-semibold">{plan.currency}</span>
                                        <span className="text-muted-foreground">/{plan.interval}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 mt-6">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex gap-3 text-sm">
                                                <Check className="w-5 h-5 text-primary shrink-0" />
                                                <span className="text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        variant={plan.is_popular ? 'default' : 'outline'}
                                        onClick={() => handleSubscribe(plan.id)}
                                    >
                                        Mettre à niveau
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
