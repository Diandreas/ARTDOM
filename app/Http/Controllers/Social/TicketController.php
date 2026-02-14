<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    /**
     * Affiche la liste des tickets de support
     * 
     * Route: GET /support
     * Middleware: auth
     * 
     * Affiche l'historique des tickets de l'utilisateur
     */
    public function index(): Response
    {
        $user = Auth::user();

        $tickets = Ticket::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Support/Index', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Crée un nouveau ticket de support
     * 
     * Route: POST /support
     * Middleware: auth
     * 
     * Logique:
     * 1. Valide les données
     * 2. Upload les pièces jointes
     * 3. Génère un numéro de ticket unique
     * 4. Crée le ticket
     * 5. Notifie les admins
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:suggestion,complaint,bug,question,other'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
            'attachments' => ['nullable', 'array', 'max:5'],
            'attachments.*' => ['file', 'max:10240'], // 10MB max par fichier
        ]);

        $user = Auth::user();

        // Upload des pièces jointes
        $attachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('support/tickets/'.$user->id, 'public');
                $attachments[] = Storage::url($path);
            }
        }

        // Générer un numéro de ticket unique
        $ticketNumber = 'TKT-'.strtoupper(Str::random(8));

        $ticket = Ticket::create([
            'ticket_number' => $ticketNumber,
            'user_id' => $user->id,
            'type' => $validated['type'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'attachments' => $attachments,
            'status' => 'open',
        ]);

        // TODO: Notifier les admins

        return redirect()->route('support.show', $ticket)
            ->with('message', 'Ticket créé. Numéro: '.$ticketNumber);
    }

    /**
     * Affiche les détails d'un ticket
     * 
     * Route: GET /support/{ticket}
     * Middleware: auth
     */
    public function show(Ticket $ticket): Response
    {
        if ($ticket->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Support/Show', [
            'ticket' => $ticket,
        ]);
    }
}
