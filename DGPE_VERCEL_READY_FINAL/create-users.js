import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// 🔐 CONFIG
const SUPABASE_URL = 'https://yshmhrsartwjctbpevup.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzaG1ocnNhcnR3amN0YnBldnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwMjQ4MiwiZXhwIjoyMDgyMDc4NDgyfQ.dfUKEoQQEcj7eyDZZbaXNTHLc0RmWdUIpvoXxqFeaJI'

const supabase = createClient(
  SUPABASE_URL,
  SERVICE_ROLE_KEY
)

// 📂 Charge le CSV (email, role, status)
const csv = fs.readFileSync('./users_import.csv', 'utf-8')
const rows = csv.split('\n').slice(1)

async function run() {
  for (const row of rows) {
    if (!row.trim()) continue

    const [email, role, status] = row.split(',')

    console.log('Création:', email)

    // 1️⃣ Création Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: email.trim(),
      password: 'DGPE@2025', // mot de passe initial
      email_confirm: true
    })

    if (error) {
      console.error('❌ Auth error:', error.message)
      continue
    }

    // 2️⃣ Insertion public.users
    const { error: e2 } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: email.trim(),
        role: role?.trim() || 'AGENT',
        status: status?.trim() || 'ACTIF'
      })

    if (e2) {
      console.error('❌ DB error:', e2.message)
    } else {
      console.log('✅ OK:', email)
    }
  }

  console.log('🎉 TERMINÉ')
}

run()
