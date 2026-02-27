import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useMemo } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type RecordRow = {
    id: string;
    attributes: Record<string, unknown>;
};

type Pagination<T> = {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type Props = {
    resource: string;
    records: Pagination<RecordRow>;
    fillable: string[];
    search: string;
};

export default function Resource({ resource, records, fillable, search }: Props) {
    const createForm = useForm({
        payloadText: '{\n\n}',
    });

    const searchForm = useForm({ search });

    const defaultUpdateTemplate = useMemo(() => {
        return JSON.stringify({
            // keep only fillable fields when possible
        }, null, 2);
    }, []);

    const submitCreate = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let parsed: Record<string, unknown>;
        try {
            parsed = JSON.parse(createForm.data.payloadText);
        } catch {
            createForm.setError('payloadText', 'JSON invalide.');
            return;
        }

        createForm.clearErrors();
        router.post(`/admin/super-crud/${resource}`, { payload: parsed });
    };

    const submitUpdate = (id: string, payloadText: string) => {
        let parsed: Record<string, unknown>;

        try {
            parsed = JSON.parse(payloadText);
        } catch {
            return;
        }

        router.put(`/admin/super-crud/${resource}/${id}`, { payload: parsed });
    };

    return (
        <AdminLayout title={`Super CRUD - ${resource}`} subtitle="Creation, modification, suppression generiques.">
            <Head title={`Super CRUD ${resource}`} />

            <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/super-crud">Retour ressources</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recherche</CardTitle>
                        <CardDescription>Recherche par ID exact.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="flex flex-wrap items-end gap-2"
                            onSubmit={(event) => {
                                event.preventDefault();
                                router.get(`/admin/super-crud/${resource}`, { search: searchForm.data.search });
                            }}
                        >
                            <div className="space-y-1">
                                <Label htmlFor="search">ID</Label>
                                <Input id="search" value={searchForm.data.search} onChange={(event) => searchForm.setData('search', event.target.value)} />
                            </div>
                            <Button type="submit">Filtrer</Button>
                            <Button type="button" variant="outline" onClick={() => router.get(`/admin/super-crud/${resource}`)}>Reset</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Creer un enregistrement</CardTitle>
                        <CardDescription>Champs fillable: {fillable.join(', ') || 'Aucun'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitCreate} className="space-y-2">
                            <Textarea
                                rows={8}
                                value={createForm.data.payloadText}
                                onChange={(event) => createForm.setData('payloadText', event.target.value)}
                            />
                            {createForm.errors.payloadText ? <p className="text-xs text-destructive">{createForm.errors.payloadText}</p> : null}
                            <Button type="submit">Creer</Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-3">
                    {records.data.map((record) => {
                        const initialJson = Object.keys(record.attributes).length > 0
                            ? JSON.stringify(record.attributes, null, 2)
                            : defaultUpdateTemplate;

                        return (
                            <Card key={record.id}>
                                <CardHeader>
                                    <CardTitle className="text-base">ID: {record.id}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Textarea
                                        rows={10}
                                        defaultValue={initialJson}
                                        onBlur={(event) => submitUpdate(record.id, event.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <Button variant="destructive" onClick={() => router.delete(`/admin/super-crud/${resource}/${record.id}`)}>Supprimer</Button>
                                        <p className="text-xs text-muted-foreground">Mise a jour automatique au blur si JSON valide.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="flex flex-wrap gap-2">
                    {records.links.map((link, index) => (
                        <Button
                            key={index}
                            size="sm"
                            variant={link.active ? 'default' : 'outline'}
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
