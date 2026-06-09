import { useEffect, useMemo, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import MockMap from "@/components/MockMap";
import { GOOGLE_MAPS_LIBRARIES, GOOGLE_MAPS_LOADER_ID } from "@/config/googleMaps";

const DEFAULT_CENTER = {
  lat: 20,
  lng: 0,
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  gestureHandling: "greedy",
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: false,
  backgroundColor: "#050505",
  styles: [
    { elementType: "geometry", stylers: [{ color: "#0b0b0d" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#7c7c84" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0b0b0d" }] },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#15151a" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#52525b" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#111114" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#060b14" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#111111" }],
    },
    // Hide default POI icons and transit station icons to reduce map clutter
    { featureType: "poi", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "poi.business", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "poi.attraction", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "poi.medical", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "poi.school", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "transit.station", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  ],
};

const createMarkerIcon = (color, active = false) => {
  const size = active ? 26 : 18;
  const innerR = active ? 8 : 6;
  const stroke = active ? "#ffffff" : "#0a0a0a";

  // two-circle SVG: outer subtle glow + inner solid circle
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
      <circle cx='${size / 2}' cy='${size / 2}' r='${innerR + 3}' fill='${color}' fill-opacity='0.12' />
      <circle cx='${size / 2}' cy='${size / 2}' r='${innerR}' fill='${color}' stroke='${stroke}' stroke-width='${active ? 2.5 : 1.5}' />
    </svg>`;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: window.google ? new window.google.maps.Size(size, size) : undefined,
    anchor: window.google ? new window.google.maps.Point(size / 2, size / 2) : undefined,
  };
};

export default function HomeMapGoogleMap({
  stations = [],
  nearestId,
  selectedId,
  onSelect,
  className = "",
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!map || !stations.length || !window.google) {
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    stations.forEach((station) => {
      bounds.extend({ lat: station.coords.lat, lng: station.coords.lng });
    });

    if (stations.length === 1) {
      map.setCenter(stations[0].coords);
      map.setZoom(14);
      return;
    }

    map.fitBounds(bounds, 72);
  }, [map, stations]);

  const center = useMemo(() => {
    if (stations[0]?.coords) {
      return stations[0].coords;
    }

    return DEFAULT_CENTER;
  }, [stations]);

  if (!apiKey || loadError || !isLoaded) {
    return (
      <MockMap
        stations={stations}
        nearestId={nearestId}
        selectedId={selectedId}
        onSelect={onSelect}
        className={className}
      />
    );
  }

  return (
    <div data-testid="home-google-map" className={`overflow-hidden ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={mapOptions}
        onLoad={(instance) => setMap(instance)}
        onUnmount={() => setMap(null)}
      >
        {stations.map((station) => {
          const isNearest = station.id === nearestId;
          const isSelected = station.id === selectedId;
          const color = station.availability === "available" ? "#10b981" : station.availability === "busy" ? "#ef4444" : "#71717a";

          return (
            <MarkerF
              key={station.id}
              position={station.coords}
              title={station.name}
              icon={createMarkerIcon(color, isSelected || isNearest)}
              zIndex={isSelected ? 1000 : isNearest ? 900 : 500}
                  onClick={(ev) => onSelect?.(station, ev)}
              optimized={false}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
}