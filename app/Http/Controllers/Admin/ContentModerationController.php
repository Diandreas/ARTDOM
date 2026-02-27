<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\VideoComment;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContentModerationController extends Controller
{
    public function index(): Response
    {
        $reportedReviews = Review::query()
            ->where('is_reported', true)
            ->latest('updated_at')
            ->limit(100)
            ->get(['id', 'rating', 'comment', 'report_reason', 'created_at'])
            ->map(fn (Review $review): array => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'reason' => $review->report_reason,
                'created_at' => $review->created_at?->toIso8601String(),
            ])
            ->values();

        $reportedComments = VideoComment::query()
            ->where('is_reported', true)
            ->latest('updated_at')
            ->limit(100)
            ->get(['id', 'content', 'created_at'])
            ->map(fn (VideoComment $comment): array => [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at?->toIso8601String(),
            ])
            ->values();

        return Inertia::render('Admin/Moderation', [
            'reportedReviews' => $reportedReviews,
            'reportedComments' => $reportedComments,
        ]);
    }

    public function resolveReview(Review $review): RedirectResponse
    {
        $review->update([
            'is_reported' => false,
            'report_reason' => null,
        ]);

        return back()->with('message', 'Signalement d\'avis traite.');
    }

    public function deleteReview(Review $review): RedirectResponse
    {
        $review->delete();

        return back()->with('message', 'Avis supprime.');
    }

    public function resolveComment(VideoComment $comment): RedirectResponse
    {
        $comment->update([
            'is_reported' => false,
        ]);

        return back()->with('message', 'Signalement de commentaire traite.');
    }

    public function deleteComment(VideoComment $comment): RedirectResponse
    {
        $comment->delete();

        return back()->with('message', 'Commentaire supprime.');
    }
}
