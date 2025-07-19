# 🚀 DÉPLOIEMENT RAPIDE - BRAND GENERATOR PRO

## 1. Prérequis
- Compte GitHub
- Compte Vercel (gratuit)
- Clé API OpenAI
- Compte Supabase (gratuit)

## 2. Configuration base de données (Supabase)
1. Aller sur https://supabase.com
2. Créer un nouveau projet
3. Copier l'URL de connexion PostgreSQL
4. Exécuter le schema Prisma:
```bash
npx prisma db push
```

## 3. Déploiement Vercel
1. Aller sur https://vercel.com
2. Connecter votre compte GitHub
3. Importer ce repository
4. Configurer les variables d'environnement:
   - `NEXTAUTH_URL`: https://votre-app.vercel.app
   - `NEXTAUTH_SECRET`: générer avec `openssl rand -base64 32`
   - `OPENAI_API_KEY`: votre clé OpenAI
   - `DATABASE_URL`: URL Supabase

## 4. Test de l'application
- URL de test: https://votre-app.vercel.app/test
- Tester la génération de noms de marque
- Vérifier les logs dans Vercel

## 5. Domaine personnalisé (optionnel)
1. Dans Vercel > Settings > Domains
2. Ajouter votre domaine
3. Configurer les DNS

## 🎯 URL de test rapide
Une fois déployé, testez directement sur:
`https://votre-app.vercel.app/test`