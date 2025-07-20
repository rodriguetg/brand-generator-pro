// Test de connexion Supabase - MISE À JOUR
require('dotenv').config({ path: '.env.local' })

console.log('🔍 TEST CONNEXION SUPABASE')
console.log('==========================')

const url = process.env.DATABASE_URL
console.log('🔗 URL complète:', url ? url.replace(/:([^:@]+)@/, ':****@') : 'NON TROUVÉE')

if (url) {
  // Extraire les infos de l'URL
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
  if (match) {
    const [, user, password, host, port, database] = match
    console.log('✅ URL parsée :')
    console.log('  Host:', host)
    console.log('  Port:', port)
    console.log('  User:', user)
    console.log('  Database:', database)
    console.log('  Password:', password ? '****' : 'MANQUANT')
    
    // Test ping avec le bon host
    const { exec } = require('child_process')
    exec(`ping -n 1 ${host}`, (error, stdout) => {
      if (error) {
        console.log('❌ Ping échoué:', error.message)
      } else {
        console.log('✅ Serveur accessible')
      }
    })
  }
} else {
  console.log('❌ DATABASE_URL non trouvée dans .env.local')
}
