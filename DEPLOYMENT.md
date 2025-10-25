# 🚀 Déploiement sur Netlify - Coordination des Animateurs

## 📋 Étapes pour déployer sur Netlify

### 1. Créer le repository GitHub

**Option A : Via GitHub Web Interface**
1. Aller sur [github.com](https://github.com)
2. Cliquer sur "New repository"
3. Nom : `coordination-schools`
4. Description : "Application de coordination des animateurs pour 3 écoles"
5. Public
6. Ne pas initialiser avec README (déjà créé)
7. Cliquer "Create repository"

**Option B : Via GitHub CLI (si installé)**
```bash
gh repo create coordination-schools --public --description "Application de coordination des animateurs pour 3 écoles"
```

### 2. Pousser le code sur GitHub

Une fois le repository créé sur GitHub, exécuter :

```bash
# Si le repository n'existe pas encore, le créer d'abord sur GitHub
git remote remove origin
git remote add origin https://github.com/Kawakoji/coordination-schools.git
git push -u origin main
```

### 3. Déployer sur Netlify

**Méthode 1 : Déploiement automatique depuis GitHub**
1. Aller sur [netlify.com](https://netlify.com)
2. Se connecter avec votre compte GitHub
3. Cliquer "New site from Git"
4. Choisir "GitHub" comme provider
5. Sélectionner le repository `Kawakoji/coordination-schools`
6. Configuration automatique :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Node version** : `18`
7. Cliquer "Deploy site"

**Méthode 2 : Déploiement manuel**
1. Construire le projet : `npm run build`
2. Aller sur Netlify
3. Glisser-déposer le dossier `dist` sur la zone de déploiement

### 4. Configuration Netlify (optionnel)

Le fichier `netlify.toml` est déjà configuré avec :
- Build command : `npm run build`
- Publish directory : `dist`
- Redirects pour SPA (Single Page Application)
- Node version : 18

### 5. Variables d'environnement (si nécessaire)

Si vous ajoutez des variables d'environnement plus tard :
1. Aller dans "Site settings" > "Environment variables"
2. Ajouter les variables nécessaires

## 🔧 Configuration du projet

### Fichiers de configuration créés :
- ✅ `netlify.toml` - Configuration Netlify
- ✅ `.gitignore` - Fichiers à ignorer
- ✅ `package.json` - Avec `"type": "module"` pour corriger les warnings

### Build et test local :
```bash
# Tester la build de production
npm run build

# Prévisualiser la build
npm run preview
```

## 🌐 URLs après déploiement

- **Site Netlify** : `https://[nom-du-site].netlify.app`
- **Repository GitHub** : `https://github.com/Kawakoji/coordination-schools`

## 📱 Fonctionnalités déployées

✅ **Application React complète**  
✅ **Interface responsive** avec Tailwind CSS  
✅ **Gestion des 3 écoles** (A, B, C)  
✅ **Calcul automatique du quota** (1 animateur pour 8 enfants)  
✅ **Notifications intelligentes** entre écoles  
✅ **Persistance localStorage**  
✅ **Auto-refresh** toutes les 10 minutes  
✅ **Configuration Netlify** optimisée  

## 🎯 Prêt pour la production !

L'application est **100% prête** pour le déploiement sur Netlify avec toutes les configurations nécessaires.
