<?php

namespace App\Enums;

enum ArtistLevel: string
{
    case Talent = 'talent';
    case RisingStar = 'rising_star';
    case EmergingStar = 'emerging_star';

    public function label(): string
    {
        return match ($this) {
            self::Talent => 'Talent',
            self::RisingStar => 'Artiste perçant',
            self::EmergingStar => 'Star en émergence',
        };
    }
}
