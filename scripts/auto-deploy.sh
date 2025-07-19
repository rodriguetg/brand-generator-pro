#!/bin/bash

echo "🚀 DÉPLOIEMENT AUTOMATIQUE BRAND GENERATOR PRO"
echo "=============================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les étapes
step() {
    echo -e "\n${BLUE}📋 ÉTAPE: $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Vérifier les prérequis
step "Vérification des prérequis"

if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé"
fi

if ! command -v npm &> /dev/null; then
    error "npm n'est pas installé"
fi

if ! command -v git &> /dev/null; then
    error "Git n'est pas installé"
fi

success "Tous les prérequis sont installés"

# Nettoyer et installer les dépendances
step "Installation des dépendances"
rm -rf node_modules package-lock.json
npm install
npm install @next/bundle-analyzer --save-dev

success "Dépendances installées"

# Corriger les vulnérabilités
step "Correction des vulnérabilités"
npm audit fix --force

# Générer le client Prisma
step "Configuration de la base de données"
npx prisma generate

success "Client Prisma généré"

# Tester le build
step "Test du build"
if npm run build; then
    success "Build réussi"
else
    error "Échec du build"
fi

# Préparer Git
step "Préparation Git"
git add .
git commit -m "feat: Brand Generator Pro - ready for deployment" || warning "Rien à commiter"

success "Code préparé pour Git"

# Instructions pour la suite
echo -e "\n${GREEN}🎉 PRÉPARATION TERMINÉE !${NC}"
echo -e "\n${YELLOW}📋 ÉTAPES SUIVANTES (à faire manuellement):${NC}"
echo -e "\n1. ${BLUE}Créer un repo GitHub:${NC}"
echo "   - Aller sur https://github.com/new"
echo "   - Nom: brand-generator-pro"
echo "   - Cliquer 'Create repository'"
echo ""
echo -e "2. ${BLUE}Pousser le code:${NC}"
echo "   git remote add origin https://github.com/VOTRE-USERNAME/brand-generator-pro.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo -e "3. ${BLUE}Créer une base de données Supabase:${NC}"
echo "   - Aller sur https://supabase.com"
echo "   - Créer un nouveau projet"
echo "   - Copier l'URL de connexion"
echo ""
echo -e "4. ${BLUE}Déployer sur Vercel:${NC}"
echo "   - Aller sur https://vercel.com"
echo "   - Importer votre repo GitHub"
echo "   - Configurer les variables d'environnement"
echo ""
echo -e "${GREEN}🔗 Liens utiles:${NC}"
echo "   GitHub: https://github.com/new"
echo "   Supabase: https://supabase.com"
echo "   Vercel: https://vercel.com"
echo "   OpenAI: https://platform.openai.com/api-keys"