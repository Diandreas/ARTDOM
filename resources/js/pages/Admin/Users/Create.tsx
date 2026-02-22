import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import UserForm from './UserForm';

type CategoryOption = {
    value: string;
    label: string;
};

type Props = {
    categories: CategoryOption[];
};

export default function Create({ categories }: Props) {
    return (
        <AdminLayout title="Creation utilisateur" subtitle="Creer un client, artiste ou admin.">
            <Head title="Admin - Creation utilisateur" />
            <UserForm mode="create" endpoint="/admin/users" categories={categories} />
        </AdminLayout>
    );
}
