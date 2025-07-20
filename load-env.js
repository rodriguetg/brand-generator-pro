// Charger .env.local et écrire dans .env
require('dotenv').config({ path: '.env.local' })
const fs = require('fs')

const envContent = `DATABASE_URL="${process.env.DATABASE_URL}"\n`
fs.writeFileSync('.env', envContent)

console.log('✅ Variables copiées de .env.local vers .env')
