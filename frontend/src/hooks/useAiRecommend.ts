import { useState } from 'react'
import { fetchItems } from '@/api/itemApi'
import type { ProductSummary } from '@/types/product'

interface AiRecommendResult {
  keywords: string[]
  description: string
  category?: string | null
}

export interface AiRecommendWithProduct extends AiRecommendResult {
  matchedProduct?: ProductSummary
}

export const useAiRecommend = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const findMatchingProduct = async (
    keywords: string[],
    category?: string | null,
  ): Promise<ProductSummary | undefined> => {
    try {
      const params: { page: number; size: number; category?: string; keyword?: string } = { page: 0, size: 10 }
      if (category) {
        params.category = category
      }
      if (keywords.length > 0) {
        params.keyword = keywords[0]
      }

      const response = await fetchItems(params)

      if (response.content && response.content.length > 0) {
        const items = response.content
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
    try {
      const response = await fetch('/api/ai/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'recommend',
          messages: [
            {
              role: 'system',
              content:
                '너는 패션 쇼핑몰 MyShop의 AI 스타일리스트이다. 사용자 요청을 분석해 패션 키워드 배열, 간결한 한국어 설명, 카테고리(outer|top|bottom|dress|shoes|acc 중 하나 또는 비우기)로 JSON만 반환해라. 예시: {"keywords":["후드","기모","코트"],"description":"겨울용 따뜻한 후드 코트를 추천합니다.","category":"outer"}',
            },
            { role: 'user', content: prompt },
          ],
        }),
      })

      if (!response.ok) {
        if (response.status === 429) throw new Error('API 요청 한도가 초과되었습니다. 잠시 후 다시 시도해 주세요.')
        if (response.status === 401) throw new Error('API 키가 설정되지 않았습니다.')
        throw new Error('AI 서비스 요청에 실패했습니다.')
      }

      const { content } = (await response.json()) as { content?: string }
      const raw = content || ''

      let parsed: AiRecommendResult = { keywords: [], description: raw, category: undefined }
      try {
        parsed = JSON.parse(raw) as AiRecommendResult
      } catch {
        const keywords = raw.match(/["']([^"']+)["']/g)?.map((k: string) => k.replace(/["']/g, '')) || []
        parsed = { keywords: keywords.slice(0, 5), description: raw, category: undefined }
      }

      const keywords = parsed.keywords || []
      const description = parsed.description || raw
      const category = parsed.category || undefined

      const matchedProduct = await findMatchingProduct(keywords, category ?? undefined)

      setLoading(false)
      return { keywords, description, category, matchedProduct }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI 추천 처리 중 오류가 발생했습니다.'
      setError(message)
      setLoading(false)
      return null
    }
  }

  return { getRecommendation, loading, error }
}
