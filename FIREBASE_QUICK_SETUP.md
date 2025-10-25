# 🔥 Configuration Firebase RAPIDE - 5 minutes

## ⚠️ Problème actuel
Les erreurs Firebase indiquent que la configuration n'est pas valide. Voici comment la corriger rapidement.

## 🚀 Configuration en 5 minutes

### 1. Créer un projet Firebase (2 minutes)
1. Aller sur [console.firebase.google.com](https://console.firebase.google.com)
2. Cliquer "Créer un projet"
3. Nom : `coordination-schools`
4. **Désactiver** Google Analytics
5. Cliquer "Créer un projet"

### 2. Activer Firestore (1 minute)
1. Menu gauche → "Firestore Database"
2. "Créer une base de données"
3. **Mode test** (règles publiques)
4. Région : **europe-west1** (France)
5. "Terminer"

### 3. Obtenir la configuration (2 minutes)
1. ⚙️ Paramètres du projet
2. "Paramètres du projet"
3. Faire défiler → "Vos applications"
4. Cliquer l'icône Web `</>`
5. Nom : `coordination-schools`
6. **Ne pas** cocher "Firebase Hosting"
7. "Enregistrer l'application"

### 4. Copier la configuration
Copier cette configuration et remplacer dans `src/firebase.js` :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // ← Votre vraie clé
  authDomain: "votre-projet.firebaseapp.com", // ← Votre domaine
  projectId: "votre-projet", // ← Votre projet
  storageBucket: "votre-projet.appspot.com", // ← Votre bucket
  messagingSenderId: "123456789", // ← Votre ID
  appId: "1:123456789:web:abc123" // ← Votre App ID
};
```

## 🔧 Règles Firestore (optionnel)
Dans Firestore → Règles :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /coordination/{document} {
      allow read, write: if true;
    }
  }
}
```

## ✅ Test rapide
1. Modifier la configuration dans `src/firebase.js`
2. Recharger la page
3. Les erreurs Firebase disparaissent
4. L'application fonctionne avec localStorage (pas de sync encore)
5. Une fois configuré, la synchronisation fonctionnera

## 🎯 Résultat
- ❌ **Avant** : Erreurs Firebase 400
- ✅ **Après** : Application fonctionnelle + synchronisation

**Temps total : 5 minutes maximum !** 🚀
