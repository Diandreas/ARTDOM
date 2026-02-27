<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\ArtistProfile;
use App\Models\ClientProfile;
use App\Models\Coupon;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Service;
use App\Models\Ticket;
use App\Models\Track;
use App\Models\User;
use App\Models\Video;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminCrudController extends Controller
{
    /**
     * @return array<string, class-string<Model>>
     */
    protected function modelMap(): array
    {
        return [
            'users' => User::class,
            'artist_profiles' => ArtistProfile::class,
            'client_profiles' => ClientProfile::class,
            'services' => Service::class,
            'reservations' => Reservation::class,
            'payments' => Payment::class,
            'albums' => Album::class,
            'tracks' => Track::class,
            'videos' => Video::class,
            'reviews' => Review::class,
            'tickets' => Ticket::class,
            'coupons' => Coupon::class,
        ];
    }

    public function index(): Response
    {
        $resources = collect($this->modelMap())
            ->map(function (string $modelClass, string $resource): array {
                return [
                    'resource' => $resource,
                    'model' => class_basename($modelClass),
                    'count' => $modelClass::query()->count(),
                ];
            })
            ->values();

        return Inertia::render('Admin/SuperCrud/Index', [
            'resources' => $resources,
        ]);
    }

    public function show(Request $request, string $resource): Response
    {
        $modelClass = $this->resolveModel($resource);
        $search = trim((string) $request->input('search', ''));

        $query = $modelClass::query();

        if ($search !== '') {
            $query->whereKey($search);
        }

        if (in_array('created_at', (new $modelClass)->getFillable(), true) || Schema::hasColumn((new $modelClass)->getTable(), 'created_at')) {
            $query->latest('created_at');
        }

        $records = $query->paginate(20)->withQueryString();

        $records->through(function (Model $record): array {
            return [
                'id' => (string) $record->getKey(),
                'attributes' => $record->attributesToArray(),
            ];
        });

        return Inertia::render('Admin/SuperCrud/Resource', [
            'resource' => $resource,
            'records' => $records,
            'fillable' => (new $modelClass)->getFillable(),
            'search' => $search,
        ]);
    }

    public function store(Request $request, string $resource): RedirectResponse
    {
        $modelClass = $this->resolveModel($resource);
        $payload = $this->validatedPayload($request);

        $modelClass::query()->create($payload);

        return back()->with('message', 'Ressource creee.');
    }

    public function update(Request $request, string $resource, string $id): RedirectResponse
    {
        $modelClass = $this->resolveModel($resource);
        $payload = $this->validatedPayload($request);

        /** @var Model $record */
        $record = $modelClass::query()->findOrFail($id);
        $record->fill($payload);
        $record->save();

        return back()->with('message', 'Ressource mise a jour.');
    }

    public function destroy(string $resource, string $id): RedirectResponse
    {
        $modelClass = $this->resolveModel($resource);

        /** @var Model $record */
        $record = $modelClass::query()->findOrFail($id);
        $record->delete();

        return back()->with('message', 'Ressource supprimee.');
    }

    /**
     * @return class-string<Model>
     */
    protected function resolveModel(string $resource): string
    {
        $map = $this->modelMap();

        abort_unless(isset($map[$resource]), 404);

        return $map[$resource];
    }

    /**
     * @return array<string, mixed>
     */
    protected function validatedPayload(Request $request): array
    {
        $validated = $request->validate([
            'payload' => ['required', 'array'],
        ]);

        return $validated['payload'];
    }
}
