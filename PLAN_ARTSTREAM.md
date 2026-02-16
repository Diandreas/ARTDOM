# PLAN D'IMPLÉMENTATION ARTSTREAM
**Date**: 15 février 2026
**Version**: 1.0

---

## ✅ COMPLÉTÉ (Session actuelle)

### 1. Backend Audio Streaming
- [x] AudioContext avec gestion de queue
- [x] Modes shuffle, repeat (off/one/all)
- [x] Volume et mute
- [x] Auto-play next track
- [x] Streaming progressif (preload='metadata')
- [x] Protection contre rechargement intempestif

### 2. Système de Favoris
- [x] Migration `favorites` table
- [x] FavoriteController (toggle, index)
- [x] Relation User->favorites
- [x] Routes favorites
- [x] Toast notifications (Sonner)
- [x] Bouton cœur fonctionnel dans full-player

### 3. Système de Playlists (Backend)
- [x] Tables `playlists` et `playlist_track`
- [x] Model Playlist avec relations
- [x] PlaylistController complet (CRUD + add/remove tracks)
- [x] PlaylistPolicy pour autorisation
- [x] Relation User->playlists
- [x] Routes playlists
- [x] Wayfinder routes générées

### 4. Lecteurs Audio
- [x] Full-player avec tous les contrôles
- [x] Mini-player persistant en bas
- [x] Bouton expand fonctionnel
- [x] Chargement depuis URL parameters
- [x] Gestion de l'état local vs audio progress

### 5. Infrastructure
- [x] 575 tracks seedés avec URLs audio valides (Archive.org/Pixabay)
- [x] UpdateTrackUrlsSeeder pour URLs CORS-enabled
- [x] ArtStreamController avec méthodes player, album, index

---

## 🔧 EN COURS / À REVOIR

### Problème de Seek
- ⚠️ Le seek redémarre parfois au lieu de continuer
- Note: Marqué pour investigation ultérieure
- Protections ajoutées mais pas complètement résolu

---

## 📋 À IMPLÉMENTER (Par priorité)

### PHASE 1: Interface Playlists (2-3 jours)

#### 1.1 Page "Mes Playlists" (`/playlists`)
**Fichier**: `resources/js/pages/ArtStream/playlists.tsx`

**Fonctionnalités**:
- [ ] Grille de playlists de l'utilisateur
- [ ] Carte playlist: cover, titre, nombre de tracks
- [ ] Bouton "Créer une playlist" (modal)
- [ ] Modal création: nom + visibilité (public/privé)
- [ ] Bouton éditer (renommer, changer visibilité)
- [ ] Bouton supprimer avec confirmation
- [ ] État vide: "Créez votre première playlist"

**API utilisées**:
- `GET /playlists` - Liste
- `POST /playlists` - Créer
- `DELETE /playlists/{id}` - Supprimer

---

#### 1.2 Page "Détail Playlist" (`/playlists/{id}`)
**Fichier**: `resources/js/pages/ArtStream/playlist-view.tsx`

**Fonctionnalités**:
- [ ] Header: cover (auto-générée ou upload), titre, nb tracks, durée totale
- [ ] Bouton "Lire" (toute la playlist)
- [ ] Liste des tracks avec:
  - [ ] Numéro, cover, titre, artiste, durée
  - [ ] Bouton play par track
  - [ ] Bouton "..." (menu: retirer de la playlist)
  - [ ] Drag & drop pour réorganiser
- [ ] Bouton "Partager"
- [ ] Bouton "Modifier" (titre, cover)

**API utilisées**:
- `GET /playlists/{id}` - Détails
- `DELETE /playlists/{id}/tracks/{trackId}` - Retirer track

---

#### 1.3 Bouton "Ajouter à Playlist"
**Fichiers à modifier**:
- `resources/js/pages/ArtStream/full-player.tsx`
- `resources/js/pages/ArtStream/music-hub.tsx`
- `resources/js/pages/ArtStream/album-view.tsx`

**Fonctionnalités**:
- [ ] Bouton "Ajouter à playlist" (icône ListMusic)
- [ ] Modal/Dropdown liste des playlists
- [ ] Checkbox par playlist
- [ ] "Créer nouvelle playlist" dans le modal
- [ ] Toast confirmation "Ajouté à [Nom Playlist]"

**API utilisées**:
- `GET /playlists` - Liste des playlists user
- `POST /playlists/{id}/tracks/{trackId}` - Ajouter track

---

### PHASE 2: Page Favoris (1 jour)

#### 2.1 Page "Mes Favoris" (`/favorites`)
**Fichier**: `resources/js/pages/ArtStream/favorites.tsx`

**Fonctionnalités**:
- [ ] Liste des tracks favoris
- [ ] Tri: récent, artiste, album
- [ ] Bouton "Tout lire"
- [ ] Carte track: cover, titre, artiste, album
- [ ] Bouton play
- [ ] Bouton unfavorite
- [ ] État vide: "Aucun favori"

**API utilisée**:
- `GET /favorites` - Liste (déjà implémentée)

---

### PHASE 3: File d'Attente UI (1 jour)

#### 3.1 Composant Queue Sidebar
**Fichier**: `resources/js/components/Player/QueueSidebar.tsx`

**Fonctionnalités**:
- [ ] Panel latéral droit (slide-in)
- [ ] Header: "File d'attente (X tracks)"
- [ ] Track actuelle (highlight)
- [ ] Prochaines tracks
- [ ] Drag & drop pour réorganiser
- [ ] Bouton "Effacer la queue"
- [ ] Bouton "Sauvegarder comme playlist"

**Intégration**:
- [ ] Bouton dans full-player (icône ListMusic)
- [ ] Utilise AudioContext.queue

---

### PHASE 4: Fonctionnalités Sociales (2 jours)

#### 4.1 Partage de Musique
**Fichiers à modifier**: Tous les players/vues

**Fonctionnalités**:
- [ ] Bouton "Partager" (track, album, playlist)
- [ ] Modal partage:
  - [ ] Lien copié (clipboard API)
  - [ ] Boutons réseaux sociaux (WhatsApp, Facebook, Twitter)
  - [ ] QR Code
- [ ] Toast "Lien copié"

**Backend requis**:
- [ ] Routes publiques pour partage (accessible sans auth)
- [ ] `GET /share/track/{id}`
- [ ] `GET /share/album/{id}`
- [ ] `GET /share/playlist/{id}`
- [ ] Meta tags OG pour preview social

---

#### 4.2 Suivi d'Artistes
**Fichiers**: Artist profile, ArtStream hub

**Fonctionnalités**:
- [ ] Bouton "Suivre" sur profil artiste
- [ ] Section "Artistes suivis" dans bibliothèque
- [ ] Feed "Nouveautés artistes suivis" sur hub

**Backend requis**:
- [ ] Table `artist_followers`
- [ ] Routes follow/unfollow

---

### PHASE 5: Recherche Musicale (2 jours)

#### 5.1 Barre de Recherche ArtStream
**Fichier**: `resources/js/pages/ArtStream/search.tsx`

**Fonctionnalités**:
- [ ] Input recherche avec auto-complétion
- [ ] Onglets résultats: Tracks, Albums, Artistes, Playlists
- [ ] Filtres: Genre, Année, Popularité
- [ ] Recherche récente (localStorage)
- [ ] Suggestions populaires

**Backend requis**:
- [ ] `GET /artstream/search?q={query}&type={tracks|albums|artists}`
- [ ] Index Meilisearch ou Algolia (optionnel)

---

### PHASE 6: Paroles (Lyrics) (1 jour)

#### 6.1 Affichage des Paroles
**Fichier à modifier**: `full-player.tsx`

**Fonctionnalités**:
- [ ] Bouton toggle "Paroles"
- [ ] Vue paroles remplace l'artwork
- [ ] Scroll auto-synchronisé avec musique
- [ ] Highlight ligne actuelle
- [ ] Support LRC (format lyrics synchronisées)

**Backend requis**:
- [ ] Colonne `lyrics` dans `tracks` (déjà existe)
- [ ] Support format LRC ou texte simple

---

### PHASE 7: Amélioration du Hub (1 jour)

#### 7.1 Sections Manquantes
**Fichier**: `music-hub.tsx`

**Fonctionnalités**:
- [ ] Section "Récemment écoutés"
- [ ] Section "Pour vous" (recommandations)
- [ ] Section "Tendances cette semaine"
- [ ] Playlists éditoriales ARTDOM
- [ ] Filtres par genre (rapide)

**Backend requis**:
- [ ] Table `play_history` pour tracking
- [ ] Algorithme recommandations basique
- [ ] Playlists système (non-user)

---

### PHASE 8: Offline & Performance (2 jours)

#### 8.1 Mode Hors-ligne (Premium)
**Fonctionnalités**:
- [ ] Bouton "Télécharger" sur albums/playlists
- [ ] IndexedDB pour stockage local
- [ ] Service Worker pour cache
- [ ] Indicateur "Disponible hors-ligne"
- [ ] Gestion de l'espace (quota API)

**Notes**: Réservé aux utilisateurs Premium

---

#### 8.2 Optimisations
**Tâches**:
- [ ] Lazy loading des images (react-lazy-load-image)
- [ ] Virtual scrolling pour longues listes
- [ ] Compression images (WebP)
- [ ] Cache des requêtes API (React Query)
- [ ] Preload tracks suivants (anticipation)

---

### PHASE 9: Analytics & Insights (1 jour)

#### 9.1 Tracking Écoutes
**Backend**:
- [ ] Endpoint `POST /tracks/{id}/play` (increment plays)
- [ ] Table `play_history` (user, track, timestamp)
- [ ] Trigger sur pause >30s = écoute comptée

**Artiste Dashboard**:
- [ ] Graphique écoutes par jour
- [ ] Top 5 tracks
- [ ] Démographie (villes, âges)

---

## 🎯 ESTIMATION GLOBALE

| Phase | Tâches | Temps Estimé | Priorité |
|-------|--------|--------------|----------|
| Phase 1 | Interface Playlists | 2-3 jours | 🔥 Haute |
| Phase 2 | Page Favoris | 1 jour | 🔥 Haute |
| Phase 3 | Queue UI | 1 jour | 🟡 Moyenne |
| Phase 4 | Partage & Social | 2 jours | 🟡 Moyenne |
| Phase 5 | Recherche | 2 jours | 🔥 Haute |
| Phase 6 | Paroles | 1 jour | 🟢 Basse |
| Phase 7 | Hub amélioré | 1 jour | 🟡 Moyenne |
| Phase 8 | Offline | 2 jours | 🟢 Basse |
| Phase 9 | Analytics | 1 jour | 🟢 Basse |

**TOTAL**: 13-14 jours de développement

---

## 🚀 ORDRE D'IMPLÉMENTATION RECOMMANDÉ

1. **Semaine 1**: Playlists + Favoris + Queue (UX core)
2. **Semaine 2**: Recherche + Partage + Hub amélioré
3. **Semaine 3**: Paroles + Analytics + Optimisations
4. **(Optionnel)**: Mode offline (feature premium)

---

## 📦 DÉPENDANCES TECHNIQUES

### NPM Packages à installer:
```json
{
  "react-beautiful-dnd": "^13.1.1",  // Drag & drop playlists
  "react-query": "^3.39.3",           // Cache API
  "react-lazy-load-image-component": "^1.6.0",  // Lazy images
  "qrcode.react": "^3.1.0",           // QR codes partage
  "react-h5-audio-player": "^3.9.0"   // Alternative player
}
```

### Backend:
- Laravel Scout (recherche full-text)
- Meilisearch ou Algolia (optionnel, pour performance)
- Job queues pour analytics

---

## ✅ CHECKLIST AVANT DÉPLOIEMENT

- [ ] Tests E2E (Cypress) sur lecteur
- [ ] Tests performance (Lighthouse score >90)
- [ ] Gestion erreurs réseau (offline, timeout)
- [ ] Logs Sentry pour tracking bugs
- [ ] CDN pour audio files (Cloudflare/AWS)
- [ ] Compression Brotli activée
- [ ] Meta tags SEO pour pages publiques
- [ ] Documentation API (Swagger)

---

**Dernière mise à jour**: 15 février 2026 - 14h00
