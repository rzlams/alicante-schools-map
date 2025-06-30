import schoolsData from "@/data/schools.json";
import type { School } from "@/types/school";
import { useEffect, useRef, useState } from "react";

// Import Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in webpack
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configure default marker icons
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIconRetina,
});

interface MapProps {
  onSchoolsLoad: (schools: School[]) => void;
}

export function Map({ onSchoolsLoad }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const currentOpenPopup = useRef<L.Marker | null>(null);
  const [schools] = useState<School[]>(schoolsData as School[]);

  // Debug schools data immediately
  console.log("Map component initialized");
  console.log("Schools data loaded:", schoolsData.length, "schools");
  console.log("First school from JSON:", schoolsData[0]);
  console.log(
    "Schools with coordinates:",
    schoolsData.filter((s) => s.lat && s.lng).length
  );

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up existing map if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (mapRef.current && !mapInstanceRef.current) {
        try {
          // Initialize map
          const map = L.map(mapRef.current, {
            center: [38.3452, -0.4815],
            zoom: 12,
            zoomControl: true,
          });

          mapInstanceRef.current = map;

          // Add OpenStreetMap tiles
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          // Force map to resize and refresh
          setTimeout(() => {
            map.invalidateSize();

            // Add a center reference marker with custom icon
            L.marker([38.35342019852393, -0.48809630116180125], {
              icon: createReferenceIcon(),
            })
              .addTo(map)
              .bindPopup("Casa de Julio");
          }, 100);

          console.log("Map initialized successfully");
        } catch (error) {
          console.error("Error initializing map:", error);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Load schools data when map and data are ready
  useEffect(() => {
    console.log(
      "Schools effect called - schools:",
      schools?.length,
      "map:",
      !!mapInstanceRef.current
    );

    if (!schools || schools.length === 0) {
      console.log("No schools data available");
      return;
    }

    console.log("Loading schools with data:", schools.length);
    console.log("Schools data preview:", schools.slice(0, 2));
    onSchoolsLoad(schools);

    // Wait for map to be available, then load markers
    const checkMapAndLoad = () => {
      if (mapInstanceRef.current) {
        console.log("Map is ready, loading markers...");
        loadSchoolMarkers(schools);
      } else {
        console.log("Map not ready, waiting...");
        setTimeout(checkMapAndLoad, 100);
      }
    };

    // Start checking after a short delay
    setTimeout(checkMapAndLoad, 300);
  }, [schools, onSchoolsLoad]);

  const createReferenceIcon = () => {
    return L.divIcon({
      className: "custom-reference-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
      html: `
        <div style="
          width: 24px; 
          height: 24px; 
          background-color: #3b82f6; 
          border: 3px solid #ffffff; 
          transform: rotate(45deg);
          box-shadow: 0 3px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s ease;
        " onmouseover="this.style.transform='rotate(45deg) scale(1.1)'" onmouseout="this.style.transform='rotate(45deg) scale(1)'">
        </div>
      `,
    });
  };

  const createCustomIcon = (school: School) => {
    let color = "#374151"; // Default black
    let borderColor = "#ffffff"; // White border

    // New color logic based on user requirements
    if (school.isVisited && school.hasQuota) {
      color = "#059669"; // Green - visited and has quota
    } else if (school.isVisited && !school.hasQuota) {
      color = "#dc2626"; // Red - visited but no quota
    } else {
      color = "#374151"; // Black - not visited (regardless of quota)
    }

    return L.divIcon({
      className: "custom-school-marker",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
      html: `
        <div style="
          width: 20px; 
          height: 20px; 
          background-color: ${color}; 
          border: 3px solid ${borderColor}; 
          border-radius: 50%; 
          box-shadow: 0 3px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s ease;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        </div>
      `,
    });
  };

  const createPopupContent = (school: School) => {
    return `
      <div class="p-4 school-popup" style="min-width: 280px; max-width: 320px;">
        <div class="flex justify-between items-start mb-3">
          <h3 class="pr-2 font-semibold text-gray-900 text-base leading-tight">${
            school.name
          }</h3>
          <div class="flex flex-shrink-0 space-x-1">
            ${
              school.isVisited
                ? '<div class="bg-emerald-500 rounded-full w-2 h-2" title="Visitado"></div>'
                : ""
            }
            ${
              school.hasQuota
                ? '<div class="bg-red-500 rounded-full w-2 h-2" title="Con cuota"></div>'
                : ""
            }
          </div>
        </div>
        
        <div class="space-y-2 text-sm">
          <div class="flex items-start space-x-2">
            <svg class="flex-shrink-0 mt-0.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-gray-600">${school.address}</span>
          </div>
          
          ${
            school.phone
              ? `
          <div class="flex items-center space-x-2">
            <svg class="flex-shrink-0 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <a href="tel:${school.phone}" class="text-blue-600 hover:text-blue-800">${school.phone}</a>
          </div>
          `
              : ""
          }
          
          ${
            school.email
              ? `
          <div class="flex items-center space-x-2">
            <svg class="flex-shrink-0 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <a href="mailto:${school.email}" class="text-blue-600 hover:text-blue-800 text-xs">${school.email}</a>
          </div>
          `
              : ""
          }
          
          ${
            school.comments
              ? `
          <div class="flex items-start space-x-2 mt-3 pt-3 border-gray-200 border-t">
            <svg class="flex-shrink-0 mt-0.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
            </svg>
            <span class="text-gray-600 italic">${school.comments}</span>
          </div>
          `
              : ""
          }
        </div>
      </div>
    `;
  };

  const loadSchoolMarkers = (schoolsData: School[]) => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers and reset popup tracking
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];
    currentOpenPopup.current = null;

    console.log(`Loading ${schoolsData.length} schools on map`);

    // Add markers for schools using their stored coordinates
    let markersAdded = 0;
    let schoolsWithoutCoords = 0;

    schoolsData.forEach((school, index) => {
      // Convert lat/lng to numbers if they're strings
      const lat =
        typeof school.lat === "string" ? parseFloat(school.lat) : school.lat;
      const lng =
        typeof school.lng === "string" ? parseFloat(school.lng) : school.lng;

      if (mapInstanceRef.current && lat && lng && !isNaN(lat) && !isNaN(lng)) {
        try {
          const marker = L.marker([lat, lng], {
            icon: createCustomIcon(school),
          }).addTo(mapInstanceRef.current);

          // Bind popup for both click and hover
          const popup = L.popup({
            maxWidth: 320,
            className: "school-popup-container",
          }).setContent(createPopupContent(school));

          marker.bindPopup(popup);

          // Add click event for toggle functionality
          marker.on("click", function (this: L.Marker) {
            // If this marker's popup is currently open, close it
            if (currentOpenPopup.current === this) {
              this.closePopup();
              currentOpenPopup.current = null;
            } else {
              // Close any currently open popup
              if (currentOpenPopup.current) {
                currentOpenPopup.current.closePopup();
              }
              // Open this marker's popup
              this.openPopup();
              currentOpenPopup.current = this;
            }
          });

          // Track when popup is closed by other means (e.g., clicking the X button)
          marker.on("popupclose", function (this: L.Marker) {
            if (currentOpenPopup.current === this) {
              currentOpenPopup.current = null;
            }
          });

          markersRef.current.push(marker);
          markersAdded++;
        } catch (error) {
          console.error(
            `Error adding marker for school ${school.name}:`,
            error
          );
        }
      } else {
        schoolsWithoutCoords++;
        console.log(
          `School ${school.name} missing coordinates: lat=${lat}, lng=${lng}`
        );
      }
    });

    console.log(
      `Added ${markersAdded} markers out of ${schoolsData.length} schools`
    );
    console.log(`Schools without valid coordinates: ${schoolsWithoutCoords}`);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div
        ref={mapRef}
        className="bg-gray-100 w-full h-full"
        style={{ minHeight: "500px" }}
      />
    </div>
  );
}
