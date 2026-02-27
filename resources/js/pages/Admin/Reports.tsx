import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Summary = {
    users_total: number;
    users_new_month: number;
    reservations_total: number;
    reservations_month: number;
    revenue_total: number;
    revenue_month: number;
};

type Props = {
    year: number;
    month: number;
    summary: Summary;
};

export default function Reports({ year, month, summary }: Props) {
    const [selectedYear, setSelectedYear] = useState(String(year));
    const [selectedMonth, setSelectedMonth] = useState(String(month));

    return (
        <AdminLayout title="Rapports admin" subtitle="Generer et exporter les metriques mensuelles.">
            <Head title="Admin - Rapports" />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Parametres</CardTitle>
                        <CardDescription>Choisissez une periode de reporting.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-end gap-3">
                        <div className="space-y-1">
                            <Label>Annee</Label>
                            <Input value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} className="w-28" />
                        </div>
                        <div className="space-y-1">
                            <Label>Mois</Label>
                            <Input value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} className="w-24" />
                        </div>
                        <Button onClick={() => router.get('/admin/reports', { year: selectedYear, month: selectedMonth })}>Actualiser</Button>
                        <Button variant="outline" onClick={() => window.open(`/admin/reports/export?year=${selectedYear}&month=${selectedMonth}`, '_blank')}>
                            Exporter CSV
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <Card><CardHeader className="pb-2"><CardDescription>Utilisateurs total</CardDescription><CardTitle>{summary.users_total}</CardTitle></CardHeader></Card>
                    <Card><CardHeader className="pb-2"><CardDescription>Nouveaux utilisateurs (mois)</CardDescription><CardTitle>{summary.users_new_month}</CardTitle></CardHeader></Card>
                    <Card><CardHeader className="pb-2"><CardDescription>Reservations total</CardDescription><CardTitle>{summary.reservations_total}</CardTitle></CardHeader></Card>
                    <Card><CardHeader className="pb-2"><CardDescription>Reservations (mois)</CardDescription><CardTitle>{summary.reservations_month}</CardTitle></CardHeader></Card>
                    <Card><CardHeader className="pb-2"><CardDescription>Revenus total</CardDescription><CardTitle>{Math.round(summary.revenue_total).toLocaleString()} FCFA</CardTitle></CardHeader></Card>
                    <Card><CardHeader className="pb-2"><CardDescription>Revenus (mois)</CardDescription><CardTitle>{Math.round(summary.revenue_month).toLocaleString()} FCFA</CardTitle></CardHeader></Card>
                </div>
            </div>
        </AdminLayout>
    );
}
