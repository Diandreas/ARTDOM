import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Clock, Building, Download, CreditCard, Banknote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { WalletSkeleton } from '@/components/Skeletons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAppLocale } from '@/hooks/use-app-locale';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';

interface WalletProps {
    wallet: {
        balance: number;
        pending_balance: number;
        currency: string;
        transactions?: Array<{
            id: string;
            type: string;
            created_at: string;
            reference_id?: string | null;
            net_amount: number;
        }>;
        withdrawals?: Array<{
            id: string;
            method: 'mobile_money' | 'bank_transfer' | 'paypal';
            amount: number;
            net_amount: number;
            status: 'pending' | 'completed' | 'rejected';
            requested_at: string;
        }>;
    };
}
export default function Wallet({ wallet }: WalletProps) {
    const { t, dateLocale, locale } = useAppLocale();
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    const form = useForm({
        amount: '',
        method: 'mobile_money',
        account_details: {
            phone: '',
            iban: '',
            email: ''
        }
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial data loading for the skeleton effect
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <MainLayout>
                <Head title={t('My Wallet')} />
                <WalletSkeleton />
            </MainLayout>
        );
    }

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();

        let isValid = true;
        if (parseFloat(form.data.amount) < 1000) {
            form.setError('amount', t('The minimum amount is 1000 FCFA'));
            isValid = false;
        }

        if (form.data.method === 'mobile_money' && !form.data.account_details.phone) {
            form.setError('account_details.phone', t('Phone number is required'));
            isValid = false;
        }

        if (!isValid) return;

        form.post('/artist/wallet/withdraw', {
            preserveScroll: true,
            onSuccess: () => {
                setIsWithdrawOpen(false);
                toast.success(t('Withdrawal request submitted successfully'));
                form.reset();
            },
            onError: () => {
                toast.error(t('An error occurred while submitting the withdrawal request'));
            }
        });
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: wallet.currency || 'XOF' }).format(amount || 0);
    };

    return (
        <MainLayout>
            <Head title={t('My Wallet')} />

            <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t('My Wallet')}</h1>
                        <p className="text-muted-foreground">{t('Manage your earnings and withdrawals.')}</p>
                    </div>

                    <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="gap-2" disabled={wallet.balance < 1000}>
                                <ArrowUpRight className="w-4 h-4" />
                                {t('Withdraw funds')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleWithdraw}>
                                <DialogHeader>
                                    <DialogTitle>{t('Request a withdrawal')}</DialogTitle>
                                    <DialogDescription>
                                        {t('Transfer your available balance to your bank account or mobile money.')}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                    <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                                        <span className="text-sm">{t('Available balance')}</span>
                                        <span className="font-bold text-lg">{formatMoney(wallet.balance)}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{t('Amount to withdraw')}</Label>
                                        <Input
                                            type="number"
                                            min="1000"
                                            max={wallet.balance}
                                            value={form.data.amount}
                                            onChange={e => form.setData('amount', e.target.value)}
                                            placeholder={t('Example: 15000')}
                                        />
                                        {form.errors.amount && <p className="text-sm text-destructive">{form.errors.amount}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{t('Withdrawal method')}</Label>
                                        <Select
                                            value={form.data.method}
                                            onValueChange={(val: 'mobile_money' | 'bank_transfer' | 'paypal') => form.setData('method', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mobile_money">{t('Mobile Money (-2% fee)')}</SelectItem>
                                                <SelectItem value="bank_transfer">{t('Bank transfer (-1% fee)')}</SelectItem>
                                                <SelectItem value="paypal">{t('PayPal (-3% fee)')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {form.data.method === 'mobile_money' && (
                                        <div className="space-y-2">
                                            <Label>{t('Mobile Money number')}</Label>
                                            <Input
                                                type="tel"
                                                placeholder="+225 00 00 00 00 00"
                                                value={form.data.account_details.phone}
                                                onChange={e => form.setData('account_details', { ...form.data.account_details, phone: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {form.data.method === 'bank_transfer' && (
                                        <div className="space-y-2">
                                            <Label>IBAN / RIB</Label>
                                            <Input
                                                value={form.data.account_details.iban}
                                                onChange={e => form.setData('account_details', { ...form.data.account_details, iban: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {form.data.method === 'paypal' && (
                                        <div className="space-y-2">
                                            <Label>{t('PayPal email')}</Label>
                                            <Input
                                                type="email"
                                                value={form.data.account_details.email}
                                                onChange={e => form.setData('account_details', { ...form.data.account_details, email: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" type="button" onClick={() => setIsWithdrawOpen(false)}>{t('Cancel')}</Button>
                                    <Button type="submit" disabled={form.processing}>{t('Confirm withdrawal')}</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('Available Balance')}</CardTitle>
                            <WalletIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">{formatMoney(wallet.balance)}</div>
                            <p className="text-xs text-muted-foreground mt-1">{t('Ready to be withdrawn')}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('Pending')}</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatMoney(wallet.pending_balance)}</div>
                            <p className="text-xs text-muted-foreground mt-1">{t('Will be released after services are completed')}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('Total Earnings')}</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatMoney(Number(wallet.balance) + Number(wallet.pending_balance))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{t('Overall cumulative earnings')}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Transactions Récentes */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>{t('Recent Activity')}</CardTitle>
                                <CardDescription>{t('Latest transactions on your wallet')}</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => window.location.href = '/artist/wallet/export'}>
                                <Download className="w-4 h-4 mr-2" /> {t('Export')}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {wallet.transactions?.length > 0 ? (
                                <div className="space-y-4">
                                    {wallet.transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${tx.type.includes('credit') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500' :
                                                    tx.type.includes('debit') ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500' :
                                                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500'
                                                    }`}>
                                                    {tx.type.includes('credit') ? <ArrowDownRight className="w-4 h-4" /> :
                                                        tx.type.includes('debit') ? <ArrowUpRight className="w-4 h-4" /> :
                                                            <Clock className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {tx.type === 'credit_reservation' ? t('Service payment') :
                                                            tx.type === 'pending_reservation' ? t('Pending payment') :
                                                                tx.type === 'debit_withdrawal' ? t('Withdrawal request') : tx.type}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(tx.created_at), 'dd MMM yyyy HH:mm', { locale: dateLocale })}
                                                        {tx.reference_id && ` • ${t('Ref')}: ${tx.reference_id.substring(0, 8)}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${tx.type.includes('debit') ? 'text-red-600 dark:text-red-400' :
                                                    tx.type.includes('credit') ? 'text-green-600 dark:text-green-400' :
                                                        ''
                                                    }`}>
                                                    {tx.type.includes('debit') ? '-' : '+'}{formatMoney(tx.net_amount)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    {t('No recent transactions.')}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Historique Retraits */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('Withdrawals')}</CardTitle>
                            <CardDescription>{t('Your recent requests')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {wallet.withdrawals?.length > 0 ? (
                                <div className="space-y-4">
                                    {wallet.withdrawals.map((w) => (
                                        <div key={w.id} className="border-b last:border-0 pb-3 last:pb-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2">
                                                    {w.method === 'mobile_money' ? <Banknote className="w-4 h-4 text-muted-foreground" /> :
                                                        w.method === 'bank_transfer' ? <Building className="w-4 h-4 text-muted-foreground" /> :
                                                            <CreditCard className="w-4 h-4 text-muted-foreground" />}
                                                    <span className="font-medium text-sm">{formatMoney(w.amount)}</span>
                                                </div>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${w.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                    w.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {w.status === 'pending' ? t('In progress') :
                                                        w.status === 'completed' ? t('Processed') : t('Rejected')}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(w.requested_at), 'dd MMM yyyy', { locale: dateLocale })} • {t('Net')}: {formatMoney(w.net_amount)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    {t('No withdrawals.')}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
