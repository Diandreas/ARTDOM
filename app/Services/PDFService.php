<?php

namespace App\Services;

use App\Models\Reservation;
use Barryvdh\DomPDF\Facade\Pdf;

class PDFService
{
    /**
     * Génère un reçu PDF pour une réservation
     */
    public function generateReceipt(Reservation $reservation): string
    {
        $reservation->load(['client', 'artist.artistProfile', 'service', 'payment']);

        $pdf = Pdf::loadView('pdf.receipt', [
            'reservation' => $reservation,
        ]);

        $filename = 'recu-'.$reservation->reservation_number.'.pdf';
        $path = storage_path('app/public/receipts/'.$filename);

        // Create directory if doesn't exist
        if (! file_exists(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        $pdf->save($path);

        return 'receipts/'.$filename;
    }

    /**
     * Génère un PDF et retourne le contenu pour téléchargement direct
     */
    public function downloadReceipt(Reservation $reservation)
    {
        $reservation->load(['client', 'artist.artistProfile', 'service', 'payment']);

        $pdf = Pdf::loadView('pdf.receipt', [
            'reservation' => $reservation,
        ]);

        return $pdf->download('recu-'.$reservation->reservation_number.'.pdf');
    }

    /**
     * Génère un PDF et retourne le contenu inline
     */
    public function streamReceipt(Reservation $reservation)
    {
        $reservation->load(['client', 'artist.artistProfile', 'service', 'payment']);

        $pdf = Pdf::loadView('pdf.receipt', [
            'reservation' => $reservation,
        ]);

        return $pdf->stream('recu-'.$reservation->reservation_number.'.pdf');
    }
}
