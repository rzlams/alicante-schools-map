import { Card } from "@/components/ui/card";
import type { School } from "@/types/school";

interface StatsPanelProps {
  schools: School[];
}

export function StatsPanel({ schools }: StatsPanelProps) {
  const total = schools.length;
  const visited = schools.filter(school => school.isVisited).length;
  const withQuota = schools.filter(school => school.hasQuota).length;

  return (
    <Card className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-[1000]">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-600">{visited}</div>
          <div className="text-xs text-gray-500">Visitados</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-600">{withQuota}</div>
          <div className="text-xs text-gray-500">Con cuota</div>
        </div>
      </div>
    </Card>
  );
}
