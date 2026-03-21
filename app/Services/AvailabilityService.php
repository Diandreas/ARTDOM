<?php

namespace App\Services;

use App\Models\Availability;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class AvailabilityService
{
    /**
     * Génère les créneaux horaires disponibles pour un artiste à une date donnée.
     *
     * @param  string  $date  (format Y-m-d)
     */
    public function getAvailableSlots(User $artist, string $date, int $serviceDurationMinutes = 60): array
    {
        // 1. Récupérer les plages horaires de disponibilité de l'artiste pour ce jour
        $availabilities = Availability::where('artist_id', $artist->id)
            ->where('date', $date)
            ->where('is_blocked', false)
            ->get();

        if ($availabilities->isEmpty()) {
            return [];
        }

        // 2. Récupérer les réservations existantes pour ce jour
        $reservations = Reservation::where('artist_id', $artist->id)
            ->whereDate('scheduled_at', $date)
            ->whereNotIn('status', ['cancelled'])
            ->get();

        $allSlots = [];

        foreach ($availabilities as $availability) {
            $start = Carbon::parse("$date $availability->start_time");
            $end = Carbon::parse("$date $availability->end_time");

            // On génère des créneaux par intervalle de 30 minutes ou par la durée du service ?
            // On va utiliser un intervalle de 30 minutes pour donner plus de flexibilité,
            // mais on vérifiera si le service entier tient.
            $interval = 30;

            $period = CarbonPeriod::since($start)->minutes($interval)->until($end->copy()->subMinutes($serviceDurationMinutes));

            foreach ($period as $slotStart) {
                $slotEnd = $slotStart->copy()->addMinutes($serviceDurationMinutes);

                // Vérifier si le créneau est disponible
                $isAvailable = $this->isSlotAvailable($slotStart, $slotEnd, $reservations);

                $allSlots[] = [
                    'time' => $slotStart->format('H:i'),
                    'available' => $isAvailable,
                ];
            }
        }

        // Trier par heure et supprimer les doublons éventuels
        usort($allSlots, fn ($a, $b) => strcmp($a['time'], $b['time']));

        // Si plusieurs disponibilités se chevauchent, on pourrait avoir des doublons
        $uniqueSlots = [];
        $seenTimes = [];
        foreach ($allSlots as $slot) {
            if (! in_array($slot['time'], $seenTimes)) {
                $uniqueSlots[] = $slot;
                $seenTimes[] = $slot['time'];
            }
        }

        return $uniqueSlots;
    }

    /**
     * Vérifie si un créneau spécifique (début -> fin) chevauche une réservation existante.
     */
    private function isSlotAvailable(Carbon $slotStart, Carbon $slotEnd, $reservations): bool
    {
        foreach ($reservations as $reservation) {
            $resStart = $reservation->scheduled_at;
            $resEnd = $resStart->copy()->addMinutes($reservation->duration_minutes);

            // Un créneau chevauche s'il commence avant la fin de la réservation
            // ET finit après le début de la réservation.
            if ($slotStart->lt($resEnd) && $slotEnd->gt($resStart)) {
                return false;
            }
        }

        return true;
    }
}
