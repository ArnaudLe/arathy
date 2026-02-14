# 🚀 Guide de Démarrage Rapide - 15 minutes

Ce guide vous permet de mettre en ligne votre application en 15 minutes chrono !

## ⚡ Étapes ultra-rapides

### 1️⃣ Installation (2 min)

```bash
cd arathy
npm install
```

Allez boire un café pendant l'installation ☕

---

### 2️⃣ Firebase - Configuration Express (5 min)

#### A. Créer le projet
1. 🔗 https://console.firebase.google.com
2. ➕ "Ajouter un projet" → Nommez "arathy"
3. ❌ Désactivez Google Analytics
4. ✅ "Créer le projet"

#### B. Activer Firestore
1. Menu gauche → "Firestore Database"
2. "Créer une base de données"
3. Mode "test" → Localisation "europe-west"
4. "Activer"

#### C. Règles de sécurité
1. Onglet "Règles"
2. **Copier-coller ce code** :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. "Publier"

#### D. Récupérer la config
1. ⚙️ Paramètres du projet
2. Bas de page → Icône `</>`
3. Nommez "web"
4. **Copiez les 6 lignes** qui ressemblent à :
```javascript
apiKey: "AIza..."
authDomain: "arathy-xxx.firebaseapp.com"
projectId: "arathy-xxx"
storageBucket: "..."
messagingSenderId: "..."
appId: "..."
```

#### E. Insérer dans le projet
Ouvrez `src/environments/environment.ts` et **collez vos valeurs** :

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "COLLER_ICI",
    authDomain: "COLLER_ICI",
    projectId: "COLLER_ICI",
    storageBucket: "COLLER_ICI",
    messagingSenderId: "COLLER_ICI",
    appId: "COLLER_ICI"
  }
};
```

✅ **Sauvegardez le fichier !**

---

### 3️⃣ Test Local (2 min)

```bash
npm start
```

Ouvrez http://localhost:4200

**Test de synchronisation :**
- Ouvrez 2 onglets
- Ajoutez un article dans l'un
- Doit apparaître dans l'autre instantanément ! ✨

✅ Ça marche ? Passez à l'étape suivante !

---

### 4️⃣ Déploiement Netlify (5 min)

#### A. Compiler
```bash
npm run build
```

Attendez ~1 minute ⏱️

#### B. Déployer
1. 🔗 https://app.netlify.com/drop
2. **Créez un compte** (gratuit)
3. **Glissez le dossier** `dist/arathy` sur la page
4. Attendez 30 secondes
5. 🎉 **C'EST EN LIGNE !**

#### C. Personnaliser l'URL
1. Site settings
2. "Change site name"
3. Tapez : `arathy` (ou votre choix)
4. URL finale : `arathy.netlify.app`

---

## ✅ Checklist finale

- [ ] `npm install` terminé
- [ ] Firebase configuré
- [ ] Config collée dans `environment.ts`
- [ ] Test local OK (localhost:4200)
- [ ] Synchronisation testée (2 onglets)
- [ ] Build réussi (`npm run build`)
- [ ] Déployé sur Netlify

---

## 🎯 Utilisation rapide

### Stock
- Bouton ➕ : Ajouter article
- Boutons +/- : Ajuster quantité
- 🗑️ : Supprimer
- ✏️ : Modifier

### Dates
- Bouton ➕ : Ajouter événement
- Toggle : Activer 2 périodes
- Cartes colorées : Affichage du temps écoulé

---

## ❓ Problèmes ?

### "Permission denied"
➡️ Vérifiez les règles Firestore (Étape 2C)

### "Module not found"
➡️ Relancez `npm install`

### Site ne charge pas
➡️ Vérifiez que vous avez glissé `dist/arathy` (pas `dist` seul)

### Pas de synchronisation
➡️ Vérifiez la config Firebase dans `environment.ts`

---

## 🎊 Félicitations !

Votre application est en ligne et synchronisée en temps réel !

**URL à partager :** `votre-nom.netlify.app`

**Durée totale :** ~15 minutes

**Coût :** 0€ à vie 💰

---

## 📞 Besoin d'aide ?

Relisez le **README.md** pour plus de détails !

Profitez-en ! 🚀
