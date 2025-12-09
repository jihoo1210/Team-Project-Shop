export interface ProductSummary {
  id: string
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
