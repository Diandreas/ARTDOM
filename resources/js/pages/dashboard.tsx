import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Music, Calendar, Users, TrendingUp, Star, DollarSign } from 'lucide-react';
import type { User as UserType } from '@/types/auth';

export default function Dashboard() {
  const { auth } = usePage().props as any;
  const user: UserType = auth.user;

  // Client Dashboard
  if (user.role === 'client') {
    return (
      <MainLayout>
        <Head title="Dashboard Client" />
        <div className="container px-4 md:px-6 py-8 pb-24">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-heading">Bienvenue, {user.name}!</h1>
            <p className="text-muted-foreground">Gérez vos réservations et découvrez de nouveaux artistes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Aucune réservation en cours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Artistes Favoris</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Aucun favori ajouté</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0 €</div>
                <p className="text-xs text-muted-foreground">Ce mois</p>
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
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Parcourir les Artistes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Réservations Récentes</CardTitle>
                <CardDescription>Vos dernières réservations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucune réservation pour le moment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Artist Dashboard
  if (user.role === 'artist') {
    return (
      <MainLayout>
        <Head title="Dashboard Artiste" />
        <div className="container px-4 md:px-6 py-8 pb-24">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-heading">Bienvenue, {user.name}!</h1>
            <p className="text-muted-foreground">Gérez votre profil et vos prestations.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vues du Profil</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">En attente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0 €</div>
                <p className="text-xs text-muted-foreground">Ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.0</div>
                <p className="text-xs text-muted-foreground">Aucun avis</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>Gérez votre présence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href={`/artist/${user.id}`}>
                  <Button className="w-full" variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Voir mon Profil Public
                  </Button>
                </Link>
                <Button className="w-full" variant="outline">
                  <Music className="mr-2 h-4 w-4" />
                  Gérer mes Services
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Réservations Récentes</CardTitle>
                <CardDescription>Demandes en attente</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucune réservation pour le moment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Default/Admin Dashboard
  return (
    <MainLayout>
      <Head title="Dashboard" />
      <div className="container px-4 md:px-6 py-8 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenue sur ARTDOM</p>
        </div>
      </div>
    </MainLayout>
  );
}
