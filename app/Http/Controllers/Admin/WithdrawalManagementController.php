<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class WithdrawalManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->get('status', 'pending');

        $withdrawals = Withdrawal::with('wallet.artist')
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Withdrawals/Index', [
            'withdrawals' => $withdrawals,
            'currentStatus' => $status,
        ]);
    }

    public function approve(Request $request, Withdrawal $withdrawal): RedirectResponse
    {
        if ($withdrawal->status !== 'pending') {
            return back()->withErrors(['message' => 'Ce retrait a déjà été traité.']);
        }

        $request->validate([
            'provider_ref' => 'required|string|max:255',
        ]);

        $withdrawal->update([
            'status' => 'completed',
            'provider_ref' => $request->provider_ref,
            'processed_at' => now(),
        ]);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Le retrait a été marqué comme complété.',
        ]);
    }

    public function reject(Request $request, Withdrawal $withdrawal): RedirectResponse
    {
        if ($withdrawal->status !== 'pending') {
            return back()->withErrors(['message' => 'Ce retrait a déjà été traité.']);
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        DB::transaction(function () use ($withdrawal, $request) {
            $withdrawal->update([
                'status' => 'rejected',
                'processed_at' => now(),
                'provider_ref' => 'Rejet : '.$request->reason,
            ]);

            // Refund the wallet
            $wallet = $withdrawal->wallet;
            $wallet->increment('balance', $withdrawal->amount);

            // Record transaction
            $wallet->transactions()->create([
                'type' => 'credit_refund',
                'amount' => $withdrawal->amount,
                'commission' => 0,
                'net_amount' => $withdrawal->amount,
                'source' => 'withdrawal_rejection',
                'balance_after' => $wallet->balance,
                'note' => 'Remboursement suite au rejet du retrait : '.$request->reason,
            ]);
        });

        return back()->with('toast', [
            'type' => 'info',
            'message' => 'Le retrait a été rejeté et l\'artiste a été remboursé.',
        ]);
    }
}
