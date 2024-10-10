"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Marker as LeafletMarker } from "leaflet";

const createNumberedIcon = (selected: boolean, number?: number) => {
  return L.divIcon({
    html: `
      <div class="relative flex justify-center">
        <img src="${
          selected ? "/custom_marker_v2.png" : "/custom_marker_black.png"
        }" class="w-11 h-12" />
        <span class="absolute text-blue-950 text-sm font-bold leading-none" style="right: 25%; top: 18%;">${
          selected ? number : ""
        }</span>
      </div>
    `,
    className: "custom-marker",
    iconSize: [35, 40],
    iconAnchor: [21, 45],
  });
};

const initIcon = new L.Icon({
  iconUrl: "/storage_red.png",
  iconSize: [45, 50],
  iconAnchor: [21, 45],
});

const markedIcon = new L.Icon({
  iconUrl: "/custom_marker.png",
  iconSize: [45, 50],
  iconAnchor: [21, 45],
});

interface MapProps {
  initialLocation?: [number, number];
  zoom?: number;
  position?: LatLngExpression;
  setPosition?: React.Dispatch<React.SetStateAction<[number, number]>>;
  locations?: MoovinLocation[];
  selectedLocations?: MoovinLocation[];
  height?: string;
  width?: string;
  handleMarkerClick?: (id: string) => void;
  handleMarkerSelectionArea?: (id: string[]) => void;
  satellite?: boolean;
  draggable?: boolean;
  markCenter?: boolean;
}

const defaults = {
  zoom: 13,
};

const Map: React.FC<MapProps> = ({
  zoom = defaults.zoom,
  markCenter = false,
  initialLocation = [9.93333, -84.08333],
  locations = [],
  selectedLocations = [],
  width = "100%",
  height = "100%",
  handleMarkerClick = () => {},
  handleMarkerSelectionArea = () => {},
  satellite = false,
  draggable,
  position = initialLocation,
  setPosition,
}) => {
  const markerRef = useRef<LeafletMarker | null>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null && setPosition) {
          const markerLat = marker.getLatLng().lat;
          const markerLng = marker.getLatLng().lng;
          setPosition([markerLat, markerLng]);
        }
      },
    }),
    []
  );

  return (
    <MapContainer
      center={initialLocation}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height, width }}
    >
      {satellite ? (
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      ) : (
        <TileLayer
          attribution='&copy; contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
      )}
      <MarkerClusterGroup chunkedLoading>
        {locations.map((loc) => (
          <Marker
            icon={createNumberedIcon(
              loc.selected,
              loc.selected
                ? selectedLocations.findIndex(
                    (selectedLoc) => selectedLoc.id === loc.id
                  ) + 1
                : undefined
            )}
            key={loc.id}
            position={loc.pos}
            draggable={false}
            eventHandlers={{ click: () => handleMarkerClick(loc.id) }}
          />
        ))}
        {initialLocation && !position && (
          <Marker
            icon={initIcon}
            key={"init"}
            position={initialLocation}
            draggable={false}
          />
        )}
        {draggable === true && (
          <Marker
            icon={markCenter ? markedIcon : initIcon}
            key={"init"}
            ref={markerRef}
            position={position}
            draggable={true}
            eventHandlers={eventHandlers}
          />
        )}
        {markCenter && !draggable && (
          <Marker
            icon={markedIcon}
            key={"markedIcon"}
            position={initialLocation}
            draggable={false}
          />
        )}
      </MarkerClusterGroup>
      <PolygonDrawer
        locations={locations}
        handleSelectedArea={handleMarkerSelectionArea}
      />
      <PolylineDrawer locations={selectedLocations.map((loc) => loc.pos)} />
    </MapContainer>
  );
};

interface PolygonDrawerProps {
  locations: MoovinLocation[];
  handleSelectedArea: (id: string[]) => void;
}

const PolygonDrawer: React.FC<PolygonDrawerProps> = ({
  locations,
  handleSelectedArea,
}) => {
  const map = useMap();

  useEffect(() => {
    const featureGroup = new L.FeatureGroup();
    map.addLayer(featureGroup);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup,
        remove: false,
      },
      draw: {
        marker: false,
        circle: false,
        rectangle: false,
        polyline: false,
        circlemarker: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
        },
      },
    });

    map.addControl(drawControl);

    const handleCreated = (e: L.LeafletEvent) => {
      const event = e as L.DrawEvents.Created;
      const layer = event.layer;
      featureGroup.addLayer(layer);

      const polygon = layer.toGeoJSON() as GeoJSON.Feature<GeoJSON.Polygon>;
      const insideMarkers = locations.filter((loc) => {
        const point = L.latLng(loc.pos);
        return (layer as L.Polygon).getBounds().contains(point);
      });

      handleSelectedArea(insideMarkers.map((x) => x.id));
    };

    map.on(L.Draw.Event.CREATED, handleCreated);

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.removeControl(drawControl);
      map.removeLayer(featureGroup);
    };
  }, [map, locations, handleSelectedArea]);

  return null;
};

const PolylineDrawer: React.FC<{
  locations: [number, number][];
  lastLineColor?: string;
  lineColor?: string;
}> = ({ locations, lineColor = "#ff0000", lastLineColor = "#ff0000" }) => {
  const allButLastLine = locations.slice(0, -1);
  const lastLine = locations.slice(-2);
  return (
    <>
      <Polyline
        positions={allButLastLine}
        pathOptions={{ color: lineColor, weight: 3 }}
      />
      {lastLine.length === 2 && (
        <Polyline
          positions={lastLine}
          pathOptions={{ color: lastLineColor, weight: 3, dashArray: "10,10" }}
        />
      )}
    </>
  );
};

export default Map;
