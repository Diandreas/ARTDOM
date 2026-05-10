<?php

namespace App\Enums;

enum AiType: string
{
    case Human = 'human';
    case PartialAi = 'partial_ai';
    case FullAi = 'full_ai';

    public function label(): string
    {
        return match ($this) {
            self::Human => 'Musique humaine',
            self::PartialAi => 'IA partielle',
            self::FullAi => 'IA générée',
        };
    }

    /**
     * Facteur de pénalité appliqué au score de recommandation (0–1).
     * 1.0 = aucune pénalité, 0.4 = réduction de 60 %.
     */
    public function scoreFactor(): float
    {
        return match ($this) {
            self::Human => 1.0,
            self::PartialAi => 0.80,
            self::FullAi => 0.40,
        };
    }

    /**
     * Indique si le contenu peut apparaître dans les playlists principales.
     */
    public function isAllowedInMainPlaylists(): bool
    {
        return $this === self::Human;
    }
}
