'use client'

import { useEffect } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Memo, MEMO_CATEGORIES } from '@/types/memo'
import { useSummarize } from '@/hooks/useSummarize'

interface MemoViewerProps {
  memo: Memo | null
  isOpen: boolean
  onClose: () => void
  onEdit: (memo: Memo) => void
  onDelete: (id: string) => Promise<void>
}

export default function MemoViewer({
  memo,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: MemoViewerProps) {
  const { summary, loading, error, summarize, reset } = useSummarize()

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // 메모가 바뀌거나 모달이 닫히면 요약 초기화
  useEffect(() => {
    reset()
  }, [memo?.id, isOpen, reset])

  if (!isOpen || !memo) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      personal: 'bg-blue-100 text-blue-800',
      work: 'bg-green-100 text-green-800',
      study: 'bg-purple-100 text-purple-800',
      idea: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return colors[category] ?? colors.other
  }

  const handleDelete = async () => {
    if (window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      try {
        await onDelete(memo.id)
        onClose()
      } catch (error) {
        alert(error instanceof Error ? error.message : '메모 삭제에 실패했습니다.')
      }
    }
  }

  const handleEdit = () => {
    onEdit(memo)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      data-testid="memo-viewer-backdrop"
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
        data-testid="memo-viewer-modal"
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1 min-w-0 pr-4">
            <h2
              className="text-xl font-bold text-gray-900 leading-snug"
              data-testid="memo-viewer-title"
            >
              {memo.title}
            </h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(memo.category)}`}
              >
                {MEMO_CATEGORIES[memo.category as keyof typeof MEMO_CATEGORIES] ??
                  memo.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            aria-label="닫기"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* AI 요약 패널 */}
          <div className="mb-5">
            {!summary && !loading && !error && (
              <button
                onClick={() => summarize(memo.title, memo.content)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                data-testid="memo-summarize-btn"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                AI 요약
              </button>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-purple-600">
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-purple-500" />
                요약 중...
              </div>
            )}

            {error && (
              <div className="flex items-center justify-between gap-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <span>{error}</span>
                <button
                  onClick={() => summarize(memo.title, memo.content)}
                  className="shrink-0 underline hover:no-underline"
                >
                  다시 시도
                </button>
              </div>
            )}

            {summary && (
              <div
                className="bg-purple-50 border-l-4 border-purple-400 px-4 py-3 rounded-r-lg"
                data-testid="memo-summary-result"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    AI 요약
                  </span>
                  <button
                    onClick={reset}
                    className="text-purple-400 hover:text-purple-600 transition-colors"
                    aria-label="요약 닫기"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-purple-900 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </p>
              </div>
            )}
          </div>

          <div
            className="prose prose-sm prose-gray max-w-none"
            data-testid="memo-viewer-content"
          >
            <Markdown remarkPlugins={[remarkGfm]}>{memo.content}</Markdown>
          </div>

          {/* 태그 */}
          {memo.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-6">
              {memo.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center justify-between gap-4">
            {/* 날짜 정보 */}
            <div className="text-xs text-gray-400 space-y-0.5">
              <p>작성: {formatDate(memo.createdAt)}</p>
              {memo.createdAt !== memo.updatedAt && (
                <p>수정: {formatDate(memo.updatedAt)}</p>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                data-testid="memo-viewer-delete-btn"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                삭제
              </button>
              <button
                onClick={handleEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                data-testid="memo-viewer-edit-btn"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                편집
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
