import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ReviewReport = {
    id: string;
    rating: number;
    comment?: string | null;
    reason?: string | null;
    created_at?: string | null;
};

type CommentReport = {
    id: string;
    content: string;
    created_at?: string | null;
};

type Props = {
    reportedReviews: ReviewReport[];
    reportedComments: CommentReport[];
};

export default function Moderation({ reportedReviews, reportedComments }: Props) {
    return (
        <AdminLayout title="Moderation contenus" subtitle="Gerer les signalements avis et commentaires.">
            <Head title="Admin - Moderation contenus" />

            <div className="grid gap-4 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Avis signales</CardTitle>
                        <CardDescription>{reportedReviews.length} element(s) a traiter</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {reportedReviews.map((review) => (
                            <div key={review.id} className="rounded border p-3 text-sm">
                                <div className="mb-1 flex items-center justify-between">
                                    <Badge variant="destructive">Avis</Badge>
                                    <span>Note {review.rating}/5</span>
                                </div>
                                <p className="text-muted-foreground">{review.comment || '-'}</p>
                                <p className="mt-1 text-xs text-muted-foreground">Motif: {review.reason || 'Non renseigne'}</p>
                                <div className="mt-2 flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => router.post(`/admin/moderation/reviews/${review.id}/resolve`)}>
                                        Marquer traite
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => router.delete(`/admin/moderation/reviews/${review.id}`)}>
                                        Supprimer
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {reportedReviews.length === 0 ? <p className="text-sm text-muted-foreground">Aucun avis signale.</p> : null}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Commentaires videos signales</CardTitle>
                        <CardDescription>{reportedComments.length} element(s) a traiter</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {reportedComments.map((comment) => (
                            <div key={comment.id} className="rounded border p-3 text-sm">
                                <div className="mb-1">
                                    <Badge variant="destructive">Commentaire</Badge>
                                </div>
                                <p className="text-muted-foreground">{comment.content}</p>
                                <div className="mt-2 flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => router.post(`/admin/moderation/comments/${comment.id}/resolve`)}>
                                        Marquer traite
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => router.delete(`/admin/moderation/comments/${comment.id}`)}>
                                        Supprimer
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {reportedComments.length === 0 ? <p className="text-sm text-muted-foreground">Aucun commentaire signale.</p> : null}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
