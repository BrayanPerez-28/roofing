'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup } from 'react-leaflet';

// Centro geográfico del Bay Area (más al centro entre SF y SJ)
const BAY_AREA_CENTER: [number, number] = [37.6879, -122.1692];

// Radio de servicio aprox. 50 km para cubrir North, East y South Bay
const SERVICE_RADIUS = 52000;

// Ciudades clave con marcadores
const CITY_POINTS: { name: string; position: [number, number] }[] = [
  { name: 'San Francisco', position: [37.7749, -122.4194] },
  { name: 'Oakland', position: [37.8044, -122.2712] },
  { name: 'San Jose', position: [37.3382, -121.8863] },
  { name: 'Palo Alto', position: [37.4419, -122.1430] },
  { name: 'Fremont', position: [37.5485, -121.9886] },
  { name: 'Daly City', position: [37.7021, -122.4616] },
  { name: 'Berkeley', position: [37.8716, -122.2727] },
  { name: 'Santa Clara', position: [37.3541, -121.9552] },
];

export default function BayAreaMap() {
  return (
    <div className="h-full w-full min-h-[320px] relative z-0 overflow-hidden" style={{ zIndex: 0 }}>
      <MapContainer
        center={BAY_AREA_CENTER}
        zoom={10}
        minZoom={9}
        maxZoom={14}
        scrollWheelZoom={false}
        zoomControl={true}
        className="h-full w-full"
        style={{ zIndex: 0, position: 'relative' }}
      >
        {/* Tile base: Carto Dark */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
          subdomains="abcd"
        />

        {/* Círculo exterior de cobertura — glow dorado */}
        <Circle
          center={BAY_AREA_CENTER}
          radius={SERVICE_RADIUS}
          pathOptions={{
            color: '#f5a623',
            fillColor: '#f5a623',
            fillOpacity: 0.08,
            weight: 2,
            dashArray: '8 6',
          }}
        />

        {/* Círculo interior */}
        <Circle
          center={BAY_AREA_CENTER}
          radius={SERVICE_RADIUS * 0.55}
          pathOptions={{
            color: '#f5a623',
            fillColor: '#f5a623',
            fillOpacity: 0.05,
            weight: 1,
            dashArray: '4 4',
          }}
        />

        {/* Marcador central (HQ) — solo Popup al hacer clic */}
        <CircleMarker
          center={BAY_AREA_CENTER}
          radius={9}
          pathOptions={{
            color: '#ffffff',
            fillColor: '#f5a623',
            fillOpacity: 1,
            weight: 2.5,
          }}
        >
          <Popup>
            <strong>Perez Premium Roofing</strong>
            <br />Bay Area — Serving all regions
          </Popup>
        </CircleMarker>

        {/* Ciudades clave — solo Popup al hacer clic */}
        {CITY_POINTS.map((city) => (
          <CircleMarker
            key={city.name}
            center={city.position}
            radius={6}
            pathOptions={{
              color: '#f5a623',
              fillColor: '#f5a623',
              fillOpacity: 0.9,
              weight: 1.5,
            }}
          >
            <Popup>{city.name}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
