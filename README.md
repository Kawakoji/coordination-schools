# Coordination des Animateurs - Application React

## Description
Application web React permettant de coordonner les animateurs entre 3 écoles avec un système de quota automatique (1 animateur pour 8 enfants).

## Fonctionnalités
- ✅ Gestion de 3 écoles (École A, B, C)
- ✅ Calcul automatique du quota (1 animateur pour 8 enfants)
- ✅ Notifications automatiques entre écoles
- ✅ Persistance des données (localStorage)
- ✅ Auto-refresh toutes les 10 minutes
- ✅ Interface responsive avec Tailwind CSS

## Installation et utilisation

### Option 1: Create React App
```bash
npx create-react-app coordination-app
cd coordination-app
npm install
# Copier le contenu de CoordinationSchools.jsx dans src/App.js
npm start
```

### Option 2: Vite
```bash
npm create vite@latest coordination-app -- --template react
cd coordination-app
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# Copier le contenu de CoordinationSchools.jsx dans src/App.jsx
npm run dev
```

### Configuration Tailwind CSS
Ajouter dans `tailwind.config.js` :
```js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Tests manuels

### Scénario 1: Notification d'aide
1. **École A** : 10 élèves, 1 animateur → Manque 1 animateur
2. **École B** : 6 élèves, 2 animateurs → Excédent 1 animateur  
3. **École C** : 4 élèves, 1 animateur → Équilibre
4. **Résultat attendu** : Notification "L'École B peut aider l'École A (excédent de 1 animateur)"

### Scénario 2: Aucune aide disponible
1. **École A** : 16 élèves, 1 animateur → Manque 1 animateur
2. **École B** : 8 élèves, 1 animateur → Équilibre
3. **École C** : 4 élèves, 0 animateurs → Manque 1 animateur
4. **Résultat attendu** : Alerte "Aucune école n'a d'animateur disponible pour aider"

### Scénario 3: Toutes équilibrées
1. Toutes les écoles respectent le quota
2. **Résultat attendu** : Aucune notification

### Scénario 4: Test des boutons
1. Cliquer "Réinitialiser" sur une carte → Doit remettre 0/0
2. Cliquer "Sauvegarder" → Doit persister les données
3. Recharger la page → Les données doivent être conservées

## Algorithme de calcul

```javascript
// Pour chaque école
needed = Math.ceil(students / 8)
delta = animators - needed

if (delta < 0) {
  // École en manque de Math.abs(delta) animateurs
} else if (delta > 0) {
  // École avec excédent de delta animateurs
} else {
  // École équilibrée
}

// Quand une école est en manque
helperSchool = findSchoolWithMaxExcedent(excludeSchoolInNeed)
if (helperSchool.excedent > 0) {
  showNotification(helperSchool, schoolInNeed, amount)
} else {
  showNoHelpMessage()
}
```

## Remplacement par API

Pour remplacer localStorage par une API, modifier :

```javascript
// Au lieu de :
const savedData = localStorage.getItem('coordination-schools');

// Utiliser :
const response = await fetch('/api/schools');
const savedData = await response.json();

// Au lieu de :
localStorage.setItem('coordination-schools', JSON.stringify(schools));

// Utiliser :
await fetch('/api/schools', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(schools)
});
```

## Messages d'interface

- **Statut OK** : "Quota respecté — Pas d'intervention nécessaire"
- **Statut manque** : "Manque X animateur(s) — Demander de l'aide"  
- **Statut excédent** : "Excédent de Y animateur(s) — Peut aider"
- **Notification aide** : "L'**École B** peut aider l'**École A** (excédent de 2 animateurs)"
- **Notification aucune aide** : "Aucune école n'a d'animateur disponible pour aider"

## Auto-refresh

L'application se rafraîchit automatiquement toutes les 10 minutes (600000 ms) en relisant les données depuis localStorage. Pour tester plus rapidement, modifier la valeur dans le code :

```javascript
// Ligne 47 : changer 600000 par 30000 pour tester toutes les 30 secondes
}, 30000); // 30 secondes pour test
```
