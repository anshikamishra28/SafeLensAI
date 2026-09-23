"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

type SafetyMapProps = {
  latitude: number;
  longitude: number;
  locationName?: string;
  policeStation?: {
    name: string;
    latitude: number;
    longitude: number;
    distance_m: number;
  } | null;
};

function MapCenter({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], 15);
  }, [map, latitude, longitude]);

  return null;
}

/*
 * SafeLens searched-location marker
 */
const locationIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #22d3ee;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #0f172a;
      "></div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -18],
});

/*
 * SafeLens police-station marker
 */
const policeIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #3b82f6;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 17px;
      font-weight: bold;
    ">
      P
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -18],
});

export default function SafetyMap({
  latitude,
  longitude,
  locationName,
  policeStation,
}: SafetyMapProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={true}
        className="h-[420px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenter
          latitude={latitude}
          longitude={longitude}
        />

        {/* Searched location */}
        <Marker
          position={[latitude, longitude]}
          icon={locationIcon}
        >
          <Popup>
            <strong>
              {locationName || "Selected location"}
            </strong>
            <br />
            SafeLens assessment location
          </Popup>
        </Marker>

        {/* Nearest police station */}
        {policeStation && (
          <Marker
            position={[
              policeStation.latitude,
              policeStation.longitude,
            ]}
            icon={policeIcon}
          >
            <Popup>
              <strong>{policeStation.name}</strong>
              <br />
              Nearest mapped police station
              <br />
              {policeStation.distance_m >= 1000
                ? `${(
                    policeStation.distance_m / 1000
                  ).toFixed(2)} km away`
                : `${Math.round(
                    policeStation.distance_m,
                  )} m away`}
            </Popup>
          </Marker>
        )}
        {policeStation && (
  <Polyline
    positions={[
      [latitude, longitude],
      [
        policeStation.latitude,
        policeStation.longitude,
      ],
    ]}
    pathOptions={{
      color: "#22d3ee",
      weight: 4,
      dashArray: "8 8",
    }}
  />
)}
      </MapContainer>
    </div>
  );
}