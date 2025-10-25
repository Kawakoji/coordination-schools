# 🚀 Installation et Lancement - Coordination des Animateurs

## Installation rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer l'application
```bash
npm run dev
```

L'application s'ouvrira automatiquement dans votre navigateur à l'adresse `http://localhost:3000`

## 📁 Structure du projet

```
animane/
├── src/
│   ├── App.jsx          # Composant principal
│   ├── main.jsx         # Point d'entrée React
│   └── index.css        # Styles Tailwind
├── index.html           # Page HTML principale
├── package.json         # Dépendances et scripts
├── vite.config.js      # Configuration Vite
├── tailwind.config.js   # Configuration Tailwind
├── postcss.config.js    # Configuration PostCSS
└── README.md           # Documentation
```

## 🧪 Tests rapides

### Test 1: Notification d'aide
1. **École A** : 10 élèves, 1 animateur → Manque 1
2. **École B** : 6 élèves, 2 animateurs → Excédent 1
3. **Résultat** : Notification "L'École B peut aider l'École A"

### Test 2: Aucune aide
1. **École A** : 16 élèves, 1 animateur → Manque 1
2. **École B** : 8 élèves, 1 animateur → Équilibre
3. **Résultat** : Alerte "Aucune école disponible"

## ⚙️ Configuration

### Auto-refresh (pour tests)
Pour tester l'auto-refresh plus rapidement, modifier dans `src/App.jsx` ligne 47 :
```javascript
// Changer 600000 par 30000 pour tester toutes les 30 secondes
}, 30000); // 30 secondes pour test
```

### Port personnalisé
Modifier dans `vite.config.js` :
```javascript
server: {
  port: 3001, // Votre port préféré
  open: true
}
```

## 🔧 Scripts disponibles

- `npm run dev` - Lancement en mode développement
- `npm run build` - Construction pour production
- `npm run preview` - Aperçu de la version de production

## 📱 Fonctionnalités

✅ **Gestion des 3 écoles** (A, B, C)  
✅ **Calcul automatique du quota** (1 animateur pour 8 enfants)  
✅ **Notifications intelligentes** entre écoles  
✅ **Persistance localStorage** (données conservées)  
✅ **Auto-refresh** toutes les 10 minutes  
✅ **Interface responsive** avec Tailwind CSS  
✅ **Boutons de sauvegarde/réinitialisation**  

## 🎯 Prêt à utiliser !

L'application est **complètement fonctionnelle** et prête à être utilisée immédiatement après `npm install` et `npm run dev`.
