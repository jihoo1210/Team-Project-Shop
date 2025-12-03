import { createTheme } from '@mui/material/styles'
import { brandColors, layoutTokens, palette, typography } from './tokens'

const theme = createTheme({
  palette,
  typography,
  shape: {
    borderRadius: 12,
  },
  spacing: 4,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: brandColors.background,
          color: brandColors.text,
        },
        '*::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: brandColors.secondary,
          borderRadius: 999,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          fontWeight: 600,
        },
        containedPrimary: {
          color: '#FFFFFF',
          backgroundColor: brandColors.primary,
          '&:hover': {
            backgroundColor: '#0F172A',
          },
        },
        containedSecondary: {
          color: '#FFFFFF',
          backgroundColor: brandColors.accent,
          '&:hover': {
            backgroundColor: '#4F46E5',
          },
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
      styleOverrides: {
        root: {
          paddingInline: layoutTokens.gutter,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: brandColors.surface,
          border: `1px solid ${brandColors.border}`,
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.surface,
          color: brandColors.text,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.surface,
          color: brandColors.text,
          borderBottom: `1px solid ${brandColors.border}`,
        },
      },
    },
  },
})

export default theme
