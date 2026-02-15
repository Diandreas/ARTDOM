ARTDOM - SPÉCIFICATIONS DÉTAILLÉES PAR INTERFACE
Date : 15 janvier 2026
Version : 1.0
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
2.5 Détail Prestation [B]
Fonctionnalités :
•	Titre de la prestation (ex : "Chanson d'anniversaire personnalisée") [B]
•	Description détaillée (déroulement, durée, inclus/non inclus) [B]
•	Prix (fixe ou à partir de) [B]
•	Photos/Vidéos exemples [B]
•	Délai de préparation (ex : 48h de prévenance minimum) [B]
•	Options supplémentaires (ex : Vidéo HD +10€) [B]
•	Bouton "Réserver maintenant" [B]
•	Section FAQ spécifique à la prestation [B]
•	Avis liés à cette prestation uniquement [B]
________________________________________
2.6 Calendrier de Disponibilité [B]
Fonctionnalités :
•	Vue Calendrier mensuel : Jours disponibles en vert, indisponibles en gris [B]
•	Sélection de date (clic sur jour disponible) [B]
•	Vue Créneaux horaires : Liste des plages disponibles ce jour-là [B]
•	Sélection d'heure de début + durée estimée [B]
•	Calcul automatique du prix selon durée [B]
•	Indication de la popularité (ex : "Seulement 2 créneaux restants") [B]
•	Bouton "Suivant" vers Personnalisation [B]
________________________________________
2.7 Personnalisation Émotion [B]
Fonctionnalités :
•	Champ "Prénom du destinataire" [B]
•	Champ "Relation" (dropdown : Ami, Conjoint, Parent, Enfant, Collègue) [B]
•	Type d'émotion (dropdown : Joie, Amour, Soutien, Hommage, Fierté) [B]
•	Message personnel (textarea 500 caractères max) : Instructions pour l'artiste [B]
•	Upload fichier (optionnel) : Photo/document à intégrer dans la prestation [B]
•	Lieu de prestation : À domicile (adresse) / En ligne (lien généré) / Lieu public (à préciser) [B]
•	Bouton "Ajouter au panier" ou "Commander" [B]
•	Prévisualisation du récapitulatif [B]
________________________________________
2.8 Panier / Récapitulatif [B]
Fonctionnalités :
•	Liste des prestations ajoutées (modifiable quantité, suppression) [B]
•	Détail par item : Artiste, Prestation, Date/Heure, Prix unitaire [B]
•	Section Coupons : Champ code promo + Bouton "Appliquer" [B]
•	Récapitulatif financier : [B]
o	Sous-total [B]
o	Frais de service ARTDOM (%) [B]
o	Réduction éventuelle [B]
o	Total TTC [B]
•	Bouton "Procéder au paiement" [B]
•	Option "Sauvegarder pour plus tard" [B]
________________________________________
2.9 Paiement [B]
Fonctionnalités :
•	Choix du moyen de paiement : [B]
o	Mobile Money (Orange Money, MTN Money, etc.) → Saisie numéro [B]
o	Carte bancaire → Intégration Stripe/Paystack (champs CB sécurisés) [B]
o	PayPal → Redirection [B]
o	Virement bancaire → Affichage IBAN + Référence unique [B]
•	Sauvegarde des moyens de paiement (tokenisation) [B]
•	Checkbox "Utiliser ce moyen par défaut" [B]
•	Validation 3D Secure si applicable [B]
•	Bouton "Payer [Montant]" [B]
•	Indicateur de chargement + Sécurité (icône cadenas) [B]
•	Gestion des erreurs (paiement refusé, timeout) [B]
________________________________________
2.10 Confirmation Commande
Fonctionnalités :
•	Animation de succès (checkmark animé)
•	Message "Réservation confirmée !"
•	QR Code de la réservation (scannable par l'artiste le jour J)
•	Numéro de réservation unique
•	Récapitulatif : Artiste, Prestation, Date/Heure, Lieu, Montant payé
•	Bouton "Télécharger le reçu" (PDF)
•	Bouton "Contacter l'artiste"
•	Bouton "Retour à l'accueil"
•	Envoi automatique d'email/SMS de confirmation
•	Ajout automatique au calendrier du téléphone (option)
________________________________________
C. ARTSTREAM (STREAMING AUDIO)
2.11 Hub Musique [x]
Fonctionnalités :
•	Header : Logo ArtStream, icône Recherche musicale, icône Bibliothèque [x]
•	Section "Nouveautés" : Carrousel d'albums/singles récents [x]
•	Section "Top Artistes" : Classement des artistes les plus écoutés (semaine/mois) [x]
•	Section "Genres" : Grille de catégories (Afrobeat, Hip-Hop, Gospel, Jazz, etc.) [x]
•	Section "Playlists ARTDOM" : Playlists éditoriales (ex : "Talents émergents") [x]
•	Section "Recommandé pour vous" : Algorithme basé sur l'historique d'écoute [x]
•	Bottom Player : Lecteur mini persistant [x]
•	Accès au mode hors-ligne (si abonnement Premium) [x]
________________________________________
2.12 Vue Album/Playlist [B]
Fonctionnalités :
•	Header : Cover, Titre album/playlist, Nom artiste, Année, Nombre de pistes [B]
•	Bouton "Lire" (lecture aléatoire ou séquentielle) [B]
•	Bouton "Ajouter à Ma Bibliothèque" [B]
•	Bouton "Partager" [B]
•	Bouton "Acheter l'album" (prix affiché) [B]
•	Liste des pistes : [B]
o	Numéro, Titre, Durée [B]
o	Icône "Lecture" au survol/clic [B]
o	Icône "..." (menu : Ajouter à playlist, Télécharger si acheté) [B]
•	Nombre d'écoutes total de l'album [B]
•	Lien vers le profil de l'artiste [B]
________________________________________
2.13 Lecteur Audio (Full Screen) [x]
Fonctionnalités :
•	Cover animé (rotation ou visualiseur d'ondes) [x]
•	Titre de la chanson + Nom de l'artiste (cliquables) [x]
•	Contrôles : [x]
o	Bouton "Précédent" [x]
o	Bouton "Play/Pause" (centré, large) [x]
o	Bouton "Suivant" [x]
o	Barre de progression (draggable) [x]
o	Timer (temps écoulé / durée totale) [x]
•	Actions secondaires : [x]
o	Bouton "J'aime" (cœur) [x]
o	Bouton "Ajouter à playlist" [x]
o	Bouton "Partager" [x]
o	Bouton "Acheter l'album" (si non acheté) [x]
•	Paroles : Toggle pour afficher les lyrics synchronisés (si disponibles) [x]
•	Mode répétition (1x, répéter, aléatoire) [x]
•	File d'attente (liste des prochaines pistes) [x]
•	Gestion du volume [x]
________________________________________
2.14 Lecteur Audio (Mini) [x]
Fonctionnalités :
•	Barre persistante en bas de l'écran (toutes les pages) [x]
•	Cover miniature + Titre + Artiste (texte défilant si long) [x]
•	Bouton "Play/Pause" [x]
•	Bouton "Suivant" [x]
•	Clic sur la barre → Ouverture de l'lecteur Full Screen [x]
•	Fermeture (icône "X") → Arrêt de la lecture [x]
________________________________________
D. ARTTUBE & CLASSROOM
2.15 Hub Vidéo/Tutos [B]
Fonctionnalités :
•	Header : Logo ArtTube, icône Recherche, icône Abonnements [B]
•	Section "Tendances" : Feed vertical type YouTube (vignettes vidéos) [B]
•	Vignette vidéo : Thumbnail, Titre, Nom artiste, Vues, Date de publication, Durée [B]
•	Section "Abonnements" : Feed des artistes suivis [B]
•	Section "Catégories" : Tutos Danse, Tutos Chant, Tutos Peinture, etc. [B]
•	Section "Formations payantes" : Teaser des Classrooms disponibles [B]
•	Filtres : Récent, Populaire, Durée [B]
•	Auto-play des vidéos en mode muet au scroll (désactivable) [B]
________________________________________
2.16 Lecteur Vidéo [B]
Fonctionnalités :
•	Player vidéo : Contrôles lecture, pause, volume, plein écran, qualité (360p-1080p) [B]
•	Barre de progression avec chapitres (si définis) [B]
•	Informations : Titre, Nom artiste, Vues, Date, Bouton "S'abonner", Bouton "J'aime/Je n'aime pas" [B]
•	Description : Texte extensible + Liens [B]
•	Bouton "Réserver cet artiste" (redirection vers profil) [B]
•	Section Commentaires : [B]
o	Tri : Les plus récents, Les plus pertinents [B]
o	Champ de saisie commentaire [B]
o	Réponses aux commentaires (thread) [B]
o	Signalement de commentaires [B]
•	Vidéos suggérées : Liste à droite ou en dessous [B]
•	Partage (lien direct, réseaux sociaux) [B]
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
2.22 Ma Bibliothèque [B]
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
•	Playlists : [B]
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
3.2 Gestion Profil [B]
Fonctionnalités :
•	Section Photo : Upload/Modification photo de profil et de couverture (crop intégré) [B]
•	Section Infos personnelles : Nom de scène, Bio (1000 caractères), Ville, Catégories (multi-sélection) [x]
•	Section Réseaux sociaux : Liens Instagram, Facebook, YouTube, etc. [x]
•	Section Tarifs : [B]
o	Tarif horaire de base [B]
o	Liste des prestations personnalisées (éditable) [B]
o	Bouton "Ajouter une prestation" [B]
•	Galerie : Upload/Suppression de photos et vidéos du portfolio [B]
•	Section Certifications : Upload de diplômes/certificats (visible sur profil public) [B]
•	Bouton "Prévisualiser mon profil" (vue client) [B]
•	Bouton "Publier les modifications" [B]
•	Tracking des vues du profil (analytics basiques) [B]
________________________________________
3.3 Gestion Agenda [B]
Fonctionnalités :
•	Vue Calendrier mensuel : Visualisation des créneaux réservés (bleu), disponibles (vert), bloqués (rouge) [B]
•	Ajout de disponibilité : [B]
o	Clic sur un jour → Sélection de plages horaires [B]
o	Option "Répéter" (tous les lundis, par exemple) [B]
•	Blocage de créneaux : [B]
o	Sélection de dates/heures à rendre indisponibles [B]
o	Raison (optionnel) : "Vacances", "Événement personnel", etc. [B]
•	Synchronisation : Import/Export vers Google Calendar, Outlook [B]
•	Notifications : Rappels 24h/1h avant chaque prestation [B]
•	Vue liste : Liste chronologique des prochaines prestations [B]
________________________________________
3.4 Gestion des Services [B]
Fonctionnalités :
•	Liste des prestations proposées (tableau) [B]
•	Colonnes : Nom service, Prix, Durée, Statut (Actif/Inactif), Actions [B]
•	Bouton "Ajouter un service" : [B]
o	Formulaire : Titre, Description, Catégorie, Prix (fixe ou à partir de), Durée estimée, Délai de prévenance [B]
o	Upload de photos/vidéos exemples [B]
o	Options supplémentaires (ex : Vidéo HD +10€) [B]
o	Disponibilité (en ligne/à domicile/lieu public) [B]
•	Actions : Éditer, Dupliquer, Désactiver, Supprimer [B]
•	Réorganisation par drag-and-drop (ordre d'affichage sur le profil) [B]
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
3.6 Gestion Commandes [B]
Fonctionnalités :
•	Onglets : "En attente", "Confirmées", "Terminées", "Annulées" [B]
•	Carte commande : [B]
o	Numéro de commande [B]
o	Client (nom, photo si partagée) [B]
o	Prestation demandée [B]
o	Date/Heure souhaitées [B]
o	Montant [B]
o	Message de personnalisation du client [B]
o	Statut [B]
•	Actions (pour "En attente") : [B]
o	Accepter → Confirmation automatique au client [B]
o	Refuser → Popup raison (optionnel) + Remboursement auto [B]
o	Négocier → Ouverture du chat pour discuter modifications [B]
•	Actions (pour "Confirmées") : [B]
o	Voir les détails [B]
o	Contacter le client [B]
o	Annuler (conditions d'annulation vérifiées) [B]
•	Filtre par date, par statut [B]
•	Compteurs : X nouvelles demandes, X confirmées à venir [B]
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
3.9 Wallet Artiste [B]
Fonctionnalités :
•	Header : Solde total disponible (gros chiffre) [B]
•	Bouton "Retirer des fonds" (actif si solde > seuil minimum) [B]
•	Section Revenus : [B]
o	Graphique des revenus (jour/semaine/mois/année) [B]
o	Filtres par source : Prestations, Ventes d'albums, Cours, Streaming [B]
•	Historique des transactions : [B]
o	Tableau : Date, Type (Prestation/Vente/Cours), Client/Source, Montant brut, Commission ARTDOM, Net [B]
o	Filtre par date, par type [B]
o	Export CSV/PDF [B]
o	Section "En attente" : Montants bloqués (prestations non encore effectuées) [B]
o	Section Retraits : Historique des virements avec statuts (En cours, Complété) [B]
________________________________________
3.10 Retrait des fonds [B]
Fonctionnalités :
•	Affichage du solde retirable [B]
•	Choix de la méthode : [B]
o	Virement bancaire (IBAN, BIC) [B]
o	Mobile Money (numéro) [B]
o	PayPal (email) [B]
•	Sauvegarde des coordonnées bancaires (chiffrées) [B]
•	Champ montant : Saisie ou bouton "Tout retirer" [B]
•	Frais de retrait affichés (si applicable) [B]
•	Montant net à recevoir [B]
•	Délai de traitement indiqué (ex : 2-5 jours ouvrés) [B]
•	Bouton "Demander le retrait" [B]
•	Confirmation par email/SMS [B]
•	Tracking du statut dans l'historique [B]
________________________________________
4. FONCTIONNALITÉS TRANSVERSES
A. SOCIAL & COMMUNICATION
4.1 Messagerie (Liste) [B]
Fonctionnalités :
•	Liste des conversations récentes (tri par date) [B]
•	Carte conversation : [B]
o	Photo de l'interlocuteur (Client ou Artiste) [B]
o	Nom [B]
o	Dernier message (aperçu tronqué) [B]
o	Timestamp [B]
o	Badge notification si message non lu (nombre) [B]
o	Statut en ligne (point vert) [B]
•	Recherche de conversations (par nom) [B]
•	Archivage de conversations (swipe) [B]
•	Suppression de conversations [B]
•	Aucune conversation → Message + CTA "Découvrir les artistes" [B]
________________________________________
4.2 Chat Room [B]
Fonctionnalités :
•	Header : Photo + Nom de l'interlocuteur, Statut en ligne, Bouton "Appel" (si activé), Menu (Bloquer, Signaler) [B]
•	Zone de messages : [B]
o	Bulles différenciées (envoyé/reçu) [B]
o	Affichage de l'heure d'envoi [B]
o	Statut du message : Envoyé (√), Délivré (√√), Lu (√√ bleu) [B]
o	Messages groupés par date [B]
•	Champ de saisie : Textarea avec auto-expand [B]
•	Boutons attachements : [B]
o	Icône photo (galerie) [B]
o	Icône caméra (photo directe) [B]
o	Icône micro (enregistrement vocal avec waveform) [B]
o	Icône fichier (PDF, docs) [B]
•	Fonctionnalités avancées : [B]
o	Réponse à un message spécifique (quote) [B]
o	Réactions emoji [B]
o	Suppression de message (pour soi ou pour tous si < 1h) [B]
•	Messages vocaux : Lecture avec waveform + durée [B]
•	Notifications push en temps réel [B]
•	Typing indicator ("... est en train d'écrire") [B]
________________________________________
4.3 Notifications [B]
Fonctionnalités :
•	Header : Titre "Notifications", Bouton "Tout marquer comme lu" [B]
•	Onglets : "Toutes", "Réservations", "Messages", "Activité" [B]
•	Carte notification : [B]
o	Icône contextuelle (réservation, message, like, abonnement) [B]
o	Texte de la notification [B]
o	Timestamp [B]
o	Badge "Non lu" (fond coloré) [B]
o	Clic → Redirection vers l'écran concerné [B]
•	Types de notifications : [B]
o	Pour Client : Confirmation réservation, Message artiste, Rappel événement, Nouveau contenu artiste suivi, Promotion [B]
o	Pour Artiste : Nouvelle demande réservation, Paiement reçu, Nouvel abonné, Commentaire, Avis reçu, Retrait traité [B]
•	Paramétrage des notifications (activé/désactivé par type) [B]
•	Suppression de notifications (swipe) [B]
•	Historique conservé 30 jours [B]
________________________________________
4.4 Espace Suggestions/Plaintes [B]
Fonctionnalités :
•	Header : "Contactez-nous" [B]
•	Sélection du type : Dropdown (Suggestion, Plainte, Bug technique, Question, Autre) [B]
•	Champ Sujet : Titre court [B]
•	Champ Message : Textarea (2000 caractères max) [B]
•	Upload fichiers : Screenshots ou documents (max 5 fichiers, 10MB) [B]
•	Champ Email (pré-rempli, éditable) [B]
•	Checkbox "Recevoir une copie de ma demande" [B]
•	Bouton "Envoyer" [B]
•	Confirmation de l'envoi + Numéro de ticket [B]
•	FAQ / Base de connaissance accessible (liens rapides) [B]
•	Suivi des tickets précédents (historique) [B]
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
4.7 Abonnement Premium [B]
Fonctionnalités :
•	Landing page : [B]
o	Comparatif tableau Gratuit vs Premium [B]
o	Avantages Premium : [B]
	Streaming sans publicité [B]
	Téléchargement illimité pour écoute hors-ligne [B]
	Accès anticipé aux nouveaux contenus [B]
	Réduction sur les réservations (ex : -10%) [B]
	Badge Premium sur le profil [B]
	Support prioritaire [B]
o	Prix : Mensuel / Annuel (avec économie affichée) [B]
•	Bouton CTA : "Essayer gratuitement 7 jours" ou "S'abonner" [B]
•	Processus de paiement : Intégration App Store / Google Play / Stripe [B]
•	Gestion : [B]
o	Annuler l'abonnement (actif jusqu'à la fin de la période payée) [B]
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
1.	Chaque interface doit inclure la gestion des états (chargement, erreur, vide)
2.	Toutes les actions utilisateur doivent avoir un feedback visuel (loaders, animations, messages toast)
3.	L'accessibilité (contraste, taille de texte, navigation vocale) doit être intégrée dès le design
4.	Les performances (lazy loading, cache, compression images) sont critiques pour l'UX mobile


