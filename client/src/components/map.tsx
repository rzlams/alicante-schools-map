import type { HouseFilterType } from '@/components/house-stats-panel'
import housesData from '@/data/houses.json'
import schoolsData from '@/data/schools.json'
import type { FilterType } from '@/pages/home'
import type { Agent, House, HousesData } from '@/types/house'
import type { School } from '@/types/school'
import { useEffect, useRef, useState } from 'react'

// Import Leaflet
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in webpack
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Configure default marker icons
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIconRetina,
})

interface MapProps {
  onSchoolsLoad: (schools: School[]) => void
  onHousesLoad: (houses: House[]) => void
  selectedFilter: FilterType
  selectedHouseFilter: HouseFilterType
}

export function Map({ onSchoolsLoad, onHousesLoad, selectedFilter, selectedHouseFilter }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const schoolMarkersRef = useRef<L.Marker[]>([])
  const houseMarkersRef = useRef<L.Marker[]>([])
  const currentOpenPopup = useRef<L.Marker | null>(null)
  const [schools] = useState<School[]>(schoolsData as School[])
  const [housesDataState] = useState<HousesData>(housesData as HousesData)

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

  // Debug data immediately
  console.log('Map component initialized')
  console.log('Schools data loaded:', schoolsData.length, 'schools')
  console.log('Houses data loaded:', housesDataState.houses.length, 'houses')
  console.log('Agents data loaded:', housesDataState.agents.length, 'agents')

  useEffect(() => {
    if (!mapRef.current) return

    // Clean up existing map if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
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
          })

          mapInstanceRef.current = map

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map)

          // Force map to resize and refresh
          setTimeout(() => {
            map.invalidateSize()

            // Add a center reference marker with custom icon
            L.marker([38.35342019852393, -0.48809630116180125], {
              icon: createReferenceIcon(),
            })
              .addTo(map)
              .bindPopup('Casa de Julio')
          }, 100)

          console.log('Map initialized successfully')
        } catch (error) {
          console.error('Error initializing map:', error)
        }
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Load schools and houses data when map and data are ready
  useEffect(() => {
    if (!schools || schools.length === 0 || !housesDataState.houses || housesDataState.houses.length === 0) {
      console.log('No data available')
      return
    }

    console.log('Loading data - schools:', schools.length, 'houses:', housesDataState.houses.length)
    onSchoolsLoad(schools)
    onHousesLoad(housesDataState.houses)

    // Wait for map to be available, then load markers
    const checkMapAndLoad = () => {
      if (mapInstanceRef.current) {
        console.log('Map is ready, loading markers...')
        const filteredSchools = getFilteredSchools(schools, selectedFilter)
        const filteredHouses = getFilteredHouses(housesDataState.houses, selectedHouseFilter)
        loadSchoolMarkers(filteredSchools)
        loadHouseMarkers(filteredHouses, housesDataState.agents)
      } else {
        console.log('Map not ready, waiting...')
        setTimeout(checkMapAndLoad, 100)
      }
    }

    // Start checking after a short delay
    setTimeout(checkMapAndLoad, 300)
  }, [schools, housesDataState, selectedFilter, selectedHouseFilter, onSchoolsLoad, onHousesLoad])

  const createReferenceIcon = () => {
    return L.divIcon({
      className: 'custom-reference-marker',
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
    })
  }

  const createCustomIcon = (school: School) => {
    let color = '#374151' // Default black
    let borderColor = '#ffffff' // White border

    // New color logic based on user requirements
    if (school.isVisited && school.hasQuota) {
      color = '#059669' // Green - visited and has quota
    } else if (school.isVisited && !school.hasQuota) {
      color = '#dc2626' // Red - visited but no quota
    } else {
      color = '#374151' // Black - not visited (regardless of quota)
    }

    return L.divIcon({
      className: 'custom-school-marker',
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
    })
  }

  const createHouseIcon = (house: House) => {
    let color = '#374151' // Default black
    let borderColor = '#ffffff' // White border
    let extraBorder = ''

    // Color logic for houses
    if (house.isNotAvailable) {
      color = '#dc2626' // Light gray - not available
    } else if (house.isVisited) {
      color = '#059669' // Green - visited
    } else {
      color = '#374151' // Black - default
    }

    // Add orange border for HIGH priority
    if (house.priority === 'HIGH') {
      extraBorder = 'box-shadow: 0 0 0 2px #f97316, 0 3px 6px rgba(0,0,0,0.3);'
    } else {
      extraBorder = 'box-shadow: 0 3px 6px rgba(0,0,0,0.3);'
    }

    return L.divIcon({
      className: 'custom-house-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
      html: `
        <div style="
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 17px solid ${color};
          position: relative;
          cursor: pointer;
          transition: transform 0.2s ease;
          ${extraBorder}
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          <div style="
            position: absolute;
            top: 17px;
            left: -10px;
            width: 20px;
            height: 3px;
            background-color: ${borderColor};
          "></div>
        </div>
      `,
    })
  }

  const createSchoolPopupContent = (school: School) => {
    return `
      <div class="p-4 school-popup" style="min-width: 280px; max-width: 320px;">
        <div class="flex justify-between items-start mb-3">
          <h3 class="pr-2 font-semibold text-gray-900 text-base leading-tight">${school.name}</h3>
          <div class="flex flex-shrink-0 space-x-1">
            ${school.isVisited ? '<div class="bg-emerald-500 rounded-full w-2 h-2" title="Visitado"></div>' : ''}
            ${school.hasQuota ? '<div class="bg-red-500 rounded-full w-2 h-2" title="Con cupo"></div>' : ''}
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
              : ''
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
              : ''
          }
          
          ${
            school.web
              ? `
          <div class="flex items-center space-x-2">
            <svg class="flex-shrink-0 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            <a href="${school.web}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 text-xs">${school.web}</a>
          </div>
          `
              : ''
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
              : ''
          }
        </div>
      </div>
    `
  }

  const createHousePopupContent = (house: House, agent: Agent | undefined) => {
    const agentInfo = agent
      ? `
      <div class="mt-3 pt-3 border-gray-200 border-t">
        <details class="group">
          <summary class="flex justify-between items-center font-medium text-gray-700 group-open:text-gray-900 text-sm cursor-pointer list-none">
            <span>Información del Agente</span>
            <svg class="w-4 h-4 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <div class="space-y-1 mt-2 text-gray-600 text-xs">
            ${agent.name ? `<div><span class="font-medium">Contacto:</span> ${agent.name}</div>` : ''}
            ${agent.agency ? `<div><span class="font-medium">Agencia:</span> ${agent.agency}</div>` : ''}
            ${agent.address ? `<div><span class="font-medium">Dirección:</span> ${agent.address}</div>` : ''}
            ${
              agent.phone
                ? `<div><span class="font-medium">Teléfono:</span> <a href="tel:${agent.phone}" class="text-blue-600 hover:text-blue-800">${agent.phone}</a></div>`
                : ''
            }
            ${
              agent.email
                ? `<div><span class="font-medium">Email:</span> <a href="mailto:${agent.email}" class="text-blue-600 hover:text-blue-800">${agent.email}</a></div>`
                : ''
            }
            ${
              agent.web
                ? `<div><span class="font-medium">Web:</span> <a href="${agent.web}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800">${agent.web}</a></div>`
                : ''
            }
          </div>
        </details>
      </div>
    `
      : ''

    return `
      <div class="p-4 house-popup" style="min-width: 280px; max-width: 320px;">
        <div class="flex justify-between items-start mb-3 pr-4">
          <h3 class="pr-2 font-semibold text-gray-900 text-base leading-tight">Piso en Alquiler</h3>
          <div class="flex flex-shrink-0 space-x-1">
            ${house.isVisited ? '<div class="bg-emerald-500 rounded-full w-2 h-2" title="Visitado"></div>' : ''}
            ${house.isNotAvailable ? '<div class="rounded-full w-2 h-2 text-red-600" title="No disponible"></div>' : ''}
            ${house.priority === 'HIGH' ? '<div class="bg-orange-500 rounded-full w-2 h-2" title="Prioridad alta"></div>' : ''}
          </div>
        </div>
        
        <div class="space-y-2 text-sm">
          <div class="flex items-start space-x-2">
            <svg class="flex-shrink-0 mt-0.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-gray-600">${house.address}</span>
          </div>
          
          <div class="flex items-center space-x-2">
            <svg class="flex-shrink-0 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
            <span class="text-gray-600"><span class="font-medium">${house.price}€/mes</span></span>
          </div>
          
          <div class="flex items-center space-x-2">
            <svg class="flex-shrink-0 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-gray-600">Garantía: ${house.warrantyMonths} ${house.warrantyMonths === 1 ? 'mes' : 'meses'}</span>
          </div>
          
          <div class="flex items-center space-x-2">
            <svg class="flex-shrink-0 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span class="text-gray-600">Seguro: ${house.requireInsurance ? 'Obligatorio' : 'No requerido'}</span>
          </div>
          
          ${
            house.comments
              ? `
          <div class="flex items-start space-x-2 mt-3 pt-3 border-gray-200 border-t">
            <svg class="flex-shrink-0 mt-0.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
            </svg>
            <span class="text-gray-600 italic">${house.comments}</span>
          </div>
          `
              : ''
          }
          
          ${agentInfo}
        </div>
      </div>
    `
  }

  const loadSchoolMarkers = (schoolsData: School[]) => {
    if (!mapInstanceRef.current) return

    // Clear existing school markers
    schoolMarkersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    schoolMarkersRef.current = []

    console.log(`Loading ${schoolsData.length} schools on map`)

    schoolsData.forEach((school) => {
      const lat = typeof school.lat === 'string' ? parseFloat(school.lat) : school.lat
      const lng = typeof school.lng === 'string' ? parseFloat(school.lng) : school.lng

      if (mapInstanceRef.current && lat && lng && !isNaN(lat) && !isNaN(lng)) {
        try {
          const marker = L.marker([lat, lng], {
            icon: createCustomIcon(school),
          }).addTo(mapInstanceRef.current)

          const popup = L.popup({
            maxWidth: 320,
            className: 'school-popup-container',
          }).setContent(createSchoolPopupContent(school))

          marker.bindPopup(popup)

          marker.on('click', function (this: L.Marker) {
            if (currentOpenPopup.current === this) {
              this.closePopup()
              currentOpenPopup.current = null
            } else {
              if (currentOpenPopup.current) {
                currentOpenPopup.current.closePopup()
              }
              this.openPopup()
              currentOpenPopup.current = this
            }
          })

          marker.on('popupclose', function (this: L.Marker) {
            if (currentOpenPopup.current === this) {
              currentOpenPopup.current = null
            }
          })

          schoolMarkersRef.current.push(marker)
        } catch (error) {
          console.error(`Error adding marker for school ${school.name}:`, error)
        }
      }
    })
  }

  const loadHouseMarkers = (housesData: House[], agents: Agent[]) => {
    if (!mapInstanceRef.current) return

    // Clear existing house markers
    houseMarkersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    houseMarkersRef.current = []

    console.log(`Loading ${housesData.length} houses on map`)

    housesData.forEach((house) => {
      const lat = typeof house.lat === 'string' ? parseFloat(house.lat) : house.lat
      const lng = typeof house.lng === 'string' ? parseFloat(house.lng) : house.lng

      if (mapInstanceRef.current && lat && lng && !isNaN(lat) && !isNaN(lng)) {
        try {
          const marker = L.marker([lat, lng], {
            icon: createHouseIcon(house),
            zIndexOffset: 1000, // Houses on top of schools
          }).addTo(mapInstanceRef.current)

          const agent = agents.find((a) => a.id === house.agentId)
          const popup = L.popup({
            maxWidth: 320,
            className: 'house-popup-container',
          }).setContent(createHousePopupContent(house, agent))

          marker.bindPopup(popup)

          marker.on('click', function (this: L.Marker) {
            if (currentOpenPopup.current === this) {
              this.closePopup()
              currentOpenPopup.current = null
            } else {
              if (currentOpenPopup.current) {
                currentOpenPopup.current.closePopup()
              }
              this.openPopup()
              currentOpenPopup.current = this
            }
          })

          marker.on('popupclose', function (this: L.Marker) {
            if (currentOpenPopup.current === this) {
              currentOpenPopup.current = null
            }
          })

          houseMarkersRef.current.push(marker)
        } catch (error) {
          console.error(`Error adding marker for house ${house.id}:`, error)
        }
      }
    })
  }

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div ref={mapRef} className="bg-gray-100 w-full h-full" style={{ minHeight: '500px' }} />
    </div>
  )
}
