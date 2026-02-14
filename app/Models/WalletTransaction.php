<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletTransaction extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'wallet_id',
        'type',
        'amount',
        'commission',
        'net_amount',
        'source',
        'reference_id',
        'reference_type',
        'balance_after',
        'note',
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
            'amount' => 'decimal:2',
            'commission' => 'decimal:2',
            'net_amount' => 'decimal:2',
            'balance_after' => 'decimal:2',
        ];
    }

    /**
     * Relation : WalletTransaction appartient à UN Wallet
     * Relation N-1 (belongsTo) : Une transaction appartient à un portefeuille
     */
    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }
}
