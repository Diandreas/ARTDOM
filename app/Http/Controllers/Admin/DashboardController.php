<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\AlbumPurchase;
use App\Models\ArtistProfile;
use App\Models\ClientSubscription;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Service;
use App\Models\Ticket;
use App\Models\Track;
use App\Models\User;
use App\Models\Video;
use App\Models\VideoComment;
use App\Models\Withdrawal;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Affiche le tableau de bord admin
     *
     * Route: GET /admin
     * Middleware: auth, role:admin
     *
     * Affiche les statistiques globales :
     * - Nombre d'utilisateurs (clients, artistes)
     * - Réservations (total, ce mois)
     * - Revenus (total, ce mois)
     * - Tickets ouverts
     * - Artistes en attente de validation
     */
    public function index(): Response
    {
        $now = now();
        $start24h = $now->copy()->subDay();
        $start7d = $now->copy()->subDays(6)->startOfDay();
        $start30d = $now->copy()->subDays(29)->startOfDay();
        $startYear = $now->copy()->startOfYear();

        $days = collect(range(6, 0))->map(fn (int $daysAgo) => $now->copy()->subDays($daysAgo)->toDateString());
        $dayLabels = $days->map(fn (string $date) => now()->parse($date)->format('d/m'));

        $totalClients = User::where('role', 'client')->count();
        $totalArtists = User::where('role', 'artist')->count();
        $totalUsers = $totalClients + $totalArtists;

        $newUsers24h = User::where('created_at', '>=', $start24h)->count();
        $newUsers7d = User::where('created_at', '>=', $start7d)->count();
        $newUsers30d = User::where('created_at', '>=', $start30d)->count();

        $artistsActive = User::where('role', 'artist')
            ->where('is_active', true)
            ->count();
        $artistsSuspended = User::where('role', 'artist')
            ->where('is_active', false)
            ->count();

        $revenueDay = Payment::where('status', 'completed')->where('created_at', '>=', $start24h)->sum('amount');
        $revenueWeek = Payment::where('status', 'completed')->where('created_at', '>=', $start7d)->sum('amount');
        $revenueMonth = Payment::where('status', 'completed')->where('created_at', '>=', $start30d)->sum('amount');
        $revenueYear = Payment::where('status', 'completed')->where('created_at', '>=', $startYear)->sum('amount');
        $revenueTotal = Payment::where('status', 'completed')->sum('amount');

        $commissionDay = Reservation::where('created_at', '>=', $start24h)->sum('commission_amount');
        $commissionWeek = Reservation::where('created_at', '>=', $start7d)->sum('commission_amount');
        $commissionMonth = Reservation::where('created_at', '>=', $start30d)->sum('commission_amount');
        $commissionYear = Reservation::where('created_at', '>=', $startYear)->sum('commission_amount');
        $commissionTotal = Reservation::sum('commission_amount');

        $reservationsConfirmed = Reservation::where('status', 'confirmed')->count();
        $reservationsPending = Reservation::where('status', 'pending')->count();
        $reservationsCompleted = Reservation::where('status', 'completed')->count();

        $contentAlbums = Album::whereNotNull('published_at')->count();
        $contentVideos = Video::whereNotNull('published_at')->count();
        $contentCourses = Service::where('is_active', true)->count();

        $reportedReviews = Review::where('is_reported', true)->count();
        $reportedVideoComments = VideoComment::where('is_reported', true)->count();
        $reportsPending = $reportedReviews + $reportedVideoComments;

        $openTickets = Ticket::where('status', 'open')->count();
        $inProgressTickets = Ticket::where('status', 'in_progress')->count();

        $reservationRevenueByDay = Reservation::where('created_at', '>=', $start7d)
            ->selectRaw('DATE(created_at) as day, SUM(total_amount) as amount')
            ->groupBy('day')
            ->pluck('amount', 'day');

        $salesRevenueByDay = AlbumPurchase::where('created_at', '>=', $start7d)
            ->selectRaw('DATE(created_at) as day, SUM(price_paid) as amount')
            ->groupBy('day')
            ->pluck('amount', 'day');

        $subscriptionRevenueByDay = ClientSubscription::where('created_at', '>=', $start7d)
            ->selectRaw('DATE(created_at) as day, SUM(price) as amount')
            ->groupBy('day')
            ->pluck('amount', 'day');

        $revenueCurve = $days->map(function (string $day) use ($reservationRevenueByDay, $salesRevenueByDay, $subscriptionRevenueByDay) {
            $reservationAmount = (float) ($reservationRevenueByDay[$day] ?? 0);
            $salesAmount = (float) ($salesRevenueByDay[$day] ?? 0);
            $subscriptionAmount = (float) ($subscriptionRevenueByDay[$day] ?? 0);

            return [
                'day' => now()->parse($day)->format('d/m'),
                'reservations' => $reservationAmount,
                'sales' => $salesAmount,
                'subscriptions' => $subscriptionAmount,
                'total' => $reservationAmount + $salesAmount + $subscriptionAmount,
            ];
        });

        $clientSignupsByDay = User::where('role', 'client')
            ->where('created_at', '>=', $start7d)
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        $artistSignupsByDay = User::where('role', 'artist')
            ->where('created_at', '>=', $start7d)
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        $signupsBar = $days->map(function (string $day) use ($clientSignupsByDay, $artistSignupsByDay) {
            return [
                'day' => now()->parse($day)->format('d/m'),
                'clients' => (int) ($clientSignupsByDay[$day] ?? 0),
                'artists' => (int) ($artistSignupsByDay[$day] ?? 0),
            ];
        });

        $categoryDistribution = [];
        ArtistProfile::query()
            ->whereNotNull('categories')
            ->get(['categories'])
            ->each(function (ArtistProfile $profile) use (&$categoryDistribution) {
                $categories = is_array($profile->categories) ? $profile->categories : [];

                foreach ($categories as $category) {
                    $normalizedCategory = strtolower((string) $category);
                    if ($normalizedCategory === '') {
                        continue;
                    }

                    $categoryDistribution[$normalizedCategory] = ($categoryDistribution[$normalizedCategory] ?? 0) + 1;
                }
            });

        arsort($categoryDistribution);
        $categoryDonut = collect($categoryDistribution)
            ->take(6)
            ->map(fn ($count, $category) => [
                'category' => (string) $category,
                'count' => (int) $count,
            ])
            ->values();

        $buyersCount = Payment::where('status', 'completed')->distinct('client_id')->count('client_id');
        $conversionFunnel = [
            'visitors' => null,
            'signups' => $totalUsers,
            'buyers' => $buyersCount,
            'signup_rate' => null,
            'buyer_rate_from_signup' => $totalUsers > 0 ? round(($buyersCount / $totalUsers) * 100, 2) : 0,
            'tracking_enabled' => false,
        ];

        $recentSignups = User::query()
            ->latest('created_at')
            ->limit(5)
            ->get(['id', 'role', 'created_at'])
            ->map(function (User $user) {
                $roleValue = $user->role instanceof \BackedEnum ? $user->role->value : (string) $user->role;

                return [
                    'type' => 'inscription',
                    'title' => 'Nouvelle inscription '.$roleValue,
                    'description' => 'Utilisateur #'.$user->id,
                    'occurred_at' => $user->created_at?->toIso8601String(),
                ];
            });

        $recentConfirmedReservations = Reservation::query()
            ->where('status', 'confirmed')
            ->latest('created_at')
            ->limit(5)
            ->get(['id', 'reservation_number', 'created_at'])
            ->map(fn (Reservation $reservation) => [
                'type' => 'reservation',
                'title' => 'Reservation confirmee',
                'description' => $reservation->reservation_number ?: 'Reservation #'.$reservation->id,
                'occurred_at' => $reservation->created_at?->toIso8601String(),
            ]);

        $recentReportedReviews = Review::query()
            ->where('is_reported', true)
            ->latest('updated_at')
            ->limit(3)
            ->get(['id', 'updated_at'])
            ->map(fn (Review $review) => [
                'type' => 'signalement',
                'title' => 'Avis signale',
                'description' => 'Review #'.$review->id,
                'occurred_at' => ($review->updated_at ?: $review->created_at)?->toIso8601String(),
            ]);

        $recentReportedComments = VideoComment::query()
            ->where('is_reported', true)
            ->latest('updated_at')
            ->limit(3)
            ->get(['id', 'updated_at'])
            ->map(fn (VideoComment $comment) => [
                'type' => 'signalement',
                'title' => 'Commentaire video signale',
                'description' => 'Commentaire #'.$comment->id,
                'occurred_at' => ($comment->updated_at ?: $comment->created_at)?->toIso8601String(),
            ]);

        $recentWithdrawals = Withdrawal::query()
            ->where('status', 'pending')
            ->latest('requested_at')
            ->limit(5)
            ->get(['id', 'amount', 'requested_at', 'created_at'])
            ->map(fn (Withdrawal $withdrawal) => [
                'type' => 'retrait',
                'title' => 'Demande de retrait',
                'description' => 'Retrait #'.$withdrawal->id.' - '.(float) $withdrawal->amount.' FCFA',
                'occurred_at' => ($withdrawal->requested_at ?: $withdrawal->created_at)?->toIso8601String(),
            ]);

        $recentReviews = Review::query()
            ->latest('created_at')
            ->limit(5)
            ->get(['id', 'rating', 'created_at'])
            ->map(fn (Review $review) => [
                'type' => 'avis',
                'title' => 'Nouvel avis client',
                'description' => 'Review #'.$review->id.' - note '.$review->rating.'/5',
                'occurred_at' => $review->created_at?->toIso8601String(),
            ]);

        $activityTimeline = $recentSignups
            ->concat($recentConfirmedReservations)
            ->concat($recentReportedReviews)
            ->concat($recentReportedComments)
            ->concat($recentWithdrawals)
            ->concat($recentReviews)
            ->filter(fn (array $item) => ! empty($item['occurred_at']))
            ->sortByDesc('occurred_at')
            ->values()
            ->take(20);

        $urgentReports = Review::where('is_reported', true)->count() + VideoComment::where('is_reported', true)->count();
        $pendingWithdrawals48h = Withdrawal::query()
            ->where('status', 'pending')
            ->where(function ($query) use ($now) {
                $query->where('requested_at', '<=', $now->copy()->subHours(48))
                    ->orWhere(function ($subQuery) use ($now) {
                        $subQuery->whereNull('requested_at')
                            ->where('created_at', '<=', $now->copy()->subHours(48));
                    });
            })
            ->count();
        $ticketsNoResponse24h = Ticket::query()
            ->whereIn('status', ['open', 'in_progress'])
            ->whereNull('admin_response')
            ->where('created_at', '<=', $now->copy()->subHours(24))
            ->count();

        $totalTrackLikes = \Illuminate\Support\Facades\DB::table('favorites')->count();
        $totalVideoLikes = Video::sum('likes');

        $topLikedTracks = Track::withCount('favoritedBy')
            ->orderBy('favorited_by_count', 'desc')
            ->limit(5)
            ->get()
            ->map(fn (Track $track) => [
                'id' => $track->id,
                'title' => $track->title,
                'likes' => $track->favorited_by_count,
            ]);

        $topLikedVideos = Video::orderBy('likes', 'desc')
            ->limit(5)
            ->get()
            ->map(fn (Video $video) => [
                'id' => $video->id,
                'title' => $video->title,
                'likes' => $video->likes,
            ]);

        $topPlayedTracks = Track::orderBy('plays', 'desc')
            ->limit(5)
            ->get()
            ->map(fn (Track $track) => [
                'id' => $track->id,
                'title' => $track->title,
                'plays' => $track->plays,
            ]);

        // Financial statistics
        $totalWithdrawalsPaid = Withdrawal::where('status', 'completed')->sum('amount');
        $pendingWithdrawalsCount = Withdrawal::where('status', 'pending')->count();
        $totalPlatformCommissions = (float) $commissionTotal;

        return Inertia::render('Admin/Dashboard', [
            'topStats' => [
                'liked_tracks' => $topLikedTracks,
                'played_tracks' => $topPlayedTracks,
                'liked_videos' => $topLikedVideos,
            ],
            'financialStats' => [
                'payouts_paid' => $totalWithdrawalsPaid,
                'pending_payouts' => $pendingWithdrawalsCount,
                'total_commissions' => $totalPlatformCommissions,
            ],
            'kpis' => [
                'users' => [
                    'total' => $totalUsers,
                    'clients' => $totalClients,
                    'artists' => $totalArtists,
                    'new' => [
                        'last_24h' => $newUsers24h,
                        'last_7d' => $newUsers7d,
                        'last_30d' => $newUsers30d,
                    ],
                ],
                'artists' => [
                    'active' => $artistsActive,
                    'suspended' => $artistsSuspended,
                ],
                'likes' => [
                    'tracks' => $totalTrackLikes,
                    'videos' => $totalVideoLikes,
                    'total' => $totalTrackLikes + $totalVideoLikes,
                ],
                'revenue' => [
                    'day' => (float) $revenueDay,
                    'week' => (float) $revenueWeek,
                    'month' => (float) $revenueMonth,
                    'year' => (float) $revenueYear,
                    'total' => (float) $revenueTotal,
                ],
                'commissions' => [
                    'day' => (float) $commissionDay,
                    'week' => (float) $commissionWeek,
                    'month' => (float) $commissionMonth,
                    'year' => (float) $commissionYear,
                    'total' => (float) $commissionTotal,
                ],
                'reservations' => [
                    'confirmed' => $reservationsConfirmed,
                    'pending' => $reservationsPending,
                    'completed' => $reservationsCompleted,
                ],
                'contents' => [
                    'albums' => $contentAlbums,
                    'videos' => $contentVideos,
                    'courses' => $contentCourses,
                ],
                'reports_pending' => $reportsPending,
                'tickets' => [
                    'open' => $openTickets,
                    'in_progress' => $inProgressTickets,
                ],
            ],
            'charts' => [
                'revenue_curve' => $revenueCurve,
                'signups_bar' => $signupsBar,
                'category_donut' => $categoryDonut,
                'conversion_funnel' => $conversionFunnel,
                'days' => $dayLabels,
            ],
            'activityTimeline' => $activityTimeline,
            'criticalAlerts' => [
                'urgent_reports' => $urgentReports,
                'withdrawals_pending_over_48h' => $pendingWithdrawals48h,
                'tickets_without_response_over_24h' => $ticketsNoResponse24h,
            ],
            'quickActions' => [
                [
                    'label' => 'Moderer contenus',
                    'description' => 'Traiter les signalements de contenus.',
                    'href' => route('admin.moderation.index'),
                ],
                [
                    'label' => 'Tickets support',
                    'description' => 'Repondre aux demandes client.',
                    'href' => route('admin.tickets.index'),
                ],
                [
                    'label' => 'Generer rapports',
                    'description' => 'Exporter les statistiques du mois.',
                    'href' => route('admin.reports.index'),
                ],
                [
                    'label' => 'Envoyer notification globale',
                    'description' => 'Diffuser un message a tous les utilisateurs.',
                    'href' => route('admin.broadcast.create'),
                ],
            ],
        ]);
    }
}
