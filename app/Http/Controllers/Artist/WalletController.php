<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Withdrawal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class WalletController extends Controller
{
    /**
     * Affiche le portefeuille de l'artiste
     * 
     * Route: GET /artist/wallet
     * Middleware: auth, role:artist
     * 
     * Affiche :
     * - Solde disponible
     * - Solde en attente
     * - Graphique des revenus
     * - Dernières transactions
     * - Historique des retraits
     */
    public function index(): Response
    {
        $artist = Auth::user();
        $wallet = $artist->artistProfile->wallet;

        // Créer le portefeuille s'il n'existe pas
        if (!$wallet) {
            $wallet = Wallet::create([
                'artist_id' => $artist->id,
                'balance' => 0,
                'pending_balance' => 0,
                'currency' => 'XAF',
            ]);
        }

        $wallet->load(['transactions' => function ($query) {
            $query->latest()->limit(10);
        }, 'withdrawals' => function ($query) {
            $query->latest()->limit(5);
        }]);

        return Inertia::render('Artist/Wallet', [
            'wallet' => $wallet,
        ]);
    }

    /**
     * Retourne les transactions paginées avec filtres
     * 
     * Route: GET /artist/wallet/transactions
     * Middleware: auth, role:artist
     * 
     * Filtres disponibles:
     * - type: Type de transaction
     * - date_from / date_to: Période
     */
    public function transactions(Request $request)
    {
        $artist = Auth::user();
        $wallet = $artist->artistProfile->wallet;

        if (!$wallet) {
            return response()->json(['transactions' => []]);
        }

        $query = $wallet->transactions()->latest();

        // Filtre par type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filtre par date
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $transactions = $query->paginate(20);

        return Inertia::render('Artist/WalletTransactions', [
            'transactions' => $transactions,
            'filters' => $request->only(['type', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Exporte les transactions en CSV
     * 
     * Route: GET /artist/wallet/export
     * Middleware: auth, role:artist
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $artist = Auth::user();
        $wallet = $artist->artistProfile->wallet;

        $query = $wallet->transactions()->latest();

        // Appliquer les mêmes filtres que transactions()
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $transactions = $query->get();

        $filename = 'transactions_'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($transactions) {
            $file = fopen('php://output', 'w');

            // En-têtes CSV
            fputcsv($file, ['Date', 'Type', 'Montant', 'Commission', 'Net', 'Solde après', 'Note']);

            // Données
            foreach ($transactions as $transaction) {
                fputcsv($file, [
                    $transaction->created_at->format('Y-m-d H:i:s'),
                    $transaction->type,
                    $transaction->amount,
                    $transaction->commission,
                    $transaction->net_amount,
                    $transaction->balance_after,
                    $transaction->note ?? '',
                ]);
            }

            fclose($file);
        }, $filename, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }

    /**
     * Crée une demande de retrait
     * 
     * Route: POST /artist/wallet/withdraw
     * Middleware: auth, role:artist
     * 
     * Logique:
     * 1. Vérifie que le solde est suffisant
     * 2. Valide les coordonnées bancaires
     * 3. Crée la demande de retrait
     * 4. Débite le portefeuille
     */
    public function withdraw(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1000'], // Minimum 1000 XAF
            'method' => ['required', 'in:mobile_money,bank_transfer,paypal'],
            'account_details' => ['required', 'array'],
            'account_details.phone' => ['required_if:method,mobile_money', 'string'],
            'account_details.iban' => ['required_if:method,bank_transfer', 'string'],
            'account_details.email' => ['required_if:method,paypal', 'email'],
        ]);

        $artist = Auth::user();
        $wallet = $artist->artistProfile->wallet;

        if (!$wallet || $wallet->balance < $validated['amount']) {
            return back()->withErrors(['amount' => 'Solde insuffisant.']);
        }

        // Calculer les frais de retrait
        $fee = $this->calculateWithdrawalFee($validated['amount'], $validated['method']);
        $netAmount = $validated['amount'] - $fee;

        // Créer la demande de retrait
        $withdrawal = Withdrawal::create([
            'wallet_id' => $wallet->id,
            'amount' => $validated['amount'],
            'fee' => $fee,
            'net_amount' => $netAmount,
            'method' => $validated['method'],
            'account_details' => $validated['account_details'],
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        // Débiter le portefeuille
        $wallet->debit($validated['amount']);

        return back()->with('message', 'Demande de retrait créée. Elle sera traitée sous 2-5 jours ouvrés.');
    }

    /**
     * Affiche le statut d'un retrait
     * 
     * Route: GET /artist/wallet/withdrawals/{withdrawal}
     */
    public function withdrawalStatus(Withdrawal $withdrawal): Response
    {
        if ($withdrawal->wallet->artist_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Artist/WithdrawalStatus', [
            'withdrawal' => $withdrawal->load('wallet'),
        ]);
    }

    /**
     * Calcule les frais de retrait selon la méthode
     */
    private function calculateWithdrawalFee(float $amount, string $method): float
    {
        return match ($method) {
            'mobile_money' => $amount * 0.02, // 2%
            'bank_transfer' => $amount * 0.01, // 1%
            'paypal' => $amount * 0.03, // 3%
            default => 0,
        };
    }
}
