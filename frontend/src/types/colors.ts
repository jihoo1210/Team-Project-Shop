/**
 * 의류 쇼핑몰 색상 정의표
 */

export const COLORS = {
  BLACK: { name: '블랙', hex: '#000000' },
  WHITE: { name: '화이트', hex: '#FFFFFF' },
  GRAY: { name: '그레이', hex: '#808080' },
  IVORY: { name: '아이보리', hex: '#E8E4D9' },
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
  BEIGE: { name: '베이지', hex: '#D4C4A8' },
} as const

export type ColorKey = keyof typeof COLORS

// 5열 3줄 레이아웃
export const COLOR_ORDER: ColorKey[] = [
  // 1줄: 무채색 계열
  'WHITE', 'IVORY', 'BEIGE', 'GRAY', 'BLACK',
  // 2줄: 따뜻한 색 계열
  'BROWN', 'RED', 'ORANGE', 'YELLOW', 'PINK',
  // 3줄: 차가운 색 계열
  'KHAKI', 'GREEN', 'BLUE', 'NAVY', 'PURPLE',
]
