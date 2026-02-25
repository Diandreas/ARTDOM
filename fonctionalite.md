ARTDOM - SPÉCIFICATIONS DÉTAILLÉES PAR INTERFACE
Date : 15 janvier 2026
Version : 1.1
Dernière mise à jour : 15 février 2026

========================================
MISES À JOUR SESSION 15-16 FÉVRIER 2026
========================================

ARTSTREAM - FONCTIONNALITÉS COMPLÉTÉES :

✅ Système Audio Complet (Backend + Frontend)
  - AudioContext avec gestion de queue avancée
  - Modes shuffle, repeat (off/one/all)
  - Contrôle volume et mute
  - Auto-play track suivant
  - Streaming progressif (preload='metadata')
  - Protection contre rechargement intempestif

✅ Système de Favoris COMPLET (Backend + Frontend)
  - Migration table 'favorites' (many-to-many User-Track)
  - FavoriteController (toggle, index)
  - Routes favorites (/favorites/toggle, /favorites)
  - Toast notifications (Sonner) pour feedback utilisateur
  - Bouton cœur fonctionnel dans full-player et mise à jour optimiste
  - ✅ PAGE FAVORIS (16/02): Liste complète avec tri, lecture, unfavorite

✅ Système de Playlists COMPLET (Backend + Frontend)
  - Tables 'playlists' et 'playlist_track'
  - Model Playlist avec relations (User, Tracks)
  - PlaylistController complet (CRUD + add/remove tracks)
  - PlaylistPolicy pour autorisation
  - Routes playlists générées via Wayfinder
  - ✅ PAGE PLAYLISTS (16/02): Grille, création, gestion
  - ✅ PAGE DÉTAIL PLAYLIST (16/02): Liste tracks, lecture, retrait
  - ✅ COMPOSANT "AJOUTER À PLAYLIST" (16/02): Modal réutilisable, intégré partout

✅ Lecteurs Audio
  - Full-player avec chargement depuis URL parameters
  - Mini-player persistant avec bouton expand fonctionnel
  - Gestion état local vs audio progress pour seek fluide
  - Affichage favoris synchronisé
  - Bouton "Ajouter à playlist" fonctionnel

✅ Infrastructure
  - 575 tracks seedés avec URLs audio valides (Archive.org/Pixabay CORS-enabled)
  - UpdateTrackUrlsSeeder pour migration URLs
  - ArtStreamController avec méthodes player(), album(), index()

⚠️ PROBLÈMES CONNUS :
  - Seek: redémarre parfois au lieu de continuer (investigation différée)

✅ File d'Attente UI (Queue Sidebar) - COMPLÉTÉE (16/02)
  - Composant QueueSidebar avec Sheet (slide-in latéral)
  - Header avec compteur de tracks
  - Section "En cours" avec track actuelle
  - Section "À suivre" avec liste des prochains tracks
  - Bouton "Sauvegarder comme playlist" fonctionnel
  - Bouton "Effacer la file d'attente"
  - Intégré dans full-player ET mini-player
  - Click sur track dans queue → lecture immédiate

✅ Recherche Musicale COMPLÈTE - COMPLÉTÉE (16/02)
  - Endpoint backend GET /artstream/search avec paramètres q et type
  - Recherche multi-critères: Tracks, Albums, Artistes
  - Page search.tsx avec input de recherche
  - Onglets résultats: Tout, Titres, Albums, Artistes
  - Recherches récentes (localStorage, max 5)
  - Bouton "Effacer recherches récentes"
  - États vides pour aucun résultat
  - Click sur track → lecture avec queue
  - Click sur album → vue album
  - Click sur artiste → profil artiste
  - Compteur de résultats total
  - Bouton recherche dans music-hub

📋 PROCHAINES ÉTAPES (voir PLAN_ARTSTREAM.md) :
  - ✅ Phase 1: Interface Playlists - COMPLÉTÉE (16/02)
  - ✅ Phase 2: Page Favoris - COMPLÉTÉE (16/02)
  - ✅ Phase 3: Queue UI - COMPLÉTÉE (16/02)
  - ✅ Phase 5: Recherche musicale - COMPLÉTÉE (16/02)
  - Phase 4: Partage & Social
  - Phase 6: Paroles (Lyrics)
  - Phase 7: Hub amélioré
  - Phase 8: Offline & Performance
  - Phase 9: Analytics

________________________________________
1. AUTHENTIFICATION & ONBOARDING
1.1 Splash Screen [x]
Fonctionnalités :
•	Animation du logo ARTDOM (2-3 secondes) [x]
•	Affichage du slogan "Artistes d'émotions, messagers de cœurs" [x]
•	Vérification automatique de la session utilisateur [x]
•	Redirection vers Home si connecté, sinon vers Onboarding [x]
________________________________________
1.2 Onboarding Slides (Carrousel x3) [x]
Fonctionnalités :
•	Slide 1 : "Trouvez un artiste local" + Illustration [x]
•	Slide 2 : "Vivez une émotion unique" + Illustration [x]
•	Slide 3 : "Soutenez les talents" + Illustration [x]
•	Bouton "Passer" en haut à droite [x]
•	Indicateurs de progression (dots) [x]
•	Bouton CTA final "Commencer" [x]
•	Sauvegarde de la préférence (ne plus afficher) [x]
________________________________________
1.3 Choix du Profil [x]
Fonctionnalités :
•	Écran scindé verticalement [x]
•	Bouton gauche : "Je suis Client" + Icône utilisateur [x]
•	Bouton droit : "Je suis Artiste" + Icône micro/palette [x]
•	Lien "J'ai déjà un compte" en bas [x]
•	Stockage du type de profil sélectionné [x]
________________________________________
1.4 Inscription Client [x]
Fonctionnalités :
•	Champs obligatoires : Nom, Prénom, Email, Téléphone, Mot de passe, Confirmation mot de passe [x]
•	Champs optionnels : Photo de profil, Ville [x]
•	Validation en temps réel (email valide, mot de passe fort 8+ caractères) [x]
•	Checkbox "J'accepte les CGU" [x]
•	Social Login : Boutons Google, Facebook, Apple [x]
•	Envoi d'email de vérification [x]
•	Redirection vers Onboarding Client après inscription [x]
________________________________________
1.5 Inscription Artiste [x]
Fonctionnalités :
•	Section Identité : Nom de scène, Nom/Prénom, Email, Téléphone, CNI/Passeport [x]
•	Section Artistique : Catégorie principale (Chanteur, Danseur, Peintre, etc.), Bio courte (200 caractères max) [x]
•	Portfolio : Upload 3-5 photos/vidéos de travail [x]
•	Vérification d'identité : Upload recto/verso CNI [x]
•	Tarification initiale : Tarif horaire de base [x]
•	Checkbox "Je certifie être professionnel/en formation" [x]
•	Statut "En attente de validation" après soumission [x]
•	Notification admin pour validation manuelle [x]
________________________________________
1.6 Connexion [x]
Fonctionnalités :
•	Champ Email ou Téléphone [x]
•	Champ Mot de passe avec toggle "Afficher/Masquer" [x]
•	Checkbox "Se souvenir de moi" [x]
•	Lien "Mot de passe oublié ?" [x]
•	Bouton "Se connecter" [x]
•	Social Login : Google, Facebook, Apple [x]
•	Gestion des erreurs (compte inexistant, mot de passe incorrect) [x]
•	Redirection vers dashboard respectif (Client/Artiste) [x]
________________________________________
1.7 Mot de passe oublié [x]
Fonctionnalités :
•	Saisie de l'email ou téléphone [x]
•	Envoi de code OTP (6 chiffres) par SMS/Email [x]
•	Écran de saisie du code OTP avec timer (5 min) [x]
•	Bouton "Renvoyer le code" après expiration [x]
•	Écran de réinitialisation : Nouveau mot de passe + Confirmation [x]
•	Validation et retour à la connexion [x]
________________________________________
2. MODULE CLIENT
A. DÉCOUVERTE & RECHERCHE
2.1 Accueil (Home) [x]
Fonctionnalités :
•	Header : Logo, icône Notifications, icône Recherche [x]
•	Section Stories : Carrousel horizontal de stories artistes (24h) [x]
•	Section "À la une" : Bannière promotionnelle (concerts, nouveautés) [x]
•	Section "Catégories" : Grille cliquable (Chant, Danse, Peinture, Théâtre, etc.) [x]
•	Section "Artistes tendances" : Carrousel horizontal de cartes artistes (Photo, Nom, Note, Prix indicatif) [x]
•	Section "Nouveautés musique" : Carrousel d'albums récents [x]
•	Section "Tutos populaires" : Carrousel de vignettes vidéos [x]
•	Bottom Navigation : Home, Recherche, ArtStream, Messagerie, Profil [x]
•	Pull-to-refresh pour actualiser le feed [x]
•	Tracking des clics pour analytics [x]
________________________________________
2.2 Recherche Avancée [x]
Fonctionnalités :
•	Barre de recherche : Auto-complétion sur noms d'artistes, catégories [x]
•	Filtres déroulants : [x]
o	Ville/Localisation (géolocalisation + saisie manuelle) [x]
o	Type d'événement (Anniversaire, Mariage, Baptême, Funérailles, Diplôme, Autre) [x]
o	Catégorie artistique (multi-sélection) [x]
o	Budget (slider min-max) [x]
o	Note minimale (1-5 étoiles) [x]
o	Disponibilité (Date précise) [x]
•	Bouton "Appliquer les filtres" [x]
•	Compteur de résultats [x]
•	Sauvegarde des recherches récentes [x]
________________________________________
2.3 Résultats de Recherche [x]
Fonctionnalités :
•	Vue Liste (par défaut) : [x]
o	Carte artiste : Photo, Nom, Catégorie, Note, Prix à partir de, Distance, Bouton "Voir profil" [x]
o	Tri : Pertinence, Note, Prix croissant/décroissant, Proximité [x]
•	Vue Carte (Map) : [x]
o	Google Maps / Mapbox avec pins artistes [x]
o	Clic sur pin → Mini-carte artiste [x]
•	Toggle Vue Liste/Carte en haut [x]
•	Pagination ou scroll infini [x]
•	Bouton "Affiner" pour retour aux filtres [x]
•	Aucun résultat → Message + Suggestions d'artistes populaires [x]
________________________________________
B. PROFIL ARTISTE & RÉSERVATION
2.4 Profil Public Artiste [x]
Fonctionnalités :
•	Header : Photo de couverture, Photo de profil, Nom de scène, Badge vérifié [x]
•	Section Infos : Catégorie, Ville, Note moyenne (★), Nombre d'avis, Prix de base [x]
•	Boutons d'action : "Réserver", "Suivre", "Partager", "Signaler" [x]
•	Section Bio : Description de l'artiste (extensible) [x]
•	Galerie Photos/Vidéos : Carrousel média [x]
•	Section Albums : Liste des albums disponibles (streaming + achat) [x]
•	Section Prestations : Liste des services proposés (Chanson personnalisée, Spectacle, Cours, etc.) [x]
•	Section Avis : Liste des commentaires clients avec notes (pagination) [x]
•	Section "Artistes similaires" : Suggestions [x]
•	Compteur de vues du profil (visible artiste uniquement) [x]
•	Chat direct avec l'artiste (bouton flottant) [x]
________________________________________
2.5 Détail Prestation [x]
Fonctionnalités :
•	Titre de la prestation (ex : "Chanson d'anniversaire personnalisée") [x]
•	Description détaillée (déroulement, durée, inclus/non inclus) [x]
•	Prix (fixe ou à partir de) [x]
•	Photos/Vidéos exemples [x]
•	Délai de préparation (ex : 48h de prévenance minimum) [x]
•	Options supplémentaires (ex : Vidéo HD +10€) [B]
•	Bouton "Réserver maintenant" [x]
•	Section FAQ spécifique à la prestation [B]
•	Avis liés à cette prestation uniquement [B]
________________________________________
2.6 Calendrier de Disponibilité [x]
Fonctionnalités :
•	Vue Calendrier mensuel : Jours disponibles en vert, indisponibles en gris [x]
•	Sélection de date (clic sur jour disponible) [x]
•	Vue Créneaux horaires : Liste des plages disponibles ce jour-là [x]
•	Sélection d'heure de début + durée estimée [x]
•	Calcul automatique du prix selon durée [x]
•	Indication de la popularité (ex : "Seulement 2 créneaux restants") [B]
•	Bouton "Suivant" vers Personnalisation [x]
________________________________________
2.7 Personnalisation Émotion [x]
Fonctionnalités :
•	Champ "Prénom du destinataire" [x]
•	Champ "Relation" (dropdown : Ami, Conjoint, Parent, Enfant, Collègue) [B]
•	Type d'émotion (dropdown : Joie, Amour, Soutien, Hommage, Fierté) [x]
•	Message personnel (textarea 500 caractères max) : Instructions pour l'artiste [x]
•	Upload fichier (optionnel) : Photo/document à intégrer dans la prestation [B]
•	Lieu de prestation : À domicile (adresse) / En ligne (lien généré) / Lieu public (à préciser) [x]
•	Bouton "Ajouter au panier" ou "Commander" [x]
•	Prévisualisation du récapitulatif [x]
________________________________________
2.8 Panier / Récapitulatif [x]
Fonctionnalités :
•	Liste des prestations ajoutées (modifiable quantité, suppression) [x]
•	Détail par item : Artiste, Prestation, Date/Heure, Prix unitaire [x]
•	Section Coupons : Champ code promo + Bouton "Appliquer" [x]
•	Récapitulatif financier : [x]
o	Sous-total [x]
o	Frais de service ARTDOM (%) [x]
o	Réduction éventuelle [x]
o	Total TTC [x]
•	Bouton "Procéder au paiement" [x]
•	Option "Sauvegarder pour plus tard" [B]
________________________________________
2.9 Paiement [x]
Fonctionnalités :
•	Choix du moyen de paiement : [x]
o	Mobile Money (Orange Money, MTN Money, etc.) → Saisie numéro [x]
o	Carte bancaire → Intégration Stripe/Paystack (champs CB sécurisés) [x]
o	PayPal → Redirection [B]
o	Virement bancaire → Affichage IBAN + Référence unique [B]
•	Sauvegarde des moyens de paiement (tokenisation) [B]
•	Checkbox "Utiliser ce moyen par défaut" [B]
•	Validation 3D Secure si applicable [B]
•	Bouton "Payer [Montant]" [x]
•	Indicateur de chargement + Sécurité (icône cadenas) [x]
•	Gestion des erreurs (paiement refusé, timeout) [B]
________________________________________
2.10 Confirmation Commande [x]
Fonctionnalités :
•	Animation de succès (checkmark animé) [x]
•	Message "Réservation confirmée !" [x]
•	QR Code de la réservation (scannable par l'artiste le jour J) [x]
•	Numéro de réservation unique [x]
•	Récapitulatif : Artiste, Prestation, Date/Heure, Lieu, Montant payé [x]
•	Bouton "Télécharger le reçu" (PDF) [x]
•	Bouton "Contacter l'artiste" [x]
•	Bouton "Retour à l'accueil" [x]
•	Envoi automatique d'email/SMS de confirmation [B]
•	Ajout automatique au calendrier du téléphone (option) [x]
________________________________________
C. ARTSTREAM (STREAMING AUDIO)
2.11 Hub Musique [x] ✅ Infrastructure complète (15/02/2026)
Fonctionnalités :
•	Header : Logo ArtStream, icône Recherche musicale, icône Bibliothèque [x]
•	Section "Nouveautés" : Carrousel d'albums/singles récents [x]
•	Section "Top Artistes" : Classement des artistes les plus écoutés (semaine/mois) [x]
•	Section "Genres" : Grille de catégories (Afrobeat, Hip-Hop, Gospel, Jazz, etc.) [x]
•	Section "Playlists ARTDOM" : Playlists éditoriales (ex : "Talents émergents") [x]
•	Section "Recommandé pour vous" : Algorithme basé sur l'historique d'écoute [x]
•	Bottom Player : Lecteur mini persistant [x] ✅ Fonctionnel avec queue et streaming
•	Accès au mode hors-ligne (si abonnement Premium) [x]
________________________________________
2.12 Vue Album/Playlist [x] ✅ Albums fonctionnels (15/02/2026)
Fonctionnalités :
•	Header : Cover, Titre album/playlist, Nom artiste, Année, Nombre de pistes [x]
•	Bouton "Lire" (lecture aléatoire ou séquentielle) [x] ✅ Charge queue et démarre lecture
•	Bouton "Ajouter à Ma Bibliothèque" [x]
•	Bouton "Partager" [x]
•	Bouton "Acheter l'album" (prix affiché) [x]
•	Liste des pistes : [x]
o	Numéro, Titre, Durée [x]
o	Icône "Lecture" au survol/clic [x] ✅ Charge track dans player
o	Icône "..." (menu : Ajouter à playlist, Télécharger si acheté) [x] ⚠️ Backend prêt, UI modal en attente
•	Nombre d'écoutes total de l'album [x]
•	Lien vers le profil de l'artiste [x]
________________________________________
2.13 Lecteur Audio (Full Screen) [x] ✅ COMPLÉTÉ 15/02/2026
Fonctionnalités :
•	Cover animé (rotation ou visualiseur d'ondes) [x]
•	Titre de la chanson + Nom de l'artiste (cliquables) [x]
•	Contrôles : [x]
o	Bouton "Précédent" [x]
o	Bouton "Play/Pause" (centré, large) [x]
o	Bouton "Suivant" [x]
o	Barre de progression (draggable) [x] ⚠️ Seek peut redémarrer (investigation différée)
o	Timer (temps écoulé / durée totale) [x]
•	Actions secondaires : [x]
o	Bouton "J'aime" (cœur) [x] ✅ Backend + Frontend + Toast notifications
o	Bouton "Ajouter à playlist" [x] ⚠️ Backend prêt, UI en attente (Phase 1)
o	Bouton "Partager" [x]
o	Bouton "Acheter l'album" (si non acheté) [x]
•	Paroles : Toggle pour afficher les lyrics synchronisés (si disponibles) [x]
•	Mode répétition (1x, répéter, aléatoire) [x] ✅ off/all/one
•	File d'attente (liste des prochaines pistes) [x] ✅ Backend complet
•	Gestion du volume [x] ✅ Slider + Mute
________________________________________
2.14 Lecteur Audio (Mini) [x] ✅ COMPLÉTÉ 15/02/2026
Fonctionnalités :
•	Barre persistante en bas de l'écran (toutes les pages) [x]
•	Cover miniature + Titre + Artiste (texte défilant si long) [x]
•	Bouton "Play/Pause" [x]
•	Bouton "Suivant" [x]
•	Clic sur la barre → Ouverture de l'lecteur Full Screen [x] ✅ Bouton expand fonctionnel
•	Fermeture (icône "X") → Arrêt de la lecture [x]
________________________________________
D. ARTTUBE & CLASSROOM
2.15 Hub Vidéo/Tutos [x]
Fonctionnalités :
•	Header : Logo ArtTube, icône Recherche, icône Abonnements [x]
•	Section "Tendances" : Feed vertical type YouTube (vignettes vidéos) [x]
•	Vignette vidéo : Thumbnail, Titre, Nom artiste, Vues, Date de publication, Durée [x]
•	Section "Abonnements" : Feed des artistes suivis [x]
•	Section "Catégories" : Tutos Danse, Tutos Chant, Tutos Peinture, etc. [x]
•	Section "Formations payantes" : Teaser des Classrooms disponibles [B]
•	Filtres : Récent, Populaire, Durée [x]
•	Auto-play des vidéos en mode muet au scroll (désactivable) [x]
________________________________________
2.16 Lecteur Vidéo [x]
Fonctionnalités :
•	Player vidéo : Contrôles lecture, pause, volume, plein écran, qualité (360p-1080p) [x]
•	Barre de progression avec chapitres (si définis) [B]
•	Informations : Titre, Nom artiste, Vues, Date, Bouton "S'abonner", Bouton "J'aime/Je n'aime pas" [x]
•	Description : Texte extensible + Liens [x]
•	Bouton "Réserver cet artiste" (redirection vers profil) [x]
•	Section Commentaires : [x]
o	Tri : Les plus récents, Les plus pertinents [x]
o	Champ de saisie commentaire [x]
o	Réponses aux commentaires (thread) [x]
o	Signalement de commentaires [B]
•	Vidéos suggérées : Liste à droite ou en dessous [x]
•	Partage (lien direct, réseaux sociaux) [x]
________________________________________
2.17 Catalogue Classroom
Fonctionnalités :
•	Liste ou grille des formations disponibles
•	Carte formation : 
o	Thumbnail du cours
o	Titre (ex : "Apprendre la guitare en 30 jours")
o	Nom de l'instructeur (artiste)
o	Note moyenne (★)
o	Prix
o	Badge "Bestseller" si applicable
o	Nombre d'inscrits
•	Filtres : Catégorie, Prix, Niveau (Débutant, Intermédiaire, Avancé), Langue
•	Bouton "Voir le cours"
________________________________________
2.18 Détail Cours
Fonctionnalités :
•	Header : Vidéo trailer en autoplay
•	Titre du cours + Nom instructeur (cliquable)
•	Note + Nombre d'avis + Nombre d'étudiants
•	Prix + Badge "Promotion" si réduction
•	Bouton "Acheter maintenant" ou "S'inscrire"
•	Section "Ce que vous allez apprendre" : Liste de bullet points
•	Section "Prérequis"
•	Section "Sommaire détaillé" : 
o	Chapitres dépliables
o	Liste des leçons avec durée
o	Vidéos preview gratuites (1-2)
•	Section "Instructeur" : Bio courte + Lien profil
•	Section Avis : Commentaires des étudiants
•	FAQ du cours
•	Garantie de remboursement (si politique applicable)
________________________________________
2.19 Interface Leçon
Fonctionnalités :
•	Sidebar gauche : Sommaire du cours (chapitres/leçons) avec progression (checkmarks)
•	Zone principale : Lecteur vidéo HD
•	Contrôles : Play/Pause, vitesse de lecture (0.5x - 2x), qualité
•	Bouton "Marquer comme terminé"
•	Onglets sous la vidéo : 
o	Aperçu : Description de la leçon
o	Ressources : Fichiers téléchargeables (PDF, partitions, exercices)
o	Q&A : Forum de questions/réponses entre étudiants + instructeur
•	Bouton "Leçon précédente" / "Leçon suivante"
•	Prise de notes intégrée (sauvegarde automatique)
•	Certificat de complétion (si cours terminé à 100%)
________________________________________
E. GESTION COMPTE CLIENT
2.20 Mes Réservations [B]
Fonctionnalités :
•	Onglets : "À venir", "Passées", "Annulées" [B]
•	Carte réservation : [B]
o	Photo artiste [B]
o	Nom artiste + Prestation [B]
o	Date/Heure [B]
o	Statut (Confirmée, En attente, Terminée, Annulée) [B]
o	Bouton "Voir les détails" [B]
o	Badge notification si nouveau message de l'artiste [B]
•	Filtre par date, par artiste [B]
•	Recherche par numéro de réservation [B]
•	Aucune réservation → Message + CTA "Découvrir les artistes" [B]
________________________________________
2.21 Détail Réservation [B]
Fonctionnalités :
•	Section Statut : Timeline visuelle (Confirmée → En cours → Terminée) [B]
•	Informations complètes : [B]
o	Numéro de réservation [B]
o	Artiste (photo, nom, lien profil) [B]
o	Prestation [B]
o	Date/Heure/Lieu [B]
o	Prix payé [B]
o	Personnalisation (message, destinataire) [B]
•	QR Code : Affichage pour scan le jour J [B]
•	Boutons d'action selon statut : [B]
o	"Contacter l'artiste" (chat direct) [B]
o	"Modifier" (si > 48h avant) [B]
o	"Annuler" (politique d'annulation affichée) [B]
o	"Noter et commenter" (si terminée) [B]
o	"Télécharger reçu" [B]
•	Section Messages : Historique du chat avec l'artiste [B]
•	Countdown avant l'événement (si à venir) [B]
________________________________________
2.22 Ma Bibliothèque [B] ⚠️ BACKEND PLAYLISTS PRÊT (15/02/2026)
Fonctionnalités :
•	Onglets : "Albums achetés", "Cours en cours", "Playlists", "Téléchargements" [B]
•	Albums achetés : [B]
o	Grille de covers [B]
o	Bouton "Lire" direct [B]
o	Bouton "Télécharger" (si pas encore fait) [B]
o	Statut du téléchargement [B]
•	Cours en cours : [B]
o	Liste des formations achetées [B]
o	Barre de progression (% complété) [B]
o	Bouton "Continuer" [B]
o	Date de dernière activité [B]
•	Playlists : [B] ⚠️ Backend 100% prêt (tables, model, controller, policy, routes) - UI en attente
o	Mes playlists créées [B]
o	Bouton "Créer une nouvelle playlist" [B]
o	Gestion (renommer, supprimer) [B]
•	Mode hors-ligne activable (télécharger pour écoute/visionnage offline) [B]
________________________________________
3. MODULE ARTISTE
A. GESTION DE CARRIÈRE
3.1 Dashboard Artiste [x]
Fonctionnalités :
•	Header : Photo de profil, Nom de scène, Badge statut compte (Vérifié/En attente) [x]
•	Section Revenus : [x]
o	Revenus du mois en cours (graphique courbe) [x]
o	Comparaison vs mois précédent (%) [x]
o	Bouton "Voir détails" → Wallet [x]
•	Section Activité : [x]
o	Prochaine prestation (date, client, lieu) [x]
o	Nombre de nouvelles réservations (badge notif) [x]
o	Nombre de nouveaux abonnés (cette semaine) [x]
o	Nombre d'écoutes de vos morceaux (cette semaine) [x]
o	Nombre de vues de vos vidéos (cette semaine) [x]
•	Section Notifications : 3 dernières notifs importantes [x]
•	Raccourcis rapides : [x]
o	"Gérer mon agenda" [x]
o	"Uploader un contenu" [x]
o	"Voir mes stats" [x]
•	Section "À faire" : Checklist (ex : "Compléter votre bio", "Ajouter une vidéo de présentation") [x]
________________________________________
3.2 Gestion Profil [x]
Fonctionnalités :
•	Section Photo : Upload/Modification photo de profil et de couverture (crop intégré) [x]
•	Section Infos personnelles : Nom de scène, Bio (1000 caractères), Ville, Catégories (multi-sélection) [x]
•	Section Réseaux sociaux : Liens Instagram, Facebook, YouTube, etc. [x]
•	Section Tarifs : [B]
o	Tarif horaire de base [B]
o	Liste des prestations personnalisées (éditable) [B]
o	Bouton "Ajouter une prestation" [B]
•	Galerie : Upload/Suppression de photos et vidéos du portfolio [x]
•	Section Certifications : Upload de diplômes/certificats (visible sur profil public) [B]
•	Bouton "Prévisualiser mon profil" (vue client) [B]
•	Bouton "Publier les modifications" [x]
•	Tracking des vues du profil (analytics basiques) [B]
________________________________________
3.3 Gestion Agenda [x]
Fonctionnalités :
•	Vue Calendrier mensuel : Visualisation des créneaux réservés (bleu), disponibles (vert), bloqués (rouge) [x]
•	Ajout de disponibilité : [x]
o	Clic sur un jour → Sélection de plages horaires [x]
o	Option "Répéter" (tous les lundis, par exemple) [x]
•	Blocage de créneaux : [x]
o	Sélection de dates/heures à rendre indisponibles [x]
o	Raison (optionnel) : "Vacances", "Événement personnel", etc. [x]
•	Synchronisation : Import/Export vers Google Calendar, Outlook [B]
•	Notifications : Rappels 24h/1h avant chaque prestation [B]
•	Vue liste : Liste chronologique des prochaines prestations [x]
________________________________________
3.4 Gestion des Services [x]
Fonctionnalités :
•	Liste des prestations proposées (tableau) [x]
•	Colonnes : Nom service, Prix, Durée, Statut (Actif/Inactif), Actions [x]
•	Bouton "Ajouter un service" : [x]
o	Formulaire : Titre, Description, Catégorie, Prix (fixe ou à partir de), Durée estimée, Délai de prévenance [x]
o	Upload de photos/vidéos exemples [x]
o	Options supplémentaires (ex : Vidéo HD +10€) [x]
o	Disponibilité (en ligne/à domicile/lieu public) [x]
•	Actions : Éditer, Dupliquer, Désactiver, Supprimer [x]
•	Réorganisation par drag-and-drop (ordre d'affichage sur le profil) [x]
________________________________________
B. GESTION DES VENTES & CONTENUS
3.5 Upload Manager [B]
Fonctionnalités :
•	Onglets : "Albums", "Vidéos/Tutos", "Cours (Classroom)" [B]
•	Upload Album : [B]
o	Titre album, Année, Genre, Cover (upload) [B]
o	Upload multiple de pistes (MP3) + métadonnées (titre, durée) [B]
o	Prix de vente (album entier ou par piste) [B]
o	Option "Disponible en streaming gratuit" (oui/non) [B]
•	Upload Vidéo/Tuto : [B]
o	Titre, Description, Catégorie, Tags [B]
o	Upload vidéo (MP4, MOV) avec barre de progression [B]
o	Thumbnail personnalisé (upload ou sélection d'un frame) [B]
o	Visibilité : Public/Abonnés uniquement/Privé [B]
•	Upload Cours : [B]
o	Titre cours, Prix, Niveau, Langue [B]
o	Upload vidéo de trailer [B]
o	Création de chapitres/leçons (voir 3.10) [B]
•	Validation automatique (vérification copyright, qualité minimum) [B]
•	Notification de publication (après validation si applicable) [B]
________________________________________
3.6 Gestion Commandes [x]
Fonctionnalités :
•	Onglets : "En attente", "Confirmées", "Terminées", "Annulées" [x]
•	Carte commande : [x]
o	Numéro de commande [x]
o	Client (nom, photo si partagée) [x]
o	Prestation demandée [x]
o	Date/Heure souhaitées [x]
o	Montant [x]
o	Message de personnalisation du client [x]
o	Statut [x]
•	Actions (pour "En attente") : [x]
o	Accepter → Confirmation automatique au client [x]
o	Refuser → Popup raison (optionnel) + Remboursement auto [x]
o	Négocier → Ouverture du chat pour discuter modifications [B]
•	Actions (pour "Confirmées") : [x]
o	Voir les détails [x]
o	Contacter le client [x]
o	Annuler (conditions d'annulation vérifiées) [x]
•	Filtre par date, par statut [x]
•	Compteurs : X nouvelles demandes, X confirmées à venir [x]
________________________________________
3.7 Suivi Prestation [B]
Fonctionnalités :
•	Liste des prestations du jour ou de la semaine [B]
•	Carte prestation active : [B]
o	Client, Lieu, Heure [B]
o	Bouton "Check-in" (début de prestation) [B]
	GPS tracking (confirmation de présence sur lieu) [B]
	Timer démarre automatiquement [B]
o	Pendant la prestation : Timer affiché, option "Ajouter du temps" [B]
o	Bouton "Check-out" (fin de prestation) [B]
	Confirmation de la durée finale [B]
	Calcul du paiement si ajustement [B]
	Demande de signature client (sur mobile, optionnel) [B]
•	Historique des prestations avec durées réelles vs estimées [B]
________________________________________
3.8 Classroom Creator
Fonctionnalités :
•	Liste des cours créés (brouillons, publiés)
•	Bouton "Créer un nouveau cours" : 
o	Étape 1 : Infos générales : Titre, Description, Prix, Niveau, Catégorie, Langue
o	Étape 2 : Structure : 
	Ajout de chapitres (titre)
	Ajout de leçons dans chaque chapitre (titre, description)
o	Étape 3 : Contenus : 
	Upload vidéo pour chaque leçon
	Ajout de ressources téléchargeables (PDF, images)
o	Étape 4 : Paramètres : 
	Vidéo de présentation (trailer)
	Prérequis
	Objectifs d'apprentissage (bullet points)
	Certificat de complétion (oui/non)
o	Étape 5 : Publication : Prévisualisation + Bouton "Publier"
•	Gestion post-publication : 
o	Statistiques : Nombre d'inscrits, revenus, progression moyenne, taux de complétion
o	Forum Q&A : Répondre aux questions des étudiants
o	Mises à jour : Ajouter/modifier des leçons
________________________________________
C. PORTEFEUILLE
3.9 Wallet Artiste [x]
Fonctionnalités :
•	Header : Solde total disponible (gros chiffre) [x]
•	Bouton "Retirer des fonds" (actif si solde > seuil minimum) [x]
•	Section Revenus : [x]
o	Graphique des revenus (jour/semaine/mois/année) [x]
o	Filtres par source : Prestations, Ventes d'albums, Cours, Streaming [x]
•	Historique des transactions : [x]
o	Tableau : Date, Type (Prestation/Vente/Cours), Client/Source, Montant brut, Commission ARTDOM, Net [x]
o	Filtre par date, par type [x]
o	Export CSV/PDF [x]
o	Section "En attente" : Montants bloqués (prestations non encore effectuées) [x]
o	Section Retraits : Historique des virements avec statuts (En cours, Complété) [x]
________________________________________
3.10 Retrait des fonds [x]
Fonctionnalités :
•	Affichage du solde retirable [x]
•	Choix de la méthode : [x]
o	Virement bancaire (IBAN, BIC) [x]
o	Mobile Money (numéro) [x]
o	PayPal (email) [x]
•	Sauvegarde des coordonnées bancaires (chiffrées) [B]
•	Champ montant : Saisie ou bouton "Tout retirer" [x]
•	Frais de retrait affichés (si applicable) [x]
•	Montant net à recevoir [x]
•	Délai de traitement indiqué (ex : 2-5 jours ouvrés) [x]
•	Bouton "Demander le retrait" [x]
•	Confirmation par email/SMS [B]
•	Tracking du statut dans l'historique [x]
________________________________________
4. FONCTIONNALITÉS TRANSVERSES
A. SOCIAL & COMMUNICATION
4.1 Messagerie (Liste) [x]
Fonctionnalités :
•	Liste des conversations récentes (tri par date) [x]
•	Carte conversation : [x]
o	Photo de l'interlocuteur (Client ou Artiste) [x]
o	Nom [x]
o	Dernier message (aperçu tronqué) [x]
o	Timestamp [x]
o	Badge notification si message non lu (nombre) [x]
o	Statut en ligne (point vert) [x]
•	Recherche de conversations (par nom) [x]
•	Archivage de conversations (swipe) [B]
•	Suppression de conversations [x]
•	Aucune conversation → Message + CTA "Découvrir les artistes" [x]
________________________________________
4.2 Chat Room [x]
Fonctionnalités :
•	Header : Photo + Nom de l'interlocuteur, Statut en ligne, Bouton "Appel" (si activé), Menu (Bloquer, Signaler) [x]
•	Zone de messages : [x]
o	Bulles différenciées (envoyé/reçu) [x]
o	Affichage de l'heure d'envoi [x]
o	Statut du message : Envoyé (√), Délivré (√√), Lu (√√ bleu) [B]
o	Messages groupés par date [x]
•	Champ de saisie : Textarea avec auto-expand [x]
•	Boutons attachements : [x]
o	Icône photo (galerie) [x]
o	Icône caméra (photo directe) [B]
o	Icône micro (enregistrement vocal avec waveform) [B]
o	Icône fichier (PDF, docs) [x]
•	Fonctionnalités avancées : [x]
o	Réponse à un message spécifique (quote) [B]
o	Réactions emoji [B]
o	Suppression de message (pour soi ou pour tous si < 1h) [B]
•	Messages vocaux : Lecture avec waveform + durée [B]
•	Notifications push en temps réel [x]
•	Typing indicator ("... est en train d'écrire") [B]
________________________________________
4.3 Notifications [x]
Fonctionnalités :
•	Header : Titre "Notifications", Bouton "Tout marquer comme lu" [x]
•	Onglets : "Toutes", "Réservations", "Messages", "Activité" [x]
•	Carte notification : [x]
o	Icône contextuelle (réservation, message, like, abonnement) [x]
o	Texte de la notification [x]
o	Timestamp [x]
o	Badge "Non lu" (fond coloré) [x]
o	Clic → Redirection vers l'écran concerné [x]
•	Types de notifications : [x]
o	Pour Client : Confirmation réservation, Message artiste, Rappel événement, Nouveau contenu artiste suivi, Promotion [x]
o	Pour Artiste : Nouvelle demande réservation, Paiement reçu, Nouvel abonné, Commentaire, Avis reçu, Retrait traité [x]
•	Paramétrage des notifications (activé/désactivé par type) [B]
•	Suppression de notifications (swipe) [x]
•	Historique conservé 30 jours [x]
________________________________________
4.4 Espace Suggestions/Plaintes [x]
Fonctionnalités :
•	Header : "Contactez-nous" [x]
•	Sélection du type : Dropdown (Suggestion, Plainte, Bug technique, Question, Autre) [x]
•	Champ Sujet : Titre court [x]
•	Champ Message : Textarea (2000 caractères max) [x]
•	Upload fichiers : Screenshots ou documents (max 5 fichiers, 10MB) [B]
•	Champ Email (pré-rempli, éditable) [x]
•	Checkbox "Recevoir une copie de ma demande" [x]
•	Bouton "Envoyer" [x]
•	Confirmation de l'envoi + Numéro de ticket [x]
•	FAQ / Base de connaissance accessible (liens rapides) [x]
•	Suivi des tickets précédents (historique) [x]
________________________________________
B. PARAMÈTRES
4.5 Réglages App [x]
Fonctionnalités :
•	Section Apparence : [x]
o	Mode Clair/Sombre/Auto (système) [x]
o	Taille de police (Petit/Moyen/Grand) [x]
•	Section Langue : [x]
o	Liste des langues disponibles (Français, Anglais, etc.) [x]
o	Redémarrage de l'app après changement [x]
•	Section Notifications : [x]
o	Toggle global "Activer les notifications" [x]
o	Par type : Réservations, Messages, Activité, Promotions (on/off individuellement) [x]
o	Notification sonore (choix du son) [x]
o	Vibration (on/off) [x]
•	Section Confidentialité : [x]
o	Profil visible par (Tout le monde / Abonnés uniquement) [x]
o	Afficher statut en ligne (on/off) [x]
o	Localisation (Toujours / Pendant utilisation / Jamais) [x]
•	Section Données : [x]
o	Téléchargement automatique vidéos (WiFi uniquement / Jamais) [x]
o	Qualité de streaming (Auto / Faible / Moyenne / Haute) [x]
o	Effacer le cache [x]
•	Section À propos : [x]
o	Version de l'application [x]
o	Conditions d'utilisation (lien) [x]
o	Politique de confidentialité (lien) [x]
o	Licences open source [x]
________________________________________
4.6 Profil Utilisateur [x]
Fonctionnalités :
•	Header : Photo de profil (éditable), Nom complet [x]
•	Informations personnelles : [x]
o	Email (éditable, vérification requise) [x]
o	Téléphone (éditable, vérification OTP) [x]
o	Date de naissance [x]
o	Genre (optionnel) [x]
o	Ville [x]
•	Section Sécurité : [x]
o	Modifier le mot de passe (ancien + nouveau) [x]
o	Authentification à deux facteurs (activation/désactivation) [x]
o	Appareils connectés (liste + déconnexion à distance) [x]
•	Section Abonnement (si applicable) : [x]
o	Plan actuel (Gratuit/Premium) [x]
o	Date de renouvellement [x]
o	Bouton "Gérer l'abonnement" ou "Passer à Premium" [x]
•	Section Compte : [x]
o	Désactiver temporairement mon compte (raisons, durée) [x]
o	Supprimer définitivement mon compte (confirmation double, mot de passe requis, email de confirmation) [x]
•	Bouton "Déconnexion" [x]
________________________________________
4.7 Abonnement Premium [x]
Fonctionnalités :
•	Landing page : [x]
o	Comparatif tableau Gratuit vs Premium [x]
o	Avantages Premium : [x]
	Streaming sans publicité [x]
	Téléchargement illimité pour écoute hors-ligne [x]
	Accès anticipé aux nouveaux contenus [x]
	Réduction sur les réservations (ex : -10%) [x]
	Badge Premium sur le profil [x]
	Support prioritaire [x]
o	Prix : Mensuel / Annuel (avec économie affichée) [x]
•	Bouton CTA : "Essayer gratuitement 7 jours" ou "S'abonner" [x]
•	Processus de paiement : Intégration App Store / Google Play / Stripe [x]
•	Gestion : [x]
o	Annuler l'abonnement (actif jusqu'à la fin de la période payée) [x]
o	Changer de plan (mensuel ↔ annuel) [B]
o	Historique des factures (téléchargement PDF) [B]
________________________________________
RÉCAPITULATIF
Total : 47 interfaces détaillées
Répartition :
•	Authentification & Onboarding : 7 écrans
•	Module Client : 15 écrans
•	Module Artiste : 10 écrans
•	Fonctionnalités Transverses : 7 écrans
•	Paramètres & Profil : 3 écrans
________________________________________
Notes importantes :
1.	Chaque interface doit inclure la gestion des états (chargement, erreur, vide) [x] (Skeletons ajoutés)
2.	Toutes les actions utilisateur doivent avoir un feedback visuel (loaders, animations, messages toast) [x]
3.	L'accessibilité (contraste, taille de texte, navigation vocale) doit être intégrée dès le design
4.	Les performances (lazy loading, cache, compression images) sont critiques pour l'UX mobile


