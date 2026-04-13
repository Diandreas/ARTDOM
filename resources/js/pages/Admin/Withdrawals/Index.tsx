import { Head, router, useForm } from '@inertiajs/react';
import { 
    CheckCircle2, 
    Clock, 
    MoreHorizontal, 
    XCircle, 
    Banknote, 
    Smartphone,
    AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppLocale } from '@/hooks/use-app-locale';

interface Withdrawal {
    id: string;
    amount: number;
    method: 'orange_money' | 'bank_transfer';
    account_details: any;
    status: 'pending' | 'completed' | 'rejected';
    requested_at: string;
    processed_at: string | null;
    provider_ref: string | null;
    wallet?: {
        artist?: {
            name: string;
            artist_profile?: {
                stage_name: string;
            }
        }
    }
}

interface Props {
    withdrawals: {
        data: Withdrawal[];
        links: any[];
    };
    currentStatus: string;
}

export default function Index({ withdrawals, currentStatus }: Props) {
    const { t } = useAppLocale();
    const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);

    const approveForm = useForm({
        provider_ref: '',
    });

    const rejectForm = useForm({
        reason: '',
    });

    const handleStatusChange = (status: string) => {
        router.get('/admin/withdrawals', { status }, { preserveState: true });
    };

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedWithdrawal) {
            approveForm.post(`/admin/withdrawals/${selectedWithdrawal.id}/approve`, {
                onSuccess: () => {
                    setIsApproveOpen(false);
                    setSelectedWithdrawal(null);
                    approveForm.reset();
                }
            });
        }
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedWithdrawal) {
            rejectForm.post(`/admin/withdrawals/${selectedWithdrawal.id}/reject`, {
                onSuccess: () => {
                    setIsRejectOpen(false);
                    setSelectedWithdrawal(null);
                    rejectForm.reset();
                }
            });
        }
    };

    const renderMethod = (method: string) => {
        if (method === 'orange_money') {
            return (
                <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-orange-500" />
                    <span>Orange Money</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-blue-500" />
                <span>{t('Bank transfer')}</span>
            </div>
        );
    };

    const renderStatus = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1"><Clock className="h-3 w-3" /> {t('Pending')}</Badge>;
            case 'completed':
                return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 gap-1"><CheckCircle2 className="h-3 w-3" /> {t('Processed')}</Badge>;
            case 'rejected':
                return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> {t('Rejected')}</Badge>;
            default:
                return <Badge>{t(status)}</Badge>;
        }
    };

    return (
        <AdminLayout title={t('Withdrawals management')} subtitle={t('Process artist withdrawal requests.')}>
            <Head title={`Admin - ${t('Withdrawals')}`} />

            <div className="space-y-6">
                <Tabs value={currentStatus} onValueChange={handleStatusChange} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-4">
                        <TabsTrigger value="pending">{t('Pending')}</TabsTrigger>
                        <TabsTrigger value="completed">{t('Processed')}</TabsTrigger>
                        <TabsTrigger value="rejected">{t('Rejected')}</TabsTrigger>
                        <TabsTrigger value="all">{t('All')}</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('Withdrawal requests')}</CardTitle>
                        <CardDescription>
                            {t('Bank transfers (RIB) are mandatory for amounts')} {'>'} 50 000 FCFA.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="py-3 px-2">{t('Artist')}</th>
                                    <th className="py-3 px-2">{t('Amount')}</th>
                                    <th className="py-3 px-2">{t('Method')}</th>
                                    <th className="py-3 px-2">{t('Account details')}</th>
                                    <th className="py-3 px-2">{t('Request Date')}</th>
                                    <th className="py-3 px-2 text-center">{t('Status')}</th>
                                    <th className="py-3 px-2 text-right">{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawals.data.map((w) => (
                                    <tr key={w.id} className="border-b align-middle hover:bg-muted/30">
                                        <td className="py-4 px-2">
                                            <div className="font-medium text-foreground">
                                                {w.wallet?.artist?.artist_profile?.stage_name || w.wallet?.artist?.name || t('Unknown')}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground uppercase">{w.id.substring(0, 8)}</div>
                                        </td>
                                        <td className="py-4 px-2 font-bold text-primary">
                                            {Number(w.amount).toLocaleString()} FCFA
                                        </td>
                                        <td className="py-4 px-2">
                                            {renderMethod(w.method)}
                                        </td>
                                        <td className="py-4 px-2 max-w-[200px]">
                                            {w.method === 'orange_money' ? (
                                                <span className="font-mono">{w.account_details?.phone}</span>
                                            ) : (
                                                <div className="text-xs">
                                                    <div className="font-semibold">{w.account_details?.bank}</div>
                                                    <div className="truncate">{w.account_details?.account}</div>
                                                    <div className="text-muted-foreground italic truncate">{w.account_details?.name}</div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-2 text-muted-foreground">
                                            {new Date(w.requested_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                            {renderStatus(w.status)}
                                        </td>
                                        <td className="py-4 px-2 text-right">
                                            {w.status === 'pending' ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem 
                                                            onClick={() => {
                                                                setSelectedWithdrawal(w);
                                                                setIsApproveOpen(true);
                                                            }}
                                                            className="text-green-600"
                                                        >
                                                            <CheckCircle2 className="mr-2 h-4 w-4" /> {t('Mark as paid')}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => {
                                                                setSelectedWithdrawal(w);
                                                                setIsRejectOpen(true);
                                                            }}
                                                            className="text-destructive"
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4" /> {t('Reject request')}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            ) : (
                                                <div className="text-[10px] text-muted-foreground italic">
                                                    {w.provider_ref || '-'}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {withdrawals.data.length === 0 && (
                            <div className="py-12 text-center">
                                <AlertCircle className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                                <p className="text-muted-foreground">{t('No withdrawal requests found.')}</p>
                            </div>
                        )}

                        <div className="mt-6 flex flex-wrap gap-2">
                            {withdrawals.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Approve Dialog */}
            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('Confirm payment')}</DialogTitle>
                        <DialogDescription>
                            {t('Enter transaction reference (Orange Money ID or transfer reference).')}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleApprove} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="ref">{t('Transaction reference')}</Label>
                            <Input 
                                id="ref" 
                                value={approveForm.data.provider_ref}
                                onChange={e => approveForm.setData('provider_ref', e.target.value)}
                                placeholder="ex: OM_123456789"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsApproveOpen(false)}>{t('Cancel')}</Button>
                            <Button type="submit" disabled={approveForm.processing}>{t('Confirm payment')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('Reject request')}</DialogTitle>
                        <DialogDescription>
                            {t('Explain why the request is rejected. The artist will be refunded to their balance.')}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReject} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">{t('Rejection reason')}</Label>
                            <Textarea 
                                id="reason" 
                                value={rejectForm.data.reason}
                                onChange={e => rejectForm.setData('reason', e.target.value)}
                                placeholder="ex: Coordonnées bancaires invalides"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsRejectOpen(false)}>{t('Cancel')}</Button>
                            <Button variant="destructive" type="submit" disabled={rejectForm.processing}>{t('Reject and refund')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
