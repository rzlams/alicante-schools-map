import { Card } from '@/components/ui/card'
import type { FilterType } from '@/pages/home'
import type { School } from '@/types/school'

interface StatsPanelProps {
  schools: School[]
  selectedFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  allSchools: School[] // Add prop for all schools to calculate global stats
}

export function StatsPanel({ schools, selectedFilter, onFilterChange, allSchools }: StatsPanelProps) {
  // Calculate global statistics from all schools for navigation purposes
  const total = allSchools.length
  const visited = allSchools.filter((school) => school.isVisited && school.hasQuota).length
  const withoutQuota = allSchools.filter((school) => school.isVisited && !school.hasQuota).length

  const filterSections = [
    {
      id: 'all' as FilterType,
      value: total,
      label: 'Total',
      color: 'text-gray-900',
    },
    {
      id: 'visited' as FilterType,
      value: visited,
      label: 'Visitados',
      color: 'text-emerald-600',
    },
    {
      id: 'withoutQuota' as FilterType,
      value: withoutQuota,
      label: 'Sin cupo',
      color: 'text-red-600',
    },
  ]

  return (
    <Card className="bottom-4 left-4 z-[1000] absolute bg-white shadow-lg p-2 md:p-4 border border-gray-200 rounded-lg">
      <div className="mb-2">
        <h3 className="font-semibold text-gray-700 text-sm">Colegios</h3>
      </div>
      <div className="gap-2 md:gap-4 grid grid-cols-3 text-center">
        {filterSections.map((section) => (
          <div
            key={section.id}
            className={`cursor-pointer p-1 md:p-2 rounded-md transition-colors duration-200 ${
              selectedFilter === section.id ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            onClick={() => onFilterChange(section.id)}
          >
            <div className={`font-bold text-lg md:text-2xl ${section.color}`}>{section.value}</div>
            <div className="text-gray-500 text-xs md:text-sm">{section.label}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
