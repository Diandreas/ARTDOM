<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ConversationController extends Controller
{
    /**
     * Affiche la liste des conversations
     * 
     * Route: GET /messages
     * Middleware: auth
     * 
     * Affiche toutes les conversations de l'utilisateur :
     * - Triées par date du dernier message
     * - Avec le nombre de messages non lus
     * - Avec l'aperçu du dernier message
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Récupérer les conversations où l'utilisateur est participant
        $conversations = $user->conversations()
            ->with(['participants' => function ($query) use ($user) {
                $query->where('users.id', '!=', $user->id);
            }])
            ->orderBy('last_message_at', 'desc')
            ->get();

        return Inertia::render('Messaging/List', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Affiche une conversation avec ses messages
     * 
     * Route: GET /messages/{conversation}
     * Middleware: auth
     * 
     * Affiche :
     * - Tous les messages de la conversation
     * - Les participants
     * - Marque les messages comme lus
     */
    public function show(Conversation $conversation): Response
    {
        $user = Auth::user();

        // Vérifier que l'utilisateur est participant
        if (!$conversation->participants()->where('users.id', $user->id)->exists()) {
            abort(403);
        }

        // Marquer les messages comme lus
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        // Réinitialiser le compteur de non lus
        $conversation->participants()->updateExistingPivot($user->id, [
            'unread_count' => 0,
            'last_read_at' => now(),
        ]);

        $conversation->load([
            'participants' => function ($query) use ($user) {
                $query->where('users.id', '!=', $user->id);
            },
            'messages' => function ($query) {
                $query->with(['sender', 'replyTo'])->orderBy('sent_at', 'asc');
            },
            'reservation',
        ]);

        return Inertia::render('Messaging/Chat', [
            'conversation' => $conversation,
        ]);
    }

    /**
     * Crée ou trouve une conversation
     * 
     * Route: POST /messages
     * Middleware: auth
     * 
     * Logique:
     * 1. Si réservation_id fourni : trouve ou crée la conversation liée
     * 2. Sinon : trouve ou crée une conversation entre deux utilisateurs
     */
    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'reservation_id' => ['nullable', 'exists:reservations,id'],
            'user_id' => ['nullable', 'exists:users,id', 'different:'.Auth::id()],
        ]);

        // Si réservation_id fourni, trouver ou créer la conversation liée
        if ($validated['reservation_id'] ?? null) {
            $reservation = Reservation::findOrFail($validated['reservation_id']);

            // Vérifier que l'utilisateur est lié à cette réservation
            if ($reservation->client_id !== $user->id && $reservation->artist_id !== $user->id) {
                abort(403);
            }

            $conversation = $reservation->conversation ?? Conversation::create([
                'reservation_id' => $reservation->id,
            ]);

            // Ajouter les participants si pas déjà présents
            if (!$conversation->participants()->where('users.id', $reservation->client_id)->exists()) {
                $conversation->participants()->attach($reservation->client_id);
            }
            if (!$conversation->participants()->where('users.id', $reservation->artist_id)->exists()) {
                $conversation->participants()->attach($reservation->artist_id);
            }
        } else {
            // Conversation directe entre deux utilisateurs
            $otherUser = User::findOrFail($validated['user_id']);

            // Chercher une conversation existante
            $conversation = Conversation::whereHas('participants', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
                ->whereHas('participants', function ($query) use ($otherUser) {
                    $query->where('users.id', $otherUser->id);
                })
                ->whereNull('reservation_id')
                ->first();

            // Créer si n'existe pas
            if (!$conversation) {
                $conversation = Conversation::create();
                $conversation->participants()->attach([$user->id, $otherUser->id]);
            }
        }

        return redirect()->route('messages.show', $conversation);
    }

    /**
     * Archive une conversation
     * 
     * Route: PATCH /messages/{conversation}/archive
     * Middleware: auth
     */
    public function archive(Conversation $conversation): RedirectResponse
    {
        $user = Auth::user();

        if (!$conversation->participants()->where('users.id', $user->id)->exists()) {
            abort(403);
        }

        $conversation->update(['is_archived' => true]);

        return redirect()->route('messages.index')->with('message', 'Conversation archivée.');
    }
}
