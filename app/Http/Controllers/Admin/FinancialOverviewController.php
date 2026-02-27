<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Subscription;
use App\Models\Withdrawal;
use Inertia\Inertia;
use Inertia\Response;

class FinancialOverviewController extends Controller
{
    public function index(): Response
    {
        $now = now();
        $startMonth = $now->copy()->startOfMonth();
        $startYear = $now->copy()->startOfYear();

        $monthlyFlow = collect(range(5, 0))->map(function (int $monthOffset) use ($now): array {
            $start = $now->copy()->subMonths($monthOffset)->startOfMonth();
            $end = $start->copy()->endOfMonth();

            $paymentsTotal = (float) Payment::query()
                ->whereBetween('created_at', [$start, $end])
                ->where('status', 'completed')
                ->sum('amount');

            $subscriptionsTotal = (float) Subscription::query()
                ->whereBetween('created_at', [$start, $end])
                ->where('is_active', true)
                ->sum('price');

            $reservationsGross = (float) Reservation::query()
                ->whereBetween('created_at', [$start, $end])
                ->sum('total_amount');

            $platformCommissions = (float) Reservation::query()
                ->whereBetween('created_at', [$start, $end])
                ->sum('commission_amount');

            $artistsNet = (float) Reservation::query()
                ->whereBetween('created_at', [$start, $end])
                ->sum('artist_earnings');

            $withdrawalsPaid = (float) Withdrawal::query()
                ->whereBetween('created_at', [$start, $end])
                ->where('status', 'completed')
                ->sum('amount');

            return [
                'month' => $start->format('Y-m'),
                'payments_total' => $paymentsTotal,
                'subscriptions_total' => $subscriptionsTotal,
                'reservations_gross' => $reservationsGross,
                'platform_commissions' => $platformCommissions,
                'artists_net' => $artistsNet,
                'withdrawals_paid' => $withdrawalsPaid,
                'total_flow' => $paymentsTotal + $subscriptionsTotal,
            ];
        })->values();

        return Inertia::render('Admin/FinancialOverview', [
            'global' => [
                'payments_completed_total' => (float) Payment::query()->where('status', 'completed')->sum('amount'),
                'payments_completed_month' => (float) Payment::query()->where('status', 'completed')->where('created_at', '>=', $startMonth)->sum('amount'),
                'payments_completed_year' => (float) Payment::query()->where('status', 'completed')->where('created_at', '>=', $startYear)->sum('amount'),
                'subscriptions_revenue_total' => (float) Subscription::query()->sum('price'),
                'subscriptions_revenue_month' => (float) Subscription::query()->where('created_at', '>=', $startMonth)->sum('price'),
                'reservations_gross_total' => (float) Reservation::query()->sum('total_amount'),
                'platform_commissions_total' => (float) Reservation::query()->sum('commission_amount'),
                'artists_earnings_total' => (float) Reservation::query()->sum('artist_earnings'),
                'withdrawals_paid_total' => (float) Withdrawal::query()->where('status', 'completed')->sum('amount'),
                'withdrawals_pending_total' => (float) Withdrawal::query()->where('status', 'pending')->sum('amount'),
            ],
            'monthlyFlow' => $monthlyFlow,
            'topArtists' => Reservation::query()
                ->with('artist.artistProfile:id,user_id,stage_name')
                ->selectRaw('artist_id, SUM(total_amount) as gross_revenue, SUM(commission_amount) as commissions, SUM(artist_earnings) as net_earnings, COUNT(*) as reservations_count')
                ->groupBy('artist_id')
                ->orderByDesc('net_earnings')
                ->limit(10)
                ->get()
                ->map(function ($row): array {
                    $artist = $row->artist;
                    $label = $artist?->artistProfile?->stage_name ?? $artist?->email ?? 'Artiste';

                    return [
                        'artist_id' => $row->artist_id,
                        'artist_name' => $label,
                        'gross_revenue' => (float) $row->gross_revenue,
                        'commissions' => (float) $row->commissions,
                        'net_earnings' => (float) $row->net_earnings,
                        'reservations_count' => (int) $row->reservations_count,
                    ];
                })
                ->values(),
        ]);
    }
}
