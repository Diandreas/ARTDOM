import { Head, useForm } from '@inertiajs/react';
import { 
    Banknote, 
    Smartphone, 
    History, 
    ArrowUpRight, 
    AlertCircle, 
    CheckCircle2,
    Clock,
    XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import ArtistLayout from '@/layouts/artist-layout';
import { useAppLocale } from '@/hooks/use-app-locale';

interface Wallet {
    balance: number;
    pending_balance: number;
}

interface Withdrawal {
    id: string;
    amount: number;
    method: string;
    status: 'pending' | 'completed' | 'rejected';
    requested_at: string;
    provider_ref: string | null;
}

interface Props {
    wallet: Wallet;
    withdrawals: {
        data: Withdrawal[];
        links: any[];
    };
}

export default function Withdrawals({ wallet, withdrawals }: Props) {
    const { t } = useAppLocale();
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        method: 'orange_money',
        phone_number: '',
        bank_name: '',
        account_number: '',
        account_name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('artist.withdrawals.store'), {
            onSuccess: () => reset(),
        });
    };

    const renderStatus = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{t('Pending')}</Badge>;
            case 'completed':
                return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">{t('Processed')}</Badge>;
            case 'rejected':
                return <Badge variant="destructive">{t('Rejected')}</Badge>;
            default:
                return <Badge>{t(status)}</Badge>;
        }
    };

    return (
        <ArtistLayout title={t('Wallet')} subtitle={t('Manage your earnings and request payouts.')}>
            <Head title={`Artist - ${t('Withdrawals')}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Solde Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-primary text-primary-foreground">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">{t('Available balance')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{Number(wallet.balance).toLocaleString()} FCFA</div>
                            <p className="text-xs mt-2 opacity-80">
                                + {Number(wallet.pending_balance).toLocaleString()} FCFA {t('Pending')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t('Request a withdrawal')}</CardTitle>
                            <CardDescription>{t('Minimum : 5 000 FCFA')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">{t('Amount to withdraw')}</Label>
                                    <div className="relative">
                                        <Input 
                                            id="amount" 
                                            type="number" 
                                            value={data.amount}
                                            onChange={e => setData('amount', e.target.value)}
                                            placeholder="5000"
                                            required
                                        />
                                        <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">FCFA</span>
                                    </div>
                                    {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label>{t('Withdrawal method')}</Label>
                                    <RadioGroup value={data.method} onValueChange={val => setData('method', val)}>
                                        <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer">
                                            <RadioGroupItem value="orange_money" id="om" />
                                            <Label htmlFor="om" className="flex items-center gap-2 cursor-pointer flex-1">
                                                <Smartphone className="h-4 w-4 text-orange-500" /> Orange Money
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer">
                                            <RadioGroupItem value="bank_transfer" id="bank" />
                                            <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer flex-1">
                                                <Banknote className="h-4 w-4 text-blue-500" /> {t('Bank transfer')}
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                    {Number(data.amount) > 50000 && data.method === 'orange_money' && (
                                        <div className="flex gap-2 p-2 bg-yellow-50 rounded border border-yellow-100 text-[10px] text-yellow-800">
                                            <AlertCircle className="h-3 w-3 shrink-0" />
                                            <span>{t('Bank transfers (RIB) are mandatory for amounts')} {'>'} 50 000 FCFA.</span>
                                        </div>
                                    )}
                                </div>

                                {data.method === 'orange_money' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">{t('Mobile Money number')}</Label>
                                        <Input 
                                            id="phone" 
                                            value={data.phone_number}
                                            onChange={e => setData('phone_number', e.target.value)}
                                            placeholder="ex: 0707070707"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="bank_name">{t('Bank name')}</Label>
                                            <Input 
                                                id="bank_name" 
                                                value={data.bank_name}
                                                onChange={e => setData('bank_name', e.target.value)}
                                                placeholder="ex: NSIA Banque"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="acc_num">{t('Account number / RIB')}</Label>
                                            <Input 
                                                id="acc_num" 
                                                value={data.account_number}
                                                onChange={e => setData('account_number', e.target.value)}
                                                placeholder="CI..."
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="acc_name">{t('Account name')}</Label>
                                            <Input 
                                                id="acc_name" 
                                                value={data.account_name}
                                                onChange={e => setData('account_name', e.target.value)}
                                                placeholder={t('Full name')}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <Button 
                                    className="w-full gap-2" 
                                    disabled={processing || wallet.balance < 5000 || (Number(data.amount) > 50000 && data.method === 'orange_money')}
                                >
                                    <ArrowUpRight className="h-4 w-4" />
                                    {t('Request a withdrawal')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Historique */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                {t('Withdrawal history')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {withdrawals.data.map((w) => (
                                    <div key={w.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                {w.method === 'orange_money' ? <Smartphone className="h-5 w-5" /> : <Banknote className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <div className="font-bold">{Number(w.amount).toLocaleString()} FCFA</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(w.requested_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {renderStatus(w.status)}
                                            {w.provider_ref && (
                                                <div className="text-[10px] text-muted-foreground mt-1 font-mono">{w.provider_ref}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {withdrawals.data.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <p>{t('You have not made any withdrawal requests yet.')}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ArtistLayout>
    );
}
