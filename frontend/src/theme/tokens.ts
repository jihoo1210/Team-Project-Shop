import type { PaletteOptions, ThemeOptions } from '@mui/material/styles'

export const brandColors = {
  // 주요 브랜드 컬러
  primary: '#111827',
  secondary: '#1F2937',
  accent: '#6366F1',
  info: '#2563EB',
  warning: '#F59E0B',

  // 배경 컬러
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceHover: '#F3F4F6',
  surfaceActive: '#F8FAFF',

  // 텍스트 컬러
  text: '#111418',
  textDark: '#1a1a1a',
  textLight: '#374151',
  muted: '#6B7280',
  mutedLight: '#9CA3AF',

  // 테두리/구분선
  border: '#E5E7EB',
  borderDark: '#D1D5DB',

  // 상태 컬러
  success: '#16A34A',
  error: '#DC2626',
  errorLight: '#ff4444',

  // 특수 컬러 (SNS 등)
  naver: '#03C75A',
  naverHover: '#02b351',
  google: '#4285F4',
  googleRed: '#EA4335',
  googleYellow: '#FBBC05',
  googleGreen: '#34A853',

  // 채팅/위젯 강조색
  chatPrimary: '#4F7DF3',
  chatGradientStart: '#667eea',
  chatGradientEnd: '#764ba2',

  // 버튼 호버
  primaryHover: '#374151',
  secondaryHover: '#333',
}

export const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: brandColors.primary,
    light: brandColors.textLight,
    dark: brandColors.textDark,
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: brandColors.accent,
    contrastText: '#FFFFFF',
  },
  error: {
    main: brandColors.error,
    light: brandColors.errorLight,
  },
  warning: {
    main: brandColors.warning,
  },
  info: {
    main: brandColors.info,
  },
  success: {
    main: brandColors.success,
  },
  background: {
    default: brandColors.background,
    paper: brandColors.surface,
  },
  text: {
    primary: brandColors.text,
    secondary: brandColors.muted,
    disabled: brandColors.mutedLight,
  },
  divider: brandColors.border,
  grey: {
    50: brandColors.background,
    100: brandColors.surfaceHover,
    200: brandColors.border,
    300: brandColors.borderDark,
    500: brandColors.muted,
    600: brandColors.textLight,
    700: brandColors.secondary,
    800: brandColors.primary,
    900: brandColors.textDark,
  },
}

export const typography: NonNullable<ThemeOptions['typography']> = {
  fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  h1: { fontSize: '2.5rem', fontWeight: 700 },
  h2: { fontSize: '2rem', fontWeight: 700 },
  h3: { fontSize: '1.75rem', fontWeight: 600 },
  h4: { fontSize: '1.5rem', fontWeight: 600 },
  h5: { fontSize: '1.25rem', fontWeight: 600 },
  subtitle1: { fontSize: '1rem', fontWeight: 500 },
  body1: { fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontSize: '0.875rem', lineHeight: 1.5 },
  button: { textTransform: 'none', fontWeight: 600 },
}

export const layoutTokens = {
  headerHeight: 72,
  gutter: 24,
  sectionSpacing: 48,
}

// 글래스모피즘 스타일 토큰
export const glassmorphism = {
  // 기본 글래스 효과
  light: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },

  // 더 투명한 글래스
  subtle: {
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  },

  // 카드용 글래스
  card: {
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },

  // 다크 글래스 (어두운 배경용)
  dark: {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },

  // 강조 글래스 (컬러 틴트)
  accent: {
    background: 'rgba(99, 102, 241, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
  },

  // 버튼/아이콘용 글래스
  button: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}
