"use client";

import React, { act, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Tooltip,
} from "react-leaflet";
import L, { MarkerOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import MarkerClusterGroup from "react-leaflet-cluster";
import { GetIcon } from "@/components/common/icon";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/custom/button";
import classNames from "classnames";
import { GetPackageSizes } from "@/app/actions";

const createNumberedIcon = (
  hasRoute: boolean,
  order?: string,
  color?: string,
  isCollect?: boolean
) => {
  return L.divIcon({
    html: `
    <div class="relative flex justify-center text-white font-bold">
    <span class="absolute

      left-[50%]
      transform -translate-x-[50%] -translate-y-[50%]
      h-fit
      text-white
      ${
        isCollect
          ? "top-[35%] pt-3 flex items-center justify-center w-8 rounded-tr-3xl rounded-tl-3xl rounded-bl-full rounded-br-full border-t-[1px] border-white"
          : "top-[40%] rounded-full px-2 py-1"
      }
      z-[999]" style="background-color:${color}">
      ${order ? order : "-"}
    </span>
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
    > 
      <path
        fill="${hasRoute ? color : "#636363"}" 
        stroke="#fafafa"
        stroke-width="1"
        fill-rule="evenodd"
        d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017-.017-.006-.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
  `,
    className: "custom-marker",
    iconSize: [48, 48],
    iconAnchor: [25, 45],
  });
};

const initIcon = new L.Icon({
  iconUrl: "/storage_red.png",
  iconSize: [45, 50],
  iconAnchor: [21, 45],
});

interface MapProps {
  centerLocation?: [number, number];
  warehouseLocation?: [number, number];
  zoom?: number;
  routes?: RouteMovin[];
  height?: string;
  width?: string;
  selectedRoute?: number;
  handleMarkerClick?: (idPackage: number, idRoute?: number | undefined) => void;
  handleMarkerSelectionArea?: (
    locations: { idPackage: number; idRoute?: number | undefined }[]
  ) => void;
}

const defaults = {
  zoom: 13,
};

interface CustomMarkerOptions extends MarkerOptions {
  idRoute?: number;
  color?: string;
  isCollect?: boolean;
}

const initialStateFilters = {
  status: "all",
  size: [] as string[],
  type: -1,
  actualRoute: false,
};

const isInitialState = (filters: typeof initialStateFilters) => {
  return JSON.stringify(filters) === JSON.stringify(initialStateFilters);
};

const RouteMapComp: React.FC<MapProps> = ({
  routes,
  zoom = defaults.zoom,
  centerLocation = [9.93333, -84.08333],
  warehouseLocation,
  width = "100%",
  height = "100%",
  handleMarkerClick = () => {},
  handleMarkerSelectionArea = () => {},
  selectedRoute = 0,
}) => {
  const locations = routes ? routes.flatMap((route) => route.locations) : [];
  const [packageSizes, setPackageSizes] = useState<PackageSizes[]>([]);
  const [satellite, setSatellite] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const [editingRoute, setEditingRoute] = useState<number>(0);
  const [onScreenLocations, setOnScreenLocations] =
    useState<MoovinLocation[]>(locations);
  const [mapFilters, setMapFilters] = useState<{
    status: string;
    size: string[];
    type: number;
    actualRoute: boolean;
  }>(initialStateFilters);

  const [markerPositions, setMarkerPositions] = useState<LeafletPosition[]>([]);
  const [expandedClusters, setExpandedClusters] = useState<boolean>(false);

  const HandleOnScreenLocations = (locations: MoovinLocation[]) => {
    let auxLocations: MoovinLocation[] = locations;
    mapFilters.size.length != 0 &&
      (auxLocations = auxLocations.filter((loc) =>
        mapFilters.size.some((size) => size === loc.acronym)
      ));
    mapFilters.status != "all" &&
      (auxLocations = auxLocations.filter((loc) =>
        mapFilters.status === "assign"
          ? loc.idRoute != -1
          : mapFilters.actualRoute
          ? loc.idRoute === -1 || loc.idRoute === selectedRoute
          : loc.idRoute === -1
      ));

    mapFilters.type != -1 &&
      (auxLocations = auxLocations.filter(
        (loc) => loc.isCollect === mapFilters.type
      ));
    mapFilters.actualRoute &&
      (auxLocations = auxLocations.filter(
        (loc) => loc.idRoute === selectedRoute || loc.idRoute == -1
      ));
    auxLocations = eliminarRepetidosPorId(auxLocations);

    return auxLocations;
  };

  function eliminarRepetidosPorId(arr: any) {
    const map = new Map();

    arr.forEach((obj: any) => {
      map.set(obj.id, obj);
    });

    return Array.from(map.values());
  }

  const clearAllFilters = () => {
    setMapFilters(initialStateFilters);
  };

  const hasFilters = !isInitialState(mapFilters);

  useEffect(() => {
    const zoomInButton = document.querySelector(".leaflet-control-zoom-in");
    const zoomOutButton = document.querySelector(".leaflet-control-zoom-out");

    if (zoomInButton) {
      zoomInButton.setAttribute("title", "Acercar");
    }

    if (zoomOutButton) {
      zoomOutButton.setAttribute("title", "Alejar");
    }

    GetPackageSizes().then((res: PackageSizesResponse) => {
      if (res.status === "OK") {
        setPackageSizes(res.body);
      }
    });
  }, []);

  useEffect(() => {
    setOnScreenLocations(HandleOnScreenLocations(locations));
  }, [mapFilters, routes, selectedRoute]);

  useEffect(() => {
    if (!onScreenLocations || onScreenLocations.length === 0) return;

    let newPositions: [number, number][] = [];

    if (
      selectedRoute !== 0 &&
      routes?.some(
        (route) => route.idRoute === selectedRoute && route.locations.length > 0
      )
    ) {
      newPositions = onScreenLocations
        .filter((loc) => loc.idRoute === selectedRoute)
        .map((loc) => loc.pos);
    } else {
      newPositions = onScreenLocations.map((loc) => loc.pos);
    }

    // Evitar setState innecesario si las posiciones no han cambiado
    if (JSON.stringify(markerPositions) !== JSON.stringify(newPositions)) {
      setMarkerPositions(newPositions);
    }
  }, [onScreenLocations, selectedRoute]);

  return (
    <MapContainer
      center={centerLocation}
      zoom={zoom}
      className="z-10"
      style={{ height, width }}
    >
      <div className="absolute right-0 flex w-full my-2 z-[999] gap-2 mr-2 justify-end">
        <Button
          variant="white"
          className={classNames("relative h-8  rounded-md text-xs w-[98px]")}
          onClick={() => setFocus(!focus)}
        >
          Vista general
        </Button>
        <Button
          variant="white"
          className={classNames(
            "relative h-8  rounded-md text-xs w-[98px]",
            mapFilters.actualRoute && "font-semibold border-black"
          )}
          disabled={selectedRoute === 0}
          onClick={() =>
            setMapFilters((prev) => ({
              ...prev,
              actualRoute: !mapFilters.actualRoute,
            }))
          }
        >
          Ruta actual
        </Button>
        <Button
          variant="white"
          className={classNames(
            "relative h-8  rounded-md text-xs w-[98px]",
            satellite && "font-semibold border-black"
          )}
          onClick={() => setSatellite(!satellite)}
        >
          Satélite
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="white"
              className={classNames(
                "relative h-8  rounded-md text-xs w-[98px]",
                mapFilters.status != "all" && "font-semibold border-black"
              )}
            >
              Estado
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 z-50" align="end" forceMount>
            <DropdownMenuItem
              onClick={() =>
                setMapFilters((prev) => ({
                  ...prev,
                  status: "all",
                }))
              }
              className={classNames(
                mapFilters.status === "all" && "font-bold "
              )}
            >
              Todos
            </DropdownMenuItem>{" "}
            <DropdownMenuItem
              onClick={() =>
                setMapFilters((prev) => ({
                  ...prev,
                  status: "assign",
                }))
              }
              className={classNames(
                mapFilters.status === "assign" && "font-bold"
              )}
            >
              Asignado
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setMapFilters((prev) => ({
                  ...prev,
                  status: "not-assign",
                }))
              }
              className={classNames(
                mapFilters.status === "not-assign" && "font-bold"
              )}
            >
              Sin asignar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="white"
              className={classNames(
                "relative h-8  rounded-md text-xs w-[98px]",
                mapFilters.size.length != 0 && "font-semibold border-black"
              )}
            >
              Medidas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 z-50 h-[400px] overflow-y-scroll"
            align="end"
            forceMount
          >
            <DropdownMenuItem
              onClick={() =>
                setMapFilters((prev) => ({
                  ...prev,
                  size: [],
                }))
              }
              className={classNames(
                mapFilters.size.length === 0 && "font-bold"
              )}
            >
              Todos
            </DropdownMenuItem>
            {packageSizes &&
              packageSizes.map((size) => {
                return (
                  <DropdownMenuItem
                    key={size.id}
                    onClick={() =>
                      setMapFilters((prev) => {
                        const currentSizeArray = prev.size || [];
                        const isAcronymPresent = currentSizeArray.includes(
                          size.acronym
                        );
                        const updatedSizeArray = isAcronymPresent
                          ? currentSizeArray.filter(
                              (acronym) => acronym !== size.acronym
                            )
                          : [...currentSizeArray, size.acronym];
                        return {
                          ...prev,
                          size: updatedSizeArray,
                        };
                      })
                    }
                    className={classNames(
                      mapFilters.size.some(
                        (filter) => filter === size.acronym
                      ) && "font-bold"
                    )}
                  >
                    {size.acronym}
                  </DropdownMenuItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="white"
              className={classNames(
                "relative h-8  rounded-md text-xs w-[98px]",
                mapFilters.type != -1 && "font-semibold border-black"
              )}
            >
              Tipo de envio
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 z-50" align="end" forceMount>
            <DropdownMenuItem
              onClick={() =>
                setMapFilters((prev) => ({
                  ...prev,
                  type: -1,
                }))
              }
              className={classNames(mapFilters.type === -1 && "font-bold")}
            >
              Todos
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setMapFilters((prev) => ({
                  ...prev,
                  type: 1,
                }))
              }
              className={classNames(mapFilters.type === 1 && "font-bold")}
            >
              Recogida
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setMapFilters((prev) => ({
                  ...prev,
                  type: 0,
                }))
              }
              className={classNames(mapFilters.type === 0 && "font-bold")}
            >
              Entrega
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant={hasFilters ? "primary" : "white"}
          disabled={!hasFilters}
          className={classNames(
            "relative h-8 w-4  rounded-md text-xs !cursor-pointer transition-all duration-300 border-1",
            satellite && "font-semibold border-black"
          )}
          onClick={clearAllFilters}
        >
          X
        </Button>
      </div>
      <div className="absolute left-[10px] top-[129px] flex flex-col h-full z-[1000]">
        <Button
          type="button"
          variant="white"
          className={classNames(
            "rounded-[5px] cursor-pointer hover:bg-zinc-100 relative p-0 text-gray-500 focus:outline-none w-[34px] h-[34px] border-[#c2c2c1] border-2"
          )}
          iconDivClassName="!m-0"
          iconName={expandedClusters ? "contract" : "expand"}
          iconColor="#464646"
          onClick={() => {
            setExpandedClusters(!expandedClusters);
          }}
        />
      </div>
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
      <MarkerClusterGroup
        key={expandedClusters ? "expanded" : "default"} // Forzar el renderizado
        chunkedLoading
        maxClusterRadius={expandedClusters ? 1 : 35} // Reduce el radio maximo para clustear, es decir, que ahora los puntos tienen qe estar mas cerca para pertenecer a un cluster.
        // spiderfyOnMaxZoom
        // disableClusteringAtZoom={17}
        iconCreateFunction={(cluster: any) => {
          const count = cluster.getChildCount();

          const markers = cluster.getAllChildMarkers();
          let allHaveRoute = true;
          let atLeastOneWithoutRoute = false;
          let allWithoutRoute = true;
          let routeColor = "#fafafa";

          for (let i = 0; i < markers.length; i++) {
            const idRoute = markers[i].options?.idRoute;

            if (idRoute === null || idRoute === undefined || idRoute < 1) {
              atLeastOneWithoutRoute = true;
              allHaveRoute = false;
            } else {
              allWithoutRoute = false;
              if (markers[i].options?.color) {
                routeColor = markers[i].options.color;
              }
            }

            if (atLeastOneWithoutRoute && !allWithoutRoute) {
              break;
            }
          }

          const halfCircle = atLeastOneWithoutRoute && !allWithoutRoute;

          const completeCircle = allHaveRoute;
          let colorObj = {
            leftColor: "#5e5e5e",
            rightColor: "#5e5e5e",
          };

          if (completeCircle) {
            colorObj.leftColor = routeColor;
            colorObj.rightColor = routeColor;
          } else if (halfCircle) {
            colorObj.leftColor = routeColor;
          }

          return L.divIcon({
            html: `<div style="
            width: 40px; 
            height: 40px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #434343;
            background: linear-gradient(45deg, ${colorObj.leftColor} 50%, ${colorObj.rightColor} 50%);
            border-radius: 50%;
            ">
              <span class="text-center flex items-center justify-center w-[30px] h-[30px] rounded-full bg-white text-shadow: 1px 2px 3px #434343;"><b>${count}</b></span>
            </div>`,
            className: "custom-cluster-icon",
            iconSize: L.point(40, 40, true),
          });
        }}
      >
        {onScreenLocations &&
          onScreenLocations.map((loc, idx) => {
            const markerOptions: CustomMarkerOptions = {
              icon: createNumberedIcon(
                !!loc.idRoute,
                loc.order,
                loc.color,
                !!loc.isCollect
              ),
              idRoute: loc.idRoute,
              color: loc.color,
            };

            return (
              <Marker
                icon={createNumberedIcon(
                  !!loc.idRoute,
                  loc.order,
                  loc.color,
                  !!loc.isCollect
                )}
                key={loc.id}
                position={loc.pos}
                draggable={false}
                eventHandlers={{
                  add: (e) => {
                    const leafletMarker = e.target;
                    leafletMarker.options.idRoute = loc.idRoute;
                  },
                  click: () => {
                    handleMarkerClick(Number(loc.id), loc.idRoute);
                    setEditingRoute(loc.idRoute ? loc.idRoute : selectedRoute);
                  },
                }}
                {...markerOptions}
              >
                <Tooltip direction="top" offset={[0, -30]} opacity={1}>
                  <Card className="border-none shadow-none p-2 flex flex-col gap-3">
                    <strong>#{loc.id}</strong>
                    <div className="flex gap-1">
                      <GetIcon iconName="marker" className="w-5 h-5" />
                      {loc.address}
                    </div>
                    <div className="flex gap-1">
                      <GetIcon iconName="package-box" className="w-5 h-5" />
                      {loc.acronym} {loc.weight}
                    </div>
                  </Card>
                </Tooltip>
              </Marker>
            );
          })}
      </MarkerClusterGroup>
      {warehouseLocation && (
        <Marker
          icon={initIcon}
          key={"warehouse"}
          position={warehouseLocation}
          draggable={false}
        />
      )}
      {onScreenLocations && (
        <PolygonDrawer
          locations={onScreenLocations}
          handleSelectedArea={handleMarkerSelectionArea}
        />
      )}
      {routes ? (
        routes.map((x, idx) => {
          return (
            <React.Fragment key={idx}>
              <PolylineDrawer
                locations={HandleOnScreenLocations(x.locations).map(
                  (loc) => loc.pos
                )}
                lineColor={x.color}
                lastLineColor={x.color}
                idRoute={x.idRoute ?? null}
              />
            </React.Fragment>
          );
        })
      ) : (
        <PolylineDrawer
          locations={onScreenLocations.map((loc) => loc.pos)}
          idRoute={null}
        />
      )}
      {markerPositions && (
        <FitBounds
          locations={markerPositions}
          warehousePoint={warehouseLocation || [0, 0]}
          selectedRoute={selectedRoute}
          editingRoute={editingRoute}
          actualRoute={focus}
        />
      )}
    </MapContainer>
  );
};

interface PolygonDrawerProps {
  locations: MoovinLocation[];
  handleSelectedArea: (
    locations: { idPackage: number; idRoute?: number | undefined }[]
  ) => void;
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

    const polygon = document.querySelector(".leaflet-draw-draw-polygon");
    if (polygon) {
      polygon.setAttribute("title", "Seleccionar área");
    }

    const handleCreated = (e: L.LeafletEvent) => {
      const event = e as L.DrawEvents.Created;
      const layer = event.layer;
      featureGroup.addLayer(layer);

      const polygon = layer.toGeoJSON() as GeoJSON.Feature<GeoJSON.Polygon>;
      const insideMarkers = locations.filter((loc) => {
        const point = L.latLng(loc.pos);
        return (layer as L.Polygon).getBounds().contains(point);
      });
      const result = insideMarkers.map((x) => {
        return {
          idPackage: Number(x.id),
          idRoute: x.idRoute,
        };
      });

      handleSelectedArea(result);
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
  lineColor?: string;
  lastLineColor?: string;
  idRoute: number | null;
}> = ({
  locations,
  lineColor = "#ff0000",
  lastLineColor = "#ff0000",
  idRoute,
}) => {
  // No dibujar líneas si la ruta es nula, vacía o el idRoute es -1
  if (idRoute === -1 || idRoute === null || locations.length < 1) return null;

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
          pathOptions={{
            color: lastLineColor,
            weight: 3,
          }}
        />
      )}
    </>
  );
};

type MapViewUpdaterProps = {
  centerLocation: [number, number];
  zoom: number;
};

const MapViewUpdater: React.FC<MapViewUpdaterProps> = ({
  centerLocation,
  zoom,
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView(centerLocation, zoom);
  }, [map, centerLocation, zoom]);

  return null;
};
const FitBounds: React.FC<{
  locations: LeafletPosition[];
  warehousePoint: LeafletPosition;
  selectedRoute: number;
  editingRoute: number;
  actualRoute: boolean;
}> = ({
  locations,
  warehousePoint,
  selectedRoute,
  editingRoute,
  actualRoute,
}) => {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const locationsWithCenter = [...locations, warehousePoint];
      const bounds = L.latLngBounds(locationsWithCenter);
      map.fitBounds(bounds);
    }
  }, [, actualRoute]);

  return null;
};

export default RouteMapComp;
