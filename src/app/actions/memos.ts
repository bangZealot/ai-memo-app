'use server'

import { v4 as uuidv4 } from 'uuid'
import { getSupabase } from '@/lib/supabase/server'
import type { Memo, MemoFormData } from '@/types/memo'

type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: string }

const toActionErrorMessage = (message: string) => {
  if (message.includes('relation') && message.includes('memos')) {
    return 'Supabase에 memos 테이블이 없습니다. 마이그레이션 SQL을 먼저 실행해 주세요.'
  }
  return message
}

const failure = (error: unknown) => ({
  data: null,
  error: toActionErrorMessage(
    error instanceof Error ? error.message : 'Supabase 작업 중 오류가 발생했습니다.'
  ),
})

export async function listMemos(): Promise<ActionResult<Memo[]>> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) return failure(error)
    return { data: (data ?? []) as Memo[], error: null }
  } catch (error) {
    return failure(error)
  }
}

export async function createMemo(formData: MemoFormData): Promise<ActionResult<Memo>> {
  try {
    const supabase = getSupabase()
    const now = new Date().toISOString()
    const newMemo = {
      id: uuidv4(),
      ...formData,
      createdAt: now,
      updatedAt: now,
    }

    const { data, error } = await supabase.from('memos').insert(newMemo).select().single()

    if (error) return failure(error)
    return { data: data as Memo, error: null }
  } catch (error) {
    return failure(error)
  }
}

export async function updateMemo(
  id: string,
  formData: MemoFormData
): Promise<ActionResult<Memo>> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('memos')
      .update({ ...formData, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) return failure(error)
    return { data: data as Memo, error: null }
  } catch (error) {
    return failure(error)
  }
}

export async function deleteMemo(id: string): Promise<ActionResult<null>> {
  try {
    const supabase = getSupabase()
    const { error } = await supabase.from('memos').delete().eq('id', id)

    if (error) return failure(error)
    return { data: null, error: null }
  } catch (error) {
    return failure(error)
  }
}

export async function clearMemos(): Promise<ActionResult<null>> {
  try {
    const supabase = getSupabase()
    const { error } = await supabase.from('memos').delete().not('id', 'is', null)

    if (error) return failure(error)
    return { data: null, error: null }
  } catch (error) {
    return failure(error)
  }
}
