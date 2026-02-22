import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import UserForm from './UserForm';

type CategoryOption = {
    value: string;
    label: string;
};

type UserPayload = {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    phone: string;
    city?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    profile_photo?: string | null;
    role: 'client' | 'artist' | 'admin';
    status: 'active' | 'pending' | 'suspended' | 'banned';
    stage_name?: string | null;
    category?: string | null;
    bio?: string | null;
    base_rate?: string | number | null;
    portfolio_urls?: string[];
    email_verified?: boolean;
};

type Props = {
    categories: CategoryOption[];
    user: UserPayload;
};

export default function Edit({ categories, user }: Props) {
    return (
        <AdminLayout title="Edition utilisateur" subtitle="Mettre a jour les informations du compte.">
            <Head title="Admin - Edition utilisateur" />
            <UserForm mode="edit" endpoint={`/admin/users/${user.id}`} categories={categories} user={user} />
        </AdminLayout>
    );
}
