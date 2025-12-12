import { useState, useCallback, useMemo } from 'react'

/**
 * 좋아요 기능 훅
 * - 현재는 랜덤 숫자 표시 + 로컬 토글만 지원
 * - TODO: 나중에 백엔드 API 연결 시 이 훅만 수정하면 됨
 */

interface UseLikeOptions {
  // 초기 좋아요 수 (없으면 랜덤 생성)
  initialCount?: number
  // 초기 좋아요 상태
  initialLiked?: boolean
  // 최소 랜덤 값
  minRandom?: number
  // 최대 랜덤 값
  maxRandom?: number
}

interface UseLikeReturn {
  likeCount: number
  isLiked: boolean
  toggleLike: () => void
}

// 랜덤 좋아요 수 생성 (컴포넌트별로 일관된 값을 위해 ID 기반)
const generateRandomLikeCount = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const useLike = (options: UseLikeOptions = {}): UseLikeReturn => {
  const {
    initialCount,
    initialLiked = false,
    minRandom = 10,
    maxRandom = 500,
  } = options

  // 랜덤 좋아요 수 (초기화 시 한 번만 생성)
  const randomCount = useMemo(
    () => initialCount ?? generateRandomLikeCount(minRandom, maxRandom),
    [initialCount, minRandom, maxRandom]
  )

  const [likeCount, setLikeCount] = useState(randomCount)
  const [isLiked, setIsLiked] = useState(initialLiked)

  // 좋아요 토글
  const toggleLike = useCallback(() => {
    setIsLiked((prev) => {
      const newLiked = !prev
      // 좋아요 상태에 따라 카운트 증감
      setLikeCount((count) => (newLiked ? count + 1 : count - 1))
      return newLiked
    })

    // TODO: 백엔드 API 연결 시 여기에 API 호출 추가
    // try {
    //   await toggleLikeApi(itemId)
    // } catch (error) {
    //   // 롤백
    //   setIsLiked((prev) => !prev)
    //   setLikeCount((count) => (isLiked ? count + 1 : count - 1))
    // }
  }, [])

  return {
    likeCount,
    isLiked,
    toggleLike,
  }
}

/**
 * 여러 아이템의 좋아요 상태를 관리하는 훅
 * - 상품 목록 등에서 사용
 */
interface UseLikesOptions {
  minRandom?: number
  maxRandom?: number
}

interface ItemLikeState {
  count: number
  liked: boolean
}

interface UseLikesReturn {
  getLikeState: (itemId: string | number) => ItemLikeState
  toggleLike: (itemId: string | number) => void
}

export const useLikes = (options: UseLikesOptions = {}): UseLikesReturn => {
  const { minRandom = 10, maxRandom = 500 } = options

  // 아이템별 좋아요 상태 저장
  const [likeStates, setLikeStates] = useState<Map<string | number, ItemLikeState>>(new Map())

  // 아이템별 좋아요 상태 가져오기 (없으면 랜덤 생성)
  const getLikeState = useCallback(
    (itemId: string | number): ItemLikeState => {
      const existing = likeStates.get(itemId)
      if (existing) return existing

      // 새 아이템이면 랜덤 값 생성 후 저장
      const newState: ItemLikeState = {
        count: generateRandomLikeCount(minRandom, maxRandom),
        liked: false,
      }
      setLikeStates((prev) => new Map(prev).set(itemId, newState))
      return newState
    },
    [likeStates, minRandom, maxRandom]
  )

  // 특정 아이템 좋아요 토글
  const toggleLike = useCallback((itemId: string | number) => {
    setLikeStates((prev) => {
      const newMap = new Map(prev)
      const current = newMap.get(itemId) || {
        count: generateRandomLikeCount(minRandom, maxRandom),
        liked: false,
      }

      newMap.set(itemId, {
        count: current.liked ? current.count - 1 : current.count + 1,
        liked: !current.liked,
      })

      return newMap
    })

    // TODO: 백엔드 API 연결 시 여기에 API 호출 추가
  }, [minRandom, maxRandom])

  return {
    getLikeState,
    toggleLike,
  }
}

export default useLike
