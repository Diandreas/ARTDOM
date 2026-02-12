ARTDOM - SPÉCIFICATIONS DÉTAILLÉES PAR INTERFACE
Date : 15 janvier 2026
Version : 1.0
________________________________________
1. AUTHENTIFICATION & ONBOARDING
1.1 Splash Screen
Fonctionnalités :
•	Animation du logo ARTDOM (2-3 secondes)
•	Affichage du slogan "Artistes d'émotions, messagers de cœurs"
•	Vérification automatique de la session utilisateur
•	Redirection vers Home si connecté, sinon vers Onboarding
________________________________________
1.2 Onboarding Slides (Carrousel x3)
Fonctionnalités :
•	Slide 1 : "Trouvez un artiste local" + Illustration
•	Slide 2 : "Vivez une émotion unique" + Illustration
•	Slide 3 : "Soutenez les talents" + Illustration
•	Bouton "Passer" en haut à droite
•	Indicateurs de progression (dots)
•	Bouton CTA final "Commencer"
•	Sauvegarde de la préférence (ne plus afficher)
________________________________________
1.3 Choix du Profil
Fonctionnalités :
•	Écran scindé verticalement
•	Bouton gauche : "Je suis Client" + Icône utilisateur
•	Bouton droit : "Je suis Artiste" + Icône micro/palette
•	Lien "J'ai déjà un compte" en bas
•	Stockage du type de profil sélectionné
________________________________________
1.4 Inscription Client
Fonctionnalités :
•	Champs obligatoires : Nom, Prénom, Email, Téléphone, Mot de passe, Confirmation mot de passe
•	Champs optionnels : Photo de profil, Ville
•	Validation en temps réel (email valide, mot de passe fort 8+ caractères)
•	Checkbox "J'accepte les CGU"
•	Social Login : Boutons Google, Facebook, Apple
•	Envoi d'email de vérification
•	Redirection vers Onboarding Client après inscription
________________________________________
1.5 Inscription Artiste
Fonctionnalités :
•	Section Identité : Nom de scène, Nom/Prénom, Email, Téléphone, CNI/Passeport
•	Section Artistique : Catégorie principale (Chanteur, Danseur, Peintre, etc.), Bio courte (200 caractères max)
•	Portfolio : Upload 3-5 photos/vidéos de travail
•	Vérification d'identité : Upload recto/verso CNI
•	Tarification initiale : Tarif horaire de base
•	Checkbox "Je certifie être professionnel/en formation"
•	Statut "En attente de validation" après soumission
•	Notification admin pour validation manuelle
________________________________________
1.6 Connexion
Fonctionnalités :
•	Champ Email ou Téléphone
•	Champ Mot de passe avec toggle "Afficher/Masquer"
•	Checkbox "Se souvenir de moi"
•	Lien "Mot de passe oublié ?"
•	Bouton "Se connecter"
•	Social Login : Google, Facebook, Apple
•	Gestion des erreurs (compte inexistant, mot de passe incorrect)
•	Redirection vers dashboard respectif (Client/Artiste)
________________________________________
1.7 Mot de passe oublié
Fonctionnalités :
•	Saisie de l'email ou téléphone
•	Envoi de code OTP (6 chiffres) par SMS/Email
•	Écran de saisie du code OTP avec timer (5 min)
•	Bouton "Renvoyer le code" après expiration
•	Écran de réinitialisation : Nouveau mot de passe + Confirmation
•	Validation et retour à la connexion
________________________________________
2. MODULE CLIENT
A. DÉCOUVERTE & RECHERCHE
2.1 Accueil (Home)
Fonctionnalités :
•	Header : Logo, icône Notifications, icône Recherche
•	Section Stories : Carrousel horizontal de stories artistes (24h)
•	Section "À la une" : Bannière promotionnelle (concerts, nouveautés)
•	Section "Catégories" : Grille cliquable (Chant, Danse, Peinture, Théâtre, etc.)
•	Section "Artistes tendances" : Carrousel horizontal de cartes artistes (Photo, Nom, Note, Prix indicatif)
•	Section "Nouveautés musique" : Carrousel d'albums récents
•	Section "Tutos populaires" : Carrousel de vignettes vidéos
•	Bottom Navigation : Home, Recherche, ArtStream, Messagerie, Profil
•	Pull-to-refresh pour actualiser le feed
•	Tracking des clics pour analytics
________________________________________
2.2 Recherche Avancée
Fonctionnalités :
•	Barre de recherche : Auto-complétion sur noms d'artistes, catégories
•	Filtres déroulants : 
o	Ville/Localisation (géolocalisation + saisie manuelle)
o	Type d'événement (Anniversaire, Mariage, Baptême, Funérailles, Diplôme, Autre)
o	Catégorie artistique (multi-sélection)
o	Budget (slider min-max)
o	Note minimale (1-5 étoiles)
o	Disponibilité (Date précise)
•	Bouton "Appliquer les filtres"
•	Compteur de résultats
•	Sauvegarde des recherches récentes
________________________________________
2.3 Résultats de Recherche
Fonctionnalités :
•	Vue Liste (par défaut) : 
o	Carte artiste : Photo, Nom, Catégorie, Note, Prix à partir de, Distance, Bouton "Voir profil"
o	Tri : Pertinence, Note, Prix croissant/décroissant, Proximité
•	Vue Carte (Map) : 
o	Google Maps / Mapbox avec pins artistes
o	Clic sur pin → Mini-carte artiste
•	Toggle Vue Liste/Carte en haut
•	Pagination ou scroll infini
•	Bouton "Affiner" pour retour aux filtres
•	Aucun résultat → Message + Suggestions d'artistes populaires
________________________________________
B. PROFIL ARTISTE & RÉSERVATION
2.4 Profil Public Artiste
Fonctionnalités :
•	Header : Photo de couverture, Photo de profil, Nom de scène, Badge vérifié
•	Section Infos : Catégorie, Ville, Note moyenne (★), Nombre d'avis, Prix de base
•	Boutons d'action : "Réserver", "Suivre", "Partager", "Signaler"
•	Section Bio : Description de l'artiste (extensible)
•	Galerie Photos/Vidéos : Carrousel média
•	Section Albums : Liste des albums disponibles (streaming + achat)
•	Section Prestations : Liste des services proposés (Chanson personnalisée, Spectacle, Cours, etc.)
•	Section Avis : Liste des commentaires clients avec notes (pagination)
•	Section "Artistes similaires" : Suggestions
•	Compteur de vues du profil (visible artiste uniquement)
•	Chat direct avec l'artiste (bouton flottant)
________________________________________
2.5 Détail Prestation
Fonctionnalités :
•	Titre de la prestation (ex : "Chanson d'anniversaire personnalisée")
•	Description détaillée (déroulement, durée, inclus/non inclus)
•	Prix (fixe ou à partir de)
•	Photos/Vidéos exemples
•	Délai de préparation (ex : 48h de prévenance minimum)
•	Options supplémentaires (ex : Vidéo HD +10€)
•	Bouton "Réserver maintenant"
•	Section FAQ spécifique à la prestation
•	Avis liés à cette prestation uniquement
________________________________________
2.6 Calendrier de Disponibilité
Fonctionnalités :
•	Vue Calendrier mensuel : Jours disponibles en vert, indisponibles en gris
•	Sélection de date (clic sur jour disponible)
•	Vue Créneaux horaires : Liste des plages disponibles ce jour-là
•	Sélection d'heure de début + durée estimée
•	Calcul automatique du prix selon durée
•	Indication de la popularité (ex : "Seulement 2 créneaux restants")
•	Bouton "Suivant" vers Personnalisation
________________________________________
2.7 Personnalisation Émotion
Fonctionnalités :
•	Champ "Prénom du destinataire"
•	Champ "Relation" (dropdown : Ami, Conjoint, Parent, Enfant, Collègue)
•	Type d'émotion (dropdown : Joie, Amour, Soutien, Hommage, Fierté)
•	Message personnel (textarea 500 caractères max) : Instructions pour l'artiste
•	Upload fichier (optionnel) : Photo/document à intégrer dans la prestation
•	Lieu de prestation : À domicile (adresse) / En ligne (lien généré) / Lieu public (à préciser)
•	Bouton "Ajouter au panier" ou "Commander"
•	Prévisualisation du récapitulatif
________________________________________
2.8 Panier / Récapitulatif
Fonctionnalités :
•	Liste des prestations ajoutées (modifiable quantité, suppression)
•	Détail par item : Artiste, Prestation, Date/Heure, Prix unitaire
•	Section Coupons : Champ code promo + Bouton "Appliquer"
•	Récapitulatif financier : 
o	Sous-total
o	Frais de service ARTDOM (%)
o	Réduction éventuelle
o	Total TTC
•	Bouton "Procéder au paiement"
•	Option "Sauvegarder pour plus tard"
________________________________________
2.9 Paiement
Fonctionnalités :
•	Choix du moyen de paiement : 
o	Mobile Money (Orange Money, MTN Money, etc.) → Saisie numéro
o	Carte bancaire → Intégration Stripe/Paystack (champs CB sécurisés)
o	PayPal → Redirection
o	Virement bancaire → Affichage IBAN + Référence unique
•	Sauvegarde des moyens de paiement (tokenisation)
•	Checkbox "Utiliser ce moyen par défaut"
•	Validation 3D Secure si applicable
•	Bouton "Payer [Montant]"
•	Indicateur de chargement + Sécurité (icône cadenas)
•	Gestion des erreurs (paiement refusé, timeout)
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
2.11 Hub Musique
Fonctionnalités :
•	Header : Logo ArtStream, icône Recherche musicale, icône Bibliothèque
•	Section "Nouveautés" : Carrousel d'albums/singles récents
•	Section "Top Artistes" : Classement des artistes les plus écoutés (semaine/mois)
•	Section "Genres" : Grille de catégories (Afrobeat, Hip-Hop, Gospel, Jazz, etc.)
•	Section "Playlists ARTDOM" : Playlists éditoriales (ex : "Talents émergents")
•	Section "Recommandé pour vous" : Algorithme basé sur l'historique d'écoute
•	Bottom Player : Lecteur mini persistant
•	Accès au mode hors-ligne (si abonnement Premium)
________________________________________
2.12 Vue Album/Playlist
Fonctionnalités :
•	Header : Cover, Titre album/playlist, Nom artiste, Année, Nombre de pistes
•	Bouton "Lire" (lecture aléatoire ou séquentielle)
•	Bouton "Ajouter à Ma Bibliothèque"
•	Bouton "Partager"
•	Bouton "Acheter l'album" (prix affiché)
•	Liste des pistes : 
o	Numéro, Titre, Durée
o	Icône "Lecture" au survol/clic
o	Icône "..." (menu : Ajouter à playlist, Télécharger si acheté)
•	Nombre d'écoutes total de l'album
•	Lien vers le profil de l'artiste
________________________________________
2.13 Lecteur Audio (Full Screen)
Fonctionnalités :
•	Cover animé (rotation ou visualiseur d'ondes)
•	Titre de la chanson + Nom de l'artiste (cliquables)
•	Contrôles : 
o	Bouton "Précédent"
o	Bouton "Play/Pause" (centré, large)
o	Bouton "Suivant"
o	Barre de progression (draggable)
o	Timer (temps écoulé / durée totale)
•	Actions secondaires : 
o	Bouton "J'aime" (cœur)
o	Bouton "Ajouter à playlist"
o	Bouton "Partager"
o	Bouton "Acheter l'album" (si non acheté)
•	Paroles : Toggle pour afficher les lyrics synchronisés (si disponibles)
•	Mode répétition (1x, répéter, aléatoire)
•	File d'attente (liste des prochaines pistes)
•	Gestion du volume
________________________________________
2.14 Lecteur Audio (Mini)
Fonctionnalités :
•	Barre persistante en bas de l'écran (toutes les pages)
•	Cover miniature + Titre + Artiste (texte défilant si long)
•	Bouton "Play/Pause"
•	Bouton "Suivant"
•	Clic sur la barre → Ouverture du lecteur Full Screen
•	Fermeture (icône "X") → Arrêt de la lecture
________________________________________
D. ARTTUBE & CLASSROOM
2.15 Hub Vidéo/Tutos
Fonctionnalités :
•	Header : Logo ArtTube, icône Recherche, icône Abonnements
•	Section "Tendances" : Feed vertical type YouTube (vignettes vidéos)
•	Vignette vidéo : Thumbnail, Titre, Nom artiste, Vues, Date de publication, Durée
•	Section "Abonnements" : Feed des artistes suivis
•	Section "Catégories" : Tutos Danse, Tutos Chant, Tutos Peinture, etc.
•	Section "Formations payantes" : Teaser des Classrooms disponibles
•	Filtres : Récent, Populaire, Durée
•	Auto-play des vidéos en mode muet au scroll (désactivable)
________________________________________
2.16 Lecteur Vidéo
Fonctionnalités :
•	Player vidéo : Contrôles lecture, pause, volume, plein écran, qualité (360p-1080p)
•	Barre de progression avec chapitres (si définis)
•	Informations : Titre, Nom artiste, Vues, Date, Bouton "S'abonner", Bouton "J'aime/Je n'aime pas"
•	Description : Texte extensible + Liens
•	Bouton "Réserver cet artiste" (redirection vers profil)
•	Section Commentaires : 
o	Tri : Les plus récents, Les plus pertinents
o	Champ de saisie commentaire
o	Réponses aux commentaires (thread)
o	Signalement de commentaires
•	Vidéos suggérées : Liste à droite ou en dessous
•	Partage (lien direct, réseaux sociaux)
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
2.20 Mes Réservations
Fonctionnalités :
•	Onglets : "À venir", "Passées", "Annulées"
•	Carte réservation : 
o	Photo artiste
o	Nom artiste + Prestation
o	Date/Heure
o	Statut (Confirmée, En attente, Terminée, Annulée)
o	Bouton "Voir les détails"
o	Badge notification si nouveau message de l'artiste
•	Filtre par date, par artiste
•	Recherche par numéro de réservation
•	Aucune réservation → Message + CTA "Découvrir les artistes"
________________________________________
2.21 Détail Réservation
Fonctionnalités :
•	Section Statut : Timeline visuelle (Confirmée → En cours → Terminée)
•	Informations complètes : 
o	Numéro de réservation
o	Artiste (photo, nom, lien profil)
o	Prestation
o	Date/Heure/Lieu
o	Prix payé
o	Personnalisation (message, destinataire)
•	QR Code : Affichage pour scan le jour J
•	Boutons d'action selon statut : 
o	"Contacter l'artiste" (chat direct)
o	"Modifier" (si > 48h avant)
o	"Annuler" (politique d'annulation affichée)
o	"Noter et commenter" (si terminée)
o	"Télécharger reçu"
•	Section Messages : Historique du chat avec l'artiste
•	Countdown avant l'événement (si à venir)
________________________________________
2.22 Ma Bibliothèque
Fonctionnalités :
•	Onglets : "Albums achetés", "Cours en cours", "Playlists", "Téléchargements"
•	Albums achetés : 
o	Grille de covers
o	Bouton "Lire" direct
o	Bouton "Télécharger" (si pas encore fait)
o	Statut du téléchargement
•	Cours en cours : 
o	Liste des formations achetées
o	Barre de progression (% complété)
o	Bouton "Continuer"
o	Date de dernière activité
•	Playlists : 
o	Mes playlists créées
o	Bouton "Créer une nouvelle playlist"
o	Gestion (renommer, supprimer)
•	Mode hors-ligne activable (télécharger pour écoute/visionnage offline)
________________________________________
3. MODULE ARTISTE
A. GESTION DE CARRIÈRE
3.1 Dashboard Artiste
Fonctionnalités :
•	Header : Photo de profil, Nom de scène, Badge statut compte (Vérifié/En attente)
•	Section Revenus : 
o	Revenus du mois en cours (graphique courbe)
o	Comparaison vs mois précédent (%)
o	Bouton "Voir détails" → Wallet
•	Section Activité : 
o	Prochaine prestation (date, client, lieu)
o	Nombre de nouvelles réservations (badge notif)
o	Nombre de nouveaux abonnés (cette semaine)
o	Nombre d'écoutes de vos morceaux (cette semaine)
o	Nombre de vues de vos vidéos (cette semaine)
•	Section Notifications : 3 dernières notifs importantes
•	Raccourcis rapides : 
o	"Gérer mon agenda"
o	"Uploader un contenu"
o	"Voir mes stats"
•	Section "À faire" : Checklist (ex : "Compléter votre bio", "Ajouter une vidéo de présentation")
________________________________________
3.2 Gestion Profil
Fonctionnalités :
•	Section Photo : Upload/Modification photo de profil et de couverture (crop intégré)
•	Section Infos personnelles : Nom de scène, Bio (1000 caractères), Ville, Catégories (multi-sélection)
•	Section Réseaux sociaux : Liens Instagram, Facebook, YouTube, etc.
•	Section Tarifs : 
o	Tarif horaire de base
o	Liste des prestations personnalisées (éditable)
o	Bouton "Ajouter une prestation"
•	Galerie : Upload/Suppression de photos et vidéos du portfolio
•	Section Certifications : Upload de diplômes/certificats (visible sur profil public)
•	Bouton "Prévisualiser mon profil" (vue client)
•	Bouton "Publier les modifications"
•	Tracking des vues du profil (analytics basiques)
________________________________________
3.3 Gestion Agenda
Fonctionnalités :
•	Vue Calendrier mensuel : Visualisation des créneaux réservés (bleu), disponibles (vert), bloqués (rouge)
•	Ajout de disponibilité : 
o	Clic sur un jour → Sélection de plages horaires
o	Option "Répéter" (tous les lundis, par exemple)
•	Blocage de créneaux : 
o	Sélection de dates/heures à rendre indisponibles
o	Raison (optionnel) : "Vacances", "Événement personnel", etc.
•	Synchronisation : Import/Export vers Google Calendar, Outlook
•	Notifications : Rappels 24h/1h avant chaque prestation
•	Vue liste : Liste chronologique des prochaines prestations
________________________________________
3.4 Gestion des Services
Fonctionnalités :
•	Liste des prestations proposées (tableau)
•	Colonnes : Nom service, Prix, Durée, Statut (Actif/Inactif), Actions
•	Bouton "Ajouter un service" : 
o	Formulaire : Titre, Description, Catégorie, Prix (fixe ou à partir de), Durée estimée, Délai de prévenance
o	Upload de photos/vidéos exemples
o	Options supplémentaires (ex : Vidéo HD +10€)
o	Disponibilité (en ligne/à domicile/lieu public)
•	Actions : Éditer, Dupliquer, Désactiver, Supprimer
•	Réorganisation par drag-and-drop (ordre d'affichage sur le profil)
________________________________________
B. GESTION DES VENTES & CONTENUS
3.5 Upload Manager
Fonctionnalités :
•	Onglets : "Albums", "Vidéos/Tutos", "Cours (Classroom)"
•	Upload Album : 
o	Titre album, Année, Genre, Cover (upload)
o	Upload multiple de pistes (MP3) + métadonnées (titre, durée)
o	Prix de vente (album entier ou par piste)
o	Option "Disponible en streaming gratuit" (oui/non)
•	Upload Vidéo/Tuto : 
o	Titre, Description, Catégorie, Tags
o	Upload vidéo (MP4, MOV) avec barre de progression
o	Thumbnail personnalisé (upload ou sélection d'un frame)
o	Visibilité : Public/Abonnés uniquement/Privé
•	Upload Cours : 
o	Titre cours, Prix, Niveau, Langue
o	Upload vidéo de trailer
o	Création de chapitres/leçons (voir 3.10)
•	Validation automatique (vérification copyright, qualité minimum)
•	Notification de publication (après validation si applicable)
________________________________________
3.6 Gestion Commandes
Fonctionnalités :
•	Onglets : "En attente", "Confirmées", "Terminées", "Annulées"
•	Carte commande : 
o	Numéro de commande
o	Client (nom, photo si partagée)
o	Prestation demandée
o	Date/Heure souhaitées
o	Montant
o	Message de personnalisation du client
o	Statut
•	Actions (pour "En attente") : 
o	Accepter → Confirmation automatique au client
o	Refuser → Popup raison (optionnel) + Remboursement auto
o	Négocier → Ouverture du chat pour discuter modifications
•	Actions (pour "Confirmées") : 
o	Voir les détails
o	Contacter le client
o	Annuler (conditions d'annulation vérifiées)
•	Filtre par date, par statut
•	Compteurs : X nouvelles demandes, X confirmées à venir
________________________________________
3.7 Suivi Prestation
Fonctionnalités :
•	Liste des prestations du jour ou de la semaine
•	Carte prestation active : 
o	Client, Lieu, Heure
o	Bouton "Check-in" (début de prestation) 
	GPS tracking (confirmation de présence sur lieu)
	Timer démarre automatiquement
o	Pendant la prestation : Timer affiché, option "Ajouter du temps"
o	Bouton "Check-out" (fin de prestation) 
	Confirmation de la durée finale
	Calcul du paiement si ajustement
	Demande de signature client (sur mobile, optionnel)
•	Historique des prestations avec durées réelles vs estimées
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
3.9 Wallet Artiste
Fonctionnalités :
•	Header : Solde total disponible (gros chiffre)
•	Bouton "Retirer des fonds" (actif si solde > seuil minimum)
•	Section Revenus : 
o	Graphique des revenus (jour/semaine/mois/année)
o	Filtres par source : Prestations, Ventes d'albums, Cours, Streaming
•	Historique des transactions : 
o	Tableau : Date, Type (Prestation/Vente/Cours), Client/Source, Montant brut, Commission ARTDOM, Net
o	Filtre par date, par type
o	Export CSV/PDF
o	Section "En attente" : Montants bloqués (prestations non encore effectuées)
o	Section Retraits : Historique des virements avec statuts (En cours, Complété)
________________________________________
3.10 Retrait des fonds
Fonctionnalités :
•	Affichage du solde retirable
•	Choix de la méthode : 
o	Virement bancaire (IBAN, BIC)
o	Mobile Money (numéro)
o	PayPal (email)
•	Sauvegarde des coordonnées bancaires (chiffrées)
•	Champ montant : Saisie ou bouton "Tout retirer"
•	Frais de retrait affichés (si applicable)
•	Montant net à recevoir
•	Délai de traitement indiqué (ex : 2-5 jours ouvrés)
•	Bouton "Demander le retrait"
•	Confirmation par email/SMS
•	Tracking du statut dans l'historique
________________________________________
4. FONCTIONNALITÉS TRANSVERSES
A. SOCIAL & COMMUNICATION
4.1 Messagerie (Liste)
Fonctionnalités :
•	Liste des conversations récentes (tri par date)
•	Carte conversation : 
o	Photo de l'interlocuteur (Client ou Artiste)
o	Nom
o	Dernier message (aperçu tronqué)
o	Timestamp
o	Badge notification si message non lu (nombre)
o	Statut en ligne (point vert)
•	Recherche de conversations (par nom)
•	Archivage de conversations (swipe)
•	Suppression de conversations
•	Aucune conversation → Message + CTA "Découvrir les artistes"
________________________________________
4.2 Chat Room
Fonctionnalités :
•	Header : Photo + Nom de l'interlocuteur, Statut en ligne, Bouton "Appel" (si activé), Menu (Bloquer, Signaler)
•	Zone de messages : 
o	Bulles différenciées (envoyé/reçu)
o	Affichage de l'heure d'envoi
o	Statut du message : Envoyé (√), Délivré (√√), Lu (√√ bleu)
o	Messages groupés par date
•	Champ de saisie : Textarea avec auto-expand
•	Boutons attachements : 
o	Icône photo (galerie)
o	Icône caméra (photo directe)
o	Icône micro (enregistrement vocal avec waveform)
o	Icône fichier (PDF, docs)
•	Fonctionnalités avancées : 
o	Réponse à un message spécifique (quote)
o	Réactions emoji
o	Suppression de message (pour soi ou pour tous si < 1h)
•	Messages vocaux : Lecture avec waveform + durée
•	Notifications push en temps réel
•	Typing indicator ("... est en train d'écrire")
________________________________________
4.3 Notifications
Fonctionnalités :
•	Header : Titre "Notifications", Bouton "Tout marquer comme lu"
•	Onglets : "Toutes", "Réservations", "Messages", "Activité"
•	Carte notification : 
o	Icône contextuelle (réservation, message, like, abonnement)
o	Texte de la notification
o	Timestamp
o	Badge "Non lu" (fond coloré)
o	Clic → Redirection vers l'écran concerné
•	Types de notifications : 
o	Pour Client : Confirmation réservation, Message artiste, Rappel événement, Nouveau contenu artiste suivi, Promotion
o	Pour Artiste : Nouvelle demande réservation, Paiement reçu, Nouvel abonné, Commentaire, Avis reçu, Retrait traité
•	Paramétrage des notifications (activé/désactivé par type)
•	Suppression de notifications (swipe)
•	Historique conservé 30 jours
________________________________________
4.4 Espace Suggestions/Plaintes
Fonctionnalités :
•	Header : "Contactez-nous"
•	Sélection du type : Dropdown (Suggestion, Plainte, Bug technique, Question, Autre)
•	Champ Sujet : Titre court
•	Champ Message : Textarea (2000 caractères max)
•	Upload fichiers : Screenshots ou documents (max 5 fichiers, 10MB)
•	Champ Email (pré-rempli, éditable)
•	Checkbox "Recevoir une copie de ma demande"
•	Bouton "Envoyer"
•	Confirmation de l'envoi + Numéro de ticket
•	FAQ / Base de connaissance accessible (liens rapides)
•	Suivi des tickets précédents (historique)
________________________________________
B. PARAMÈTRES
4.5 Réglages App
Fonctionnalités :
•	Section Apparence : 
o	Mode Clair/Sombre/Auto (système)
o	Taille de police (Petit/Moyen/Grand)
•	Section Langue : 
o	Liste des langues disponibles (Français, Anglais, etc.)
o	Redémarrage de l'app après changement
•	Section Notifications : 
o	Toggle global "Activer les notifications"
o	Par type : Réservations, Messages, Activité, Promotions (on/off individuellement)
o	Notification sonore (choix du son)
o	Vibration (on/off)
•	Section Confidentialité : 
o	Profil visible par (Tout le monde / Abonnés uniquement)
o	Afficher statut en ligne (on/off)
o	Localisation (Toujours / Pendant utilisation / Jamais)
•	Section Données : 
o	Téléchargement automatique vidéos (WiFi uniquement / Jamais)
o	Qualité de streaming (Auto / Faible / Moyenne / Haute)
o	Effacer le cache
•	Section À propos : 
o	Version de l'application
o	Conditions d'utilisation (lien)
o	Politique de confidentialité (lien)
o	Licences open source
________________________________________
4.6 Profil Utilisateur
Fonctionnalités :
•	Header : Photo de profil (éditable), Nom complet
•	Informations personnelles : 
o	Email (éditable, vérification requise)
o	Téléphone (éditable, vérification OTP)
o	Date de naissance
o	Genre (optionnel)
o	Ville
•	Section Sécurité : 
o	Modifier le mot de passe (ancien + nouveau)
o	Authentification à deux facteurs (activation/désactivation)
o	Appareils connectés (liste + déconnexion à distance)
•	Section Abonnement (si applicable) : 
o	Plan actuel (Gratuit/Premium)
o	Date de renouvellement
o	Bouton "Gérer l'abonnement" ou "Passer à Premium"
•	Section Compte : 
o	Désactiver temporairement mon compte (raisons, durée)
o	Supprimer définitivement mon compte (confirmation double, mot de passe requis, email de confirmation)
•	Bouton "Déconnexion"
________________________________________
4.7 Abonnement Premium
Fonctionnalités :
•	Landing page : 
o	Comparatif tableau Gratuit vs Premium
o	Avantages Premium : 
	Streaming sans publicité
	Téléchargement illimité pour écoute hors-ligne
	Accès anticipé aux nouveaux contenus
	Réduction sur les réservations (ex : -10%)
	Badge Premium sur le profil
	Support prioritaire
o	Prix : Mensuel / Annuel (avec économie affichée)
•	Bouton CTA : "Essayer gratuitement 7 jours" ou "S'abonner"
•	Processus de paiement : Intégration App Store / Google Play / Stripe
•	Gestion : 
o	Annuler l'abonnement (actif jusqu'à la fin de la période payée)
o	Changer de plan (mensuel ↔ annuel)
o	Historique des factures (téléchargement PDF)
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


