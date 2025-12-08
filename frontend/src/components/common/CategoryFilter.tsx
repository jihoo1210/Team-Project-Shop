import ExpandMore from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface CategoryFilterProps {
  onFilterChange?: (filters: FilterState) => void
}

export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  brands: string[]
  badges: string[]
}

const categories: FilterOption[] = [
  { id: 'outer', label: '아우터', count: 42 },
  { id: 'top', label: '상의', count: 128 },
  { id: 'bottom', label: '하의', count: 86 },
  { id: 'sneakers', label: '스니커즈', count: 64 },
  { id: 'bag', label: '가방', count: 35 },
  { id: 'accessory', label: '액세서리', count: 91 },
]

const brands: FilterOption[] = [
  { id: 'myshop', label: 'MyShop Originals', count: 89 },
  { id: 'premium', label: 'Premium Line', count: 56 },
  { id: 'flexfit', label: 'Flexfit', count: 43 },
  { id: 'urban', label: 'Urban Style', count: 38 },
  { id: 'denim', label: 'Denim Pro', count: 29 },
]

const badges: FilterOption[] = [
  { id: 'new', label: '신규', count: 25 },
  { id: 'best', label: '베스트', count: 18 },
  { id: 'sale', label: '할인', count: 47 },
  { id: 'limited', label: '한정수량', count: 12 },
]

const CategoryFilter = ({ onFilterChange }: CategoryFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 500000],
    brands: [],
    badges: [],
  })

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId]
    
    const newFilters = { ...filters, categories: newCategories }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleBrandChange = (brandId: string) => {
    const newBrands = filters.brands.includes(brandId)
      ? filters.brands.filter((id) => id !== brandId)
      : [...filters.brands, brandId]
    
    const newFilters = { ...filters, brands: newBrands }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleBadgeChange = (badgeId: string) => {
    const newBadges = filters.badges.includes(badgeId)
      ? filters.badges.filter((id) => id !== badgeId)
      : [...filters.badges, badgeId]
    
    const newFilters = { ...filters, badges: newBadges }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    const newFilters = { ...filters, priceRange: newValue as [number, number] }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearAllFilters = () => {
    const newFilters: FilterState = {
      categories: [],
      priceRange: [0, 500000],
      brands: [],
      badges: [],
    }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.badges.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 500000

  return (
    <Paper elevation={0} sx={{ p: 2, position: 'sticky', top: 80, border: '1px solid #E5E7EB' }}>
      <Stack spacing={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ pb: 2, borderBottom: '1px solid #E5E7EB' }}>
          <Typography variant="h6" fontWeight={700}>
            필터
          </Typography>
          {hasActiveFilters && (
            <Chip label="초기화" size="small" onClick={clearAllFilters} onDelete={clearAllFilters} />
          )}
        </Box>

        {/* 카테고리 필터 */}
        <Accordion defaultExpanded elevation={0} disableGutters sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid #E5E7EB' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>카테고리</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {categories.map((category) => (
                <FormControlLabel
                  key={category.id}
                  control={
                    <Checkbox
                      checked={filters.categories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      size="small"
                    />
                  }
                  label={
                    <Box display="flex" justifyContent="space-between" width="100%">
                      <Typography variant="body2">{category.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.count}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* 가격 필터 */}
        <Accordion defaultExpanded elevation={0} disableGutters sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid #E5E7EB' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>가격</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Slider
                value={filters.priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={500000}
                step={10000}
                valueLabelFormat={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {filters.priceRange[0].toLocaleString()}원
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filters.priceRange[1].toLocaleString()}원
                </Typography>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* 브랜드 필터 */}
        <Accordion elevation={0} disableGutters sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid #E5E7EB' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>브랜드</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {brands.map((brand) => (
                <FormControlLabel
                  key={brand.id}
                  control={
                    <Checkbox
                      checked={filters.brands.includes(brand.id)}
                      onChange={() => handleBrandChange(brand.id)}
                      size="small"
                    />
                  }
                  label={
                    <Box display="flex" justifyContent="space-between" width="100%">
                      <Typography variant="body2">{brand.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {brand.count}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* 배지 필터 */}
        <Accordion elevation={0} disableGutters sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>상품 태그</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {badges.map((badge) => (
                <Chip
                  key={badge.id}
                  label={`${badge.label} (${badge.count})`}
                  onClick={() => handleBadgeChange(badge.id)}
                  color={filters.badges.includes(badge.id) ? 'primary' : 'default'}
                  variant={filters.badges.includes(badge.id) ? 'filled' : 'outlined'}
                  size="small"
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Paper>
  )
}

export default CategoryFilter
