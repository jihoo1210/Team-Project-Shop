import { useState } from 'react'

interface AiRecommendResult {
  keywords: string[]
  description: string
  category?: string
}

export const useAiRecommend = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getRecommendation = async (prompt: string): Promise<AiRecommendResult | null> => {
    setLoading(true)
    setError(null)

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY

    if (!apiKey) {
      setError('API 키가 설정되지 않았습니다.')
      setLoading(false)
      return null
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `당신은 패션 쇼핑몰의 스타일리스트입니다.
사용자의 요청을 분석하여 적합한 상품 검색 키워드와 스타일 설명을 JSON 형식으로 반환해주세요.

응답 형식:
{
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "description": "추천 스타일에 대한 간단한 설명",
  "category": "outer|top|bottom|dress|shoes|acc" (해당되는 경우)
}

예시:
- 요청: "따뜻하고 캐주얼한 겨울 코디 추천해줘"
- 응답: {"keywords": ["패딩", "니트", "기모", "후드"], "description": "따뜻한 겨울 캐주얼 룩을 위한 아이템들입니다.", "category": "outer"}`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      })

      if (!response.ok) {
        throw new Error('AI 서비스 요청에 실패했습니다.')
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('AI 응답을 받지 못했습니다.')
      }

      // JSON 파싱 시도
      try {
        const result = JSON.parse(content)
        setLoading(false)
        return result as AiRecommendResult
      } catch {
        // JSON 파싱 실패 시 기본 키워드 추출
        const keywords = content.match(/["']([^"']+)["']/g)?.map((k: string) => k.replace(/["']/g, '')) || []
        setLoading(false)
        return {
          keywords: keywords.slice(0, 5),
          description: content,
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI 추천 중 오류가 발생했습니다.'
      setError(message)
      setLoading(false)
      return null
    }
  }

  return { getRecommendation, loading, error }
}
