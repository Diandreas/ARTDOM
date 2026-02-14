<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'reservation_id',
        'last_message',
        'last_message_at',
        'is_archived',
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
            'last_message_at' => 'datetime',
            'is_archived' => 'boolean',
        ];
    }

    /**
     * Relation : Conversation a PLUSIEURS Users (participants)
     * Relation N-N (belongsToMany) : Une conversation a plusieurs participants
     * 
     * Table pivot : conversation_user
     * Colonnes pivot : unread_count, last_read_at
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_user')
            ->withPivot('unread_count', 'last_read_at')
            ->withTimestamps();
    }

    /**
     * Relation : Conversation a PLUSIEURS Messages
     * Relation 1-N (hasMany) : Une conversation contient plusieurs messages
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('sent_at');
    }

    /**
     * Relation : Conversation peut être liée à UN Reservation (optionnel)
     * Relation N-1 (belongsTo) : Une conversation peut être liée à une réservation
     */
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }
}
