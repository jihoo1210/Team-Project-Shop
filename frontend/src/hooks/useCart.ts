import { useState, useEffect, useCallback } from 'react'
import { fetchCartItems, toggleCartItem } from '@/api/itemApi'

export interface CartItem {
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  option?: string
  color?: string
  size?: string
  discountRate?: number // 할인율 (0~100)
}

// API 응답 아이템 타입
interface CartApiItem {
  item_id: string
  item_name?: string
  name?: string
  main_image?: string
  image?: string
  price?: number
  quantity?: number
  option?: string
  color?: string
  size?: string
  discount_percent?: number
  discountRate?: number
}

const CART_STORAGE_KEY = 'myshop_cart'

/**
 * 장바구니 훅
 * - 백엔드 API 우선 시도
 * - 실패 시 로컬 스토리지 사용 (fallback)
 */
export const useCart = () => {
  // 초기값을 localStorage에서 바로 로드 (깜빡임 방지)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(false)

  // 로컬 스토리지에서 장바구니 로드
  const loadFromLocalStorage = useCallback((): CartItem[] => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }, [])

  // 로컬 스토리지에 장바구니 저장
  const saveToLocalStorage = useCallback((items: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.error('로컬 스토리지 저장 실패:', err)
    }
  }, [])

  // 장바구니 로드 (백엔드 우선, 실패 시 로컬 스토리지)
  const loadCart = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetchCartItems()
      const backendItems: CartItem[] = (response.content || []).map((item: CartApiItem) => ({
        productId: item.item_id,
        productName: item.item_name || item.name || '상품명',
        productImage: item.main_image || item.image || 'https://placehold.co/100x100/png',
        price: item.price || 0,
        quantity: item.quantity || 1,
        option: item.option,
        color: item.color,
        size: item.size,
        discountRate: item.discount_percent || item.discountRate || 0,
      }))

      // 백엔드에 데이터가 있으면 백엔드 데이터 사용
      if (backendItems.length > 0) {
        setCartItems(backendItems)
        saveToLocalStorage(backendItems)
      } else {
        // 백엔드가 비어있으면 로컬 스토리지 유지
        const localItems = loadFromLocalStorage()
        setCartItems(localItems)
      }
    } catch {
      // 백엔드 실패 시 로컬 스토리지 사용
      const localItems = loadFromLocalStorage()
      setCartItems(localItems)
    } finally {
      setLoading(false)
    }
  }, [loadFromLocalStorage, saveToLocalStorage])

  // 장바구니에 상품 추가
  const addToCart = useCallback(async (item: CartItem): Promise<boolean> => {
    console.log('[useCart] addToCart 호출:', item)

    // 먼저 로컬 스토리지에 저장 (즉시 반영)
    const currentItems = loadFromLocalStorage()
    console.log('[useCart] 현재 장바구니:', currentItems)

    const existingIndex = currentItems.findIndex(
      (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
    )

    if (existingIndex >= 0) {
      // 이미 있으면 수량 증가
      currentItems[existingIndex].quantity += item.quantity
    } else {
      // 새로 추가
      currentItems.push(item)
    }

    saveToLocalStorage(currentItems)
    setCartItems(currentItems)
    console.log('[useCart] 저장 완료:', currentItems)

    // 백엔드 API는 비동기로 시도 (실패해도 무시)
    try {
      await toggleCartItem(item.productId)
    } catch {
      // 백엔드 실패해도 로컬에는 이미 저장됨
      console.log('백엔드 장바구니 동기화 실패')
    }

    return true
  }, [loadFromLocalStorage, saveToLocalStorage])

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback(async (productId: string, color?: string, size?: string): Promise<boolean> => {
    try {
      await toggleCartItem(productId)
    } catch {
      // 백엔드 실패해도 로컬에서는 제거
    }
    
    const currentItems = loadFromLocalStorage()
    const filteredItems = currentItems.filter(
      (i) => !(i.productId === productId && i.color === color && i.size === size)
    )
    
    saveToLocalStorage(filteredItems)
    setCartItems(filteredItems)
    return true
  }, [loadFromLocalStorage, saveToLocalStorage])

  // 장바구니 수량 변경
  const updateQuantity = useCallback((productId: string, quantity: number, color?: string, size?: string) => {
    const currentItems = loadFromLocalStorage()
    const updatedItems = currentItems.map((item) => {
      if (item.productId === productId && item.color === color && item.size === size) {
        return { ...item, quantity: Math.max(1, quantity) }
      }
      return item
    })
    
    saveToLocalStorage(updatedItems)
    setCartItems(updatedItems)
  }, [loadFromLocalStorage, saveToLocalStorage])

  // 장바구니 비우기
  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_STORAGE_KEY)
    setCartItems([])
  }, [])

  // 장바구니 총액 계산
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cartItems])

  // 장바구니 상품 수
  const getItemCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartItems])

  // 초기 로드
  useEffect(() => {
    loadCart()
  }, [loadCart])

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
    getTotalPrice,
    getItemCount,
  }
}

// 전역 장바구니 이벤트 (컴포넌트 간 동기화용)
export const CART_UPDATED_EVENT = 'cart:updated'

export const dispatchCartUpdate = () => {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT))
}
