# 👫 Arathy - Application du quotidien

Application Angular avec Firebase pour gérer votre stock domestique et suivre vos événements importants.

## 🎯 Fonctionnalités

### 📦 Gestion du Stock
- Ajouter, modifier, supprimer des articles
- Gérer les quantités avec boutons +/-
- Alertes de stock faible
- Filtres par catégorie et recherche
- Statistiques en temps réel
- **Synchronisation en temps réel entre appareils**

### 📅 Calculateur de Dates
- Créer des événements avec dates
- Calculer le temps écoulé (années, mois, jours)
- Mode 1 période (date → aujourd'hui) ou 2 périodes (date → date)
- Cartes colorées et design moderne
- **Synchronisation en temps réel entre appareils**

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ installé (https://nodejs.org)
- Compte Firebase gratuit

### Étape 1 : Installer les dépendances

```bash
cd arathy
npm install
```

### Étape 2 : Configurer Firebase

#### 2.1 Créer le projet Firebase

1. Allez sur https://console.firebase.google.com
2. Cliquez sur "Ajouter un projet"
3. Nommez-le "arathy"
4. Désactivez Google Analytics (optionnel)
5. Cliquez sur "Créer le projet"

#### 2.2 Activer Firestore Database

1. Dans le menu, allez à "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez "Démarrer en mode test"
4. Sélectionnez "europe-west" (localisation)
5. Cliquez sur "Activer"

#### 2.3 Sécuriser les données

1. Allez dans l'onglet "Règles" de Firestore
2. Remplacez le contenu par :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /stock-items/{itemId} {
      allow read, write: if true;
    }
    match /date-events/{eventId} {
      allow read, write: if true;
    }
  }
}
```

3. Cliquez sur "Publier"

⚠️ **Note** : Ces règles permettent à quiconque ayant l'URL d'accéder aux données. C'est parfait pour un usage familial.

#### 2.4 Récupérer la configuration

1. Cliquez sur ⚙️ (Paramètres du projet)
2. Faites défiler jusqu'à "Vos applications"
3. Cliquez sur l'icône `</>` (Web)
4. Nommez l'app "arathy-web"
5. Ne cochez PAS Firebase Hosting
6. Cliquez sur "Enregistrer l'application"
7. Copiez les 6 lignes de `firebaseConfig`

#### 2.5 Insérer la configuration

Ouvrez `src/environments/environment.ts` et remplacez les valeurs :

**AVANT :**
```typescript
firebase: {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  // ...
}
```

**APRÈS (avec vos vraies valeurs) :**
```typescript
firebase: {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "arathy-12345.firebaseapp.com",
  projectId: "arathy-12345",
  storageBucket: "arathy-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxx"
}
```

### Étape 3 : Tester en local

```bash
npm start
```

Ouvrez http://localhost:4200 dans votre navigateur.

**Pour tester la synchronisation :**
- Ouvrez deux onglets
- Modifiez quelque chose dans un onglet
- Ça doit se synchroniser instantanément dans l'autre ! ✨

### Étape 4 : Déployer sur Netlify

#### 4.1 Compiler le projet

```bash
npm run build
```

Un dossier `dist/arathy` sera créé.

#### 4.2 Déployer

**Méthode simple (Drag & Drop) :**
1. Allez sur https://app.netlify.com/drop
2. Glissez le dossier `dist/arathy` sur la page
3. Attendez 30 secondes
4. Votre site est en ligne ! 🎉

**Méthode via GitHub (recommandée) :**
1. Créez un repo GitHub
2. Uploadez tout le projet
3. Allez sur https://netlify.com
4. "Add new site" > "Import from GitHub"
5. Sélectionnez votre repo
6. Build command : `npm run build`
7. Publish directory : `dist/arathy`
8. Déployez !

#### 4.3 Personnaliser l'URL

Dans Netlify :
1. Site settings
2. Change site name
3. Choisissez : `arathy` ou autre
4. Votre URL : `arathy.netlify.app`

## 📱 Utilisation

### Accès
- Accessible depuis PC, mobile, tablette
- Pas besoin de compte utilisateur
- Synchronisation automatique en temps réel

### Gestion du Stock
1. Cliquez sur "📦 Stock"
2. Ajoutez des articles avec le bouton ➕
3. Utilisez +/- pour ajuster les quantités
4. Les alertes apparaissent automatiquement si stock faible

### Calculateur de Dates
1. Cliquez sur "📅 Dates"
2. Ajoutez un événement
3. Activez "2 périodes" si vous voulez calculer entre 2 dates
4. Sinon, le calcul se fait jusqu'à aujourd'hui automatiquement

## 🎨 Technologies utilisées

- **Angular 17** (Framework frontend)
- **Firebase Firestore** (Base de données temps réel)
- **TypeScript** (Langage)
- **Netlify** (Hébergement)

## 🔒 Sécurité et données

- **Données partagées** : Accessible à quiconque a l'URL
- **Pas d'authentification** : Pas besoin de mot de passe
- **Gratuit à vie** : Firebase plan gratuit largement suffisant
- **Backup** : Données stockées dans Firebase (sauvegarde automatique)

## 📊 Limites Firebase (plan gratuit)

- ✅ 50 000 lectures/jour
- ✅ 20 000 écritures/jour
- ✅ 1 GB de stockage
- ✅ 10 GB de bande passante/mois

Pour votre usage : vous ne dépasserez JAMAIS ces limites !

## 🆘 Dépannage

### Erreur "Permission denied"
➡️ Vérifiez les règles Firestore (Étape 2.3)

### Pas de synchronisation
➡️ Vérifiez que vous avez bien copié toute la config Firebase
➡️ Ouvrez la console du navigateur (F12) pour voir les erreurs

### Erreur lors du build
➡️ Supprimez `node_modules` et `package-lock.json`
➡️ Relancez `npm install`

### Le site ne charge pas après déploiement
➡️ Vérifiez que vous avez bien glissé le dossier `dist/arathy` (pas juste `dist`)

## 🚀 Améliorations futures possibles

- [ ] Authentification avec mot de passe
- [ ] Export PDF/Excel du stock
- [ ] Photos des produits
- [ ] Notifications push
- [ ] Liste de courses générée automatiquement
- [ ] Thème sombre
- [ ] Multi-langues

## 💡 Commandes utiles

```bash
# Développement local
npm start

# Build production
npm run build

# Installer les dépendances
npm install

# Vérifier la version Angular
ng version
```

## 📝 Structure du projet

```
arathy/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── stock/           # Composant gestion stock
│   │   │   └── date-calculator/ # Composant calcul dates
│   │   ├── services/
│   │   │   ├── stock.service.ts # Service Firebase stock
│   │   │   └── date.service.ts  # Service Firebase dates
│   │   ├── models/
│   │   │   └── models.ts        # Interfaces TypeScript
│   │   ├── app.component.ts     # Composant principal
│   │   └── app.routes.ts        # Routes de l'app
│   ├── environments/
│   │   └── environment.ts       # Configuration Firebase
│   ├── styles.css               # Styles globaux
│   └── index.html               # HTML principal
├── angular.json                 # Config Angular
├── package.json                 # Dépendances
├── netlify.toml                 # Config Netlify
└── README.md                    # Ce fichier
```

## 👥 Auteurs

Arathy ❤️

## 🎉 Profitez-en !

Votre application est maintenant :
✅ Fonctionnelle
✅ Synchronisée en temps réel
✅ Accessible partout
✅ Gratuite à vie

Amusez-vous bien ! 🎊
