import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ShoppingCart,
    Trash2,
    Tag,
    CreditCard,
    AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    removeItem,
    applyCoupon,
    clear,
} from '@/actions/App/Http/Controllers/CartController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';

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

interface CartItemOption {
    id: string;
    name: string;
    price: string;
}

interface CartItem {
    id: string;
    service: Service;
    quantity: number;
    unit_price: number;
    subtotal: number;
    customization: any;
    selected_options_details?: CartItemOption[];
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
    const { t } = useAppLocale();
    const [removingItemId, setRemovingItemId] = useState<string | null>(null);
    const [couponCode, setCouponCode] = useState(cart.coupon_code || '');
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    const handleRemoveItem = (itemId: string) => {
        if (
            confirm(
                t('Are you sure you want to remove this item from the cart?'),
            )
        ) {
            setRemovingItemId(itemId);
            router.delete(removeItem({ item: itemId }), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(t('Item removed from cart'));
                },
                onError: () => {
                    toast.error(t('Error while removing item'));
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
                    toast.success(t('Promo code applied'));
                },
                onError: (errors) => {
                    toast.error(errors.code || t('Invalid promo code'));
                },
                onFinish: () => {
                    setApplyingCoupon(false);
                },
            },
        );
    };

    const handleClearCart = () => {
        if (confirm(t('Are you sure you want to clear your cart?'))) {
            router.delete(clear(), {
                onSuccess: () => {
                    toast.success(t('Cart cleared'));
                },
            });
        }
    };

    if (cart.items.length === 0) {
        return (
            <MainLayout>
                <Head title={t('Cart')} />
                <div className="container mx-auto max-w-7xl px-4 py-8 pb-24 md:px-6 md:pb-12">
                    <Card>
                        <CardContent className="pt-12 pb-12 text-center">
                            <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                {t('Your cart is empty')}
                            </h3>
                            <p className="mb-6 text-muted-foreground">
                                {t(
                                    'Discover our artists and add services to your cart.',
                                )}
                            </p>
                            <Link href="/artists">
                                <Button>{t('Discover artists')}</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={t('Cart')} />

            <div className="container mx-auto max-w-7xl px-4 py-8 pb-24 md:px-6 md:pb-12">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="font-heading mb-2 text-3xl font-bold text-foreground">
                            {t('My cart')}
                        </h1>
                        <p className="text-muted-foreground">
                            {cart.items.length}{' '}
                            {cart.items.length === 1 ? t('item') : t('items')}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearCart}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('Clear cart')}
                    </Button>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Items List */}
                    <div className="space-y-4 lg:col-span-2">
                        {cart.items.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        {/* Artist Photo */}
                                        <div className="flex-shrink-0">
                                            {item.service.artist.photo_url ? (
                                                <img
                                                    src={
                                                        item.service.artist
                                                            .photo_url
                                                    }
                                                    alt={
                                                        item.service.artist
                                                            .stage_name
                                                    }
                                                    className="h-20 w-20 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                                                    <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Item Details */}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="mb-1 font-semibold text-foreground">
                                                {item.service.title}
                                            </h3>
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                {t('by')}{' '}
                                                {item.service.artist.stage_name}
                                            </p>

                                            {item.scheduled_at && (
                                                <Badge
                                                    variant="secondary"
                                                    className="mb-2"
                                                >
                                                    {item.scheduled_at}
                                                </Badge>
                                            )}

                                            {item.customization?.message && (
                                                <p className="mt-2 text-sm text-muted-foreground italic">
                                                    "
                                                    {item.customization.message.substring(
                                                        0,
                                                        100,
                                                    )}
                                                    {item.customization.message
                                                        .length > 100
                                                        ? '...'
                                                        : ''}
                                                    "
                                                </p>
                                            )}

                                            {item.selected_options_details &&
                                                item.selected_options_details
                                                    .length > 0 && (
                                                    <div className="mt-2 text-sm text-muted-foreground">
                                                        <span className="font-semibold">
                                                            {t('Options')}:
                                                        </span>
                                                        <ul className="mt-1 list-inside list-disc">
                                                            {item.selected_options_details.map(
                                                                (opt) => (
                                                                    <li
                                                                        key={
                                                                            opt.id
                                                                        }
                                                                    >
                                                                        {
                                                                            opt.name
                                                                        }{' '}
                                                                        (+
                                                                        {Number(
                                                                            opt.price,
                                                                        ).toLocaleString(
                                                                            'fr-FR',
                                                                        )}{' '}
                                                                        FCFA)
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}

                                            <div className="mt-3 flex items-center gap-4">
                                                <span className="text-sm text-muted-foreground">
                                                    {t('Quantity')}:{' '}
                                                    {item.quantity}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {t('Unit price')}:{' '}
                                                    {item.unit_price.toLocaleString(
                                                        'fr-FR',
                                                    )}{' '}
                                                    FCFA
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price & Actions */}
                                        <div className="flex flex-col items-end justify-between">
                                            <p className="text-lg font-bold text-foreground">
                                                {item.subtotal.toLocaleString(
                                                    'fr-FR',
                                                )}{' '}
                                                FCFA
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleRemoveItem(item.id)
                                                }
                                                disabled={
                                                    removingItemId === item.id
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
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
                                <CardTitle>{t('Summary')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Coupon Input */}
                                <form
                                    onSubmit={handleApplyCoupon}
                                    className="space-y-2"
                                >
                                    <label className="text-sm font-medium text-foreground">
                                        {t('Promo code')}
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            placeholder={t('Enter your code')}
                                            value={couponCode}
                                            onChange={(e) =>
                                                setCouponCode(e.target.value)
                                            }
                                            disabled={
                                                applyingCoupon ||
                                                !!cart.coupon_code
                                            }
                                        />
                                        <Button
                                            type="submit"
                                            variant="secondary"
                                            disabled={
                                                applyingCoupon ||
                                                !!cart.coupon_code ||
                                                !couponCode.trim()
                                            }
                                        >
                                            <Tag className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {cart.coupon_code && (
                                        <p className="flex items-center gap-1 text-sm text-green-600">
                                            <Tag className="h-3 w-3" />
                                            {t('Code')} "{cart.coupon_code}"{' '}
                                            {t('applied')}
                                        </p>
                                    )}
                                </form>

                                <Separator />

                                {/* Financial Summary */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {t('Subtotal')}
                                        </span>
                                        <span className="font-medium">
                                            {cart.subtotal.toLocaleString(
                                                'fr-FR',
                                            )}{' '}
                                            FCFA
                                        </span>
                                    </div>

                                    {cart.discount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>{t('Discount')}</span>
                                            <span className="font-medium">
                                                -
                                                {cart.discount.toLocaleString(
                                                    'fr-FR',
                                                )}{' '}
                                                FCFA
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {t('Service fee (5%)')}
                                        </span>
                                        <span className="font-medium">
                                            {cart.service_fee.toLocaleString(
                                                'fr-FR',
                                            )}{' '}
                                            FCFA
                                        </span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-foreground">
                                            {t('Total')}
                                        </span>
                                        <span className="text-primary">
                                            {cart.total.toLocaleString('fr-FR')}{' '}
                                            FCFA
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                {/* CTA */}
                                <Link href="/booking/payment">
                                    <Button className="w-full" size="lg">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        {t('Proceed to payment')}
                                    </Button>
                                </Link>

                                <div className="rounded-lg bg-muted p-3">
                                    <p className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                        {t(
                                            'Reservations are confirmed after payment validation. You will receive a confirmation by email.',
                                        )}
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
