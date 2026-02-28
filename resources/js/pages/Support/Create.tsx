import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Upload, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SupportCreate({ auth }: { auth: any }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        type: 'suggestion',
        subject: '',
        message: '',
        attachments: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/support');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('attachments', Array.from(e.target.files));
        }
    };

    return (
        <MainLayout>
            <Head title="Nouvelle Demande de Support" />
            <div className="container max-w-3xl mx-auto py-8 px-4 pb-24">
                <Link href="/support" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour au centre de support
                </Link>

                <h1 className="text-3xl font-bold font-heading mb-8">Nouvelle Demande</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Détails de votre demande</CardTitle>
                        <CardDescription>
                            Veuillez remplir le formulaire ci-dessous avec le plus de précisions possible pour nous aider à vous répondre rapidement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-2">
                                <Label htmlFor="type">Type de demande</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(value) => setData('type', value)}
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Sélectionnez un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="suggestion">Suggestion d'amélioration</SelectItem>
                                        <SelectItem value="bug">Rapport de problème technique</SelectItem>
                                        <SelectItem value="complaint">Réclamation sur une prestation</SelectItem>
                                        <SelectItem value="other">Autre demande</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <p className="text-sm text-destructive mt-1">{errors.type}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Sujet détaillé</Label>
                                <Input
                                    id="subject"
                                    type="text"
                                    placeholder="En quelques mots, quel est le sujet ?"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                />
                                {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Votre message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Décrivez votre problème, suggestion ou demande en détail..."
                                    className="min-h-[150px]"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                />
                                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="attachments">Pièces jointes (Optionnel)</Label>
                                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/10 hover:bg-muted/30 transition-colors relative">
                                    <Input
                                        id="attachments"
                                        type="file"
                                        multiple
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        accept="image/*,.pdf,.doc,.docx"
                                    />
                                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="text-sm font-medium">Cliquez ou glissez-déposez vos fichiers ici</p>
                                    <p className="text-xs text-muted-foreground mt-1">Images ou PDF (Max. 10MB chacun)</p>
                                </div>
                                {data.attachments.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {data.attachments.map((file, index) => (
                                            <Badge key={index} variant="secondary" className="px-3 py-1">
                                                {file.name}
                                                <button
                                                    type="button"
                                                    className="ml-2 text-muted-foreground hover:text-foreground"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const newAttachments = [...data.attachments];
                                                        newAttachments.splice(index, 1);
                                                        setData('attachments', newAttachments);
                                                    }}
                                                >
                                                    &times;
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                {errors['attachments.*'] && <p className="text-sm text-destructive mt-1">{errors['attachments.*']}</p>}
                                {errors['attachments'] && <p className="text-sm text-destructive mt-1">{errors['attachments']}</p>}
                            </div>

                            {progress && (
                                <progress value={progress.percentage} max="100" className="w-full h-2 rounded-full overflow-hidden">
                                    {progress.percentage}%
                                </progress>
                            )}

                            <Alert className="bg-primary/5 border-primary/20">
                                <AlertCircle className="h-4 w-4 text-primary" />
                                <AlertDescription className="text-xs">
                                    Notre équipe s'engage à vous répondre sous 48h ouvrées.
                                </AlertDescription>
                            </Alert>

                            <div className="flex justify-end gap-4 pt-4 border-t">
                                <Button variant="outline" asChild>
                                    <Link href="/support">Annuler</Link>
                                </Button>
                                <Button type="submit" disabled={processing} className="min-w-[150px]">
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        'Envoyer la demande'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
