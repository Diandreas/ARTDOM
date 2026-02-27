import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ResourceRow = {
    resource: string;
    model: string;
    count: number;
};

type Props = {
    resources: ResourceRow[];
};

export default function Index({ resources }: Props) {
    return (
        <AdminLayout title="Super Admin CRUD" subtitle="Gestion globale des entites de l'application.">
            <Head title="Super Admin CRUD" />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {resources.map((item) => (
                    <Card key={item.resource}>
                        <CardHeader>
                            <CardTitle>{item.model}</CardTitle>
                            <CardDescription>{item.resource}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">Enregistrements: {item.count}</p>
                            <Button asChild>
                                <Link href={`/admin/super-crud/${item.resource}`}>Ouvrir CRUD</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AdminLayout>
    );
}
