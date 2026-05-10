<?php

namespace App\Enums;

enum ArtistLevel: string
{
    case Talent = 'talent';
    case Emerging = 'emerging';
    case Rising = 'rising';
    case Breakout = 'breakout';
    case Featured = 'featured';

    // Legacy aliases kept for backward compatibility
    case RisingStar = 'rising_star';
    case EmergingStar = 'emerging_star';

    public function label(): string
    {
        return match ($this) {
            self::Talent => 'Talent',
            self::Emerging, self::RisingStar => 'Artiste émergent',
            self::Rising => 'Artiste perçant',
            self::Breakout, self::EmergingStar => 'Breakout Artist',
            self::Featured => 'Star en émergence',
        };
    }

    /**
     * Score minimum pour atteindre ce niveau.
     */
    public function minScore(): int
    {
        return match ($this) {
            self::Talent => 0,
            self::Emerging, self::RisingStar => 30,
            self::Rising => 60,
            self::Breakout, self::EmergingStar => 80,
            self::Featured => 90,
        };
    }

    /**
     * Calcule le niveau depuis un score brut.
     */
    public static function fromScore(int $score): self
    {
        return match (true) {
            $score >= 90 => self::Featured,
            $score >= 80 => self::Breakout,
            $score >= 60 => self::Rising,
            $score >= 30 => self::Emerging,
            default => self::Talent,
        };
    }
}
