#!/bin/bash

echo "🚀 Déploiement Brand Generator Pro..."

# 1. Vérifier que tout est prêt
echo "📋 Vérification des prérequis..."
npm run lint
npm run build

# 2. Pousser vers Git
echo "📤 Push vers GitHub..."
git add .
git commit -m "feat: version de test déployable"
git push origin main

# 3. Instructions pour Vercel
echo "✅ Prêt pour déploiement Vercel!"
echo ""
echo "🔗 Étapes suivantes:"
echo "1. Aller sur https://vercel.com"
echo "2. Importer le repo GitHub"
echo "3. Configurer les variables d'environnement"
echo "4. Déployer!"