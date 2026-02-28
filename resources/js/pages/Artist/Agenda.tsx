import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Plus, Trash2, CalendarCheck, Ban, CalendarDays } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Availability {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    is_booked: boolean;
    is_blocked: boolean;
    repeat_rule: string | null;
}

interface AgendaProps {
    availabilities: Availability[];
    currentMonth: number;
    currentYear: number;
}

export default function ArtistAgenda({ availabilities, currentMonth, currentYear }: AgendaProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isBlockOpen, setIsBlockOpen] = useState(false);

    const { data: addData, setData: setAddData, post: postAdd, reset: resetAdd, processing: adding } = useForm({
        date: date ? format(date, 'yyyy-MM-dd') : '',
        start_time: '09:00',
        end_time: '18:00',
        repeat_rule: '',
        repeat_until: '',
    });

    const { data: blockData, setData: setBlockData, post: postBlock, reset: resetBlock, processing: blocking } = useForm({
        date: date ? format(date, 'yyyy-MM-dd') : '',
        start_time: '00:00',
        end_time: '23:59',
        block_reason: '',
    });

    // Mettre à jour les dates des formulaires quand on clique sur le calendrier
    const handleSelectDate = (newDate: Date | undefined) => {
        setDate(newDate);
        if (newDate) {
            const dateStr = format(newDate, 'yyyy-MM-dd');
            setAddData('date', dateStr);
            setBlockData('date', dateStr);
        }
    };

    const handleAddAvailability = (e: React.FormEvent) => {
        e.preventDefault();
        postAdd(route('artist.availability.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Disponibilité ajoutée avec succès');
                setIsAddOpen(false);
                resetAdd();
            },
        });
    };

    const handleBlockAvailability = (e: React.FormEvent) => {
        e.preventDefault();
        postBlock(route('artist.availability.block'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Créneau bloqué avec succès');
                setIsBlockOpen(false);
                resetBlock();
            },
        });
    };

    const handleDelete = (id: string, isBooked: boolean) => {
        if (isBooked) {
            toast.error('Impossible de supprimer un créneau déjà réservé.');
            return;
        }

        if (confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
            router.delete(route('artist.availability.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Créneau supprimé'),
            });
        }
    };

    // Obtenir les créneaux pour la date sélectionnée
    const selectedDateAvailabilities = date
        ? availabilities.filter(a => isSameDay(parseISO(a.date), date))
        : [];

    return (
        <MainLayout>
            <Head title="Agenda & Disponibilités" />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-heading mb-2 text-foreground">Agenda</h1>
                        <p className="text-muted-foreground">Gérez vos disponibilités et vos créneaux bloqués</p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex-1 md:flex-none gap-2">
                                    <Plus className="w-4 h-4" />
                                    Ajouter
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Ajouter des disponibilités</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddAvailability} className="space-y-4 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Date</Label>
                                            <Input
                                                type="date"
                                                value={addData.date}
                                                onChange={e => setAddData('date', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Heure de début</Label>
                                            <Input
                                                type="time"
                                                value={addData.start_time}
                                                onChange={e => setAddData('start_time', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Heure de fin</Label>
                                            <Input
                                                type="time"
                                                value={addData.end_time}
                                                onChange={e => setAddData('end_time', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 border-t pt-4 mt-2">
                                        <Label>Répétition (Optionnel)</Label>
                                        <Select value={addData.repeat_rule} onValueChange={(v) => setAddData('repeat_rule', v === 'none' ? '' : v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pas de répétition" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Pas de répétition</SelectItem>
                                                <SelectItem value="daily">Tous les jours</SelectItem>
                                                <SelectItem value="weekly">Toutes les semaines</SelectItem>
                                                <SelectItem value="monthly">Tous les mois</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {addData.repeat_rule && (
                                        <div className="space-y-2">
                                            <Label>Répéter jusqu'au</Label>
                                            <Input
                                                type="date"
                                                value={addData.repeat_until}
                                                onChange={e => setAddData('repeat_until', e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Annuler</Button>
                                        <Button type="submit" disabled={adding}>Enregistrer</Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isBlockOpen} onOpenChange={setIsBlockOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex-1 md:flex-none gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
                                    <Ban className="w-4 h-4" />
                                    Bloquer
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Bloquer une période</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleBlockAvailability} className="space-y-4 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Date</Label>
                                            <Input
                                                type="date"
                                                value={blockData.date}
                                                onChange={e => setBlockData('date', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Heure de début</Label>
                                            <Input
                                                type="time"
                                                value={blockData.start_time}
                                                onChange={e => setBlockData('start_time', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Heure de fin</Label>
                                            <Input
                                                type="time"
                                                value={blockData.end_time}
                                                onChange={e => setBlockData('end_time', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Motif (Optionnel)</Label>
                                        <Input
                                            type="text"
                                            value={blockData.block_reason}
                                            onChange={e => setBlockData('block_reason', e.target.value)}
                                            placeholder="Ex: Vacances, Maladie..."
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button type="button" variant="outline" onClick={() => setIsBlockOpen(false)}>Annuler</Button>
                                        <Button type="submit" variant="destructive" disabled={blocking}>Bloquer le créneau</Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                    <Card className="md:col-span-3 h-fit border-none shadow-md overflow-hidden bg-card/50">
                        <CardContent className="p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleSelectDate}
                                locale={fr}
                                className="p-4 w-full flex justify-center bg-card"
                                modifiers={{
                                    hasSlot: (d: Date) => availabilities.some(a => isSameDay(parseISO(a.date), d)),
                                    booked: (d: Date) => availabilities.some(a => isSameDay(parseISO(a.date), d) && a.is_booked),
                                    blocked: (d: Date) => availabilities.some(a => isSameDay(parseISO(a.date), d) && a.is_blocked),
                                }}
                                modifiersStyles={{
                                    hasSlot: { fontWeight: 'bold' },
                                    booked: { color: 'var(--primary)', fontWeight: 'bold' },
                                    blocked: { color: 'var(--destructive)', fontWeight: 'bold' }
                                }}
                            />
                            <div className="bg-muted/50 p-4 border-t flex flex-wrap gap-4 text-xs">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary/20"></div> Libre</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div> Réservé</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-destructive"></div> Bloqué</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-4 h-fit min-h-[500px]">
                        <CardHeader className="border-b bg-card rounded-t-xl px-6 py-5">
                            <div className="flex items-center gap-3">
                                <CalendarDays className="w-5 h-5 text-primary" />
                                <CardTitle className="text-xl">
                                    {date ? format(date, 'EEEE d MMMM yyyy', { locale: fr }) : 'Sélectionnez une date'}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {selectedDateAvailabilities.length === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center text-muted-foreground text-center">
                                    <Clock className="w-12 h-12 mb-3 text-muted-foreground/30" />
                                    <p>Aucun créneau programmé à cette date.</p>
                                    <Button variant="link" onClick={() => setIsAddOpen(true)} className="mt-2 text-primary">
                                        Ajouter une disponibilité
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedDateAvailabilities.sort((a, b) => a.start_time.localeCompare(b.start_time)).map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${slot.is_blocked
                                                    ? 'bg-destructive/5 border-destructive/20 text-destructive'
                                                    : slot.is_booked
                                                        ? 'bg-primary/5 border-primary/20 text-primary-foreground'
                                                        : 'hover:border-primary/40 bg-card hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex flex-col items-center justify-center p-3 rounded-lg ${slot.is_blocked
                                                        ? 'bg-destructive/10'
                                                        : slot.is_booked
                                                            ? 'bg-primary/20'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}>
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className={`text-lg font-bold font-mono tracking-tight ${!slot.is_blocked && !slot.is_booked ? 'text-foreground' : ''
                                                        }`}>
                                                        {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                                    </div>
                                                    <div className="text-sm opacity-80 mt-1 font-medium">
                                                        {slot.is_blocked ? (
                                                            <div className="flex items-center gap-1.5"><Ban className="w-3.5 h-3.5" /> Indisponible</div>
                                                        ) : slot.is_booked ? (
                                                            <div className="flex items-center gap-1.5"><CalendarCheck className="w-3.5 h-3.5 text-primary" /> Réservé</div>
                                                        ) : (
                                                            <span className="text-muted-foreground">Libre</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(slot.id, slot.is_booked)}
                                                disabled={slot.is_booked}
                                                className={`rounded-full h-10 w-10 ${!slot.is_booked && 'hover:bg-destructive/10 hover:text-destructive'}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
