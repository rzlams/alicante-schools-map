import { Card } from "@/components/ui/card";

interface LegendProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function Legend({ isVisible, onToggle }: LegendProps) {
  return (
    <>
      <button
        onClick={onToggle}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Leyenda
      </button>
      
      {isVisible && (
        <Card className="absolute top-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-[1000]">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Estado de Colegios
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-all duration-200">
              <div className="w-4 h-4 rounded-full bg-gray-700 border-2 border-white shadow-sm"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">No visitado</p>
                <p className="text-xs text-gray-500">Estado predeterminado</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-all duration-200">
              <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-sm"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Visitado</p>
                <p className="text-xs text-gray-500">Colegio ya visitado</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-all duration-200">
              <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-sm"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Con cuota</p>
                <p className="text-xs text-gray-500">Tiene plaza disponible</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
