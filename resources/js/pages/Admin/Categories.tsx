import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppLocale } from '@/hooks/use-app-locale';
import AdminLayout from '@/layouts/admin-layout';

interface Category {
    id: number;
    slug: string;
    label_fr: string;
    label_en: string;
    icon: string | null;
    is_active: boolean;
    order: number;
}

interface Props {
    categories: Category[];
}

export default function Categories({ categories: initialCategories }: Props) {
    const { t } = useAppLocale();
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [draggedItem, setDraggedItem] = useState<number | null>(null);

    const addForm = useForm({ slug: '', label_fr: '', label_en: '', icon: '' });
    const editForm = useForm({ slug: '', label_fr: '', label_en: '', icon: '', is_active: true });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/admin/categories', {
            onSuccess: () => {
                toast.success(t('Category created'));
                setIsAddOpen(false);
                addForm.reset();
            },
        });
    };

    const openEdit = (cat: Category) => {
        setEditingCategory(cat);
        editForm.setData({ slug: cat.slug, label_fr: cat.label_fr, label_en: cat.label_en, icon: cat.icon ?? '', is_active: cat.is_active });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        editForm.put(`/admin/categories/${editingCategory.id}`, {
            onSuccess: () => {
                toast.success(t('Category updated'));
                setEditingCategory(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm(t('Delete this category?'))) {
            router.delete(`/admin/categories/${id}`, {
                onSuccess: () => toast.success(t('Category deleted')),
            });
        }
    };

    const onDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => { (e.target as HTMLElement).style.opacity = '0.5'; }, 0);
    };

    const onDragEnd = (e: React.DragEvent) => {
        setDraggedItem(null);
        (e.target as HTMLElement).style.opacity = '1';
    };

    const onDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedItem === null || draggedItem === index) return;
        const newCats = [...categories];
        const dragged = newCats[draggedItem];
        newCats.splice(draggedItem, 1);
        newCats.splice(index, 0, dragged);
        setDraggedItem(index);
        setCategories(newCats);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        router.post('/admin/categories/reorder', { categories: categories.map((c) => c.id) }, {
            preserveScroll: true,
            onSuccess: () => toast.success(t('Order updated')),
        });
    };

    return (
        <AdminLayout title={t('Categories')} subtitle={t('Manage service categories')}>
            <Head title={t('Categories')} />

            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{t('Drag to reorder. Categories appear in service creation forms.')}</p>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('New category')}
                </Button>
            </div>

            <div className="space-y-2">
                {categories.map((cat, index) => (
                    <Card
                        key={cat.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, index)}
                        onDragEnd={onDragEnd}
                        onDragOver={(e) => onDragOver(e, index)}
                        onDrop={onDrop}
                        className={`transition-all ${draggedItem === index ? 'shadow-lg border-primary scale-[1.01]' : ''} ${!cat.is_active ? 'opacity-60' : ''}`}
                    >
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="cursor-grab p-1 text-muted-foreground">
                                <GripVertical className="h-5 w-5" />
                            </div>
                            <span className="text-xl">{cat.icon}</span>
                            <div className="flex-1">
                                <p className="font-semibold">{cat.label_fr}</p>
                                <p className="text-xs text-muted-foreground">{cat.label_en} · <code className="rounded bg-muted px-1">{cat.slug}</code></p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-medium ${cat.is_active ? 'text-green-600' : 'text-muted-foreground'}`}>
                                    {cat.is_active ? t('Active') : t('Inactive')}
                                </span>
                                <Button variant="outline" size="icon" onClick={() => openEdit(cat)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDelete(cat.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{t('New category')}</DialogTitle></DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('Slug')}</Label>
                                <Input value={addForm.data.slug} onChange={(e) => addForm.setData('slug', e.target.value)} placeholder="ma-categorie" required />
                                {addForm.errors.slug && <p className="text-xs text-destructive">{addForm.errors.slug}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Icon (emoji)')}</Label>
                                <Input value={addForm.data.icon} onChange={(e) => addForm.setData('icon', e.target.value)} placeholder="🎨" maxLength={4} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('Label (French)')}</Label>
                            <Input value={addForm.data.label_fr} onChange={(e) => addForm.setData('label_fr', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('Label (English)')}</Label>
                            <Input value={addForm.data.label_en} onChange={(e) => addForm.setData('label_en', e.target.value)} required />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>{t('Cancel')}</Button>
                            <Button type="submit" disabled={addForm.processing}>{t('Create')}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingCategory} onOpenChange={(open) => { if (!open) setEditingCategory(null); }}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{t('Edit category')}</DialogTitle></DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('Slug')}</Label>
                                <Input value={editForm.data.slug} onChange={(e) => editForm.setData('slug', e.target.value)} required />
                                {editForm.errors.slug && <p className="text-xs text-destructive">{editForm.errors.slug}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Icon (emoji)')}</Label>
                                <Input value={editForm.data.icon} onChange={(e) => editForm.setData('icon', e.target.value)} maxLength={4} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('Label (French)')}</Label>
                            <Input value={editForm.data.label_fr} onChange={(e) => editForm.setData('label_fr', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('Label (English)')}</Label>
                            <Input value={editForm.data.label_en} onChange={(e) => editForm.setData('label_en', e.target.value)} required />
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch checked={editForm.data.is_active} onCheckedChange={(v) => editForm.setData('is_active', v)} />
                            <Label>{t('Active')}</Label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>{t('Cancel')}</Button>
                            <Button type="submit" disabled={editForm.processing}>{t('Update')}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
