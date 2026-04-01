import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit2,
    Camera,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';

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
    const { t, dateLocale } = useAppLocale();

    return (
        <MainLayout>
            <Head title={t('My profile')} />

            <div className="container mx-auto max-w-7xl px-4 py-8 pb-24 md:px-6 md:pb-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-heading mb-2 text-3xl font-bold text-foreground">
                        {t('My profile')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('Manage your personal information')}
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-4">
                                        <Avatar className="h-32 w-32">
                                            <AvatarImage
                                                src={
                                                    user.profile_photo ||
                                                    undefined
                                                }
                                            />
                                            <AvatarFallback className="text-3xl">
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="absolute right-0 bottom-0 rounded-full"
                                        >
                                            <Camera className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <h2 className="mb-1 text-2xl font-bold">
                                        {user.name}
                                    </h2>
                                    <Badge variant="secondary" className="mb-4">
                                        {t('Client')}
                                    </Badge>

                                    <div className="mt-6 w-full space-y-3 text-left">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="break-all text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </div>

                                        {user.phone && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    {user.phone}
                                                </span>
                                            </div>
                                        )}

                                        {user.city && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    {user.city}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                {t('Member since')}{' '}
                                                {format(
                                                    new Date(user.created_at),
                                                    'MMMM yyyy',
                                                    { locale: dateLocale },
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href="/settings/profile"
                                        className="mt-6 w-full"
                                    >
                                        <Button className="w-full gap-2">
                                            <Edit2 className="h-4 w-4" />
                                            {t('Edit my profile')}
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats & Info */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Stats Cards */}
                        <div className="grid gap-4 sm:grid-cols-3">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {t('Total reservations')}
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
                                        {t('Upcoming')}
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
                                        {t('Favorite artists')}
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
                                <CardTitle>
                                    {t('Account information')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-muted-foreground">
                                        {t('Full name')}
                                    </Label>
                                    <div className="mt-1 font-medium">
                                        {user.name}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-muted-foreground">
                                        {t('Email')}
                                    </Label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="font-medium">
                                            {user.email}
                                        </span>
                                        {user.email_verified_at ? (
                                            <Badge
                                                variant="default"
                                                className="text-xs"
                                            >
                                                {t('Verified')}
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="destructive"
                                                className="text-xs"
                                            >
                                                {t('Not verified')}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {user.phone && (
                                    <div>
                                        <Label className="text-muted-foreground">
                                            {t('Phone')}
                                        </Label>
                                        <div className="mt-1 font-medium">
                                            {user.phone}
                                        </div>
                                    </div>
                                )}

                                {user.city && (
                                    <div>
                                        <Label className="text-muted-foreground">
                                            {t('City')}
                                        </Label>
                                        <div className="mt-1 font-medium">
                                            {user.city}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('Quick links')}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 sm:grid-cols-2">
                                <Link href="/client/reservations">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        {t('My reservations')}
                                    </Button>
                                </Link>
                                <Link href="/client/cart">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        {t('My cart')}
                                    </Button>
                                </Link>
                                <Link href="/favorites">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        {t('My favorites')}
                                    </Button>
                                </Link>
                                <Link href="/settings">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        {t('Settings')}
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
