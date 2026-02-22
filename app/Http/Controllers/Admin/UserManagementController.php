<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\Album;
use App\Models\AlbumPurchase;
use App\Models\ArtistProfile;
use App\Models\ClientProfile;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Service;
use App\Models\Track;
use App\Models\User;
use App\Models\UserSession;
use App\Models\Video;
use App\Models\Wallet;
use App\Models\Withdrawal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserManagementController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $query = User::query()
            ->with(['clientProfile', 'artistProfile'])
            ->withCount(['reservations', 'artistReservations'])
            ->when($request->string('type')->isNotEmpty() && $request->string('type')->value() !== 'all', function ($builder) use ($request) {
                $builder->where('role', $request->string('type')->value());
            })
            ->when($request->string('city')->isNotEmpty(), function ($builder) use ($request) {
                $builder->where('city', $request->string('city')->value());
            })
            ->when($request->filled('email_verified'), function ($builder) use ($request) {
                $emailVerified = $request->boolean('email_verified');

                if ($emailVerified) {
                    $builder->whereNotNull('email_verified_at');
                } else {
                    $builder->whereNull('email_verified_at');
                }
            })
            ->when($request->filled('registered_from'), function ($builder) use ($request) {
                $builder->whereDate('created_at', '>=', (string) $request->input('registered_from'));
            })
            ->when($request->filled('registered_to'), function ($builder) use ($request) {
                $builder->whereDate('created_at', '<=', (string) $request->input('registered_to'));
            })
            ->when($request->string('search')->isNotEmpty(), function ($builder) use ($request) {
                $search = trim($request->string('search')->value());

                $builder->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhereHas('clientProfile', function ($profileQuery) use ($search) {
                            $profileQuery
                                ->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('artistProfile', function ($profileQuery) use ($search) {
                            $profileQuery->where('stage_name', 'like', "%{$search}%");
                        });
                });
            });

        $this->applyStatusFilter($query, (string) $request->input('status', 'all'));

        $sort = (string) $request->input('sort', 'created_at');
        $direction = (string) $request->input('direction', 'desc');

        if (! in_array($sort, ['id', 'email', 'created_at'], true)) {
            $sort = 'created_at';
        }

        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        $query->orderBy($sort, $direction);

        /** @var LengthAwarePaginator $users */
        $users = $query->paginate(20)->withQueryString();

        $users->through(function (User $user): array {
            $status = $this->resolveStatus($user);

            return [
                'id' => $user->id,
                'avatar' => $user->profile_photo,
                'full_name' => $this->resolveFullName($user),
                'email' => $user->email,
                'phone' => $user->phone,
                'type' => $this->roleValue($user),
                'status' => $status,
                'registered_at' => $user->created_at?->toIso8601String(),
                'email_verified' => $user->email_verified_at !== null,
                'city' => $user->city,
            ];
        });

        $availableCities = User::query()
            ->whereNotNull('city')
            ->distinct()
            ->orderBy('city')
            ->pluck('city')
            ->values();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'type' => (string) $request->input('type', 'all'),
                'status' => (string) $request->input('status', 'all'),
                'registered_from' => (string) $request->input('registered_from', ''),
                'registered_to' => (string) $request->input('registered_to', ''),
                'city' => (string) $request->input('city', ''),
                'email_verified' => $request->input('email_verified'),
                'search' => (string) $request->input('search', ''),
                'sort' => $sort,
                'direction' => $direction,
            ],
            'cities' => $availableCities,
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('Admin/Users/Create', [
            'categories' => $this->artistCategories(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::query()->create([
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'profile_photo' => $validated['profile_photo'] ?? null,
            'city' => $validated['city'] ?? null,
            'role' => $validated['role'],
            'is_active' => true,
            'email_verified_at' => ! empty($validated['mark_email_verified']) ? now() : null,
        ]);

        ClientProfile::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'gender' => $validated['gender'] ?? null,
            ]
        );

        if ($validated['role'] === 'artist') {
            ArtistProfile::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'stage_name' => $validated['stage_name'],
                    'bio' => $validated['bio'] ?? null,
                    'categories' => ! empty($validated['category']) ? [$validated['category']] : null,
                    'base_rate' => $validated['base_rate'] ?? 0,
                    'portfolio_urls' => $validated['portfolio_urls'] ?? null,
                    'verification_status' => 'pending',
                    'is_verified' => false,
                ]
            );

            Wallet::query()->firstOrCreate(
                ['artist_id' => $user->id],
                [
                    'balance' => 0,
                    'pending_balance' => 0,
                    'currency' => 'XAF',
                ]
            );
        }

        $this->applyStatus($user, $validated['status']);

        if (! empty($validated['force_password_change'])) {
            $request->session()->flash('warning', 'Option activee: demander un changement de mot de passe a la prochaine connexion (champ non persiste en base actuelle).');
        }

        if ($request->boolean('create_and_new')) {
            return redirect()->route('admin.users.create')->with('message', 'Utilisateur cree. Vous pouvez en creer un autre.');
        }

        return redirect()->route('admin.users.show', $user)->with('message', 'Utilisateur cree avec succes.');
    }

    public function show(User $user): InertiaResponse
    {
        $user->load(['clientProfile', 'artistProfile']);

        $artistStats = null;
        if ($this->roleValue($user) === 'artist') {
            $artistStats = [
                'reservations_count' => Reservation::query()->where('artist_id', $user->id)->count(),
                'avg_rating' => round((float) Review::query()->where('artist_id', $user->id)->avg('rating'), 2),
                'followers_count' => (int) ArtistProfile::query()->where('user_id', $user->id)->first()?->followers()->count(),
                'generated_revenue' => (float) Reservation::query()->where('artist_id', $user->id)->sum('artist_earnings'),
            ];
        }

        $securitySessions = UserSession::query()
            ->where('user_id', $user->id)
            ->latest('last_activity')
            ->limit(50)
            ->get(['id', 'ip_address', 'user_agent', 'last_activity'])
            ->map(fn (UserSession $session): array => [
                'id' => $session->id,
                'ip' => $session->ip_address,
                'device' => $session->user_agent,
                'last_activity_at' => $session->last_activity > 0 ? now()->setTimestamp($session->last_activity)->toIso8601String() : null,
            ])
            ->values();

        $activity = $this->buildActivity($user);
        $transactions = $this->buildTransactions($user);
        $contents = $this->buildArtistContents($user);
        $reviews = $this->buildReviews($user);

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'full_name' => $this->resolveFullName($user),
                'first_name' => $user->clientProfile?->first_name,
                'last_name' => $user->clientProfile?->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'city' => $user->city,
                'date_of_birth' => $user->clientProfile?->date_of_birth?->toDateString(),
                'gender' => $user->clientProfile?->gender,
                'profile_photo' => $user->profile_photo,
                'type' => $this->roleValue($user),
                'status' => $this->resolveStatus($user),
                'stage_name' => $user->artistProfile?->stage_name,
                'email_verified' => $user->email_verified_at !== null,
                'created_at' => $user->created_at?->toIso8601String(),
                'last_connection_at' => $securitySessions->first()['last_activity_at'] ?? null,
                'two_factor_enabled' => $user->two_factor_confirmed_at !== null,
            ],
            'artistStats' => $artistStats,
            'activity' => $activity,
            'transactions' => $transactions,
            'contents' => $contents,
            'reviews' => $reviews,
            'security' => [
                'sessions' => $securitySessions,
                'failed_attempts' => 0,
                'password_change_logs' => [],
                'active_sessions_count' => $securitySessions->count(),
            ],
        ]);
    }

    public function edit(User $user): InertiaResponse
    {
        $user->load(['clientProfile', 'artistProfile']);

        return Inertia::render('Admin/Users/Edit', [
            'categories' => $this->artistCategories(),
            'user' => [
                'id' => $user->id,
                'first_name' => $user->clientProfile?->first_name,
                'last_name' => $user->clientProfile?->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'city' => $user->city,
                'date_of_birth' => $user->clientProfile?->date_of_birth?->toDateString(),
                'gender' => $user->clientProfile?->gender,
                'profile_photo' => $user->profile_photo,
                'role' => $this->roleValue($user),
                'status' => $this->resolveStatus($user),
                'stage_name' => $user->artistProfile?->stage_name,
                'category' => is_array($user->artistProfile?->categories) ? ($user->artistProfile?->categories[0] ?? '') : '',
                'bio' => $user->artistProfile?->bio,
                'base_rate' => $user->artistProfile?->base_rate,
                'portfolio_urls' => is_array($user->artistProfile?->portfolio_urls) ? $user->artistProfile?->portfolio_urls : [],
                'email_verified' => $user->email_verified_at !== null,
            ],
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();

        $user->update([
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'city' => $validated['city'] ?? null,
            'profile_photo' => $validated['profile_photo'] ?? null,
            'role' => $validated['role'],
            'email_verified_at' => ! empty($validated['mark_email_verified']) ? now() : null,
            'password' => ! empty($validated['password']) ? Hash::make($validated['password']) : $user->password,
        ]);

        ClientProfile::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'gender' => $validated['gender'] ?? null,
            ]
        );

        if ($validated['role'] === 'artist') {
            ArtistProfile::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'stage_name' => $validated['stage_name'],
                    'bio' => $validated['bio'] ?? null,
                    'categories' => ! empty($validated['category']) ? [$validated['category']] : null,
                    'base_rate' => $validated['base_rate'] ?? 0,
                    'portfolio_urls' => $validated['portfolio_urls'] ?? null,
                ]
            );

            Wallet::query()->firstOrCreate(
                ['artist_id' => $user->id],
                [
                    'balance' => 0,
                    'pending_balance' => 0,
                    'currency' => 'XAF',
                ]
            );
        } else {
            ArtistProfile::query()->where('user_id', $user->id)->delete();
            Wallet::query()->where('artist_id', $user->id)->delete();
        }

        $this->applyStatus($user->fresh(['artistProfile']), $validated['status']);

        if (! empty($validated['force_password_change'])) {
            $request->session()->flash('warning', 'Option activee: demander un changement de mot de passe a la prochaine connexion (champ non persiste en base actuelle).');
        }

        return redirect()->route('admin.users.show', $user)->with('message', 'Utilisateur mis a jour avec succes.');
    }

    public function suspend(User $user): RedirectResponse
    {
        $user->update(['is_active' => false]);

        return back()->with('message', 'Utilisateur suspendu.');
    }

    public function activate(User $user): RedirectResponse
    {
        $user->update(['is_active' => true]);

        return back()->with('message', 'Utilisateur active.');
    }

    public function ban(User $user): RedirectResponse
    {
        $user->update(['is_active' => false]);

        if ($this->roleValue($user) === 'artist') {
            ArtistProfile::query()->where('user_id', $user->id)->update([
                'verification_status' => 'rejected',
                'is_verified' => false,
            ]);
        }

        return back()->with('message', 'Utilisateur banni.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('admin.users.index')->with('message', 'Utilisateur supprime.');
    }

    public function bulk(Request $request): RedirectResponse|StreamedResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'string', 'exists:users,id'],
            'action' => ['required', 'in:suspend,ban,delete,export_csv,send_email'],
            'subject' => ['nullable', 'string', 'max:150'],
            'body' => ['nullable', 'string', 'max:5000'],
        ]);

        $users = User::query()->whereIn('id', $validated['ids'])->get();

        if ($validated['action'] === 'suspend') {
            User::query()->whereIn('id', $validated['ids'])->update(['is_active' => false]);

            return back()->with('message', 'Suspension en masse effectuee.');
        }

        if ($validated['action'] === 'ban') {
            User::query()->whereIn('id', $validated['ids'])->update(['is_active' => false]);
            ArtistProfile::query()->whereIn('user_id', $validated['ids'])->update([
                'verification_status' => 'rejected',
                'is_verified' => false,
            ]);

            return back()->with('message', 'Bannissement en masse effectue.');
        }

        if ($validated['action'] === 'delete') {
            User::query()->whereIn('id', $validated['ids'])->delete();

            return back()->with('message', 'Suppression en masse effectuee.');
        }

        if ($validated['action'] === 'send_email') {
            return back()->with('message', 'Campagne email enregistree. Connectez un transport mail pour l\'envoi effectif.');
        }

        return response()->streamDownload(function () use ($users): void {
            $handle = fopen('php://output', 'wb');
            fputcsv($handle, ['ID', 'Nom', 'Email', 'Telephone', 'Type', 'Statut', 'Inscription']);

            foreach ($users as $user) {
                $user->loadMissing(['clientProfile', 'artistProfile']);

                fputcsv($handle, [
                    $user->id,
                    $this->resolveFullName($user),
                    $user->email,
                    $user->phone,
                    $this->roleValue($user),
                    $this->resolveStatus($user),
                    $user->created_at?->toDateString(),
                ]);
            }

            fclose($handle);
        }, 'users-export-'.now()->format('Ymd-His').'.csv');
    }

    public function impersonate(Request $request, User $user): RedirectResponse
    {
        $admin = $request->user();

        if ($admin === null || ! method_exists($admin, 'isAdmin') || ! $admin->isAdmin()) {
            abort(403);
        }

        $request->session()->put('admin_impersonator_id', $admin->id);
        auth()->login($user);

        return redirect('/')->with('message', 'Connexion en tant que '.$this->resolveFullName($user).' activee.');
    }

    public function stopImpersonation(Request $request): RedirectResponse
    {
        $adminId = $request->session()->pull('admin_impersonator_id');

        if (! is_string($adminId) || $adminId === '') {
            return redirect()->route('admin.dashboard');
        }

        $admin = User::query()->find($adminId);

        if (! $admin) {
            return redirect()->route('admin.dashboard');
        }

        auth()->login($admin);

        return redirect()->route('admin.users.index')->with('message', 'Retour sur la session administrateur effectue.');
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder<User>  $query
     */
    protected function applyStatusFilter($query, string $status): void
    {
        if ($status === 'all') {
            return;
        }

        if ($status === 'active') {
            $query->where('is_active', true)
                ->where(function ($subQuery) {
                    $subQuery
                        ->whereDoesntHave('artistProfile', fn ($profileQuery) => $profileQuery->where('verification_status', 'pending'))
                        ->whereNotNull('email_verified_at');
                });

            return;
        }

        if ($status === 'pending') {
            $query->where('is_active', true)
                ->where(function ($subQuery) {
                    $subQuery
                        ->whereNull('email_verified_at')
                        ->orWhereHas('artistProfile', fn ($profileQuery) => $profileQuery->where('verification_status', 'pending'));
                });

            return;
        }

        if ($status === 'suspended') {
            $query->where('is_active', false)
                ->where(function ($subQuery) {
                    $subQuery
                        ->whereDoesntHave('artistProfile', fn ($profileQuery) => $profileQuery->where('verification_status', 'rejected'))
                        ->orWhereHas('artistProfile', fn ($profileQuery) => $profileQuery->whereNot('verification_status', 'rejected'));
                });

            return;
        }

        if ($status === 'banned') {
            $query->where('is_active', false)
                ->whereHas('artistProfile', fn ($profileQuery) => $profileQuery->where('verification_status', 'rejected'));
        }
    }

    protected function applyStatus(User $user, string $status): void
    {
        $user->loadMissing('artistProfile');

        if ($status === 'active') {
            $user->update(['is_active' => true]);

            if ($this->roleValue($user) === 'artist' && $user->artistProfile) {
                $user->artistProfile->update([
                    'verification_status' => 'approved',
                    'is_verified' => true,
                ]);
            }

            return;
        }

        if ($status === 'pending') {
            $user->update(['is_active' => true]);

            if ($this->roleValue($user) === 'artist' && $user->artistProfile) {
                $user->artistProfile->update([
                    'verification_status' => 'pending',
                    'is_verified' => false,
                ]);
            }

            return;
        }

        if ($status === 'suspended') {
            $user->update(['is_active' => false]);

            if ($this->roleValue($user) === 'artist' && $user->artistProfile && $user->artistProfile->verification_status === 'rejected') {
                $user->artistProfile->update([
                    'verification_status' => 'approved',
                    'is_verified' => true,
                ]);
            }

            return;
        }

        if ($status === 'banned') {
            $user->update(['is_active' => false]);

            if ($this->roleValue($user) === 'artist' && $user->artistProfile) {
                $user->artistProfile->update([
                    'verification_status' => 'rejected',
                    'is_verified' => false,
                ]);
            }
        }
    }

    protected function resolveStatus(User $user): string
    {
        $role = $this->roleValue($user);

        if (! $user->is_active) {
            if ($role === 'artist' && $user->artistProfile?->verification_status === 'rejected') {
                return 'banned';
            }

            return 'suspended';
        }

        if ($role === 'artist' && $user->artistProfile?->verification_status === 'pending') {
            return 'pending';
        }

        if ($user->email_verified_at === null) {
            return 'pending';
        }

        return 'active';
    }

    protected function resolveFullName(User $user): string
    {
        $firstName = trim((string) ($user->clientProfile?->first_name ?? ''));
        $lastName = trim((string) ($user->clientProfile?->last_name ?? ''));
        $fullName = trim($firstName.' '.$lastName);

        if ($fullName !== '') {
            return $fullName;
        }

        if (! empty($user->artistProfile?->stage_name)) {
            return (string) $user->artistProfile?->stage_name;
        }

        return 'Utilisateur '.Str::substr($user->id, 0, 8);
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    protected function artistCategories(): array
    {
        return [
            ['value' => 'singer', 'label' => 'Chant'],
            ['value' => 'musician', 'label' => 'Musique instrumentale'],
            ['value' => 'dancer', 'label' => 'Danse'],
            ['value' => 'dj', 'label' => 'DJ'],
            ['value' => 'painter', 'label' => 'Peinture'],
            ['value' => 'actor', 'label' => 'Comedie'],
            ['value' => 'photographer', 'label' => 'Photographie'],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function buildActivity(User $user): array
    {
        $activities = collect();

        $sessions = UserSession::query()
            ->where('user_id', $user->id)
            ->latest('last_activity')
            ->limit(20)
            ->get(['id', 'ip_address', 'user_agent', 'last_activity']);

        $sessions->each(function (UserSession $session) use ($activities): void {
            $activities->push([
                'type' => 'connexion',
                'title' => 'Connexion',
                'description' => trim(($session->ip_address ?? 'IP inconnue').' - '.Str::limit((string) ($session->user_agent ?? 'Device inconnu'), 80)),
                'date' => $session->last_activity > 0 ? now()->setTimestamp($session->last_activity)->toIso8601String() : null,
            ]);
        });

        Reservation::query()
            ->where(function ($query) use ($user): void {
                $query->where('client_id', $user->id)->orWhere('artist_id', $user->id);
            })
            ->latest('created_at')
            ->limit(20)
            ->get(['id', 'status', 'created_at'])
            ->each(function (Reservation $reservation) use ($activities): void {
                $activities->push([
                    'type' => 'reservation',
                    'title' => 'Reservation '.$reservation->status,
                    'description' => 'Reservation #'.$reservation->id,
                    'date' => $reservation->created_at?->toIso8601String(),
                ]);
            });

        AlbumPurchase::query()
            ->where('client_id', $user->id)
            ->latest('created_at')
            ->limit(20)
            ->get(['id', 'album_id', 'price_paid', 'created_at'])
            ->each(function (AlbumPurchase $purchase) use ($activities): void {
                $activities->push([
                    'type' => 'achat',
                    'title' => 'Achat album',
                    'description' => 'Achat #'.$purchase->id.' - '.(float) $purchase->price_paid.' FCFA',
                    'date' => $purchase->created_at?->toIso8601String(),
                ]);
            });

        Video::query()
            ->where('artist_id', $user->id)
            ->latest('created_at')
            ->limit(20)
            ->get(['id', 'title', 'created_at'])
            ->each(function (Video $video) use ($activities): void {
                $activities->push([
                    'type' => 'publication',
                    'title' => 'Publication video',
                    'description' => (string) $video->title,
                    'date' => $video->created_at?->toIso8601String(),
                ]);
            });

        return $activities
            ->filter(fn (array $item): bool => ! empty($item['date']))
            ->sortByDesc('date')
            ->take(60)
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function buildTransactions(User $user): array
    {
        $transactions = collect();

        Payment::query()
            ->where('client_id', $user->id)
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'reservation_id', 'amount', 'status', 'created_at'])
            ->each(function (Payment $payment) use ($transactions): void {
                $transactions->push([
                    'id' => $payment->id,
                    'type' => 'Reservation',
                    'amount' => (float) $payment->amount,
                    'commission' => null,
                    'status' => $payment->status->value,
                    'date' => $payment->created_at?->toIso8601String(),
                ]);
            });

        AlbumPurchase::query()
            ->where('client_id', $user->id)
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'price_paid', 'created_at'])
            ->each(function (AlbumPurchase $purchase) use ($transactions): void {
                $transactions->push([
                    'id' => $purchase->id,
                    'type' => 'Achat album',
                    'amount' => (float) $purchase->price_paid,
                    'commission' => null,
                    'status' => 'completed',
                    'date' => $purchase->created_at?->toIso8601String(),
                ]);
            });

        $wallet = Wallet::query()->where('artist_id', $user->id)->first();
        if ($wallet) {
            Withdrawal::query()
                ->where('wallet_id', $wallet->id)
                ->latest('created_at')
                ->limit(50)
                ->get(['id', 'amount', 'fee', 'status', 'created_at'])
                ->each(function (Withdrawal $withdrawal) use ($transactions): void {
                    $transactions->push([
                        'id' => $withdrawal->id,
                        'type' => 'Retrait',
                        'amount' => (float) $withdrawal->amount,
                        'commission' => (float) $withdrawal->fee,
                        'status' => $withdrawal->status,
                        'date' => $withdrawal->created_at?->toIso8601String(),
                    ]);
                });
        }

        return $transactions
            ->filter(fn (array $item): bool => ! empty($item['date']))
            ->sortByDesc('date')
            ->take(100)
            ->values()
            ->all();
    }

    /**
     * @return array<string, array<int, array<string, mixed>>>
     */
    protected function buildArtistContents(User $user): array
    {
        if ($this->roleValue($user) !== 'artist') {
            return [
                'albums' => [],
                'videos' => [],
                'services' => [],
                'tracks' => [],
            ];
        }

        $albums = Album::query()
            ->where('artist_id', $user->id)
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'title', 'published_at'])
            ->map(fn (Album $album): array => [
                'id' => $album->id,
                'title' => $album->title,
                'published' => $album->published_at !== null,
            ])
            ->values()
            ->all();

        $videos = Video::query()
            ->where('artist_id', $user->id)
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'title', 'published_at'])
            ->map(fn (Video $video): array => [
                'id' => $video->id,
                'title' => $video->title,
                'published' => $video->published_at !== null,
            ])
            ->values()
            ->all();

        $services = Service::query()
            ->where('artist_id', $user->id)
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'title', 'is_active'])
            ->map(fn (Service $service): array => [
                'id' => $service->id,
                'title' => $service->title,
                'published' => (bool) $service->is_active,
            ])
            ->values()
            ->all();

        $tracks = Track::query()
            ->whereHas('album', fn ($query) => $query->where('artist_id', $user->id))
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'title'])
            ->map(fn (Track $track): array => [
                'id' => $track->id,
                'title' => $track->title,
                'published' => true,
            ])
            ->values()
            ->all();

        return [
            'albums' => $albums,
            'videos' => $videos,
            'services' => $services,
            'tracks' => $tracks,
        ];
    }

    /**
     * @return array<string, array<int, array<string, mixed>>>
     */
    protected function buildReviews(User $user): array
    {
        $given = Review::query()
            ->where('client_id', $user->id)
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'artist_id', 'rating', 'comment', 'created_at'])
            ->map(fn (Review $review): array => [
                'id' => $review->id,
                'target_user_id' => $review->artist_id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'date' => $review->created_at?->toIso8601String(),
            ])
            ->values()
            ->all();

        $received = Review::query()
            ->where('artist_id', $user->id)
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'client_id', 'rating', 'comment', 'is_reported', 'created_at'])
            ->map(fn (Review $review): array => [
                'id' => $review->id,
                'target_user_id' => $review->client_id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'is_reported' => (bool) $review->is_reported,
                'date' => $review->created_at?->toIso8601String(),
            ])
            ->values()
            ->all();

        return [
            'given' => $given,
            'received' => $received,
        ];
    }

    protected function roleValue(User $user): string
    {
        return is_string($user->role) ? $user->role : $user->role->value;
    }
}
