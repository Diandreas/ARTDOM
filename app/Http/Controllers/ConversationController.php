<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $conversations = $user->conversations()
            ->with(['participants', 'messages' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->orderBy('last_message_at', 'desc')
            ->get();

        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
        ]);
    }

    public function show(Conversation $conversation): Response
    {
        // Security check: user must be participant
        if (!$conversation->participants->contains(Auth::id())) {
            abort(403);
        }

        $conversation->load(['participants', 'messages.sender', 'reservation.service']);

        // Mark messages as read for this user
        $conversation->participants()->updateExistingPivot(Auth::id(), [
            'unread_count' => 0,
            'last_read_at' => now(),
        ]);

        return Inertia::render('Messages/Show', [
            'conversation' => $conversation,
        ]);
    }

    public function store(Request $request, Conversation $conversation)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        if (!$conversation->participants->contains(Auth::id())) {
            abort(403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => Auth::id(),
            'content' => $request->content,
            'sent_at' => now(),
        ]);

        $conversation->update([
            'last_message' => $request->content,
            'last_message_at' => now(),
        ]);

        // Increment unread count for other participants
        foreach ($conversation->participants as $participant) {
            if ($participant->id !== Auth::id()) {
                $conversation->participants()->updateExistingPivot($participant->id, [
                    'unread_count' => \DB::raw('unread_count + 1'),
                ]);
            }
        }

        return back();
    }

    public function contact(Reservation $reservation)
    {
        // Try to find existing conversation for this reservation
        $conversation = Conversation::where('reservation_id', $reservation->id)->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'reservation_id' => $reservation->id,
                'last_message_at' => now(),
            ]);

            // Add participants: client and artist
            $conversation->participants()->attach([
                $reservation->client_id,
                $reservation->artist_id
            ]);
        }

        return redirect()->route('messages.show', $conversation->id);
    }
}
