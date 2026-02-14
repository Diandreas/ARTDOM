<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Affiche le tableau de bord admin
     * 
     * Route: GET /admin
     * Middleware: auth, role:admin
     * 
     * Affiche les statistiques globales :
     * - Nombre d'utilisateurs (clients, artistes)
     * - Réservations (total, ce mois)
     * - Revenus (total, ce mois)
     * - Tickets ouverts
     * - Artistes en attente de validation
     */
    public function index(): Response
    {
        // Statistiques utilisateurs
        $totalClients = User::where('role', 'client')->count();
        $totalArtists = User::where('role', 'artist')->count();
        $newUsersThisMonth = User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Statistiques réservations
        $totalReservations = Reservation::count();
        $reservationsThisMonth = Reservation::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $pendingReservations = Reservation::where('status', 'pending')->count();

        // Revenus (total des commissions)
        $totalRevenue = Reservation::sum('commission_amount');
        $revenueThisMonth = Reservation::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('commission_amount');

        // Tickets
        $openTickets = Ticket::where('status', 'open')->count();
        $pendingTickets = Ticket::where('status', 'in_progress')->count();

        // Artistes en attente de validation
        $pendingArtists = User::where('role', 'artist')
            ->whereHas('artistProfile', function ($query) {
                $query->where('verification_status', 'pending');
            })
            ->count();

        // Graphique des revenus (7 derniers jours)
        $revenueChart = Reservation::where('created_at', '>=', now()->subDays(7))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(commission_amount) as amount'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => $item->date,
                'amount' => (float) $item->amount,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => [
                    'total_clients' => $totalClients,
                    'total_artists' => $totalArtists,
                    'new_this_month' => $newUsersThisMonth,
                ],
                'reservations' => [
                    'total' => $totalReservations,
                    'this_month' => $reservationsThisMonth,
                    'pending' => $pendingReservations,
                ],
                'revenue' => [
                    'total' => $totalRevenue,
                    'this_month' => $revenueThisMonth,
                ],
                'tickets' => [
                    'open' => $openTickets,
                    'in_progress' => $pendingTickets,
                ],
                'artists' => [
                    'pending_validation' => $pendingArtists,
                ],
            ],
            'revenueChart' => $revenueChart,
        ]);
    }
}
