<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function index(Request $request): Response
    {
        $client = Auth::user();

        $query = Reservation::with(['artist.artistProfile', 'service'])
            ->where('client_id', $client->id);

        // Filter by status tab
        $status = $request->query('status');
        if ($status && in_array($status, ['upcoming', 'past', 'cancelled'])) {
            if ($status === 'upcoming') {
                $query->where('scheduled_at', '>=', now())
                    ->whereNotIn('status', ['cancelled', 'completed']);
            } elseif ($status === 'past') {
                $query->where(function ($q) {
                    $q->where('scheduled_at', '<', now())
                        ->orWhere('status', 'completed');
                });
            } elseif ($status === 'cancelled') {
                $query->where('status', 'cancelled');
            }
        }

        // Filter by date
        if ($request->filled('date_from')) {
            $query->where('scheduled_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('scheduled_at', '<=', $request->date_to);
        }

        // Search by reservation number
        if ($request->filled('search')) {
            $query->where('reservation_number', 'like', '%'.$request->search.'%');
        }

        $reservations = $query->latest()->get()->map(function ($reservation) {
            return [
                'id' => $reservation->id,
                'reservation_number' => $reservation->reservation_number,
                'status' => $reservation->status,
                'scheduled_at' => $reservation->scheduled_at->toISOString(),
                'total_amount' => (float) $reservation->total_amount,
                'service' => [
                    'id' => $reservation->service->id,
                    'title' => $reservation->service->title,
                ],
                'artist' => [
                    'id' => $reservation->artist->id,
                    'stage_name' => $reservation->artist->artistProfile->stage_name ?? $reservation->artist->name,
                    'profile_photo' => $reservation->artist->profile_photo,
                ],
            ];
        });

        // Calculate stats
        $upcomingCount = Reservation::where('client_id', $client->id)
            ->where('scheduled_at', '>=', now())
            ->whereNotIn('status', ['cancelled', 'completed'])
            ->count();

        $pastCount = Reservation::where('client_id', $client->id)
            ->where(function ($q) {
                $q->where('scheduled_at', '<', now())
                    ->orWhere('status', 'completed');
            })
            ->count();

        $cancelledCount = Reservation::where('client_id', $client->id)
            ->where('status', 'cancelled')
            ->count();

        return Inertia::render('Client/reservations', [
            'reservations' => $reservations,
            'stats' => [
                'upcoming' => $upcomingCount,
                'past' => $pastCount,
                'cancelled' => $cancelledCount,
            ],
            'filters' => [
                'status' => $status,
                'search' => $request->query('search'),
                'date_from' => $request->query('date_from'),
                'date_to' => $request->query('date_to'),
            ],
        ]);
    }

    public function show(string $id): Response
    {
        $client = Auth::user();

        $reservation = Reservation::with(['artist.artistProfile', 'service', 'payment'])
            ->where('client_id', $client->id)
            ->findOrFail($id);

        // Generate QR Code
        $qrService = app(\App\Services\QRCodeService::class);
        $qrCode = $qrService->generateBase64(
            json_encode([
                'type' => 'reservation',
                'id' => $reservation->id,
                'number' => $reservation->reservation_number,
            ])
        );

        return Inertia::render('Client/reservation-detail', [
            'reservation' => [
                'id' => $reservation->id,
                'reservation_number' => $reservation->reservation_number,
                'status' => $reservation->status,
                'scheduled_at' => $reservation->scheduled_at->toISOString(),
                'duration_minutes' => $reservation->duration_minutes,
                'total_amount' => (float) $reservation->total_amount,
                'commission_amount' => (float) $reservation->commission_amount,
                'location_type' => $reservation->location_type,
                'location_address' => $reservation->location_address,
                'recipient_name' => $reservation->recipient_name,
                'emotion_type' => $reservation->emotion_type,
                'custom_message' => $reservation->custom_message,
                'qr_code' => $qrCode,
                'created_at' => $reservation->created_at->toISOString(),
                'service' => [
                    'id' => $reservation->service->id,
                    'title' => $reservation->service->title,
                    'duration_minutes' => $reservation->service->duration_minutes,
                ],
                'artist' => [
                    'id' => $reservation->artist->id,
                    'stage_name' => $reservation->artist->artistProfile->stage_name ?? $reservation->artist->name,
                    'profile_photo' => $reservation->artist->profile_photo,
                    'city' => $reservation->artist->city,
                ],
                'payment' => $reservation->payment ? [
                    'id' => $reservation->payment->id,
                    'method' => $reservation->payment->method,
                    'status' => $reservation->payment->status,
                    'paid_at' => $reservation->payment->paid_at?->toISOString(),
                ] : null,
            ],
        ]);
    }

    public function cancel(string $id): RedirectResponse
    {
        $client = Auth::user();

        $reservation = Reservation::where('client_id', $client->id)->findOrFail($id);

        // Check if cancellation is allowed (e.g., > 48h before event)
        if ($reservation->scheduled_at->diffInHours(now()) < 48) {
            return back()->withErrors([
                'cancellation' => 'Les réservations ne peuvent être annulées moins de 48h avant la prestation.',
            ]);
        }

        if (in_array($reservation->status, ['cancelled', 'completed'])) {
            return back()->withErrors([
                'cancellation' => 'Cette réservation ne peut pas être annulée.',
            ]);
        }

        $reservation->update(['status' => 'cancelled']);

        // Refund payment if applicable
        if ($reservation->payment && $reservation->payment->status === 'completed') {
            $reservation->payment->update([
                'status' => 'refunded',
                'refunded_at' => now(),
            ]);
        }

        return redirect()
            ->route('client.reservations.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Réservation annulée avec succès. Vous serez remboursé sous 3-5 jours ouvrés.',
            ]);
    }

    public function review(Request $request, string $id): RedirectResponse
    {
        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        // TODO: Créer le review réel
        return back()->with('message', 'Votre avis a été enregistré. Merci !');
    }
}
