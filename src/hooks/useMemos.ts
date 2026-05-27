'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Memo, MemoFormData } from '@/types/memo'
import {
  listMemos,
  createMemo as createMemoAction,
  updateMemo as updateMemoAction,
  deleteMemo as deleteMemoAction,
  clearMemos as clearMemosAction,
} from '@/app/actions/memos'

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : '메모 작업 중 오류가 발생했습니다.'

export const useMemos = () => {
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    setLoading(true)
    setError(null)
    listMemos()
      .then(result => {
        if (result.error || !result.data) {
          setError(result.error)
          setMemos([])
          return
        }
        setMemos(result.data)
      })
      .catch(error => {
        console.error('Failed to load memos:', error)
        setError(getErrorMessage(error))
      })
      .finally(() => setLoading(false))
  }, [])

  const createMemo = useCallback(async (formData: MemoFormData): Promise<Memo> => {
    try {
      setError(null)
      const result = await createMemoAction(formData)
      if (result.error || !result.data) {
        throw new Error(result.error ?? '메모 생성에 실패했습니다.')
      }
      const newMemo = result.data
      setMemos(prev => [newMemo, ...prev])
      return newMemo
    } catch (error) {
      setError(getErrorMessage(error))
      throw error
    }
  }, [])

  const updateMemo = useCallback(async (id: string, formData: MemoFormData): Promise<void> => {
    try {
      setError(null)
      const result = await updateMemoAction(id, formData)
      if (result.error || !result.data) {
        throw new Error(result.error ?? '메모 수정에 실패했습니다.')
      }
      const updatedMemo = result.data
      setMemos(prev => prev.map(memo => (memo.id === id ? updatedMemo : memo)))
    } catch (error) {
      setError(getErrorMessage(error))
      throw error
    }
  }, [])

  const deleteMemo = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      const result = await deleteMemoAction(id)
      if (result.error) throw new Error(result.error)
      setMemos(prev => prev.filter(memo => memo.id !== id))
    } catch (error) {
      setError(getErrorMessage(error))
      throw error
    }
  }, [])

  const searchMemos = useCallback((query: string): void => {
    setSearchQuery(query)
  }, [])

  const filterByCategory = useCallback((category: string): void => {
    setSelectedCategory(category)
  }, [])

  const getMemoById = useCallback(
    (id: string): Memo | undefined => {
      return memos.find(memo => memo.id === id)
    },
    [memos]
  )

  const filteredMemos = useMemo(() => {
    let filtered = memos

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(memo => memo.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        memo =>
          memo.title.toLowerCase().includes(query) ||
          memo.content.toLowerCase().includes(query) ||
          memo.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [memos, selectedCategory, searchQuery])

  const clearAllMemos = useCallback(async (): Promise<void> => {
    try {
      setError(null)
      const result = await clearMemosAction()
      if (result.error) throw new Error(result.error)
      setMemos([])
      setSearchQuery('')
      setSelectedCategory('all')
    } catch (error) {
      setError(getErrorMessage(error))
      throw error
    }
  }, [])

  const stats = useMemo(() => {
    const categoryCounts = memos.reduce(
      (acc, memo) => {
        acc[memo.category] = (acc[memo.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      total: memos.length,
      byCategory: categoryCounts,
      filtered: filteredMemos.length,
    }
  }, [memos, filteredMemos])

  return {
    memos: filteredMemos,
    allMemos: memos,
    loading,
    error,
    searchQuery,
    selectedCategory,
    stats,

    createMemo,
    updateMemo,
    deleteMemo,
    getMemoById,

    searchMemos,
    filterByCategory,

    clearAllMemos,
  }
}
