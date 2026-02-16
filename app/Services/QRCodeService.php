<?php

namespace App\Services;

use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class QRCodeService
{
    /**
     * Génère un QR code en SVG
     */
    public function generateSvg(string $content, int $size = 300): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle($size),
            new SvgImageBackEnd
        );

        $writer = new Writer($renderer);

        return $writer->writeString($content);
    }

    /**
     * Génère un QR code pour une réservation
     */
    public function generateForReservation(string $reservationId, string $reservationNumber): string
    {
        $content = json_encode([
            'type' => 'reservation',
            'id' => $reservationId,
            'number' => $reservationNumber,
            'timestamp' => now()->timestamp,
        ]);

        return $this->generateSvg($content);
    }

    /**
     * Génère une URL de QR code en base64
     */
    public function generateBase64(string $content, int $size = 300): string
    {
        $svg = $this->generateSvg($content, $size);

        return 'data:image/svg+xml;base64,'.base64_encode($svg);
    }
}
