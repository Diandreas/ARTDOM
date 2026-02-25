<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function calendar(Request $request): Response
    {
        $serviceId = $request->query('service');
        $service = Service::with(['artist.artistProfile'])->findOrFail($serviceId);

        // Generate available time slots (example - should be based on artist availability)
        $availableSlots = [
            ['time' => '09:00', 'available' => true],
            ['time' => '10:00', 'available' => true],
            ['time' => '11:00', 'available' => false],
            ['time' => '12:00', 'available' => true],
            ['time' => '14:00', 'available' => true],
            ['time' => '15:00', 'available' => true],
            ['time' => '16:00', 'available' => false],
            ['time' => '17:00', 'available' => true],
            ['time' => '18:00', 'available' => true],
            ['time' => '19:00', 'available' => true],
            ['time' => '20:00', 'available' => false],
            ['time' => '21:00', 'available' => true],
        ];

        return Inertia::render('Booking/Calendar', [
            'service' => [
                'id' => $service->id,
                'title' => $service->title,
                'description' => $service->description,
                'price' => $service->price,
                'duration_minutes' => $service->duration_minutes,
                'location_type' => $service->location_type,
            ],
            'artist' => [
                'id' => $service->artist->id,
                'name' => $service->artist->name,
                'stage_name' => $service->artist->artistProfile->stage_name ?? $service->artist->name,
                'profile_photo' => $service->artist->profile_photo,
                'city' => $service->artist->city,
                'is_verified' => $service->artist->artistProfile->is_verified ?? false,
            ],
            'availableSlots' => $availableSlots,
        ]);
    }

    public function customize(Request $request): Response
    {
        $serviceId = $request->query('service');
        $date = $request->query('date');
        $time = $request->query('time');

        $service = Service::with(['artist.artistProfile', 'serviceOptions' => function($q) {
            $q->where('is_active', true);
        }])->findOrFail($serviceId);

        return Inertia::render('Booking/Customize', [
            'service' => [
                'id' => $service->id,
                'title' => $service->title,
                'price' => $service->price,
                'location_type' => $service->location_type,
                'options' => $service->serviceOptions,
            ],
            'artist' => [
                'id' => $service->artist->id,
                'stage_name' => $service->artist->artistProfile->stage_name ?? $service->artist->name,
                'profile_photo' => $service->artist->profile_photo,
            ],
            'bookingDetails' => [
                'date' => $date,
                'time' => $time,
            ],
            'emotionTypes' => [
                ['key' => 'joy', 'label' => 'Joie / Célébration'],
                ['key' => 'love', 'label' => 'Amour / Romance'],
                ['key' => 'sadness', 'label' => 'Tristesse / Soutien'],
                ['key' => 'surprise', 'label' => 'Surprise / Humour'],
                ['key' => 'gratitude', 'label' => 'Gratitude / Merci'],
            ],
        ]);
    }

    public function checkout(Request $request)
    {
        $data = $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|string',
            'time' => 'required|string',
            'emotion_type' => 'required|string',
            'recipient_name' => 'nullable|string',
            'relation_type' => 'nullable|string',
            'special_message' => 'nullable|string',
            'customer_location' => 'nullable|string',
            'selected_options' => 'nullable|string',
            'file_url' => 'nullable|file|max:5120',
        ]);

        if ($request->hasFile('file_url')) {
            $path = $request->file('file_url')->store('booking/files', 'public');
            $data['file_url'] = '/storage/' . $path;
        } else {
            // Keep the string if it was passed via query/previous step or null
            $data['file_url'] = $request->input('file_url');
        }

        session(['booking_checkout' => $data]);

        return redirect()->route('booking.payment');
    }

    public function payment(Request $request): Response
    {
        $bookingData = session('booking_checkout') ?? $request->all();
        
        $serviceId = $bookingData['service_id'] ?? null;
        if (!$serviceId) {
            abort(400, "Données de réservation manquantes");
        }

        $date = $bookingData['date'] ?? null;
        $time = $bookingData['time'] ?? null;
        $emotionType = $bookingData['emotion_type'] ?? null;
        $recipientName = $bookingData['recipient_name'] ?? null;
        $specialMessage = $bookingData['special_message'] ?? null;
        $customerLocation = $bookingData['customer_location'] ?? null;
        $relationType = $bookingData['relation_type'] ?? null;
        $fileUrl = $bookingData['file_url'] ?? null;
        $selectedOptionIds = $bookingData['selected_options'] ?? '';

        $service = Service::with(['artist.artistProfile', 'serviceOptions'])->findOrFail($serviceId);

        $selectedOptions = [];
        if (!empty($selectedOptionIds)) {
            $ids = explode(',', $selectedOptionIds);
            $selectedOptions = $service->serviceOptions->whereIn('id', $ids)->values()->toArray();
        }

        $optionsTotal = array_reduce($selectedOptions, function($carry, $opt) {
            return $carry + $opt['price'];
        }, 0);

        return Inertia::render('Booking/Payment', [
            'service' => [
                'id' => $service->id,
                'title' => $service->title,
                'price' => $service->price,
                'options_total' => $optionsTotal,
                'selected_options' => $selectedOptions,
            ],
            'artist' => [
                'id' => $service->artist->id,
                'stage_name' => $service->artist->artistProfile->stage_name ?? $service->artist->name,
                'profile_photo' => $service->artist->profile_photo,
            ],
            'bookingData' => [
                'service_id' => $serviceId,
                'date' => $date,
                'time' => $time,
                'emotion_type' => $emotionType,
                'recipient_name' => $recipientName,
                'special_message' => $specialMessage,
                'customer_location' => $customerLocation,
                'location_type' => $request->query('location_type', $service->location_type),
                'relation_type' => $relationType,
                'file_url' => $fileUrl,
                'selected_options' => $selectedOptionIds,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $service = Service::findOrFail($request->service_id);

        // Calculate commission (example: 10%)
        $commissionRate = 10.00;
        $commissionAmount = $request->total_amount * ($commissionRate / 100);
        $artistEarnings = $request->total_amount - $commissionAmount;

        $reservation = \App\Models\Reservation::create([
            'client_id' => auth()->id(),
            'artist_id' => $service->artist_id,
            'service_id' => $request->service_id,
            'reservation_number' => 'RES-'.strtoupper(uniqid()),
            'scheduled_at' => $request->date.' '.$request->time,
            'duration_minutes' => $service->duration_minutes,
            'status' => 'pending',
            'total_amount' => $request->total_amount,
            'commission_rate' => $commissionRate,
            'commission_amount' => $commissionAmount,
            'artist_earnings' => $artistEarnings,
            'custom_message' => $request->special_message,
            'recipient_name' => $request->recipient_name,
            'emotion_type' => $request->emotion_type,
            'location_type' => $service->location_type,
            'location_address' => $request->customer_location,
            'relation_type' => $request->relation_type,
        ]);

        // If file_url is present, store it via media or JSON options. For now we use custom_message to store extras
        if ($request->file_url) {
            $reservation->custom_message .= "\n\n[Fichier joint: " . $request->file_url . "]";
            $reservation->save();
        }

        // Create initial payment record
        \App\Models\Payment::create([
            'reservation_id' => $reservation->id,
            'client_id' => auth()->id(),
            'amount' => $request->total_amount,
            'method' => $request->payment_method,
            'status' => 'pending',
            'provider_ref' => 'TRX-'.strtoupper(uniqid()),
        ]);

        // Mettre les fonds en attente dans le portefeuille de l'artiste
        $wallet = \App\Models\Wallet::firstOrCreate([
            'artist_id' => $service->artist_id,
        ], [
            'currency' => 'FCFA',
            'balance' => 0,
            'pending_balance' => 0,
        ]);
        
        $wallet->addPending((float) $request->total_amount, 'reservation', $reservation->id);

        return redirect()->route('client.reservations.show', $reservation->id)
            ->with('success', 'Votre réservation a été envoyée avec succès !');
    }

    public function confirmation($id): Response
    {
        $reservation = \App\Models\Reservation::with(['service', 'artist.artistProfile'])
            ->where('client_id', auth()->id())
            ->findOrFail($id);

        // Generate QR Code
        $qrService = app(\App\Services\QRCodeService::class);
        $qrCode = $qrService->generateBase64(
            json_encode([
                'type' => 'reservation',
                'id' => $reservation->id,
                'number' => $reservation->reservation_number,
            ])
        );

        return Inertia::render('Booking/Confirmation', [
            'reservation' => [
                'id' => $reservation->id,
                'reservation_number' => $reservation->reservation_number,
                'scheduled_at' => $reservation->scheduled_at,
                'total_amount' => $reservation->total_amount,
                'customer_location' => $reservation->customer_location,
                'emotion_type' => $reservation->emotion_type,
                'recipient_name' => $reservation->recipient_name,
                'special_message' => $reservation->special_message,
                'qr_code' => $qrCode,
            ],
            'artist' => [
                'id' => $reservation->artist->id,
                'stage_name' => $reservation->artist->artistProfile->stage_name ?? $reservation->artist->name,
                'profile_photo' => $reservation->artist->profile_photo,
                'city' => $reservation->artist->city,
            ],
            'service' => [
                'id' => $reservation->service->id,
                'title' => $reservation->service->title,
            ],
        ]);
    }

    /**
     * Télécharge le reçu PDF d'une réservation
     */
    public function downloadReceipt($id)
    {
        $reservation = \App\Models\Reservation::with(['service', 'artist.artistProfile', 'client', 'payment'])
            ->where('client_id', auth()->id())
            ->findOrFail($id);

        $pdfService = app(\App\Services\PDFService::class);

        return $pdfService->downloadReceipt($reservation);
    }
}
