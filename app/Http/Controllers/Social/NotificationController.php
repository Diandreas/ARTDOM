<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Affiche la liste des notifications
     * 
     * Route: GET /notifications
     * Middleware: auth
     * 
     * Affiche les notifications groupées par type :
     * - Toutes
     * - Réservations
     * - Messages
     * - Activité
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $type = $request->input('type', 'all');

        $query = $user->notifications()->latest();

        // Filtrer par type si spécifié
        if ($type !== 'all') {
            $query->where('type', 'like', '%'.ucfirst($type).'%');
        }

        $notifications = $query->paginate(20);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'activeType' => $type,
        ]);
    }

    /**
     * Marque une notification comme lue
     * 
     * Route: PATCH /notifications/{id}/read
     * Middleware: auth
     */
    public function markRead(string $id): RedirectResponse
    {
        $user = Auth::user();
        $notification = $user->notifications()->findOrFail($id);

        $notification->markAsRead();

        return back();
    }

    /**
     * Marque toutes les notifications comme lues
     * 
     * Route: PATCH /notifications/read-all
     * Middleware: auth
     */
    public function markAllRead(): RedirectResponse
    {
        $user = Auth::user();
        $user->unreadNotifications->markAsRead();

        return back()->with('message', 'Toutes les notifications ont été marquées comme lues.');
    }

    /**
     * Supprime une notification
     * 
     * Route: DELETE /notifications/{id}
     * Middleware: auth
     */
    public function destroy(string $id): RedirectResponse
    {
        $user = Auth::user();
        $notification = $user->notifications()->findOrFail($id);

        $notification->delete();

        return back()->with('message', 'Notification supprimée.');
    }
}
