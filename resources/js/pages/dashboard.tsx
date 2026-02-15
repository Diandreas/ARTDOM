import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Calendar, Users, Star, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardProps {
  stats: {
    reservations_count: number;
    favorites_count: number;
    total_spent: number;
  };
  recentReservations: any[];
}

export default function ClientDashboard({ stats, recentReservations }: DashboardProps) {
  return (
    <MainLayout>
      <Head title="Dashboard Client" />
      <div className="container px-4 md:px-6 py-8 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading">Mon Dashboard</h1>
          <p className="text-muted-foreground">Gérez vos réservations et découvrez de nouveaux artistes.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Réservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reservations_count}</div>
              <p className="text-xs text-muted-foreground">Total des réservations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artistes Favoris</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favorites_count}</div>
              <p className="text-xs text-muted-foreground">Favoris enregistrés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_spent.toFixed(2)} €</div>
              <p className="text-xs text-muted-foreground">Toutes réservations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>Explorez et réservez des artistes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/artstream">
                <Button className="w-full" variant="outline">
                  <Music className="mr-2 h-4 w-4" />
                  Découvrir ArtStream
                </Button>
              </Link>
              <Link href="/artists">
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Parcourir les Artistes
                </Button>
              </Link>
              <Link href="/client/reservations">
                <Button className="w-full" variant="default">
                  <Calendar className="mr-2 h-4 w-4" />
                  Mes Réservations
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Réservations Récentes</CardTitle>
              <CardDescription>Vos 5 dernières réservations</CardDescription>
            </CardHeader>
            <CardContent>
              {recentReservations && recentReservations.length > 0 ? (
                <div className="space-y-4">
                  {recentReservations.map((res: any) => (
                    <div key={res.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <img
                          src={res.artist?.profile_photo || '/placeholder-avatar.png'}
                          alt={res.artist?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm">{res.service?.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {res.artist?.artistProfile?.stage_name || res.artist?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={res.status === 'pending' ? 'outline' : 'default'}>
                          {res.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Link href={`/client/reservations/${res.id}`} className="hover:underline">
                            Voir détails
                          </Link>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    Aucune réservation pour le moment.
                  </p>
                  <Link href="/artists">
                    <Button variant="outline" size="sm">
                      Découvrir des artistes
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
