import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, CreditCard, Wallet, Landmark, Info } from 'lucide-react';
import { fr } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';

interface Service {
    id: string;
    title: string;
    price: number;
}

interface Artist {
    id: string;
    stage_name: string;
    profile_photo: string;
}

interface BookingData {
    service_id: string;
    date: string;
    time: string;
    emotion_type: string;
    recipient_name: string;
    special_message: string;
    customer_location: string;
}

interface PaymentProps {
    service: Service;
    artist: Artist;
    bookingData: BookingData;
}

export default function BookingPayment({ service, artist, bookingData }: PaymentProps) {
    const platformFee = service.price * 0.1;
    const totalAmount = service.price + platformFee;

    const { data, setData, post, processing } = useForm({
        ...bookingData,
        total_amount: totalAmount,
        payment_method: 'orange_money',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/booking/store');
    };

    const formattedDate = format(parseISO(bookingData.date), 'EEEE d MMMM yyyy', { locale: fr });

    return (
        <MainLayout>
            <Head title="Paiement et confirmation" />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
                <Link
                    href={`/booking/customize?service=${service.id}&date=${bookingData.date}&time=${bookingData.time}`}
                    className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour à la personnalisation
                </Link>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex items-center text-primary">
                            <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center font-semibold text-xs">
                                1
                            </div>
                            <span className="ml-2 font-medium text-xs sm:text-sm">Date & Heure</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-primary" />
                        <div className="flex items-center text-primary">
                            <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center font-semibold text-xs">
                                2
                            </div>
                            <span className="ml-2 font-medium text-xs sm:text-sm">Personnalisation</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-primary" />
                        <div className="flex items-center text-primary">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
                                3
                            </div>
                            <span className="ml-2 font-medium text-xs sm:text-sm">Paiement</span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Payment Section */}
                    <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Méthode de paiement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <RadioGroup
                                    value={data.payment_method}
                                    onValueChange={(val) => setData('payment_method', val)}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                >
                                    {/* Mobile Money */}
                                    <Label
                                        className={`flex flex-col gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${data.payment_method === 'orange_money'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                                                <Wallet className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <RadioGroupItem value="orange_money" />
                                        </div>
                                        <div>
                                            <div className="font-bold">Orange Money</div>
                                            <div className="text-xs text-muted-foreground mt-1">Paiement via mobile</div>
                                        </div>
                                    </Label>

                                    <Label
                                        className={`flex flex-col gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${data.payment_method === 'moov_money'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <Wallet className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <RadioGroupItem value="moov_money" />
                                        </div>
                                        <div>
                                            <div className="font-bold">Moov Money</div>
                                            <div className="text-xs text-muted-foreground mt-1">Paiement via mobile</div>
                                        </div>
                                    </Label>

                                    <Label
                                        className={`flex flex-col gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${data.payment_method === 'wave'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                                                <Wallet className="w-5 h-5 text-cyan-600" />
                                            </div>
                                            <RadioGroupItem value="wave" />
                                        </div>
                                        <div>
                                            <div className="font-bold">Wave</div>
                                            <div className="text-xs text-muted-foreground mt-1">Zéro frais de retrait</div>
                                        </div>
                                    </Label>

                                    {/* Bank Card */}
                                    <Label
                                        className={`flex flex-col gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${data.payment_method === 'card'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <CreditCard className="w-5 h-5 text-primary" />
                                            </div>
                                            <RadioGroupItem value="card" />
                                        </div>
                                        <div>
                                            <div className="font-bold">Carte Bancaire</div>
                                            <div className="text-xs text-muted-foreground mt-1">Visa, Mastercard</div>
                                        </div>
                                    </Label>
                                </RadioGroup>

                                <div className="p-4 bg-muted/50 rounded-lg flex gap-3 items-start">
                                    <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Votre paiement sera mis en attente et l'artiste aura 48h pour confirmer.
                                        En cas de refus ou d'absence de réponse, vous serez intégralement remboursé
                                        sur votre moyen de paiement d'origine.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between items-center bg-card border p-6 rounded-xl shadow-sm">
                            <div>
                                <div className="text-sm text-muted-foreground">Total à payer</div>
                                <div className="text-2xl font-bold text-primary">{totalAmount.toLocaleString()} FCFA</div>
                            </div>
                            <Button type="submit" size="lg" disabled={processing} className="px-12 h-12 text-lg">
                                {processing ? 'Traitement...' : 'Confirmer et Payer'}
                            </Button>
                        </div>
                    </form>

                    {/* Final Summary Sidebar */}
                    <div className="md:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Votre réservation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={artist.profile_photo} alt={artist.stage_name} />
                                        <AvatarFallback>{artist.stage_name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-bold text-sm">{artist.stage_name}</div>
                                        <div className="text-xs text-muted-foreground">{service.title}</div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date:</span>
                                        <span className="font-medium">{formattedDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Heure:</span>
                                        <span className="font-medium">{bookingData.time}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Lieu:</span>
                                        <span className="font-medium text-right">{bookingData.customer_location || 'En ligne'}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Prix du service</span>
                                        <span>{service.price.toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Frais plateforme</span>
                                        <span>{platformFee.toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t text-primary">
                                        <span>Total</span>
                                        <span>{totalAmount.toLocaleString()} FCFA</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
