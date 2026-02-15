import { Head, router, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Upload,
  Music,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface Album {
  id: string;
  title: string;
  year: number;
  genre: string;
  cover_url: string;
  price: number;
  is_streamable: boolean;
  is_purchasable: boolean;
  total_plays: number;
  tracks_count: number;
  published_at: string | null;
  created_at: string;
}

interface Props {
  albums: Album[];
}

export default function UploadAlbums({ albums }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    year: new Date().getFullYear(),
    genre: '',
    cover: null as File | null,
    price: 0,
    is_free: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('artist.albums.store'), {
      onSuccess: () => {
        reset();
        setCoverPreview(null);
        setShowForm(false);
      },
    });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('cover', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteAlbum = (albumId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
      router.delete(route('artist.albums.destroy', albumId));
    }
  };

  const togglePublication = (albumId: string) => {
    router.patch(route('artist.albums.toggle', albumId));
  };

  return (
    <MainLayout>
      <Head title="Gérer mes albums" />

      <div className="container px-4 md:px-6 py-8 pb-24">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Mes Albums</h1>
            <p className="text-muted-foreground">Gérez vos albums et pistes musicales</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? <EyeOff className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {showForm ? 'Annuler' : 'Nouvel Album'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Créer un nouvel album</CardTitle>
              <CardDescription>
                Ajoutez les informations de base de votre album
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Cover Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="cover">Pochette de l'album *</Label>
                    <div className="flex items-center gap-4">
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-muted rounded-md flex items-center justify-center">
                          <Music className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          id="cover"
                          type="file"
                          accept="image/*"
                          onChange={handleCoverChange}
                          className="cursor-pointer"
                        />
                        {errors.cover && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.cover}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre de l'album *</Label>
                      <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Mon premier album"
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Année *</Label>
                        <Input
                          id="year"
                          type="number"
                          value={data.year}
                          onChange={(e) => setData('year', parseInt(e.target.value))}
                          min="1900"
                          max={new Date().getFullYear() + 1}
                        />
                        {errors.year && (
                          <p className="text-sm text-destructive">{errors.year}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="genre">Genre *</Label>
                        <select
                          id="genre"
                          value={data.genre}
                          onChange={(e) => setData('genre', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Sélectionner...</option>
                          <option value="afrobeat">Afrobeat</option>
                          <option value="highlife">Highlife</option>
                          <option value="coupé-décalé">Coupé-Décalé</option>
                          <option value="zouglou">Zouglou</option>
                          <option value="gospel">Gospel</option>
                          <option value="makossa">Makossa</option>
                          <option value="rumba">Rumba</option>
                          <option value="hip-hop">Hip-Hop</option>
                          <option value="r&b">R&B</option>
                        </select>
                        {errors.genre && (
                          <p className="text-sm text-destructive">{errors.genre}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="is_free"
                      checked={data.is_free}
                      onChange={(e) => setData('is_free', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is_free" className="cursor-pointer">
                      Album gratuit (streaming uniquement)
                    </Label>
                  </div>

                  {!data.is_free && (
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix (FCFA)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={data.price}
                        onChange={(e) => setData('price', parseFloat(e.target.value))}
                        min="0"
                        step="100"
                        placeholder="5000"
                      />
                      {errors.price && (
                        <p className="text-sm text-destructive">{errors.price}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={processing}>
                    <Upload className="mr-2 h-4 w-4" />
                    {processing ? 'Création...' : 'Créer l\'album'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      reset();
                      setCoverPreview(null);
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Albums List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Vous n'avez pas encore créé d'album
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer mon premier album
                </Button>
              </CardContent>
            </Card>
          ) : (
            albums.map((album) => (
              <Card key={album.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={album.cover_url}
                    alt={album.title}
                    className="w-full h-48 object-cover"
                  />
                  {album.published_at ? (
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      Publié
                    </Badge>
                  ) : (
                    <Badge className="absolute top-2 right-2 bg-amber-500">
                      Brouillon
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{album.title}</CardTitle>
                  <CardDescription>
                    {album.year} • {album.genre}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>🎵 {album.tracks_count} piste{album.tracks_count > 1 ? 's' : ''}</p>
                    <p>👁️ {album.total_plays.toLocaleString()} écoutes</p>
                    <p>💰 {album.price > 0 ? `${album.price} FCFA` : 'Gratuit'}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublication(album.id)}
                      className="flex-1"
                    >
                      {album.published_at ? <EyeOff className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
                      {album.published_at ? 'Dépublier' : 'Publier'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteAlbum(album.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
