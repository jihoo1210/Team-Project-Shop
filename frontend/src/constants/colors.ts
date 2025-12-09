/**
 * 의류 쇼핑몰 색상 정의표
 */

export const COLORS = {
  BLACK: { name: '블랙', hex: '#000000' },
  WHITE: { name: '화이트', hex: '#FFFFFF' },
  GRAY: { name: '그레이', hex: '#808080' },
  IVORY: { name: '아이보리', hex: '#FFFFF0' },
  RED: { name: '레드', hex: '#FF0000' },
  PINK: { name: '핑크', hex: '#FFC0CB' },
  ORANGE: { name: '오렌지', hex: '#FFA500' },
  YELLOW: { name: '옐로우', hex: '#FFFF00' },
  GREEN: { name: '그린', hex: '#008000' },
  KHAKI: { name: '카키', hex: '#C3B091' },
  BLUE: { name: '블루', hex: '#0000FF' },
  NAVY: { name: '네이비', hex: '#000080' },
  PURPLE: { name: '퍼플', hex: '#800080' },
  BROWN: { name: '브라운', hex: '#8B4513' },
  BEIGE: { name: '베이지', hex: '#F5F5DC' },
} as const

export type ColorKey = keyof typeof COLORS
