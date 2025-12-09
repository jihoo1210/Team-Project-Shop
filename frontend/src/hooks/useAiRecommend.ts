import { useState } from 'react'
import { fetchItems } from '@/api/itemApi'
import type { ProductSummary } from '@/types/product'

interface AiRecommendResult {
  keywords: string[]
  description: string
  category?: string
}

export interface AiRecommendWithProduct extends AiRecommendResult {
  matchedProduct?: ProductSummary
}

export const useAiRecommend = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 키워드로 매칭되는 상품 찾기
  const findMatchingProduct = async (
    keywords: string[],
    category?: string
  ): Promise<ProductSummary | undefined> => {
    try {
      // 카테고리와 키워드로 상품 검색
      const params: { page: number; size: number; category?: string; keyword?: string } = { page: 0, size: 10 }
      if (category) {
        params.category = category
      }
      // 첫 번째 키워드로 검색
      if (keywords.length > 0) {
        params.keyword = keywords[0]
      }

      const response = await fetchItems(params)

      if (response.content && response.content.length > 0) {
        // 키워드와 가장 잘 매칭되는 상품 찾기
        const items = response.content

        // 키워드 매칭 점수 계산
        let bestMatch: typeof items[number] | null = null
        let bestScore = 0

        for (const item of items) {
          let score = 0
          const title = (item.item_name || item.title || '').toLowerCase()
          const brand = (item.brand || '').toLowerCase()

          for (const keyword of keywords) {
            const lowerKeyword = keyword.toLowerCase()
            if (title.includes(lowerKeyword)) score += 2
            if (brand.includes(lowerKeyword)) score += 1
          }

          if (score > bestScore) {
            bestScore = score
            bestMatch = item
          }
        }

        // 매칭되는 상품이 없으면 첫 번째 상품 반환
        const matchedItem = bestMatch || items[0]

        return {
          id: matchedItem.item_id,
          title: matchedItem.item_name || matchedItem.title || '',
          brand: matchedItem.brand || 'MyShop',
          price: matchedItem.price,
          discountPercent: matchedItem.discount_percent,
          mainImage: matchedItem.main_image || matchedItem.main_image_url || matchedItem.thumbnailUrl || '',
        }
      }

      return undefined
    } catch {
      return undefined
    }
  }

  const getRecommendation = async (prompt: string): Promise<AiRecommendWithProduct | null> => {
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
사용자의 요청을 분석하여 적합한 상품 검색 키워드와 스타일 설명을 JSON 형식으로 반환하고 그에 맞는

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
        if (response.status === 429) {
          throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.')
        }
        if (response.status === 401) {
          throw new Error('API 키가 유효하지 않습니다.')
        }
        throw new Error('AI 서비스 요청에 실패했습니다.')
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('AI 응답을 받지 못했습니다.')
      }

      // JSON 파싱 시도
      let result: AiRecommendResult
      try {
        result = JSON.parse(content)
      } catch {
        // JSON 파싱 실패 시 기본 키워드 추출
        const keywords = content.match(/["']([^"']+)["']/g)?.map((k: string) => k.replace(/["']/g, '')) || []
        result = {
          keywords: keywords.slice(0, 5),
          description: content,
        }
      }

      // 매칭되는 상품 찾기
      const matchedProduct = await findMatchingProduct(result.keywords, result.category)

      setLoading(false)
      return {
        ...result,
        matchedProduct,
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
