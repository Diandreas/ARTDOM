<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use App\Models\Withdrawal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class WithdrawalController extends Controller
{
    public function index(): Response
    {
        $artist = Auth::user();
        $wallet = Wallet::where('artist_id', $artist->id)->first();
        
        if (!$wallet) {
            $wallet = Wallet::create([
                'artist_id' => $artist->id,
                'balance' => 0,
                'pending_balance' => 0,
                'currency' => 'XOF'
            ]);
        }

        $withdrawals = Withdrawal::where('wallet_id', $wallet->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Artist/Withdrawals', [
            'wallet' => $wallet,
            'withdrawals' => $withdrawals,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $artist = Auth::user();
        $wallet = Wallet::where('artist_id', $artist->id)->firstOrFail();

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:5000', 'max:'.$wallet->balance],
            'method' => ['required', 'string', 'in:orange_money,bank_transfer'],
            // If amount > 50000, bank_transfer is mandatory? 
            // Or just check if details are provided for the chosen method
            'phone_number' => ['required_if:method,orange_money', 'nullable', 'string'],
            'bank_name' => ['required_if:method,bank_transfer', 'nullable', 'string'],
            'account_number' => ['required_if:method,bank_transfer', 'nullable', 'string'],
            'account_name' => ['required_if:method,bank_transfer', 'nullable', 'string'],
        ]);

        // Enforcement: RIB for > 50k
        if ($validated['amount'] > 50000 && $validated['method'] !== 'bank_transfer') {
            return back()->withErrors(['method' => 'Pour les montants supérieurs à 50 000 FCFA, le virement bancaire est obligatoire.']);
        }

        $accountDetails = $validated['method'] === 'orange_money' 
            ? ['phone' => $validated['phone_number']]
            : [
                'bank' => $validated['bank_name'],
                'account' => $validated['account_number'],
                'name' => $validated['account_name']
            ];

        DB::transaction(function () use ($wallet, $validated, $accountDetails) {
            // 1. Debit wallet
            $wallet->decrement('balance', $validated['amount']);

            // 2. Create withdrawal request
            Withdrawal::create([
                'wallet_id' => $wallet->id,
                'amount' => $validated['amount'],
                'fee' => 0, // Could add fees logic here
                'net_amount' => $validated['amount'],
                'method' => $validated['method'],
                'account_details' => $accountDetails,
                'status' => 'pending',
                'requested_at' => now(),
            ]);

            // 3. Create transaction record
            $wallet->transactions()->create([
                'type' => 'debit_withdrawal',
                'amount' => $validated['amount'],
                'commission' => 0,
                'net_amount' => -$validated['amount'],
                'source' => 'withdrawal',
                'balance_after' => $wallet->balance,
                'note' => 'Demande de retrait en attente',
            ]);
        });

        return redirect()->route('artist.withdrawals.index')->with('toast', [
            'type' => 'success',
            'message' => 'Votre demande de retrait a été enregistrée.'
        ]);
    }
}
