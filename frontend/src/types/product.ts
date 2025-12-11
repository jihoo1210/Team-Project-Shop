export interface ProductSummary {
  id: number
  title: string
  brand: string
  price: number
  discountPercent?: number
  scoreAverage?: number
  reviewCount?: number
  likeCount?: number
  status?: '판매중' | '품절' | '예약'
  mainImage: string
  badges?: string[]
  favorite?: boolean
  cart?: boolean
}

export interface ProductDetail extends ProductSummary {
  description: string
  colorList: string[]
  sizeList: string[]
  imageList: string[]
  sku: string
  savedInLikes?: boolean
  savedInCart?: boolean
}
