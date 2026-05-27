'use client'

import { useCallback, useState } from 'react'
import { summarizeMemo } from '@/app/actions/summarize'

interface UseSummarizeReturn {
  summary: string
  loading: boolean
  error: string | null
  summarize: (title: string, content: string) => Promise<void>
  reset: () => void
}

export const useSummarize = (): UseSummarizeReturn => {
  const [summary, setSummary] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const summarize = useCallback(async (title: string, content: string) => {
    setLoading(true)
    setError(null)
    setSummary('')
    try {
      const result = await summarizeMemo(title, content)
      if (result.error || result.summary === null) {
        setError(result.error ?? '요약 실패')
        return
      }
      setSummary(result.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : '요약 실패')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setSummary('')
    setError(null)
    setLoading(false)
  }, [])

  return { summary, loading, error, summarize, reset }
}
