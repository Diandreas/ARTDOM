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

            <div className="container mx-auto max-w-7xl px-4 pt-4 pb-24 md:px-6 md:pt-8 md:pb-12">
                {/* Mobile-first compact profile header */}
                <div className="mb-4 flex items-center gap-4 md:mb-8">
                    <div className="relative shrink-0">
                        <Avatar className="h-16 w-16 md:h-24 md:w-24">
                            <AvatarImage src={user.profile_photo || undefined} />
                            <AvatarFallback className="text-xl md:text-3xl">
                                {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute right-0 bottom-0 h-6 w-6 rounded-full md:h-8 md:w-8"
                        >
                            <Camera className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h1 className="font-heading truncate text-xl font-bold text-foreground md:text-3xl">
                                {user.name}
                            </h1>
                            <Badge variant="secondary" className="shrink-0 text-xs">
                                {t('Client')}
                            </Badge>
                        </div>
                        <p className="truncate text-xs text-muted-foreground md:text-sm">
                            {user.email}
                        </p>
                        {user.city && (
                            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{user.city}</span>
                            </div>
                        )}
                        <Link href="/settings/profile" className="mt-2 inline-block">
                            <Button size="sm" className="h-7 gap-1.5 px-3 text-xs">
                                <Edit2 className="h-3 w-3" />
                                {t('Edit my profile')}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats — horizontal scroll on mobile */}
                <div className="mb-4 grid grid-cols-3 gap-2 md:gap-4">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-3 text-center md:p-6">
                            <div className="text-2xl font-bold text-primary md:text-3xl">
                                {stats.total_reservations}
                            </div>
                            <p className="mt-0.5 text-[10px] text-muted-foreground md:text-sm">
                                {t('Total reservations')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-3 text-center md:p-6">
                            <div className="text-2xl font-bold text-primary md:text-3xl">
                                {stats.upcoming_reservations}
                            </div>
                            <p className="mt-0.5 text-[10px] text-muted-foreground md:text-sm">
                                {t('Upcoming')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-3 text-center md:p-6">
                            <div className="text-2xl font-bold text-primary md:text-3xl">
                                {stats.favorite_artists}
                            </div>
                            <p className="mt-0.5 text-[10px] text-muted-foreground md:text-sm">
                                {t('Favorite artists')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
                    {/* Empty placeholder to keep grid alignment on desktop */}
                    <div className="hidden lg:col-span-1 lg:block" />

                    {/* Info & Actions */}
                    <div className="space-y-4 md:space-y-6 lg:col-span-2">

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
