import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const DEFAULT_SUPABASE_URL = 'https://achzxlmwnhyswtvuonhz.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaHp4bG13bmh5c3d0dnVvbmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NDkzNjAsImV4cCI6MjA5NTQyNTM2MH0.PuZQluSsV6sw-HqEwqJyGz_pjPgGJ3FChrzeyEZucs4'

export const getSupabase = () => {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    DEFAULT_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('환경 변수 SUPABASE_URL이 설정되지 않았습니다.')
  }
  if (!supabaseKey) {
    throw new Error('환경 변수 SUPABASE_SERVICE_ROLE_KEY 또는 SUPABASE_ANON_KEY가 설정되지 않았습니다.')
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  })
}
