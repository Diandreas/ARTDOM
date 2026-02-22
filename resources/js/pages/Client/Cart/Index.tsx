import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Tag, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import removeItem from '@/actions/App/Http/Controllers/CartController/removeItem';
import applyCoupon from '@/actions/App/Http/Controllers/CartController/applyCoupon';
import clear from '@/actions/App/Http/Controllers/CartController/clear';

interface Artist {
    id: string;
    stage_name: string;
    photo_url: string | null;
}

interface Service {
    id: string;
    title: string;
    artist: Artist;
}

interface CartItem {
    id: string;
    service: Service;
    quantity: number;
    unit_price: number;
    subtotal: number;
    customization: any;
    scheduled_at: string | null;
}

interface Cart {
    id: string;
    items: CartItem[];
    coupon_code: string | null;
    subtotal: number;
    discount: number;
    service_fee: number;
    total: number;
}

interface CartIndexProps {
    cart: Cart;
}

export default function CartIndex({ cart }: CartIndexProps) {
    const [removingItemId, setRemovingItemId] = useState<string | null>(null);
    const [couponCode, setCouponCode] = useState(cart.coupon_code || '');
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    const handleRemoveItem = (itemId: string) => {
        if (confirm('Êtes-vous sûr de vouloir retirer cet article du panier ?')) {
            setRemovingItemId(itemId);
            router.delete(removeItem({ item: itemId }), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Article retiré du panier');
                },
                onError: () => {
                    toast.error('Erreur lors de la suppression');
                },
                onFinish: () => {
                    setRemovingItemId(null);
                },
            });
        }
    };

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode.trim()) {
            return;
        }

        setApplyingCoupon(true);
        router.post(
            applyCoupon(),
            { code: couponCode },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Code promo appliqué');
                },
                onError: (errors) => {
                    toast.error(errors.code || 'Code promo invalide');
                },
                onFinish: () => {
                    setApplyingCoupon(false);
                },
            }
        );
    };

    const handleClearCart = () => {
        if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
            router.delete(clear(), {
                onSuccess: () => {
                    toast.success('Panier vidé');
                },
            });
        }
    };

    if (cart.items.length === 0) {
        return (
            <MainLayout>
                <Head title="Panier" />
                <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                    <Card>
                        <CardContent className="pt-12 pb-12 text-center">
                            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Votre panier est vide</h3>
                            <p className="text-muted-foreground mb-6">
                                Découvrez nos artistes et ajoutez des prestations à votre panier.
                            </p>
                            <Link href="/artists">
                                <Button>Découvrir les artistes</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title="Panier" />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-heading mb-2 text-foreground">Mon Panier</h1>
                        <p className="text-muted-foreground">
                            {cart.items.length} {cart.items.length === 1 ? 'article' : 'articles'}
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleClearCart}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Vider le panier
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        {/* Artist Photo */}
                                        <div className="flex-shrink-0">
                                            {item.service.artist.photo_url ? (
                                                <img
                                                    src={item.service.artist.photo_url}
                                                    alt={item.service.artist.stage_name}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                                                    <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground mb-1">{item.service.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                par {item.service.artist.stage_name}
                                            </p>

                                            {item.scheduled_at && (
                                                <Badge variant="secondary" className="mb-2">
                                                    {item.scheduled_at}
                                                </Badge>
                                            )}

                                            {item.customization?.message && (
                                                <p className="text-sm text-muted-foreground italic mt-2">
                                                    "{item.customization.message.substring(0, 100)}
                                                    {item.customization.message.length > 100 ? '...' : ''}"
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 mt-3">
                                                <span className="text-sm text-muted-foreground">
                                                    Quantité: {item.quantity}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    Prix unitaire: {item.unit_price.toLocaleString('fr-FR')} FCFA
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price & Actions */}
                                        <div className="flex flex-col items-end justify-between">
                                            <p className="font-bold text-lg text-foreground">
                                                {item.subtotal.toLocaleString('fr-FR')} FCFA
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={removingItemId === item.id}
                                            >
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Récapitulatif</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Coupon Input */}
                                <form onSubmit={handleApplyCoupon} className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Code promo</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Entrez votre code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            disabled={applyingCoupon || !!cart.coupon_code}
                                        />
                                        <Button
                                            type="submit"
                                            variant="secondary"
                                            disabled={applyingCoupon || !!cart.coupon_code || !couponCode.trim()}
                                        >
                                            <Tag className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {cart.coupon_code && (
                                        <p className="text-sm text-green-600 flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            Code "{cart.coupon_code}" appliqué
                                        </p>
                                    )}
                                </form>

                                <Separator />

                                {/* Financial Summary */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Sous-total</span>
                                        <span className="font-medium">
                                            {cart.subtotal.toLocaleString('fr-FR')} FCFA
                                        </span>
                                    </div>

                                    {cart.discount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Réduction</span>
                                            <span className="font-medium">
                                                -{cart.discount.toLocaleString('fr-FR')} FCFA
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Frais de service (5%)</span>
                                        <span className="font-medium">
                                            {cart.service_fee.toLocaleString('fr-FR')} FCFA
                                        </span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-foreground">Total</span>
                                        <span className="text-primary">
                                            {cart.total.toLocaleString('fr-FR')} FCFA
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                {/* CTA */}
                                <Link href="/booking/payment">
                                    <Button className="w-full" size="lg">
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Procéder au paiement
                                    </Button>
                                </Link>

                                <div className="bg-muted p-3 rounded-lg">
                                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        Les réservations sont confirmées après validation du paiement. Vous
                                        recevrez une confirmation par email.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
