import { Card } from "@/components/ui/card";
import type { House } from "@/types/house";

export type HouseFilterType = "all" | "visited" | "notAvailable";

interface HouseStatsPanelProps {
  houses: House[];
  selectedFilter: HouseFilterType;
  onFilterChange: (filter: HouseFilterType) => void;
  allHouses: House[];
}

export function HouseStatsPanel({
  houses,
  selectedFilter,
  onFilterChange,
  allHouses,
}: HouseStatsPanelProps) {
  // Calculate global statistics from all houses for navigation purposes
  const total = allHouses.length;
  const visited = allHouses.filter(
    (house) => house.isVisited && !house.isNotAvailable
  ).length;
  const notAvailable = allHouses.filter((house) => house.isNotAvailable).length;

  const filterSections = [
    {
      id: "all" as HouseFilterType,
      value: total,
      label: "Total",
      color: "text-gray-900",
    },
    {
      id: "visited" as HouseFilterType,
      value: visited,
      label: "Visitados",
      color: "text-emerald-600",
    },
    {
      id: "notAvailable" as HouseFilterType,
      value: notAvailable,
      label: "No disponible",
      color: "text-red-600",
    },
  ];

  return (
    <Card className="bottom-4 left-4 z-[1000] absolute bg-white shadow-lg p-4 border border-gray-200 rounded-lg">
      <div className="mb-2">
        <h3 className="font-semibold text-gray-700 text-sm">
          Casas en Alquiler
        </h3>
      </div>
      <div className="gap-4 grid grid-cols-3 text-center">
        {filterSections.map((section) => (
          <div
            key={section.id}
            className={`cursor-pointer p-2 rounded-md transition-colors duration-200 ${
              selectedFilter === section.id ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
            onClick={() => onFilterChange(section.id)}
          >
            <div className={`font-bold text-2xl ${section.color}`}>
              {section.value}
            </div>
            <div className="text-gray-500 text-xs">{section.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
