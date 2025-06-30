import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { School } from "@/types/school";

// Import Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  onSchoolsLoad: (schools: School[]) => void;
}

export function Map({ onSchoolsLoad }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);


  const { data: schools, isLoading } = useQuery<School[]>({
    queryKey: ["/api/schools"],
  });

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([38.3452, -0.4815], 12);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!schools || !mapInstanceRef.current) return;

    onSchoolsLoad(schools);
    loadSchoolMarkers(schools);
  }, [schools, onSchoolsLoad]);

  const createCustomIcon = (school: School) => {
    let color = '#374151'; // Default black
    
    if (school.hasQuota) {
      color = '#dc2626'; // Red - takes priority
    } else if (school.isVisited) {
      color = '#059669'; // Green
    }

    return L.divIcon({
      className: 'custom-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      html: `<div style="width: 16px; height: 16px; background-color: ${color}; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`
    });
  };

  const createPopupContent = (school: School) => {
    return `
      <div class="school-popup p-4" style="min-width: 280px; max-width: 320px;">
        <div class="flex items-start justify-between mb-3">
          <h3 class="font-semibold text-gray-900 text-base leading-tight pr-2">${school.name}</h3>
          <div class="flex space-x-1 flex-shrink-0">
            ${school.isVisited ? '<div class="w-2 h-2 bg-emerald-500 rounded-full" title="Visitado"></div>' : ''}
            ${school.hasQuota ? '<div class="w-2 h-2 bg-red-500 rounded-full" title="Con cuota"></div>' : ''}
          </div>
        </div>
        
        <div class="space-y-2 text-sm">
          <div class="flex items-start space-x-2">
            <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-gray-600">${school.address}</span>
          </div>
          
          ${school.phone ? `
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <a href="tel:${school.phone}" class="text-blue-600 hover:text-blue-800">${school.phone}</a>
          </div>
          ` : ''}
          
          ${school.email ? `
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <a href="mailto:${school.email}" class="text-blue-600 hover:text-blue-800 text-xs">${school.email}</a>
          </div>
          ` : ''}
          
          ${school.comments ? `
          <div class="flex items-start space-x-2 mt-3 pt-3 border-t border-gray-200">
            <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
            </svg>
            <span class="text-gray-600 italic">${school.comments}</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  };

  const loadSchoolMarkers = (schools: School[]) => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for schools that have coordinates
    schools.forEach(school => {
      if (school.lat && school.lng && mapInstanceRef.current) {
        const marker = L.marker([school.lat, school.lng], {
          icon: createCustomIcon(school)
        }).addTo(mapInstanceRef.current);

        marker.bindPopup(createPopupContent(school), {
          maxWidth: 320,
          className: 'school-popup-container'
        });

        markersRef.current.push(marker);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-[calc(100vh-4rem)]">
        <div ref={mapRef} className="w-full h-full" />
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando colegios...</p>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-[calc(100vh-4rem)]" />;
}
