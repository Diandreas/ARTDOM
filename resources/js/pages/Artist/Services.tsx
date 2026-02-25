import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, GripVertical, Check, Ban, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ServiceOption {
    id?: string;
    name: string;
    description: string;
    price: number;
    is_active: boolean;
}

interface Service {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    price_type: 'fixed' | 'from' | 'hourly';
    duration_minutes: number;
    notice_period_hours: number;
    location_type: 'home' | 'online' | 'public' | 'any';
    is_active: boolean;
    order: number;
    options?: ServiceOption[];
}

interface ServicesProps {
    services: Service[];
}

export default function ArtistServices({ services: initialServices }: ServicesProps) {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const { data: formData, setData: setFormData, post, put, reset, processing } = useForm({
        title: '',
        description: '',
        category: '',
        price: '',
        price_type: 'fixed',
        duration_minutes: '60',
        notice_period_hours: '24',
        location_type: 'home',
        options: [] as ServiceOption[],
    });

    const addOptionRow = () => {
        setFormData('options', [...formData.options, { name: '', description: '', price: 0, is_active: true }]);
    };

    const updateOption = (index: number, key: string, value: any) => {
        const newOptions = [...formData.options];
        newOptions[index] = { ...newOptions[index], [key]: value };
        setFormData('options', newOptions);
    };

    const removeOption = (index: number) => {
        const newOptions = [...formData.options];
        newOptions.splice(index, 1);
        setFormData('options', newOptions);
    };

    const openAdd = () => {
        reset();
        setIsAddOpen(true);
    };

    const openEdit = (service: Service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            description: service.description,
            category: service.category,
            price: service.price.toString(),
            price_type: service.price_type,
            duration_minutes: service.duration_minutes.toString(),
            notice_period_hours: service.notice_period_hours.toString(),
            location_type: service.location_type,
            options: service.options || [],
        });
        setIsEditOpen(true);
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('artist.services.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Service créé avec succès');
                setIsAddOpen(false);
                reset();
                router.reload({ only: ['services'] });
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;
        put(route('artist.services.update', editingService.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Service mis à jour avec succès');
                setIsEditOpen(false);
                setEditingService(null);
                reset();
                router.reload({ only: ['services'] });
            },
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.')) {
            router.delete(route('artist.services.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Service supprimé avec succès');
                    router.reload({ only: ['services'] });
                },
                onError: (errors) => {
                    if (errors.message) toast.error(errors.message);
                }
            });
        }
    };

    const handleToggle = (id: string, currentStatus: boolean) => {
        router.patch(route('artist.services.toggle', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(currentStatus ? 'Service désactivé' : 'Service activé');
                router.reload({ only: ['services'] });
            }
        });
    };

    // Drag and Drop Logic
    const [draggedItem, setDraggedItem] = useState<number | null>(null);

    const onDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
        // Petit effet de transparence
        setTimeout(() => {
            (e.target as HTMLElement).style.opacity = '0.5';
        }, 0);
    };

    const onDragEnd = (e: React.DragEvent) => {
        setDraggedItem(null);
        (e.target as HTMLElement).style.opacity = '1';
    };

    const onDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (draggedItem === null || draggedItem === index) return;

        const newServices = [...services];
        const dragged = newServices[draggedItem];
        newServices.splice(draggedItem, 1);
        newServices.splice(index, 0, dragged);

        setDraggedItem(index);
        setServices(newServices);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        // Sauvegarder le nouvel ordre
        const updatedIds = services.map(s => s.id);
        router.post(route('artist.services.reorder'), { services: updatedIds }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Ordre mis à jour')
        });
    };

    const formatPriceType = (type: string) => {
        switch (type) {
            case 'fixed': return 'Prix fixe';
            case 'from': return 'À partir de';
            case 'hourly': return 'Par heure';
            default: return type;
        }
    };

    return (
        <MainLayout>
            <Head title="Mes Services - Espace Artiste" />

            <div className="container max-w-5xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-heading mb-2 text-foreground">Mes Services</h1>
                        <p className="text-muted-foreground">Gérez votre catalogue de prestations et les options proposées</p>
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openAdd} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nouveau Service
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Créer un nouveau service</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAdd} className="space-y-4 pt-4">
                                <FormFields data={formData} setData={setFormData} />
                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Annuler</Button>
                                    <Button type="submit" disabled={processing}>Créer le service</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-4">
                    {services.length === 0 ? (
                        <Card>
                            <CardContent className="pt-12 pb-12 text-center text-muted-foreground">
                                <p>Vous n'avez pas encore créé de services.</p>
                                <Button variant="link" onClick={openAdd} className="mt-2 text-primary">Créer votre premier service</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground mb-4">
                                Vous pouvez glisser-déposer (drag & drop) les services pour modifier l'ordre d'affichage sur votre profil public.
                            </p>
                            {services.map((service, index) => (
                                <Card
                                    key={service.id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, index)}
                                    onDragEnd={onDragEnd}
                                    onDragOver={(e) => onDragOver(e, index)}
                                    onDrop={onDrop}
                                    className={`transition-all ${!service.is_active ? 'opacity-60 bg-muted/50' : 'bg-card'} ${draggedItem === index ? 'shadow-lg border-primary border-2 scale-[1.02] z-10' : ''}`}
                                >
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="cursor-grab hover:bg-muted p-2 rounded text-muted-foreground">
                                            <GripVertical className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg truncate">{service.title}</h3>
                                                <Badge variant="outline">{service.category}</Badge>
                                                {!service.is_active && (
                                                    <Badge variant="secondary" className="flex items-center gap-1">
                                                        <Ban className="w-3 h-3" /> Masqué
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-4">
                                                <span>{formatPriceType(service.price_type)} : <strong>{service.price} FCFA</strong></span>
                                                <span>Durée : {service.duration_minutes} min</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 mr-4 border-r pr-4">
                                                <Switch
                                                    checked={service.is_active}
                                                    onCheckedChange={() => handleToggle(service.id, service.is_active)}
                                                />
                                                <Label className="text-xs cursor-pointer" onClick={() => handleToggle(service.id, service.is_active)}>
                                                    {service.is_active ? 'Actif' : 'Inactif'}
                                                </Label>
                                            </div>
                                            <Button variant="outline" size="icon" onClick={() => openEdit(service)}>
                                                <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)} className="hover:bg-destructive/10 hover:text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Edit Form Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Modifier le service</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4 pt-4">
                            <FormFields data={formData} setData={setFormData} />
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
                                <Button type="submit" disabled={processing}>Mettre à jour</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );

    function FormFields({ data, setData }: { data: any, setData: any }) {
        return (
            <>
                <div className="space-y-2">
                    <Label htmlFor="title">Titre de la prestation</Label>
                    <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} required placeholder="Ex: Portrait au fusain" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description (détails, ce qui est inclus)</Label>
                    <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} required rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Catégorie</Label>
                        <Select value={data.category} onValueChange={v => setData('category', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="peinture">Peinture</SelectItem>
                                <SelectItem value="photographie">Photographie</SelectItem>
                                <SelectItem value="musique">Prestation musicale</SelectItem>
                                <SelectItem value="sculpture">Sculpture</SelectItem>
                                <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Lieu de la prestation</Label>
                        <Select value={data.location_type} onValueChange={v => setData('location_type', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="home">Chez le client</SelectItem>
                                <SelectItem value="public">Lieu public / Événement</SelectItem>
                                <SelectItem value="online">En ligne (Zoom, etc.)</SelectItem>
                                <SelectItem value="any">Flexible</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Tarif (FCFA)</Label>
                        <Input type="number" value={data.price} onChange={e => setData('price', e.target.value)} required min="0" />
                    </div>
                    <div className="space-y-2">
                        <Label>Type de facturation</Label>
                        <Select value={data.price_type} onValueChange={v => setData('price_type', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fixed">Prix fixe</SelectItem>
                                <SelectItem value="from">À partir de</SelectItem>
                                <SelectItem value="hourly">Taux horaire</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Durée estimée (minutes)</Label>
                        <Input type="number" value={data.duration_minutes} onChange={e => setData('duration_minutes', e.target.value)} required min="15" step="15" />
                    </div>
                    <div className="space-y-2">
                        <Label>Délai de prévenance (heures)</Label>
                        <Input type="number" value={data.notice_period_hours} onChange={e => setData('notice_period_hours', e.target.value)} required min="0" />
                        <p className="text-xs text-muted-foreground border-l-2 pl-2">Temps minimum requis avant le rdv</p>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Options Supplémentaires</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addOptionRow} className="gap-2">
                            <Plus className="w-3 h-3" />
                            Ajouter option
                        </Button>
                    </div>
                    {data.options && data.options.length > 0 ? (
                        <div className="space-y-3">
                            {data.options.map((opt: ServiceOption, idx: number) => (
                                <div key={idx} className="p-3 bg-muted/30 rounded-lg border space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 space-y-1">
                                            <Input placeholder="Nom de l'option (ex: Format A3)" value={opt.name} onChange={e => updateOption(idx, 'name', e.target.value)} required />
                                        </div>
                                        <div className="w-32 space-y-1">
                                            <Input type="number" placeholder="Tarif" value={opt.price} onChange={e => updateOption(idx, 'price', parseFloat(e.target.value))} required min="0" />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(idx)} className="text-destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <Input placeholder="Brève description..." value={opt.description} onChange={e => updateOption(idx, 'description', e.target.value)} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Aucune option configurée pour ce service.</p>
                    )}
                </div>
            </>
        );
    }
}
