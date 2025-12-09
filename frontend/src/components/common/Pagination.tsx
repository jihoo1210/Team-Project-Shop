import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import { Box, IconButton, Stack, Typography } from '@mui/material'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        size="small"
      >
        <ChevronLeft />
      </IconButton>

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <Typography key={`ellipsis-${index}`} sx={{ px: 1 }}>
              ...
            </Typography>
          )
        }

        const pageNum = page as number
        const isActive = pageNum === currentPage

        return (
          <Box
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            sx={{
              minWidth: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              cursor: 'pointer',
              fontWeight: isActive ? 700 : 400,
              bgcolor: isActive ? 'primary.main' : 'transparent',
              color: isActive ? 'white' : 'text.primary',
              '&:hover': {
                bgcolor: isActive ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            {pageNum}
          </Box>
        )
      })}

      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        size="small"
      >
        <ChevronRight />
      </IconButton>
    </Stack>
  )
}

export default Pagination
