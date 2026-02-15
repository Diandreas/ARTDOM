<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        // Reservetions récentes
        $reservations = $user->reservations()
            ->with(['artist.artistProfile', 'service'])
            ->latest()
            ->limit(5)
            ->get();

        // Statistiques
        $stats = [
            'reservations_count' => $user->reservations()->count(),
            'favorites_count' => 0, // TODO: Implémenter les favoris
            'total_spent' => $user->reservations()->where('status', 'completed')->sum('total_amount'),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentReservations' => $reservations,
        ]);
    }
}
