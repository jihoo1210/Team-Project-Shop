import { useState } from 'react'
import { fetchItems } from '@/api/itemApi'
import type { ItemSummary } from '@/types/api'
import type { ProductSummary } from '@/types/product'

const MAX_CATALOG = 100
const PICKS_PER_SECTION = 4

type Gender = 'women' | 'men'

interface AiPick {
  id: number
  reason?: string
}

interface AiRecommendResult {
  title?: string
  keywords: string[]
  description: string
  category?: string | null
  women?: AiPick[]
  men?: AiPick[]
}

export interface RecommendedProduct extends ProductSummary {
  reason?: string
}

export interface RecommendSection {
  gender: Gender
  label: string
  items: RecommendedProduct[]
}

export interface AiRecommendWithProduct {
  // 'ai': OpenAI 응답, 'fallback': AI 호출 실패 시 키워드 기반 추천
  source: 'ai' | 'fallback'
  title?: string
  keywords: string[]
  description: string
  category?: string | null
  sections: RecommendSection[]
}

const SECTION_LABELS: Record<Gender, string> = {
  women: 'WOMEN',
  men: 'MEN',
}

// 상품 목록 API에는 성별 정보가 없어 카테고리별로 조회해 구분 (그 외 카테고리는 공용)
interface Catalog {
  items: ItemSummary[]
  womenIds: Set<number>
  menIds: Set<number>
}

const loadCatalog = async (): Promise<Catalog> => {
  const [all, women, men] = await Promise.all([
    fetchItems({ page: 0, size: MAX_CATALOG }),
    fetchItems({ page: 0, size: MAX_CATALOG, majorCategory: 'WOMEN' }),
    fetchItems({ page: 0, size: MAX_CATALOG, majorCategory: 'MEN' }),
  ])
  return {
    items: all.content ?? [],
    womenIds: new Set((women.content ?? []).map((item) => item.id)),
    menIds: new Set((men.content ?? []).map((item) => item.id)),
  }
}

const fitsGender = (catalog: Catalog, id: number, gender: Gender) =>
  gender === 'women' ? !catalog.menIds.has(id) : !catalog.womenIds.has(id)

const genderTag = (catalog: Catalog, id: number) =>
  catalog.womenIds.has(id) ? '여성' : catalog.menIds.has(id) ? '남성' : '공용'

const toProduct = (item: ItemSummary, reason?: string): RecommendedProduct => ({
  id: item.id,
  title: item.title || '',
  brand: item.brand || 'MyShop',
  price: item.price,
  discountPercent: item.discountPercent,
  mainImage: item.mainImageUrl || '',
  reason,
})

// AI 응답이 ```json 코드블록으로 감싸져 오는 경우까지 처리
const parseAiJson = (raw: string): AiRecommendResult | null => {
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(raw.slice(start, end + 1)) as AiRecommendResult
  } catch {
    return null
  }
}

// AI를 사용할 수 없을 때(API 키 미설정, 크레딧 소진 등) 쓰는 스타일 프리셋
const STYLE_PRESETS = [
  {
    triggers: ['데이트', '여성스러', '예쁜', '로맨틱', '하객', '소개팅', '러블리'],
    title: '로맨틱 데이트룩',
    description: '여성은 하늘하늘한 원피스에 스트랩 힐과 진주 귀걸이로, 남성은 깔끔한 셔츠와 치노 팬츠로 호감 가는 데이트룩을 완성했어요.',
    keywords: ['데이트룩', '원피스', '셔츠', '로맨틱'],
    women: ['원피스', '힐', '크로스백', '귀걸이'],
    men: ['셔츠', '치노', '스니커즈', '토트백'],
  },
  {
    triggers: ['출근', '오피스', '면접', '회사', '비즈니스', '깔끔'],
    title: '깔끔한 오피스룩',
    description: '단정한 블라우스와 슬랙스, 테일러드 수트로 신뢰감 있는 출근룩을 제안해요.',
    keywords: ['오피스룩', '슬랙스', '수트', '미니멀'],
    women: ['블라우스', '슬랙스', '자켓', '힐'],
    men: ['수트', '셔츠', '치노', '토트백'],
  },
  {
    triggers: ['겨울', '따뜻', '추운', '패딩', '코트', '니트'],
    title: '포근한 겨울 코디',
    description: '보온성 좋은 아우터와 니트를 레이어드하고 부츠와 스카프로 마무리한 따뜻한 겨울 스타일이에요.',
    keywords: ['겨울코디', '코트', '패딩', '니트'],
    women: ['코트', '스웨터', '부츠', '스카프'],
    men: ['패딩', '후드', '치노', '스니커즈'],
  },
  {
    triggers: ['운동', '요가', '러닝', '헬스', '스포티', '애슬레저'],
    title: '애슬레저 스타일',
    description: '움직이기 편한 기능성 아이템으로 운동할 때도, 일상에서도 멋스러운 스포티 룩이에요.',
    keywords: ['애슬레저', '레깅스', '조거', '스포티'],
    women: ['레깅스', '티셔츠', '볼캡', '토트백'],
    men: ['후드', '조거', '스니커즈', '패딩'],
  },
  {
    triggers: [],
    title: '데일리 캐주얼 코디',
    description: '매일 입기 좋은 베이직 아이템을 조합해 편안하면서도 감각적인 캐주얼 룩을 제안해요.',
    keywords: ['데일리룩', '캐주얼', '베이직'],
    women: ['티셔츠', '데님', '가디건', '토트백'],
    men: ['후드', '치노', '스니커즈', '볼캡'],
  },
]

// 키워드별 코디 포인트 설명
const KEYWORD_REASONS: Record<string, string> = {
  원피스: '한 벌로 완성되는 실루엣이라 코디의 중심을 잡아줘요.',
  힐: '발등 라인을 살려 전체 비율을 길어 보이게 해줘요.',
  크로스백: '작은 사이즈로 손이 자유롭고 룩에 귀여운 포인트가 돼요.',
  귀걸이: '얼굴 가까이에서 은은하게 빛나 분위기를 살려줘요.',
  가디건: '쌀쌀한 저녁에 걸치기 좋은 부드러운 레이어드 아이템이에요.',
  블라우스: '단정하면서도 여성스러운 디테일로 첫인상을 깔끔하게 해줘요.',
  슬랙스: '하이웨스트 핏으로 다리가 길어 보이는 출근룩 필수템이에요.',
  자켓: '어깨 라인을 잡아줘 포멀한 자리에도 잘 어울려요.',
  수트: '몸에 맞는 테일러드 핏으로 단정하고 신뢰감 있는 인상을 줘요.',
  토트백: '소지품을 넉넉하게 담을 수 있어 실용적이에요.',
  코트: '긴 기장이 체온을 지켜주고 겨울 룩을 우아하게 정리해줘요.',
  스웨터: '포근한 니트 소재로 이너로도 단독으로도 활용도가 높아요.',
  부츠: '눈길에도 든든하고 겨울 코디에 무게감을 더해줘요.',
  스카프: '목을 따뜻하게 감싸면서 컬러 포인트가 돼요.',
  패딩: '가볍고 따뜻해서 한겨울 데일리 아우터로 좋아요.',
  레깅스: '신축성이 좋아 어떤 동작에도 편안해요.',
  후드: '가볍게 걸치기 좋은 캐주얼 아이템이에요.',
  스니커즈: '쿠션감 좋은 기본 스니커즈로 어디에나 잘 어울려요.',
  볼캡: '햇빛을 가리면서 캐주얼한 무드를 완성해줘요.',
  조거: '발목을 잡아주는 핏으로 활동성이 좋아요.',
  셔츠: '기본 셔츠 하나로 깔끔하고 호감 가는 인상을 줄 수 있어요.',
  치노: '셔츠와도 티셔츠와도 잘 맞는 활용도 높은 팬츠예요.',
  티셔츠: '매일 입기 좋은 베이직 아이템이에요.',
  데님: '어떤 상의와도 잘 어울리는 데일리 팬츠예요.',
}

// '셔츠'가 '티셔츠'에 걸리지 않도록 단어 시작 기준으로 매칭
const titleHasKeyword = (title: string, keyword: string) =>
  title.split(/\s+/).some((word) => word.startsWith(keyword))

const pickByKeywords = (catalog: Catalog, keywords: string[], gender: Gender, used: Set<number>) => {
  const items: RecommendedProduct[] = []
  for (const keyword of keywords) {
    if (items.length >= PICKS_PER_SECTION) break
    const item = catalog.items.find(
      (i) => !used.has(i.id) && fitsGender(catalog, i.id, gender) && titleHasKeyword(i.title || '', keyword),
    )
    if (item) {
      used.add(item.id)
      items.push(toProduct(item, KEYWORD_REASONS[keyword]))
    }
  }
  return items
}

const recommendWithoutAi = (prompt: string, catalog: Catalog): AiRecommendWithProduct => {
  const preset =
    STYLE_PRESETS.find((p) => p.triggers.some((t) => prompt.includes(t))) ?? STYLE_PRESETS[STYLE_PRESETS.length - 1]
  const used = new Set<number>()
  const sections: RecommendSection[] = (['women', 'men'] as const).map((gender) => ({
    gender,
    label: SECTION_LABELS[gender],
    items: pickByKeywords(catalog, preset[gender], gender, used),
  }))
  return {
    source: 'fallback',
    title: preset.title,
    description: preset.description,
    keywords: preset.keywords,
    sections: sections.filter((section) => section.items.length > 0),
  }
}

export const useAiRecommend = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getRecommendation = async (prompt: string): Promise<AiRecommendWithProduct | null> => {
    setLoading(true)
    setError(null)
    let catalog: Catalog | null = null
    try {
      catalog = await loadCatalog()
      const loaded = catalog
      const catalogText = loaded.items
        .map(
          (item) =>
            `${item.id}|${genderTag(loaded, item.id)}|${item.title}|${item.brand}|${(item.realPrice ?? item.price).toLocaleString()}원`,
        )
        .join('\n')

      const response = await fetch('/api/ai/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'recommend',
          messages: [
            {
              role: 'system',
              content: [
                '너는 패션 쇼핑몰 MyShop의 AI 스타일리스트이다.',
                '아래 판매 중인 상품 목록(id|성별|상품명|브랜드|가격)에서만 골라 사용자 요청에 어울리는 코디를 추천해라.',
                `여성 코디(women)는 여성/공용 상품에서, 남성 코디(men)는 남성/공용 상품에서 각각 서로 잘 어울리는 상품 ${PICKS_PER_SECTION}개를 골라라.`,
                '같은 상품을 두 코디에 중복으로 넣지 말고, 요청과 어울리지 않는 상품은 고르지 마라.',
                '반드시 JSON만 반환해라. 형식:',
                '{"title":"코디 이름(15자 이내)","description":"전체 코디 설명 2문장","keywords":["키워드"],"category":"","women":[{"id":상품id,"reason":"고른 이유 1문장"}],"men":[{"id":상품id,"reason":"고른 이유 1문장"}]}',
                '',
                '[상품 목록]',
                catalogText,
              ].join('\n'),
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

      const body = (await response.json()) as { result?: { content?: string }; content?: string }
      const raw = body.result?.content ?? body.content ?? ''
      const parsed = parseAiJson(raw)
      if (!parsed) {
        // 백엔드가 AI 실패 시 안내 문구를 돌려주므로 키워드 기반 추천으로 대체
        const fallback = recommendWithoutAi(prompt, loaded)
        setLoading(false)
        return fallback
      }

      const keywords = parsed.keywords || []
      const byId = new Map(loaded.items.map((item) => [item.id, item]))
      const used = new Set<number>()
      const sections: RecommendSection[] = (['women', 'men'] as const).map((gender) => {
        const items: RecommendedProduct[] = []
        for (const pick of parsed[gender] || []) {
          const item = byId.get(Number(pick.id))
          if (item && !used.has(item.id) && fitsGender(loaded, item.id, gender)) {
            used.add(item.id)
            items.push(toProduct(item, pick.reason))
          }
          if (items.length >= PICKS_PER_SECTION) break
        }
        return { gender, label: SECTION_LABELS[gender], items }
      })

      setLoading(false)
      return {
        source: 'ai',
        title: parsed.title,
        keywords,
        description: parsed.description || '',
        category: parsed.category || undefined,
        sections: sections.filter((section) => section.items.length > 0),
      }
    } catch (err) {
      if (catalog && catalog.items.length > 0) {
        const fallback = recommendWithoutAi(prompt, catalog)
        if (fallback.sections.length > 0) {
          setLoading(false)
          return fallback
        }
      }
      const message = err instanceof Error ? err.message : 'AI 추천 처리 중 오류가 발생했습니다.'
      setError(message)
      setLoading(false)
      return null
    }
  }

  return { getRecommendation, loading, error }
}
