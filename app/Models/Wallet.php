<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'artist_id',
        'balance',
        'pending_balance',
        'currency',
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
            'balance' => 'decimal:2',
            'pending_balance' => 'decimal:2',
        ];
    }

    /**
     * Relation : Wallet appartient à UN User (artiste)
     * Relation N-1 (belongsTo) : Un portefeuille appartient à un artiste
     */
    public function artist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'artist_id');
    }

    /**
     * Relation : Wallet a PLUSIEURS WalletTransactions
     * Relation 1-N (hasMany) : Un portefeuille a plusieurs transactions
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    /**
     * Relation : Wallet a PLUSIEURS Withdrawals
     * Relation 1-N (hasMany) : Un portefeuille peut avoir plusieurs retraits
     */
    public function withdrawals(): HasMany
    {
        return $this->hasMany(Withdrawal::class);
    }

    /**
     * Crédite le portefeuille d'un montant
     * 
     * @param float $amount Le montant à créditer
     * @param string $source La source du crédit (ex: 'prestation', 'album_sale')
     * @param string|null $referenceId L'ID de référence (ex: reservation_id)
     */
    public function credit(float $amount, string $source, ?string $referenceId = null): WalletTransaction
    {
        $commissionRate = config('artdom.commission_rate', 0.15); // 15% par défaut
        $commission = $amount * $commissionRate;
        $netAmount = $amount - $commission;

        $this->balance += $netAmount;
        $this->save();

        return $this->transactions()->create([
            'type' => 'credit_'.$source,
            'amount' => $amount,
            'commission' => $commission,
            'net_amount' => $netAmount,
            'source' => $source,
            'reference_id' => $referenceId,
            'balance_after' => $this->balance,
        ]);
    }

    /**
     * Débite le portefeuille d'un montant
     */
    public function debit(float $amount): WalletTransaction
    {
        $this->balance -= $amount;
        $this->save();

        return $this->transactions()->create([
            'type' => 'debit_withdrawal',
            'amount' => $amount,
            'commission' => 0,
            'net_amount' => $amount,
            'balance_after' => $this->balance,
        ]);
    }

    /**
     * Libère un montant du solde en attente vers le solde disponible
     * Utilisé quand une réservation est complétée
     */
    public function release(string $reservationId): void
    {
        // Logique à implémenter : transférer de pending_balance vers balance
        // Cette méthode sera complétée avec la logique métier
    }
}
