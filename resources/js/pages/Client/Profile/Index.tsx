import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
    profile_photo: string | null;
    role: string;
    created_at: string;
    email_verified_at: string | null;
}

interface ProfileStats {
    total_reservations: number;
    upcoming_reservations: number;
    favorite_artists: number;
}

interface ClientProfileProps {
    user: User;
    stats: ProfileStats;
}

export default function ClientProfile({ user, stats }: ClientProfileProps) {
    return (
        <MainLayout>
            <Head title="Mon Profil" />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading mb-2 text-foreground">Mon Profil</h1>
                    <p className="text-muted-foreground">Gérez vos informations personnelles</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-4">
                                        <Avatar className="w-32 h-32">
                                            <AvatarImage src={user.profile_photo || undefined} />
                                            <AvatarFallback className="text-3xl">
                                                {user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="absolute bottom-0 right-0 rounded-full"
                                        >
                                            <Camera className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                                    <Badge variant="secondary" className="mb-4">
                                        Client
                                    </Badge>

                                    <div className="w-full space-y-3 text-left mt-6">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground break-all">{user.email}</span>
                                        </div>

                                        {user.phone && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">{user.phone}</span>
                                            </div>
                                        )}

                                        {user.city && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">{user.city}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Membre depuis {format(new Date(user.created_at), 'MMMM yyyy', { locale: fr })}
                                            </span>
                                        </div>
                                    </div>

                                    <Link href="/settings/profile" className="w-full mt-6">
                                        <Button className="w-full gap-2">
                                            <Edit2 className="w-4 h-4" />
                                            Modifier mon profil
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats & Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Réservations totales
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-primary">
                                        {stats.total_reservations}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        À venir
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-primary">
                                        {stats.upcoming_reservations}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Artistes favoris
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-primary">
                                        {stats.favorite_artists}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Account Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations du compte</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-muted-foreground">Nom complet</Label>
                                    <div className="font-medium mt-1">{user.name}</div>
                                </div>

                                <div>
                                    <Label className="text-muted-foreground">Email</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-medium">{user.email}</span>
                                        {user.email_verified_at ? (
                                            <Badge variant="default" className="text-xs">
                                                Vérifié
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive" className="text-xs">
                                                Non vérifié
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {user.phone && (
                                    <div>
                                        <Label className="text-muted-foreground">Téléphone</Label>
                                        <div className="font-medium mt-1">{user.phone}</div>
                                    </div>
                                )}

                                {user.city && (
                                    <div>
                                        <Label className="text-muted-foreground">Ville</Label>
                                        <div className="font-medium mt-1">{user.city}</div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Liens rapides</CardTitle>
                            </CardHeader>
                            <CardContent className="grid sm:grid-cols-2 gap-3">
                                <Link href="/client/reservations">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Mes réservations
                                    </Button>
                                </Link>
                                <Link href="/client/cart">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <User className="w-4 h-4" />
                                        Mon panier
                                    </Button>
                                </Link>
                                <Link href="/favorites">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <User className="w-4 h-4" />
                                        Mes favoris
                                    </Button>
                                </Link>
                                <Link href="/settings">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <User className="w-4 h-4" />
                                        Paramètres
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
