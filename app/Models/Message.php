<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'content',
        'type',
        'media_url',
        'duration_seconds',
        'reply_to_id',
        'is_deleted',
        'is_read',
        'reactions',
        'sent_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'string',
            'is_deleted' => 'boolean',
            'is_read' => 'boolean',
            'reactions' => 'array',
            'sent_at' => 'datetime',
        ];
    }

    /**
     * Relation : Message appartient à UN Conversation
     * Relation N-1 (belongsTo) : Un message appartient à une conversation
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Relation : Message appartient à UN User (expéditeur)
     * Relation N-1 (belongsTo) : Un message a un expéditeur
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Relation : Message peut répondre à UN autre Message
     * Relation N-1 (belongsTo) : Un message peut répondre à un autre message
     * 
     * Note : Relation auto-référentielle (le modèle Message référence lui-même)
     */
    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'reply_to_id');
    }
}
