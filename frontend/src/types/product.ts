export interface ProductSummary {
  id: number
  title: string
  brand: string
  price: number
  
  discountPercent?: number
  realPrice?: number
  scoreAverage?: number
  reviewCount?: number
  likeCount?: number
  status?: '판매중' | '품절' | '예약'
  mainImage: string
  mainImageUrl?: string
  badges?: string[]
  favorite?: boolean
  cart?: boolean
  isFavorite?: boolean
  isCart?: boolean
}

export interface ProductDetail extends ProductSummary {
  description: string
  colorList: string[]
  sizeList: string[]
  imageList: string[]
  sku: string
  stock?: number
  savedInLikes?: boolean
  savedInCart?: boolean
}
