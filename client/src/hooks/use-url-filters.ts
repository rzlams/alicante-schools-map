import type { HouseFilterType } from '@/components/house-stats-panel'
import type { FilterType } from '@/pages/home'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'wouter'

interface UrlFilters {
  schoolFilter: FilterType
  houseFilter: HouseFilterType
}

interface UrlFiltersReturn {
  schoolFilter: FilterType
  houseFilter: HouseFilterType
  setSchoolFilter: (filter: FilterType) => void
  setHouseFilter: (filter: HouseFilterType) => void
}

const VALID_SCHOOL_FILTERS: FilterType[] = ['all', 'visited', 'withoutQuota']
const VALID_HOUSE_FILTERS: HouseFilterType[] = ['all', 'visited', 'notAvailable']

// Helper functions to validate filters
const isValidSchoolFilter = (filter: string): filter is FilterType => {
  return VALID_SCHOOL_FILTERS.includes(filter as FilterType)
}

const isValidHouseFilter = (filter: string): filter is HouseFilterType => {
  return VALID_HOUSE_FILTERS.includes(filter as HouseFilterType)
}

// Parse URL search params to get filters
const parseFiltersFromUrl = (): UrlFilters => {
  const urlParams = new URLSearchParams(window.location.search)

  const schoolFilter = urlParams.get('schoolFilter')
  const houseFilter = urlParams.get('houseFilter')

  return {
    schoolFilter: isValidSchoolFilter(schoolFilter || '') ? (schoolFilter as FilterType) : 'all',
    houseFilter: isValidHouseFilter(houseFilter || '') ? (houseFilter as HouseFilterType) : 'all',
  }
}

// Update URL with new filters
const updateUrlWithFilters = (schoolFilter: FilterType, houseFilter: HouseFilterType) => {
  const urlParams = new URLSearchParams(window.location.search)

  // Only set params if they're not the default 'all'
  if (schoolFilter === 'all') {
    urlParams.delete('schoolFilter')
  } else {
    urlParams.set('schoolFilter', schoolFilter)
  }

  if (houseFilter === 'all') {
    urlParams.delete('houseFilter')
  } else {
    urlParams.set('houseFilter', houseFilter)
  }

  const newUrl = urlParams.toString()
  const baseUrl = window.location.pathname
  const fullUrl = newUrl ? `${baseUrl}?${newUrl}` : baseUrl

  // Update URL without causing a page refresh
  window.history.replaceState(null, '', fullUrl)
}

export function useUrlFilters(): UrlFiltersReturn {
  const [location] = useLocation()
  const [filters, setFilters] = useState<UrlFilters>(() => parseFiltersFromUrl())

  // Update filters when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const newFilters = parseFiltersFromUrl()
    setFilters(newFilters)
  }, [location])

  // Handle school filter change
  const setSchoolFilter = useCallback((schoolFilter: FilterType) => {
    setFilters((prev) => {
      const newFilters = { ...prev, schoolFilter }
      updateUrlWithFilters(newFilters.schoolFilter, newFilters.houseFilter)
      return newFilters
    })
  }, [])

  // Handle house filter change
  const setHouseFilter = useCallback((houseFilter: HouseFilterType) => {
    setFilters((prev) => {
      const newFilters = { ...prev, houseFilter }
      updateUrlWithFilters(newFilters.schoolFilter, newFilters.houseFilter)
      return newFilters
    })
  }, [])

  return {
    schoolFilter: filters.schoolFilter,
    houseFilter: filters.houseFilter,
    setSchoolFilter,
    setHouseFilter,
  }
}
