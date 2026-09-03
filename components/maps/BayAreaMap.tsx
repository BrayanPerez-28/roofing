'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

// Centro geográfico del Bay Area (más al centro entre SF y SJ)
const BAY_AREA_CENTER: [number, number] = [37.6879, -122.1692];


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
  { name: 'Santa Rosa', position: [38.4404, -122.7141] },
  { name: 'Bodega Bay', position: [38.3327, -123.0497] },
  { name: 'Sonoma', position: [38.2921, -122.4580] },
  { name: 'Napa', position: [38.2975, -122.2869] },
  { name: 'San Rafael', position: [37.9735, -122.5311] },
  { name: 'Concord', position: [37.9780, -122.0311] },
  { name: 'San Mateo', position: [37.5630, -122.3255] },
  { name: 'Pacifica', position: [37.6138, -122.4869] },
  { name: 'Walnut Creek', position: [37.9101, -122.0652] },
  { name: 'Half Moon Bay', position: [37.4635, -122.4286] },
  { name: 'Morgan Hill', position: [37.1305, -121.6544] },
  { name: 'Gilroy', position: [37.0058, -121.5683] },
  { name: 'Cupertino', position: [37.3230, -122.0322] },
  { name: 'Campbell', position: [37.2872, -121.9400] },
  { name: 'Sunnyvale', position: [37.3688, -122.0363] },
  { name: 'Milpitas', position: [37.4323, -121.8996] },
  { name: 'Mountain View', position: [37.3861, -122.0839] },
];

export default function BayAreaMap() {
  return (
    <div className="map-dark-mode h-full w-full min-h-[320px] relative z-0 overflow-hidden" style={{ zIndex: 0 }}>

      {/* ── Dark-mode filter: only the tile layer is inverted, SVG overlays are not ── */}
      <style>{`
        /* Invierte únicamente los tiles de OSM → mapa oscuro con colores naturales */
        .map-dark-mode .leaflet-tile-pane {
          filter:
            invert(1)
            hue-rotate(200deg)
            brightness(0.80)
            contrast(0.88)
            saturate(0.60);
        }

        /* Controles de zoom y atribución: también en oscuro */
        .map-dark-mode .leaflet-control-zoom a,
        .map-dark-mode .leaflet-control-attribution {
          background: rgba(15, 15, 20, 0.75) !important;
          color: #9ca3af !important;
          border-color: rgba(255,255,255,0.08) !important;
          backdrop-filter: blur(6px);
        }
        .map-dark-mode .leaflet-control-zoom a:hover {
          background: rgba(30, 30, 40, 0.90) !important;
          color: #f5a623 !important;
        }
        .map-dark-mode .leaflet-control-attribution a {
          color: #6b7280 !important;
        }

        /* Popups en tema oscuro */
        .map-dark-mode .leaflet-popup-content-wrapper,
        .map-dark-mode .leaflet-popup-tip {
          background: rgba(15, 15, 22, 0.92) !important;
          color: #e2e8f0 !important;
          border: 1px solid rgba(245, 166, 35, 0.25) !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.60) !important;
          backdrop-filter: blur(8px);
        }
        .map-dark-mode .leaflet-popup-close-button {
          color: #9ca3af !important;
        }
      `}</style>

      <MapContainer
        center={BAY_AREA_CENTER}
        zoom={9}
        minZoom={9}
        maxZoom={14}
        scrollWheelZoom={false}
        zoomControl={true}
        className="h-full w-full"
        style={{ zIndex: 0, position: 'relative' }}
      >
        {/* Tile base: OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

