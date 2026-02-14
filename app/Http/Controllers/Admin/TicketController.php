<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    /**
     * Affiche la liste des tickets de support
     * 
     * Route: GET /admin/tickets
     * Middleware: auth, role:admin
     * 
     * Affiche tous les tickets avec filtres :
     * - Par statut (open, in_progress, resolved, closed)
     * - Par type
     * - Par date
     */
    public function index(Request $request): Response
    {
        $query = Ticket::with('user')->latest();

        // Filtre par statut
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filtre par type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $tickets = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Tickets', [
            'tickets' => $tickets,
            'filters' => $request->only(['status', 'type']),
        ]);
    }

    /**
     * Affiche les détails d'un ticket
     * 
     * Route: GET /admin/tickets/{ticket}
     * Middleware: auth, role:admin
     */
    public function show(Ticket $ticket): Response
    {
        $ticket->load('user');

        return Inertia::render('Admin/TicketDetail', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Répond à un ticket
     * 
     * Route: POST /admin/tickets/{ticket}/respond
     * Middleware: auth, role:admin
     * 
     * Logique:
     * 1. Ajoute la réponse admin
     * 2. Change le statut à "in_progress" si ouvert
     * 3. Notifie l'utilisateur
     */
    public function respond(Request $request, Ticket $ticket): RedirectResponse
    {
        $validated = $request->validate([
            'admin_response' => ['required', 'string', 'max:2000'],
        ]);

        $ticket->update([
            'admin_response' => $validated['admin_response'],
            'status' => $ticket->status === 'open' ? 'in_progress' : $ticket->status,
        ]);

        // TODO: Envoyer une notification à l'utilisateur

        return back()->with('message', 'Réponse envoyée à l\'utilisateur.');
    }

    /**
     * Ferme un ticket
     * 
     * Route: PATCH /admin/tickets/{ticket}/close
     * Middleware: auth, role:admin
     */
    public function close(Ticket $ticket): RedirectResponse
    {
        $ticket->update([
            'status' => 'closed',
            'closed_at' => now(),
        ]);

        // TODO: Envoyer une notification à l'utilisateur

        return back()->with('message', 'Ticket fermé.');
    }
}
