import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, GripVertical, Ban } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { store, update, destroy, toggle, reorder } from '@/actions/App/Http/Controllers/Artist/ServiceController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';

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

interface FormFieldsProps {
    data: ServiceFormData;
    setData: <K extends keyof ServiceFormData>(key: K, value: ServiceFormData[K]) => void;
    addOptionRow: () => void;
    updateOption: (index: number, key: keyof ServiceOption, value: string | number | boolean) => void;
    removeOption: (index: number) => void;
    t: (key: string) => string;
}

interface ServiceFormData {
    title: string;
    description: string;
    category: string;
    price: string;
    price_type: 'fixed' | 'from' | 'hourly';
    duration_minutes: string;
    notice_period_hours: string;
    location_type: 'home' | 'online' | 'public' | 'any';
    options: ServiceOption[];
}

function FormFields({ data, setData, addOptionRow, updateOption, removeOption, t }: FormFieldsProps) {
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="title">{t('Service title')}</Label>
                <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} required placeholder={t('Example: Charcoal portrait')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">{t('Description (details, what is included)')}</Label>
                <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} required rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{t('Category')}</Label>
                    <Select value={data.category} onValueChange={v => setData('category', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('Select...')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="peinture">{t('Painting')}</SelectItem>
                            <SelectItem value="photographie">{t('Photography')}</SelectItem>
                            <SelectItem value="musique">{t('Music performance')}</SelectItem>
                            <SelectItem value="sculpture">{t('Sculpture')}</SelectItem>
                            <SelectItem value="autre">{t('Other')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>{t('Service location')}</Label>
                    <Select value={data.location_type} onValueChange={v => setData('location_type', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('Select...')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="home">{t('At the client location')}</SelectItem>
                            <SelectItem value="public">{t('Public venue / Event')}</SelectItem>
                            <SelectItem value="online">{t('Online (Zoom, etc.)')}</SelectItem>
                            <SelectItem value="any">{t('Flexible')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{t('Rate (FCFA)')}</Label>
                    <Input type="number" value={data.price} onChange={e => setData('price', e.target.value)} required min="0" />
                </div>
                <div className="space-y-2">
                    <Label>{t('Pricing type')}</Label>
                    <Select value={data.price_type} onValueChange={v => setData('price_type', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('Select...')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fixed">{t('Fixed price')}</SelectItem>
                            <SelectItem value="from">{t('Starting from')}</SelectItem>
                            <SelectItem value="hourly">{t('Hourly rate')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{t('Estimated duration (minutes)')}</Label>
                    <Input type="number" value={data.duration_minutes} onChange={e => setData('duration_minutes', e.target.value)} required min="15" step="15" />
                </div>
                <div className="space-y-2">
                    <Label>{t('Notice period (hours)')}</Label>
                    <Input type="number" value={data.notice_period_hours} onChange={e => setData('notice_period_hours', e.target.value)} required min="0" />
                    <p className="text-xs text-muted-foreground border-l-2 pl-2">{t('Minimum time required before the appointment')}</p>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">{t('Additional options')}</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addOptionRow} className="gap-2">
                        <Plus className="w-3 h-3" />
                        {t('Add option')}
                    </Button>
                </div>
                {data.options && data.options.length > 0 ? (
                    <div className="space-y-3">
                        {data.options.map((opt: ServiceOption, idx: number) => (
                            <div key={idx} className="p-3 bg-muted/30 rounded-lg border space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 space-y-1">
                                        <Input placeholder={t('Option name (example: A3 format)')} value={opt.name} onChange={e => updateOption(idx, 'name', e.target.value)} required />
                                    </div>
                                    <div className="w-32 space-y-1">
                                        <Input type="number" placeholder={t('Rate')} value={opt.price} onChange={e => updateOption(idx, 'price', parseFloat(e.target.value))} required min="0" />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(idx)} className="text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Input placeholder={t('Short description...')} value={opt.description} onChange={e => updateOption(idx, 'description', e.target.value)} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">{t('No option configured for this service.')}</p>
                )}
            </div>
        </>
    );
}

export default function ArtistServices({ services: initialServices }: ServicesProps) {
    const { t } = useAppLocale();
    const [services, setServices] = useState<Service[]>(initialServices);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const { data: formData, setData: setFormData, post, put, reset, processing } = useForm<ServiceFormData>({
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

    const updateOption = (index: number, key: keyof ServiceOption, value: string | number | boolean) => {
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
        post(store().url, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t('Service created successfully'));
                setIsAddOpen(false);
                reset();
                router.reload({ only: ['services'] });
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;
        put(update(editingService.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t('Service updated successfully'));
                setIsEditOpen(false);
                setEditingService(null);
                reset();
                router.reload({ only: ['services'] });
            },
        });
    };

    const handleDelete = (id: string) => {
        if (confirm(t('Are you sure you want to delete this service? This action cannot be undone.'))) {
            router.delete(destroy(id).url, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(t('Service deleted successfully'));
                    router.reload({ only: ['services'] });
                },
                onError: (errors) => {
                    if (errors.message) toast.error(errors.message);
                }
            });
        }
    };

    const handleToggle = (id: string, currentStatus: boolean) => {
        router.patch(toggle(id).url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(currentStatus ? t('Service disabled') : t('Service enabled'));
                router.reload({ only: ['services'] });
            }
        });
    };

    // Drag and Drop Logic
    const [draggedItem, setDraggedItem] = useState<number | null>(null);

    const onDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
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
        const updatedIds = services.map(s => s.id);
        router.post(reorder().url, { services: updatedIds }, {
            preserveScroll: true,
            onSuccess: () => toast.success(t('Order updated'))
        });
    };

    const formatPriceType = (type: string) => {
        switch (type) {
            case 'fixed': return t('Fixed price');
            case 'from': return t('Starting from');
            case 'hourly': return t('Per hour');
            default: return type;
        }
    };

    return (
        <MainLayout>
            <Head title={t('My Services - Artist Space')} />

            <div className="container max-w-5xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-heading mb-2 text-foreground">{t('My Services')}</h1>
                        <p className="text-muted-foreground">{t('Manage your service catalog and available options')}</p>
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openAdd} className="gap-2">
                                <Plus className="w-4 h-4" />
                                {t('New Service')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{t('Create a new service')}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAdd} className="space-y-4 pt-4">
                                <FormFields
                                    data={formData}
                                    setData={setFormData}
                                    addOptionRow={addOptionRow}
                                    updateOption={updateOption}
                                    removeOption={removeOption}
                                    t={t}
                                />
                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>{t('Cancel')}</Button>
                                    <Button type="submit" disabled={processing}>{t('Create service')}</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-4">
                    {services.length === 0 ? (
                        <Card>
                            <CardContent className="pt-12 pb-12 text-center text-muted-foreground">
                                <p>{t('You have not created any services yet.')}</p>
                                <Button variant="link" onClick={openAdd} className="mt-2 text-primary">{t('Create your first service')}</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground mb-4">
                                {t('You can drag and drop services to change their display order on your public profile.')}
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
                                                        <Ban className="w-3 h-3" /> {t('Hidden')}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-4">
                                                <span>{formatPriceType(service.price_type)} : <strong>{service.price} FCFA</strong></span>
                                                <span>{t('Duration')}: {service.duration_minutes} min</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 mr-4 border-r pr-4">
                                                <Switch
                                                    checked={service.is_active}
                                                    onCheckedChange={() => handleToggle(service.id, service.is_active)}
                                                />
                                                <Label className="text-xs cursor-pointer" onClick={() => handleToggle(service.id, service.is_active)}>
                                                    {service.is_active ? t('Active') : t('Inactive')}
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
                            <DialogTitle>{t('Edit service')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4 pt-4">
                            <FormFields
                                data={formData}
                                setData={setFormData}
                                addOptionRow={addOptionRow}
                                updateOption={updateOption}
                                removeOption={removeOption}
                                t={t}
                            />
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>{t('Cancel')}</Button>
                                <Button type="submit" disabled={processing}>{t('Update')}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
