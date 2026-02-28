import { Head, Link, router, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Star, MapPin, Calendar as CalendarIcon, Clock, Plus, Upload } from 'lucide-react';
import { fr } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';

interface ServiceOption {
    id: string;
    name: string;
    description: string;
    price: number;
}

interface Service {
    id: string;
    title: string;
    price: number;
    location_type: string;
    options?: ServiceOption[];
}

interface Artist {
    id: string;
    stage_name: string;
    profile_photo: string;
}

interface BookingDetails {
    date: string;
    time: string;
}

interface EmotionType {
    key: string;
    label: string;
}

interface CustomizeProps {
    service: Service;
    artist: Artist;
    bookingDetails: BookingDetails;
    emotionTypes: EmotionType[];
}

const locationTypes: Record<string, string> = {
    home: 'À domicile',
    online: 'En ligne',
    public: 'Lieu public',
    any: 'Flexible',
};

export default function BookingCustomize({ service, artist, bookingDetails, emotionTypes }: CustomizeProps) {
    const { data, setData, post, processing, errors } = useForm({
        service_id: service.id,
        date: bookingDetails.date,
        time: bookingDetails.time,
        emotion_type: '',
        recipient_name: '',
        relation_type: '',
        special_message: '',
        customer_location: service.location_type === 'any' ? '' : locationTypes[service.location_type],
        selected_options: [] as string[],
        file_url: null as File | null,
    });

    const [optionsTotal, setOptionsTotal] = useState(0);

    const handleOptionToggle = (option: ServiceOption) => {
        const isSelected = data.selected_options.includes(option.id);
        if (isSelected) {
            setData('selected_options', data.selected_options.filter(id => id !== option.id));
            setOptionsTotal(prev => prev - Number(option.price));
        } else {
            setData('selected_options', [...data.selected_options, option.id]);
            setOptionsTotal(prev => prev + Number(option.price));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/booking/checkout', {
            ...data,
            selected_options: data.selected_options.join(','),
        }, { forceFormData: true });
    };

    const formattedDate = format(parseISO(bookingDetails.date), 'EEEE d MMMM yyyy', { locale: fr });

    return (
        <MainLayout>
            <Head title="Personnalisez votre réservation" />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
                <Link
                    href={`/booking/calendar?service=${service.id}`}
                    className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour à la date
                </Link>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex items-center text-primary">
                            <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center font-semibold">
                                1
                            </div>
                            <span className="ml-2 font-medium">Date & Heure</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-primary" />
                        <div className="flex items-center text-primary">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                2
                            </div>
                            <span className="ml-2 font-medium">Personnalisation</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <div className="flex items-center text-muted-foreground">
                            <div className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center">
                                3
                            </div>
                            <span className="ml-2">Paiement</span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personnalisation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Emotion Type */}
                                <div className="space-y-3">
                                    <Label>Quelle est l'émotion de l'événement ?</Label>
                                    <RadioGroup
                                        value={data.emotion_type}
                                        onValueChange={(val) => setData('emotion_type', val)}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                    >
                                        {emotionTypes.map((emotion) => (
                                            <Label
                                                key={emotion.key}
                                                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${data.emotion_type === emotion.key
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-muted hover:border-primary/50'
                                                    }`}
                                            >
                                                <span>{emotion.label}</span>
                                                <RadioGroupItem value={emotion.key} className="sr-only" />
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                    {errors.emotion_type && (
                                        <p className="text-xs text-destructive mt-1">{errors.emotion_type}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Recipient Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="recipient_name">Nom du bénéficiaire (Optionnel)</Label>
                                        <Input
                                            id="recipient_name"
                                            placeholder="Pour qui est la prestation ?"
                                            value={data.recipient_name}
                                            onChange={(e) => setData('recipient_name', e.target.value)}
                                        />
                                    </div>

                                    {/* Relation Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="relation_type">Lien avec le bénéficiaire</Label>
                                        <Select
                                            value={data.relation_type}
                                            onValueChange={(val) => setData('relation_type', val)}
                                        >
                                            <SelectTrigger id="relation_type">
                                                <SelectValue placeholder="Choisir une relation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="self">Moi-même</SelectItem>
                                                <SelectItem value="family">Famille</SelectItem>
                                                <SelectItem value="friend">Ami(e)</SelectItem>
                                                <SelectItem value="colleague">Collègue</SelectItem>
                                                <SelectItem value="partner">Conjoint(e)</SelectItem>
                                                <SelectItem value="other">Autre</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Location if not online */}
                                {service.location_type !== 'online' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="customer_location">Adresse précise de la prestation</Label>
                                        <Input
                                            id="customer_location"
                                            placeholder="Ex: Riviera Palmeraie, Rue I12..."
                                            value={data.customer_location}
                                            onChange={(e) => setData('customer_location', e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                {/* Special Message */}
                                <div className="space-y-2">
                                    <Label htmlFor="special_message">Message spécial ou consignes</Label>
                                    <Textarea
                                        id="special_message"
                                        placeholder="Dites-en plus à l'artiste sur vos attentes..."
                                        rows={4}
                                        value={data.special_message}
                                        onChange={(e) => setData('special_message', e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Expliquez le contexte pour que l'artiste puisse se préparer au mieux.
                                    </p>
                                </div>

                                {/* File Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="file_url">Ajouter un fichier / Photo (Optionnel)</Label>
                                    <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/10 hover:bg-muted/30 transition-colors relative cursor-pointer">
                                        <Input
                                            id="file_url"
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setData('file_url', e.target.files[0]);
                                                }
                                            }}
                                            accept="image/*,.pdf"
                                        />
                                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                        <p className="text-sm font-medium">
                                            {data.file_url ? data.file_url.name : 'Cliquez ou glissez-déposez un fichier ici'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Images ou PDF (Max. 5MB)</p>
                                    </div>
                                </div>

                                {/* Additional Options */}
                                {service.options && service.options.length > 0 && (
                                    <div className="space-y-3 pt-6 border-t">
                                        <Label className="text-base font-semibold">Options supplémentaires</Label>
                                        <div className="space-y-3">
                                            {service.options.map((option) => (
                                                <div
                                                    key={option.id}
                                                    className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${data.selected_options.includes(option.id) ? 'border-primary bg-primary/5' : ''}`}
                                                >
                                                    <Checkbox
                                                        id={`option-${option.id}`}
                                                        checked={data.selected_options.includes(option.id)}
                                                        onCheckedChange={() => handleOptionToggle(option)}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <Label
                                                            htmlFor={`option-${option.id}`}
                                                            className="text-sm font-medium leading-none cursor-pointer"
                                                        >
                                                            {option.name}
                                                        </Label>
                                                        {option.description && (
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {option.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="font-semibold whitespace-nowrap">
                                                        + {Number(option.price).toLocaleString()} FCFA
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button type="submit" size="lg" className="min-w-[200px]" disabled={!data.emotion_type}>
                                Continuer vers le paiement
                            </Button>
                        </div>
                    </form>

                    {/* Summary Sidebar */}
                    <div className="md:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Récapitulatif</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Artist Info */}
                                <div className="flex items-center gap-3 pb-4 border-b">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={artist.profile_photo} alt={artist.stage_name} />
                                        <AvatarFallback>{artist.stage_name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm">{artist.stage_name}</h3>
                                        <div className="text-xs text-muted-foreground">{service.title}</div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <CalendarIcon className="w-4 h-4 text-primary" />
                                        <span>{formattedDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span>{bookingDetails.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{locationTypes[service.location_type]}</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm">Prix du service</span>
                                        <span className="font-semibold">{service.price.toLocaleString()} FCFA</span>
                                    </div>
                                    {optionsTotal > 0 && (
                                        <div className="flex justify-between items-center mt-2 text-sm">
                                            <span>Options ({data.selected_options.length})</span>
                                            <span className="font-semibold">+{optionsTotal.toLocaleString()} FCFA</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                                        <span>Frais plateforme (10%)</span>
                                        <span>{((service.price + optionsTotal) * 0.1).toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-primary">
                                            {((service.price + optionsTotal) * 1.1).toLocaleString()} FCFA
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
