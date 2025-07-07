import { type HouseFilterType } from '@/components/house-stats-panel'
import { Map } from '@/components/map'
import { StatsPanel } from '@/components/stats-panel'
import { useUrlFilters } from '@/hooks/use-url-filters'
import type { House } from '@/types/house'
import type { School } from '@/types/school'
import { useState } from 'react'

export type FilterType = 'all' | 'visited' | 'withoutQuota'

export default function Home() {
  const [schools, setSchools] = useState<School[]>([])
  const [houses, setHouses] = useState<House[]>([])

  // Use URL-based filters instead of local state
  const { schoolFilter, houseFilter, setSchoolFilter, setHouseFilter } = useUrlFilters()

  const handleSchoolsLoad = (loadedSchools: School[]) => {
    setSchools(loadedSchools)
  }

  const handleHousesLoad = (loadedHouses: House[]) => {
    setHouses(loadedHouses)
  }

  // Function to filter schools based on selected filter
  const getFilteredSchools = (schools: School[], filter: FilterType): School[] => {
    switch (filter) {
      case 'visited':
        return schools.filter((school) => school.isVisited && school.hasQuota)
      case 'withoutQuota':
        return schools.filter((school) => school.isVisited && !school.hasQuota)
      case 'all':
      default:
        return schools
    }
  }

  // Function to filter houses based on selected filter
  const getFilteredHouses = (houses: House[], filter: HouseFilterType): House[] => {
    switch (filter) {
      case 'visited':
        return houses.filter((house) => house.isVisited && !house.isNotAvailable)
      case 'notAvailable':
        return houses.filter((house) => house.isNotAvailable)
      case 'all':
      default:
        return houses
    }
  }

  const filteredSchools = getFilteredSchools(schools, schoolFilter)
  const filteredHouses = getFilteredHouses(houses, houseFilter)

  return (
    <div className="bg-slate-50 font-sans">
      {/* Header */}
      <header className="z-[1000] relative bg-white shadow-sm border-slate-200 border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex justify-center items-center bg-blue-600 rounded-lg w-8 h-8">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-semibold text-gray-900 text-lg sm:text-xl leading-tight">Mapa de Colegios y Pisos en Alquiler</h1>
                <p className="text-gray-500 text-xs sm:text-sm">Alicante, España</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2 text-gray-600 text-xs sm:text-sm">
                <span className="hidden sm:inline">{schools.length} colegios</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{houses.length} pisos</span>
                <span className="hidden sm:inline">•</span>
                <span className="text-blue-600">
                  <a target="_blank" href="https://w2.alicante.es/zonasescolares/#" className="whitespace-nowrap">
                    Zonas Escolares
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <Map onSchoolsLoad={handleSchoolsLoad} onHousesLoad={handleHousesLoad} selectedFilter={schoolFilter} selectedHouseFilter={houseFilter} />

        {/* <HouseStatsPanel houses={filteredHouses} selectedFilter={houseFilter} onFilterChange={setHouseFilter} allHouses={houses} /> */}

        <StatsPanel schools={filteredSchools} selectedFilter={schoolFilter} onFilterChange={setSchoolFilter} allSchools={schools} />
      </main>
    </div>
  )
}
