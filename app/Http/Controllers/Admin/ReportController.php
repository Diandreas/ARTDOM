<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $year = (int) $request->integer('year', (int) now()->year);
        $month = (int) $request->integer('month', (int) now()->month);

        $monthStart = now()->setDate($year, $month, 1)->startOfDay();
        $monthEnd = $monthStart->copy()->endOfMonth();

        $summary = [
            'users_total' => User::query()->count(),
            'users_new_month' => User::query()->whereBetween('created_at', [$monthStart, $monthEnd])->count(),
            'reservations_total' => Reservation::query()->count(),
            'reservations_month' => Reservation::query()->whereBetween('created_at', [$monthStart, $monthEnd])->count(),
            'revenue_total' => (float) Payment::query()->where('status', 'completed')->sum('amount'),
            'revenue_month' => (float) Payment::query()->where('status', 'completed')->whereBetween('created_at', [$monthStart, $monthEnd])->sum('amount'),
        ];

        return Inertia::render('Admin/Reports', [
            'year' => $year,
            'month' => $month,
            'summary' => $summary,
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $year = (int) $request->integer('year', (int) now()->year);
        $month = (int) $request->integer('month', (int) now()->month);

        $monthStart = now()->setDate($year, $month, 1)->startOfDay();
        $monthEnd = $monthStart->copy()->endOfMonth();

        return response()->streamDownload(function () use ($monthStart, $monthEnd): void {
            $handle = fopen('php://output', 'wb');

            fputcsv($handle, ['metric', 'value']);
            fputcsv($handle, ['users_total', User::query()->count()]);
            fputcsv($handle, ['users_new_month', User::query()->whereBetween('created_at', [$monthStart, $monthEnd])->count()]);
            fputcsv($handle, ['reservations_total', Reservation::query()->count()]);
            fputcsv($handle, ['reservations_month', Reservation::query()->whereBetween('created_at', [$monthStart, $monthEnd])->count()]);
            fputcsv($handle, ['revenue_total', (float) Payment::query()->where('status', 'completed')->sum('amount')]);
            fputcsv($handle, ['revenue_month', (float) Payment::query()->where('status', 'completed')->whereBetween('created_at', [$monthStart, $monthEnd])->sum('amount')]);

            fclose($handle);
        }, sprintf('admin-report-%s.csv', $monthStart->format('Y-m')));
    }
}
