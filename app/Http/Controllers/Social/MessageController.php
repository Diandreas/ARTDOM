<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    /**
     * Envoie un message dans une conversation
     * 
     * Route: POST /messages/{conversation}/send
     * Middleware: auth
     * 
     * Logique:
     * 1. Vérifie que l'utilisateur est participant
     * 2. Crée le message
     * 3. Met à jour la conversation (dernier message, date)
     * 4. Incrémente le compteur de non lus pour les autres participants
     * 5. Broadcast via Reverb (WebSocket) pour temps réel
     */
    public function store(Request $request, Conversation $conversation): RedirectResponse
    {
        $user = Auth::user();

        // Vérifier que l'utilisateur est participant
        if (!$conversation->participants()->where('users.id', $user->id)->exists()) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => ['nullable', 'string', 'max:5000'],
            'type' => ['required', 'in:text,image,audio,video,file'],
            'media' => ['required_if:type,image,audio,video,file', 'file', 'max:10240'], // 10MB
            'reply_to_id' => ['nullable', 'exists:messages,id'],
        ]);

        $mediaUrl = null;

        // Upload du média si fourni
        if ($request->hasFile('media')) {
            $path = $request->file('media')->store('conversations/'.$conversation->id.'/media', 'public');
            $mediaUrl = Storage::url($path);
        }

        // Créer le message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'content' => $validated['content'] ?? null,
            'type' => $validated['type'],
            'media_url' => $mediaUrl,
            'reply_to_id' => $validated['reply_to_id'] ?? null,
            'sent_at' => now(),
        ]);

        // Mettre à jour la conversation
        $conversation->update([
            'last_message' => $message->content ?? '[Média]',
            'last_message_at' => now(),
        ]);

        // Incrémenter le compteur de non lus pour les autres participants
        $conversation->participants()
            ->where('users.id', '!=', $user->id)
            ->increment('unread_count');

        // TODO: Broadcast via Reverb pour temps réel
        // broadcast(new MessageSent($message))->toOthers();

        return back()->with('message', 'Message envoyé.');
    }

    /**
     * Supprime un message
     * 
     * Route: DELETE /messages/{conversation}/messages/{message}
     * Middleware: auth
     * 
     * Logique:
     * - Si < 1h : peut supprimer pour tous
     * - Sinon : supprime seulement pour soi (soft delete)
     */
    public function destroy(Conversation $conversation, Message $message): RedirectResponse
    {
        $user = Auth::user();

        // Vérifier que le message appartient à la conversation
        if ($message->conversation_id !== $conversation->id) {
            abort(404);
        }

        // Vérifier que c'est l'expéditeur
        if ($message->sender_id !== $user->id) {
            abort(403);
        }

        // Si < 1h, supprimer complètement
        if ($message->sent_at->diffInHours(now()) < 1) {
            // Supprimer le fichier média si existe
            if ($message->media_url) {
                $path = str_replace('/storage/', '', $message->media_url);
                Storage::disk('public')->delete($path);
            }
            $message->delete();
        } else {
            // Soft delete (marquer comme supprimé)
            $message->update(['is_deleted' => true]);
        }

        return back()->with('message', 'Message supprimé.');
    }

    /**
     * Marque tous les messages d'une conversation comme lus
     * 
     * Route: PATCH /messages/{conversation}/read
     * Middleware: auth
     */
    public function markRead(Conversation $conversation): RedirectResponse
    {
        $user = Auth::user();

        if (!$conversation->participants()->where('users.id', $user->id)->exists()) {
            abort(403);
        }

        // Marquer tous les messages comme lus
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        // Réinitialiser le compteur
        $conversation->participants()->updateExistingPivot($user->id, [
            'unread_count' => 0,
            'last_read_at' => now(),
        ]);

        return back();
    }
}
