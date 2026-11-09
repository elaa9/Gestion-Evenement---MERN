# EventHub – Plateforme MERN de Gestion et Découverte d'Événements

> Projet Académique – **Module MERN Décalé**  
> **Institution :** École Polytechnique de Sousse  
> **Enseignant :** Dr. Abdelweheb GUEDDES  
> **Filière :** 5ème Année Génie Logiciel (5GL)  

---

## 📌 1. Présentation du Projet & Objectifs

**EventHub** est une application web full-stack basée sur la pile **MERN** (MongoDB, Express.js, React 18, Node.js), conçue pour la découverte d'événements, la gestion de leur cycle de vie et l'évaluation communautaire par les participants.

### Objectifs Principaux :
* **Découverte Publique (Mode Visiteur)** : Consultation libre du catalogue, recherche textuelle en temps réel, filtrage par 7 catégories thématiques, tri chronologique et consultation détaillée des événements sans obligation de création de compte.
* **Gestion pour Organisateurs (Event Organizer)** : Création d'événements avec dates, horaires, affiches et lieux, modification et suppression de ses propres événements via un espace personnel dédié (*My Events*).
* **Système d'Avis & Évaluations Cumulatives** : Notation de 1 à 5 étoiles et commentaires par les participants connectés, avec calcul automatique en temps réel de la note moyenne et règle stricte d'**un avis unique par utilisateur par événement** (mise à jour cumulative).
* **Console d'Administration & Modération** : Tableau de bord dédié pour l'administrateur avec statistiques globales en temps réel, répartition par catégories, liste des événements les mieux notés, et modération complète (suppression de tout événement ou avis inapproprié).

---

## 🛠️ 2. Stack Technique

### Frontend (Client)
* **React 18** : Composants fonctionnels et hooks standards (`useState`, `useEffect`, `useContext`, `useSearchParams`).
* **Redux Toolkit & React-Redux** : Gestion d'état global centralisée (`configureStore`, `createSlice`, `createAsyncThunk`) structurée en 4 slices : `authSlice`, `eventsSlice`, `feedbackSlice` et `adminSlice`.
* **Vite** : Outil de build moderne, rapide et optimisé pour la production.
* **Axios** : Client HTTP avec intercepteur de requêtes pour l'injection automatique du token JWT (`Authorization: Bearer <token>`) et intercepteur de réponses pour la gestion globale des erreurs `401 Unauthorized`.
* **React Router DOM v6** : Routage côté client avec protection d'accès (`ProtectedRoute`) et séparation stricte des layouts (Sidebar administrateur persistante vs Navbar visiteur).
* **Tailwind CSS v3** : Design responsive moderne avec charte graphique harmonisée (Indigo `#5B4BDB`, Marine `#172033`, Ardoise `#F8FAFC`).
* **Lucide React** : Bibliothèque d'icônes vectorielles légères et cohérentes.

### Backend (Serveur)
* **Node.js** : Environnement d'exécution JavaScript côté serveur.
* **Express.js** : Framework REST API structuré selon le patron Contrôleur-Modèle-Route.
* **MongoDB & Mongoose ODM** : Base de données NoSQL orientée documents, schémas typés avec validations strictes, clés étrangères `ObjectId` et relations avec `.populate()`.
* **JSON Web Token (JWT)** : Authentification sécurisée et sans état (stateless).
* **bcryptjs** : Hachage sécurisé et salé des mots de passe.
* **CORS & Dotenv** : Gestion des origines autorisées et des variables d'environnement confidentielles.

---

## 🗄️ 3. Modélisation de la Base de Données (Mongoose ODM)

EventHub applique des relations **One-to-Many (1:N)** grâce aux références `ObjectId` Mongoose :

```text
+--------------------+            1 : N            +---------------------+
|        User        | --------------------------> |        Event        |
|--------------------|                             |---------------------|
| _id                |                             | _id                 |
| name               |                             | title               |
| email (unique)     |                             | description         |
| password (haché)   |                             | category            |
| role (enum)        |                             | date                |
| createdAt          |                             | location            |
+--------------------+                             | imageUrl            |
       |       |                                   | author (Ref: User)  |
       |       |                                   | createdAt           |
       |       |                                   +---------------------+
       |       |                                              |
       |       +-------------------+                          | 1 : N
       |                           |                          |
       | 1 : N                     v                          v
       |                     +-----------------------------------+
       |                     |             Feedback              |
       +-------------------> |-----------------------------------|
                             | _id                               |
                             | message                           |
                             | rating (1..5)                     |
                             | event (Ref: Event)                |
                             | author (Ref: User)                |
                             | createdAt                         |
                             +-----------------------------------+
```

### Règles Métier & Intégrité Référentielle :
1. **User ➔ Event (1:N)** : Un utilisateur de rôle `organizer` ou `admin` peut créer un ou plusieurs événements. Le champ `author` référence la collection `User`.
2. **Event ➔ Feedback (Unicité Cumulative)** : Chaque participant ne peut soumettre qu'**un seul avis par événement**. Un index composé unique Mongoose garantit l'intégrité au niveau de la base :
   ```javascript
   feedbackSchema.index({ event: 1, author: 1 }, { unique: true });
   ```
   Si l'utilisateur note à nouveau le même événement, son avis existant est mis à jour (upsert) sans créer de doublon.
3. **Suppression en Cascade** : Lors de la suppression d'un événement par son propriétaire ou par l'administrateur, tous les avis liés sont automatiquement purgés :
   ```javascript
   await Feedback.deleteMany({ event: event._id });
   ```

---

## 👥 4. Gestion des Rôles & Niveaux d'Accès

Conformément aux directives du Cahier des Charges, la plateforme distingue strictement 3 rôles :

| Rôle | Niveau d'accès | Droits & Fonctionnalités |
|---|---|---|
| **👁️ Visiteur** | Public (Non authentifié) | • Consultation libre du catalogue d'événements.<br>• Recherche textuelle, filtres par catégorie, tri.<br>• Consultation des détails et lecture des avis.<br>• Formulaires de création et d'avis verrouillés avec invitation à la connexion. |
| **🎪 Event Organizer** | Authentifié (`role: 'organizer'`) | • Toutes les fonctionnalités du Visiteur.<br>• Publication de nouveaux événements.<br>• Espace personnel *My Events* : modification et suppression de ses propres événements.<br>• Soumission ou modification de sa note/avis sur n'importe quel événement. |
| **👑 Admin** | Authentifié (`role: 'admin'`) | • Interface exclusive avec Sidebar d'administration dédiée.<br>• Dashboard analytique complet : indicateurs clés, répartition par catégories, meilleurs événements.<br>• Modération globale : modification ou suppression de **n'importe quel événement** sur la plateforme.<br>• Modération des avis : suppression immédiate de tout commentaire inapproprié ou spam.<br>• Publication d'événements officiels. |

### Comptes de Démonstration pour l'Évaluation :

| Profil | Nom d'utilisateur | Adresse Email | Mot de passe | Rôle |
|---|---|---|---|---|
| **Administrateur** | Admin EventHub | `admin@eventhub.com` | `admin123` | `admin` |
| **Organisateur 1** | Sarah Chen | `sarah@eventhub.com` | `password123` | `organizer` |
| **Organisateur 2** | Alex Morgan | `alex@eventhub.com` | `password123` | `organizer` |
| **Organisateur 3** | Karim Ben Salem | `karim@eventhub.com` | `password123` | `organizer` |

---

## 📡 5. Spécification des Endpoints de l'API REST

### Authentification (`/api/auth`)
* `POST /api/auth/register` : Inscription d'un nouvel organisateur (mot de passe haché par bcrypt).
* `POST /api/auth/login` : Connexion, vérification des identifiants et émission du JWT.
* `GET /api/auth/me` : Vérification du token et récupération du profil connecté *(Protégé)*.
* `PUT /api/auth/profile` : Mise à jour du nom de profil *(Protégé)*.

### Événements (`/api/events`)
* `GET /api/events` : Récupération filtrée et triée des événements *(Public)*.
* `GET /api/events/:id` : Détails d'un événement avec population de l'auteur et des avis *(Public)*.
* `POST /api/events` : Création d'un événement *(Protégé : Organizer ou Admin)*.
* `PUT /api/events/:id` : Modification d'un événement *(Protégé : Propriétaire ou Admin)*.
* `DELETE /api/events/:id` : Suppression de l'événement et cascade delete des avis *(Protégé : Propriétaire ou Admin)*.
* `GET /api/events/user/my-events` : Récupération des événements de l'organisateur connecté *(Protégé)*.

### Avis & Évaluations (`/api/feedback`)
* `GET /api/feedback/event/:eventId` : Liste des avis liés à un événement *(Public)*.
* `POST /api/feedback/event/:eventId` : Publication ou mise à jour cumulative de l'avis *(Protégé)*.
* `DELETE /api/feedback/:id` : Suppression d'un avis *(Protégé : Auteur ou Admin)*.

### Administration (`/api/admin`)
* `GET /api/admin/stats` : Statistiques consolidées, indicateurs KPIs, répartition par catégories et flux des avis récents *(Protégé : Admin uniquement)*.

---

## 📂 6. Arborescence du Projet

```text
Gestion events/
├── .gitignore                     # Exclusion stricte des .env, node_modules et builds
├── README.md                      # Documentation technique complète
├── client/                        # Application Frontend React 18 + Vite
│   ├── .env.example               # Modèle des variables client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx                # Routage et séparation AdminLayout / PublicLayout
│       ├── main.jsx               # Point d'entrée avec Provider Redux
│       ├── index.css              # Directives Tailwind CSS
│       ├── components/            # Composants réutilisables
│       │   ├── Navbar.jsx         # Barre de navigation publique
│       │   ├── AdminSidebar.jsx   # Barre latérale persistante pour l'administrateur
│       │   ├── EventCard.jsx      # Carte d'affichage d'un événement
│       │   ├── EventForm.jsx      # Formulaire réutilisable (Création / Édition)
│       │   ├── FeedbackForm.jsx   # Formulaire de notation (1-5 étoiles)
│       │   ├── FeedbackList.jsx   # Liste des retours d'expérience
│       │   ├── SearchBar.jsx      # Filtres de recherche, catégories et tri
│       │   ├── ProtectedRoute.jsx # Garde d'authentification pour les routes privées
│       │   ├── ErrorBoundary.jsx  # Sécurité contre les erreurs d'exécution React
│       │   └── LoadingSpinner.jsx # Indicateur de chargement animé
│       ├── context/
│       │   └── AuthContext.jsx    # Passerelle d'authentification connectée à Redux
│       ├── redux/                 # Store Redux Toolkit & Slices
│       │   ├── store.js           # Configuration centrale du store
│       │   ├── authSlice.js       # Gestion de session, token et profil
│       │   ├── eventsSlice.js     # Gestion des événements et thunks asynchrones
│       │   ├── feedbackSlice.js   # Gestion des avis et notes cumulatives
│       │   └── adminSlice.js      # Gestion des statistiques administrateur
│       ├── pages/                 # Vues principales de l'application
│       │   ├── Home.jsx           # Accueil avec bannières, recherche et catégories
│       │   ├── Events.jsx         # Catalogue complet des événements
│       │   ├── EventDetails.jsx   # Fiche détaillée, affichage et dépôt d'avis
│       │   ├── CreateEvent.jsx    # Publication d'un nouvel événement
│       │   ├── EditEvent.jsx      # Modification d'un événement existant
│       │   ├── MyEvents.jsx       # Espace de gestion de l'organisateur
│       │   ├── AdminDashboard.jsx # Console d'administration et modération
│       │   ├── Profile.jsx        # Profil utilisateur et badges de rôles
│       │   ├── Login.jsx          # Connexion avec comptes démo 1-clic
│       │   ├── Register.jsx       # Inscription en tant qu'organisateur
│       │   └── NotFound.jsx       # Page 404
│       └── services/              # Couche d'accès aux données (Axios)
│           ├── api.js             # Instance Axios avec intercepteur JWT
│           ├── authService.js
│           ├── eventService.js
│           ├── feedbackService.js
│           └── adminService.js
└── server/                        # API Backend Express & MongoDB
    ├── .env.example               # Modèle des variables serveur
    ├── package.json
    ├── server.js                  # Point d'entrée de l'API Express
    ├── seeder.js                  # Script d'injection des données de test
    ├── config/
    │   └── db.js                  # Connexion Mongoose à MongoDB Atlas
    ├── controllers/               # Logique métier
    │   ├── authController.js
    │   ├── eventController.js
    │   ├── feedbackController.js
    │   └── adminController.js
    ├── middleware/                # Filtres intermédiaires
    │   ├── authMiddleware.js      # Vérification du token JWT et rôle admin
    │   └── errorMiddleware.js     # Capture et formatage des erreurs HTTP
    ├── models/                    # Schémas Mongoose
    │   ├── User.js
    │   ├── Event.js
    │   └── Feedback.js
    └── routes/                    # Définition des routes Express
        ├── authRoutes.js
        ├── eventRoutes.js
        ├── feedbackRoutes.js
        └── adminRoutes.js
```

---

## 🚀 7. Installation & Démarrage en Local

### Prérequis
* **Node.js** (version 18+ ou 20+)
* **MongoDB** (Instance locale ou cluster distant MongoDB Atlas)

### Étape 1 : Configuration des Variables d'Environnement

Créez le fichier `server/.env` :
```env
PORT=5000
MONGO_URI=mongodb+srv://<votre_utilisateur>:<mot_de_passe>@cluster0.mongodb.net/eventhub?retryWrites=true&w=majority
JWT_SECRET=eventhub_secret_key_2026_academic
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Créez le fichier `client/.env` :
```env
VITE_API_URL=http://localhost:5000/api
```

### Étape 2 : Installation des Dépendances

```bash
# Installation des packages du Backend
cd server
npm install

# Installation des packages du Frontend
cd ../client
npm install
```

### Étape 3 : Initialisation des Données de Démonstration (Seeder)

```bash
cd server
npm run seed
```
> Cette commande initialise la base de données avec 1 compte administrateur, 4 comptes organisateurs, 12 événements variés et les avis associés.

### Étape 4 : Lancement des Serveurs de Développement

Ouvrez deux terminaux séparés :

**Terminal 1 (Backend API) :**
```bash
cd server
npm run dev
# L'API s'exécute sur http://localhost:5000
```

**Terminal 2 (Frontend Client) :**
```bash
cd client
npm run dev
# L'interface s'exécute sur http://localhost:5173
```

---

## 🌐 8. Guide de Déploiement en Production

### 1. Base de Données : MongoDB Atlas
1. Créez un cluster gratuit **M0 Sandbox** sur [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Dans **Database Access**, créez un utilisateur administrateur avec droits lecture/écriture.
3. Dans **Network Access**, ajoutez l'adresse IP `0.0.0.0/0` pour autoriser les requêtes cloud de Render.
4. Récupérez la chaîne de connexion URI.

### 2. Backend API : Render.com
1. Créez un nouveau **Web Service** connecté à votre dépôt GitHub.
2. Paramétrez les champs :
   * **Root Directory** : `server`
   * **Build Command** : `npm install`
   * **Start Command** : `node server.js`
3. Renseignez les variables d'environnement dans l'onglet **Environment** :
   * `MONGO_URI` : votre chaîne MongoDB Atlas
   * `JWT_SECRET` : votre clé secrète JWT
   * `NODE_ENV` : `production`
   * `CLIENT_URL` : URL de votre frontend Vercel

### 3. Frontend : Vercel.com
1. Importez votre dépôt GitHub sur **Vercel**.
2. Paramétrez les options :
   * **Root Directory** : `client`
   * **Framework Preset** : `Vite`
3. Ajoutez la variable d'environnement :
   * `VITE_API_URL` : `https://votre-api-render.onrender.com/api`
4. Lancez le déploiement. L'application est servie en HTTPS avec rechargement instantané.

---

## 📋 9. Livrables Conformes pour la Soutenance

| N° | Livrable Attendu | Statut / Lien |
|:---:|---|---|
| **1** | **Dépôt GitHub** | Code source complet (`client/` et `server/`), `.gitignore` strict (aucun `.env`), `README.md` détaillé en français. |
| **2** | **Front-End en Ligne (Vercel)** | Application déployée en HTTPS, accessible publiquement. |
| **3** | **API Back-End en Ligne (Render)** | API Express connectée à MongoDB Atlas répondant aux requêtes REST. |
| **4** | **Rapport Synthétique** | Document de 5 à 8 pages comprenant la présentation, les schémas Mongoose, les rôles et les captures d'écran. |
