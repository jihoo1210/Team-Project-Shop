import type { PaletteOptions, ThemeOptions } from '@mui/material/styles'

export const brandColors = {
  primary: '#111827',
  secondary: '#1F2937',
  accent: '#6366F1',
  info: '#2563EB',
  warning: '#F59E0B',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111418',
  muted: '#6B7280',
  border: '#E5E7EB',
}

export const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: brandColors.primary,
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: brandColors.accent,
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#DC2626',
  },
  warning: {
    main: brandColors.warning,
  },
  info: {
    main: brandColors.info,
  },
  success: {
    main: '#16A34A',
  },
  background: {
    default: brandColors.background,
    paper: brandColors.surface,
  },
  text: {
    primary: brandColors.text,
    secondary: brandColors.muted,
  },
  divider: brandColors.border,
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
