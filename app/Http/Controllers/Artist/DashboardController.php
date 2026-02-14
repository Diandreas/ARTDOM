<?php

namespace App\Http\Controllers\Artist;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Reservation;
use App\Models\Video;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Affiche le tableau de bord de l'artiste avec les KPIs
     * 
     * Route: GET /artist/dashboard
     * Middleware: auth, role:artist
     * 
     * Affiche les indicateurs clés :
     * - Revenus (mois en cours, comparaison avec mois précédent)
     * - Réservations (en attente, confirmées, terminées)
     * - Nouveaux abonnés (cette semaine)
     * - Écoutes de morceaux (cette semaine)
     * - Vues de vidéos (cette semaine)
     * - Prochaine prestation
     * - Notifications importantes
     */
    public function index(): Response
    {
        $artist = Auth::user();

        // Revenus du mois en cours
        $currentMonthRevenue = Wallet::where('artist_id', $artist->id)
            ->first()
            ?->transactions()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->where('type', 'like', 'credit_%')
            ->sum('net_amount') ?? 0;

        // Revenus du mois précédent
        $lastMonthRevenue = Wallet::where('artist_id', $artist->id)
            ->first()
            ?->transactions()
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->where('type', 'like', 'credit_%')
            ->sum('net_amount') ?? 0;

        // Calcul du pourcentage de variation
        $revenueChange = $lastMonthRevenue > 0
            ? (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100
            : 0;

        // Réservations
        $pendingReservations = Reservation::where('artist_id', $artist->id)
            ->where('status', ReservationStatus::Pending)
            ->count();

        $confirmedReservations = Reservation::where('artist_id', $artist->id)
            ->where('status', ReservationStatus::Confirmed)
            ->count();

        $completedReservations = Reservation::where('artist_id', $artist->id)
            ->where('status', ReservationStatus::Completed)
            ->count();

        // Prochaine prestation
        $nextReservation = Reservation::where('artist_id', $artist->id)
            ->whereIn('status', [ReservationStatus::Pending, ReservationStatus::Confirmed])
            ->where('scheduled_at', '>=', now())
            ->with(['client.clientProfile', 'service'])
            ->orderBy('scheduled_at', 'asc')
            ->first();

        // Nouveaux abonnés cette semaine
        $newFollowers = $artist->artistProfile
            ->followers()
            ->wherePivot('created_at', '>=', now()->startOfWeek())
            ->count();

        // Écoutes de morceaux cette semaine
        $playsThisWeek = Album::where('artist_id', $artist->id)
            ->withSum('tracks', 'plays')
            ->get()
            ->sum('tracks_sum_plays') ?? 0;

        // Vues de vidéos cette semaine
        $videoViewsThisWeek = Video::where('artist_id', $artist->id)
            ->where('created_at', '>=', now()->startOfWeek())
            ->sum('views');

        // Graphique des revenus (7 derniers jours)
        $revenueChart = Wallet::where('artist_id', $artist->id)
            ->first()
            ?->transactions()
            ->where('created_at', '>=', now()->subDays(7))
            ->where('type', 'like', 'credit_%')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(net_amount) as amount'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => $item->date,
                'amount' => (float) $item->amount,
            ]) ?? collect();

        return Inertia::render('Artist/Dashboard', [
            'kpis' => [
                'revenue' => [
                    'current' => $currentMonthRevenue,
                    'last' => $lastMonthRevenue,
                    'change' => round($revenueChange, 2),
                ],
                'reservations' => [
                    'pending' => $pendingReservations,
                    'confirmed' => $confirmedReservations,
                    'completed' => $completedReservations,
                ],
                'followers' => [
                    'new_this_week' => $newFollowers,
                    'total' => $artist->artistProfile->followers()->count(),
                ],
                'content' => [
                    'plays_this_week' => $playsThisWeek,
                    'video_views_this_week' => $videoViewsThisWeek,
                ],
            ],
            'nextReservation' => $nextReservation,
            'revenueChart' => $revenueChart,
        ]);
    }
}
