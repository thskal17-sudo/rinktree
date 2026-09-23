import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * 문의 내역 저장용 Supabase 클라이언트.
 *
 * service_role 키는 RLS를 우회하므로 절대 클라이언트 번들에 들어가면 안 된다.
 * 파일 맨 위의 'server-only' import가 클라이언트에서 import되는 순간 빌드를 깨뜨린다.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/** 환경변수가 없으면 DB 저장 없이(메일 발송만으로) 동작한다. */
export const isSupabaseConfigured = Boolean(supabaseUrl && serviceRoleKey)

let cachedClient: SupabaseClient | null = null

function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !serviceRoleKey) return null

  cachedClient ??= createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return cachedClient
}

export type InquiryRecord = {
  name: string
  organization: string | null
  phone: string
  email: string | null
  program: string | null
  message: string
}

export type SaveInquiryResult =
  | { status: 'saved'; id: string | null }
  | { status: 'skipped' }
  | { status: 'failed'; error: string }

/** inquiries 테이블에 문의 한 건을 기록한다. */
export async function saveInquiry(record: InquiryRecord): Promise<SaveInquiryResult> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { status: 'skipped' }

  const { data, error } = await supabase
    .from('inquiries')
    .insert(record)
    .select('id')
    .single<{ id: string }>()

  if (error) {
    return { status: 'failed', error: error.message }
  }

  return { status: 'saved', id: data?.id ?? null }
}
