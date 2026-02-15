
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Check, Clock, Calendar as CalendarIcon, CreditCard } from 'lucide-react';

export default function ServiceDetail() {
    const service = {
        title: "Concert Privé Acoustique",
        artist: "Koffi Olomide",
        price: "5000€",
        duration: "2 heures",
        description: "Offrez-vous une prestation exclusive de Koffi Olomide en format acoustique. Idéal pour les mariages, anniversaires ou soirées d'entreprise prestigieuses. L'artiste interprétera ses plus grands succès dans une ambiance intimiste.",
        includes: [
            "Performance de 2h",
            "Sonorisation incluse",
            "Séance photo (30 min)",
            "Dédicace personnalisée"
        ],
        requirements: [
            "Loge privée sécurisée",
            "Repas pour 4 personnes",
            "Espace scénique min 4x3m"
        ]
    };

    return (
        <MainLayout>
            <Head title={`${service.title} - Détails`} />

            <div className="container px-4 md:px-6 py-8 md:py-12">
                <Link href="#" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour au profil
                </Link>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <Badge className="mb-2">Concert</Badge>
                            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">{service.title}</h1>
                            <p className="text-xl text-primary font-medium">{service.artist}</p>
                        </div>

                        <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                            <img
                                src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop"
                                alt="Service"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <h3>Description</h3>
                            <p>{service.description}</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Ce qui est inclus</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {service.includes.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <Check className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Pré-requis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {service.requirements.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="md:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Récapitulatif</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-between items-end border-b pb-4">
                                    <span className="text-muted-foreground">Prix total</span>
                                    <span className="text-3xl font-bold text-primary">{service.price}</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span>Durée : {service.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                        <span>Disponibilité immédiate</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                                        <span>Paiement sécurisé</span>
                                    </div>
                                </div>

                                <Button className="w-full text-lg h-12">
                                    Réserver maintenant
                                </Button>

                                <p className="text-xs text-center text-muted-foreground">
                                    Vous ne serez débité qu'après confirmation de l'artiste.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
