import { useState } from "react";
import { Map } from "@/components/map";
import { Legend } from "@/components/legend";
import { StatsPanel } from "@/components/stats-panel";
import type { School } from "@/types/school";

export default function Home() {
  const [schools, setSchools] = useState<School[]>([]);
  const [showLegend, setShowLegend] = useState(false);

  const handleSchoolsLoad = (loadedSchools: School[]) => {
    setSchools(loadedSchools);
  };

  return (
    <div className="bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 relative z-[1000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Mapa de Colegios</h1>
                <p className="text-sm text-gray-500">Alicante, España</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <span>{schools.length}</span>
                <span>colegios encontrados</span>
              </div>
              
              <Legend 
                isVisible={showLegend} 
                onToggle={() => setShowLegend(!showLegend)} 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <Map onSchoolsLoad={handleSchoolsLoad} />
        <StatsPanel schools={schools} />
      </main>
    </div>
  );
}
