'use server'

import { GoogleGenAI } from '@google/genai'

type SummaryResult =
  | { summary: string; error: null }
  | { summary: null; error: string }

export async function summarizeMemo(
  title: string,
  content: string
): Promise<SummaryResult> {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return { summary: null, error: 'GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.' }
    }

    if (!content?.trim()) {
      return { summary: null, error: '요약할 내용이 비어 있습니다.' }
    }

    const ai = new GoogleGenAI({ apiKey })
    const prompt = `다음 메모를 한국어로 2~3문장으로 간결하게 요약해 주세요. 핵심 내용만 담고, 부가 설명·머리말·markdown 없이 평문으로만 작성하세요.\n\n제목: ${title ?? '(제목 없음)'}\n\n내용:\n${content}`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    })

    return { summary: response.text?.trim() ?? '', error: null }
  } catch (error) {
    return {
      summary: null,
      error: error instanceof Error ? error.message : '요약 생성에 실패했습니다.',
    }
  }
}
