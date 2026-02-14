<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Availability extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'artist_id',
        'date',
        'start_time',
        'end_time',
        'is_booked',
        'is_blocked',
        'block_reason',
        'repeat_rule',
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
            'date' => 'date',
            'is_booked' => 'boolean',
            'is_blocked' => 'boolean',
        ];
    }

    /**
     * Relation : Availability appartient à UN User (artiste)
     * Relation N-1 (belongsTo) : Un créneau de disponibilité appartient à un artiste
     */
    public function artist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'artist_id');
    }

    /**
     * Scopes pour filtrer les disponibilités
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_booked', false)
            ->where('is_blocked', false);
    }

    public function scopeByDate($query, string $date)
    {
        return $query->where('date', $date);
    }

    public function scopeByMonth($query, int $year, int $month)
    {
        return $query->whereYear('date', $year)
            ->whereMonth('date', $month);
    }
}
