# ARTDOM - PLAN D'IMPLÉMENTATION
**Date de création**: 2026-02-15
**Objectif**: Implémenter les bases de chaque module avec données réalistes

---

## PHILOSOPHIE D'IMPLÉMENTATION

### Approche Progressive
1. **Phase 1** (ACTUELLE) : Bases de chaque module - MVP fonctionnel
2. **Phase 2** : Enrichissement des fonctionnalités
3. **Phase 3** : Optimisations et fonctionnalités avancées

### Priorités
- ✅ **Base fonctionnelle** pour chaque module principal
- ✅ **Données réalistes** avec vraies images
- ✅ **Navigation fluide** entre les modules
- ⏳ **Fonctionnalités avancées** (chat temps réel, paiements, etc.)

---

## STATUT ACTUEL

### ✅ Déjà Implémenté

#### Infrastructure
- [x] Base Laravel 12 avec Inertia v2
- [x] Authentification avec Fortify (login, register, 2FA)
- [x] Base de données (migrations complètes)
- [x] Models Eloquent avec relations
- [x] Wayfinder pour routes TypeScript
- [x] Contexte Audio (AudioContext) pour le player
- [x] Composants UI de base (shadcn)

#### Authentification
- [x] Pages: Login, Register (Client), Forgot Password
- [x] Routes: auth/login, auth/register, auth/forgot-password
- [x] Nouveaux: register-selection, register-artist (créés aujourd'hui)

#### Base de Données
- [x] Tables: users, client_profiles, artist_profiles, services, albums, tracks, playlists, videos, reviews, reservations, carts, payments, conversations, messages, etc.
- [x] Migrations avec UUID pour les IDs
- [x] Relations Eloquent configurées

#### Frontend
- [x] Components: Button, Input, Label, Select, Textarea, Spinner, Slider, Tabs, Carousel
- [x] Layouts: AuthLayout, MainLayout (créé)
- [x] Player: MiniPlayer component (basique)
- [x] Contexte: AudioContext pour gestion audio globale

---

## PHASE 1 : BASES DES MODULES (EN COURS)

### Module 1: Thème Afro-centré
**Objectif**: Appliquer la palette et le style visuel unique

#### Tâches
- [ ] Configurer Tailwind avec palette afro-centrée
  - Couleurs: #1A0F0A (fond), #FDB913 (or), #E63946 (rouge), #06A77D (vert)
  - Extensions: patterns, animations africaines
- [ ] Créer composants stylisés:
  - Card avec patterns Kente subtils
  - Buttons avec dégradés africains
  - Headers avec motifs Adinkra
- [ ] Implémenter les icônes inspirées symboles africains
- [ ] Créer des animations fluides (mouvement danse)

**Fichiers concernés**:
- `tailwind.config.js`
- `resources/css/app.css`
- `resources/js/components/ui/*`

---

### Module 2: Seeders avec Images Réelles
**Objectif**: Base de données remplie avec données réalistes

#### Tâches
- [ ] UserSeeder: 20 artistes + 10 clients avec photos de profil
- [ ] ArtistProfileSeeder: Profils complets (bio, catégories, tarifs)
- [ ] ServiceSeeder: Services variés par artiste (5-10 par artiste)
- [ ] AlbumSeeder: 30+ albums avec covers réelles
- [ ] TrackSeeder: 200+ tracks avec métadonnées
- [ ] VideoSeeder: 50+ vidéos/tutos avec thumbnails
- [ ] ReviewSeeder: Avis réalistes pour artistes et services
- [ ] StorySeeder: Stories temporaires (24h)

#### Sources d'Images
- **Artistes**: Unsplash (musiciens africains, performers)
- **Covers**: Placeholder.com ou Picsum avec filtres
- **Vidéos thumbnails**: YouTube thumbnails API ou placeholders

**Fichiers concernés**:
- `database/seeders/DatabaseSeeder.php`
- `database/seeders/*Seeder.php`
- `database/factories/*Factory.php`

---

### Module 3: Découverte Client (Home)
**Objectif**: Page d'accueil complète avec toutes les sections

#### Tâches
- [ ] Controller: `HomeController@index`
- [ ] Page: `resources/js/pages/home.tsx`
- [ ] Sections:
  - [ ] Header (logo, notifs, recherche)
  - [ ] Stories artistes (carrousel 24h)
  - [ ] Bannière promotionnelle
  - [ ] Grille catégories (Chant, Danse, Peinture, etc.)
  - [ ] Carrousel artistes tendances
  - [ ] Carrousel nouveautés musique
  - [ ] Carrousel tutos populaires
- [ ] Bottom Navigation: Home, Recherche, ArtStream, Messages, Profil
- [ ] Pull-to-refresh

**Routes**:
- `GET /` → HomeController@index

**Données requises**:
- Stories récentes (< 24h)
- Top 10 artistes (par note/réservations)
- Nouveaux albums (2 dernières semaines)
- Vidéos populaires (par vues)

---

### Module 4: Recherche Artistes
**Objectif**: Recherche et filtrage des artistes

#### Tâches
- [ ] Controller: `ArtistController@search`
- [ ] Page: `resources/js/pages/artists/search.tsx`
- [ ] Composants:
  - [ ] SearchBar avec auto-complétion
  - [ ] Filtres (Ville, Catégorie, Budget, Note, Date)
  - [ ] Toggle Vue Liste/Carte
  - [ ] Tri (Pertinence, Note, Prix, Proximité)
- [ ] Vue Liste: Cards artistes
- [ ] Vue Carte: Map avec pins (Google Maps/Mapbox)
- [ ] Pagination

**Routes**:
- `GET /artists/search` → ArtistController@search

**Filtres implémentés**:
- Localisation (ville)
- Catégorie artistique (multi-select)
- Budget (min-max)
- Note minimale (1-5★)
- Disponibilité (date)

---

### Module 5: Profil Public Artiste
**Objectif**: Page profil complète de l'artiste

#### Tâches
- [ ] Controller: `ArtistController@show`
- [ ] Page: `resources/js/pages/Artist/profile.tsx`
- [ ] Sections:
  - [ ] Header (cover, photo, nom, badge vérifié)
  - [ ] Infos (catégorie, ville, note, prix)
  - [ ] Boutons (Réserver, Suivre, Partager)
  - [ ] Bio
  - [ ] Galerie photos/vidéos
  - [ ] Albums disponibles
  - [ ] Services proposés
  - [ ] Avis clients
  - [ ] Artistes similaires
- [ ] Bouton chat flottant

**Routes**:
- `GET /artist/{id}` → ArtistController@show

---

### Module 6: ArtStream (Hub Musique)
**Objectif**: Page principale du streaming audio

#### Tâches
- [ ] Controller: `ArtStreamController@index`
- [ ] Page: `resources/js/pages/ArtStream/music-hub.tsx`
- [ ] Sections:
  - [ ] Header (logo, recherche, bibliothèque)
  - [ ] Nouveautés (carrousel albums)
  - [ ] Top Artistes (classement)
  - [ ] Genres (grille)
  - [ ] Playlists ARTDOM
  - [ ] Recommandations personnalisées
- [ ] Mini Player (persistant)

**Routes**:
- `GET /artstream` → ArtStreamController@index (✅ déjà créée)

**Données requises**:
- Nouveaux albums
- Top artistes (par écoutes)
- Playlists éditoriales
- Historique utilisateur pour recommandations

---

### Module 7: Lecteur Audio
**Objectif**: Lecteur full-screen et mini persistant

#### Tâches
- [ ] Page: `resources/js/pages/ArtStream/full-player.tsx`
- [ ] Composant: `resources/js/components/Player/FullPlayer.tsx`
- [ ] Améliorer: `resources/js/components/Player/MiniPlayer.tsx`
- [ ] Fonctionnalités:
  - [ ] Cover animé (rotation)
  - [ ] Contrôles (play, pause, prev, next)
  - [ ] Barre progression (draggable)
  - [ ] Actions (like, add to playlist, share)
  - [ ] Paroles (toggle)
  - [ ] File d'attente
  - [ ] Volume
- [ ] Intégration AudioContext existant

**Routes**:
- `GET /artstream/player` → Inertia::render (✅ déjà créée)

---

### Module 8: Dashboard Artiste
**Objectif**: Tableau de bord pour les artistes

#### Tâches
- [ ] Controller: `Artist\DashboardController@index`
- [ ] Page: `resources/js/pages/Artist/dashboard.tsx`
- [ ] Sections:
  - [ ] Header (photo, nom, badge statut)
  - [ ] Revenus du mois (graphique)
  - [ ] Prochaine prestation
  - [ ] Notifications importantes
  - [ ] Nouvelles réservations (badge)
  - [ ] Stats (abonnés, écoutes, vues)
  - [ ] Raccourcis (agenda, upload, stats)
  - [ ] Checklist "À faire"

**Routes**:
- `GET /artist/dashboard` → Artist\DashboardController@index

**Données requises**:
- Revenus (mois en cours vs précédent)
- Prochaine prestation (date, client, lieu)
- Compteurs (réservations, abonnés, écoutes, vues)

---

### Module 9: Réservations (Base)
**Objectif**: Système de réservation simplifié

#### Tâches
- [ ] Controller: `ReservationController`
- [ ] Pages:
  - [ ] `resources/js/pages/Reservation/calendar.tsx`
  - [ ] `resources/js/pages/Reservation/customize.tsx`
  - [ ] `resources/js/pages/Reservation/confirmation.tsx`
- [ ] Flux:
  1. Sélection service
  2. Choix date/heure (calendrier)
  3. Personnalisation (message, type émotion)
  4. Récapitulatif
  5. Paiement (simulé pour l'instant)
  6. Confirmation

**Routes**:
- `GET /reservation/create/{service}` → ReservationController@create
- `POST /reservation/store` → ReservationController@store

---

### Module 10: Messagerie (Base)
**Objectif**: Chat 1-to-1 basique

#### Tâches
- [ ] Controller: `MessageController`
- [ ] Pages:
  - [ ] `resources/js/pages/Messages/index.tsx` (liste)
  - [ ] `resources/js/pages/Messages/chat.tsx` (room)
- [ ] Fonctionnalités:
  - [ ] Liste conversations
  - [ ] Chat room avec bulles
  - [ ] Envoi messages texte
  - [ ] Timestamps
  - [ ] Badge non lu
- [ ] ⏳ Temps réel (Pusher/Laravel Echo) - Phase 2

**Routes**:
- `GET /messages` → MessageController@index
- `GET /messages/{conversation}` → MessageController@show
- `POST /messages/{conversation}` → MessageController@store

---

## PHASE 2 : ENRICHISSEMENT (À VENIR)

### Fonctionnalités Avancées
- [ ] Paiements réels (Mobile Money, Stripe)
- [ ] Upload fichiers (images, audio, vidéo)
- [ ] Streaming audio (stockage + CDN)
- [ ] Chat temps réel (Laravel Echo + Pusher)
- [ ] Notifications push (FCM)
- [ ] Géolocalisation (Google Maps API)
- [ ] Stories avec expiration 24h
- [ ] Système de reviews/notes
- [ ] Wallet & retraits artistes
- [ ] Classroom (cours vidéo)
- [ ] Playlists utilisateur
- [ ] Téléchargements offline (PWA)

### Optimisations
- [ ] Lazy loading images
- [ ] Cache (Redis)
- [ ] CDN pour médias
- [ ] Compression assets
- [ ] SEO (meta tags dynamiques)
- [ ] Analytics (Google Analytics)

---

## PHASE 3 : PERFECTIONNEMENT (FUTUR)

### Expérience Utilisateur
- [ ] Onboarding slides (carrousel 3 pages)
- [ ] Splash screen animé
- [ ] Animations micro-interactions
- [ ] Mode hors-ligne (PWA)
- [ ] Dark mode raffiné

### Administration
- [ ] Panel admin
- [ ] Modération contenus
- [ ] Validation artistes
- [ ] Analytics avancés
- [ ] Gestion coupons/promos

### Social
- [ ] Partage sur réseaux sociaux
- [ ] Abonnements artistes
- [ ] Feed activités
- [ ] Recommandations IA

---

## CONVENTIONS DE DÉVELOPPEMENT

### Structure des fichiers
```
Controllers: app/Http/Controllers/{Module}Controller.php
Pages: resources/js/pages/{Module}/{page}.tsx
Components: resources/js/components/{Category}/{Component}.tsx
Routes: routes/{module}.php
```

### Nomenclature
- **Controllers**: PascalCase (HomeController, ArtistController)
- **Pages**: kebab-case (music-hub.tsx, full-player.tsx)
- **Components**: PascalCase (MiniPlayer.tsx, ArtistCard.tsx)
- **Routes**: kebab-case (/art-stream, /artist/dashboard)

### Best Practices
1. **Controllers**: Logique métier minimale, déléguée aux Services
2. **Pages**: Components fonctionnels, props typées
3. **Composants**: Réutilisables, documentés
4. **Routes**: RESTful, groupées par module
5. **Tests**: Feature tests pour chaque flux utilisateur

---

## COMMANDES UTILES

### Seeders
```bash
# Tout réinitialiser + seed
php artisan migrate:fresh --seed

# Seed uniquement
php artisan db:seed

# Seed spécifique
php artisan db:seed --class=UserSeeder
```

### Wayfinder (régénérer routes TypeScript)
```bash
php artisan wayfinder:generate
```

### Tests
```bash
php artisan test --compact
php artisan test --filter=ArtistProfileTest
```

### Dev
```bash
# Frontend
npm run dev

# Backend + Frontend
composer run dev
```

---

## PROCHAINES ÉTAPES (SESSION ACTUELLE)

1. ✅ Plan d'implémentation (ce fichier)
2. ⏳ Factories avec données réalistes
3. ⏳ Seeders avec vraies images
4. ⏳ Thème afro-centré (Tailwind config + composants)
5. ⏳ Page Home (découverte client)
6. ⏳ ArtStream Hub + Player
7. ⏳ Dashboard Artiste
8. ⏳ Documentation progression (PROGRESS.md)

---

**Dernière mise à jour**: 2026-02-15
