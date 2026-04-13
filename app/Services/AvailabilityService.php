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

        // 2. Si aucune disponibilité n'est définie, on propose des créneaux par défaut (9h-18h)
        // SAUF si le jour est explicitement bloqué (is_blocked = true pour toute la journée)
        $isDayBlocked = Availability::where('artist_id', $artist->id)
            ->where('date', $date)
            ->where('is_blocked', true)
            ->whereNull('start_time') // Blocage toute la journée
            ->exists();

        if ($isDayBlocked) {
            return [];
        }

        if ($availabilities->isEmpty()) {
            // Créer une disponibilité virtuelle par défaut : 09:00 à 18:00
            $availabilities = collect([
                (object) [
                    'start_time' => '09:00',
                    'end_time' => '18:00',
                ],
            ]);
        }

        // 3. Récupérer les réservations existantes pour ce jour
        $reservations = Reservation::where('artist_id', $artist->id)
            ->whereDate('scheduled_at', $date)
            ->whereNotIn('status', ['cancelled', 'declined'])
            ->get();

        // 4. Récupérer les blocs spécifiques (ex: pause midi bloquée)
        $blockedSlots = Availability::where('artist_id', $artist->id)
            ->where('date', $date)
            ->where('is_blocked', true)
            ->whereNotNull('start_time')
            ->get();

        $allSlots = [];

        foreach ($availabilities as $availability) {
            $start = Carbon::parse("$date $availability->start_time");
            $end = Carbon::parse("$date $availability->end_time");

            // On génère des créneaux par intervalle de 30 minutes
            $interval = 30;
            
            // Ne pas proposer de créneaux dans le passé si c'est aujourd'hui
            if ($start->isToday() && $start->lt(now())) {
                $start = now()->addMinutes(30)->roundMinute(30);
            }

            if ($start->gt($end->copy()->subMinutes($serviceDurationMinutes))) {
                continue;
            }

            $period = CarbonPeriod::since($start)->minutes($interval)->until($end->copy()->subMinutes($serviceDurationMinutes));

            foreach ($period as $slotStart) {
                $slotEnd = $slotStart->copy()->addMinutes($serviceDurationMinutes);

                // Vérifier si le créneau est disponible (pas de réservation, pas de blocage)
                $isAvailable = $this->isSlotAvailable($slotStart, $slotEnd, $reservations, $blockedSlots);

                $allSlots[] = [
                    'time' => $slotStart->format('H:i'),
                    'available' => $isAvailable,
                ];
            }
        }

        // Trier par heure et supprimer les doublons éventuels
        usort($allSlots, fn ($a, $b) => strcmp($a['time'], $b['time']));

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
     * Vérifie si un créneau spécifique (début -> fin) chevauche une réservation existante ou un blocage.
     */
    private function isSlotAvailable(Carbon $slotStart, Carbon $slotEnd, $reservations, $blockedSlots = []): bool
    {
        // Vérifier les réservations
        foreach ($reservations as $reservation) {
            $resStart = $reservation->scheduled_at;
            $resEnd = $resStart->copy()->addMinutes($reservation->duration_minutes);

            if ($slotStart->lt($resEnd) && $slotEnd->gt($resStart)) {
                return false;
            }
        }

        // Vérifier les créneaux bloqués manuellement
        foreach ($blockedSlots as $block) {
            $blockStart = Carbon::parse($slotStart->format('Y-m-d')." $block->start_time");
            $blockEnd = Carbon::parse($slotStart->format('Y-m-d')." $block->end_time");

            if ($slotStart->lt($blockEnd) && $slotEnd->gt($blockStart)) {
                return false;
            }
        }

        return true;
    }
}
