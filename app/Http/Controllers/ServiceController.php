<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function show(string $id): Response
    {
        $service = Service::with(['artist.artistProfile'])
            ->findOrFail($id);

        return Inertia::render('Service/detail', [
            'service' => [
                'id' => $service->id,
                'title' => $service->title,
                'description' => $service->description,
                'price' => $service->price,
                'price_type' => $service->price_type,
                'duration_minutes' => $service->duration_minutes,
                'notice_period_hours' => $service->notice_period_hours,
                'location_type' => $service->location_type,
                'category' => $service->category,
                'is_active' => $service->is_active,
            ],
            'artist' => [
                'id' => $service->artist->id,
                'name' => $service->artist->name,
                'stage_name' => $service->artist->artistProfile->stage_name ?? $service->artist->name,
                'city' => $service->artist->city,
                'profile_photo' => $service->artist->profile_photo,
                'is_verified' => $service->artist->artistProfile->is_verified ?? false,
                'rating' => $service->artist->artistProfile->rating ?? 0,
                'total_reviews' => $service->artist->artistProfile->total_reviews ?? 0,
                'categories' => json_decode($service->artist->artistProfile->categories ?? '[]'),
            ],
        ]);
    }
}
