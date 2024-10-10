"use client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import LocationList from "./location-list";
import Image from "next/image";
import { Button } from "@/components/custom/button";
import Map from "@/components/custom/map";
import { useEffect, useMemo, useState } from "react";
type props = {
  route?: Route;
};

const NewRoutePackagesContainer: React.FC<props> = (props) => {
  // console.log(props.route, "RUTA CREADA EN LA PANTALLA ANTERIOR");
  const [initialLocation, setInitialLocation] = useState<[number, number]>([
    0, 0,
  ]);
  const [browserPosition, setBrowserPosition] = useState<{
    lat: number;
    long: number;
  }>();
  const [locationData, setLocationData] = useState<MoovinLocation[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<MoovinLocation[]>(
    []
  );

  const generateMockLocations = (
    center: [number, number],
    count: number
  ): MoovinLocation[] => {
    const locations: MoovinLocation[] = [];

    for (let i = 0; i < count; i++) {
      const randomLat = center[0] + (Math.random() - 0.5) * 0.02; // Rango de +/- 0.01 grados
      const randomLong = center[1] + (Math.random() - 0.5) * 0.02; // Rango de +/- 0.01 grados
      locations.push({
        pos: [randomLat, randomLong],
        id: `${i + 1}`,
        selected: false,
        idPackageSize: 1,
        idStatus: 1,
        statusTranslate: "",
        nameStatus: "",
        isCollect: 0,
      });
    }
    return locations;
  };

  const mockLocationData: MoovinLocation[] = useMemo(() => {
    if (!initialLocation) return [];
    return generateMockLocations(initialLocation, 7);
  }, [initialLocation]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setBrowserPosition({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    browserPosition?.lat &&
      setInitialLocation([browserPosition?.lat, browserPosition?.long]);
  }, [browserPosition]);

  useEffect(() => {
    setLocationData(mockLocationData);
  }, [mockLocationData]);

  const handleMarkerClick = (id: string) => {
    const selectedMarker = locationData.find((x) => x.id === id);
    if (!selectedMarker) return;

    setSelectedPackages((prevItems) => {
      if (prevItems.find((x) => x.id === selectedMarker.id)) {
        const newSelected = prevItems.filter(
          (item) => item.id !== selectedMarker.id
        );
        return newSelected;
      } else {
        return [...prevItems, selectedMarker];
      }
    });

    const updatedLocationData = locationData.map((pkg) => {
      if (pkg.id === id) {
        return { ...pkg, selected: !pkg.selected };
      }
      return pkg;
    });
    setLocationData(updatedLocationData);
  };

  const handleMultipleMarkerSelection = (ids: string[]) => {
    const selectedMarkers = locationData.filter((x) => ids.includes(x.id));
    if (selectedMarkers.length === 0) return;

    setSelectedPackages(selectedMarkers);

    const newLocationData = mockLocationData.map((marker) => {
      if (ids.includes(marker.id)) {
        return { ...marker, selected: !marker.selected };
      }
      return marker;
    });

    setLocationData(newLocationData);
  };

  const createGoogleMapsUrl = (packages: MoovinLocation[]): string => {
    const initPoint = `${initialLocation[0]} ${initialLocation[1]}`;

    if (packages.length === 0) {
      return "";
    }

    const positionToString = (pos: LeafletPosition): string => {
      if (Array.isArray(pos)) {
        return `${pos[0]},${pos[1]}`;
      } else {
        return `${pos.lat},${pos.lng}`;
      }
    };

    const coordinates = packages.map((pkg) => positionToString(pkg.pos));
    const destination = coordinates[0];
    const waypointsStr =
      coordinates.length > 1
        ? `&waypoints=${coordinates.slice(1).join("|")}`
        : "";

    const url = `https://www.google.com/maps/dir/?api=1&origin=${initPoint}&destination=${destination}${waypointsStr}`;
    return url;
  };

  const googleMapsUrl = createGoogleMapsUrl(selectedPackages);

  const handleLocationReorder = (updatedLocations: MoovinLocation[]) => {
    setSelectedPackages(updatedLocations);
  };

  const heightScreen = "75vh";

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
      <div
        className={`flex flex-col col-span-1 lg:col-span-2 h-[${heightScreen}] gap-2`}
      >
        <Card className="flex-grow overflow-y-auto">
          <CardContent className="p-4">
            <LocationList
              locations={selectedPackages}
              onLocationReorder={handleLocationReorder}
              topRightComponent={
                selectedPackages.length > 0 && (
                  <Link href={googleMapsUrl} target="_blank">
                    <Image
                      src="/google-maps.256x256.png"
                      alt="GoogleMaps Icon"
                      className="mr-2 hover:opacity-50 transition-all duration-300 "
                      width={30}
                      height={30}
                    />
                  </Link>
                )
              }
            />
          </CardContent>
        </Card>
        <Button variant="black" className="w-full">
          Finalizar ruta
        </Button>
      </div>
      <Card className="col-span-1 lg:col-span-5 min-h-[480px] ">
        <CardContent className="p-0 overflow-hidden !rounded-sm">
          {initialLocation[0] != 0 && initialLocation[1] != 0 && (
            <Map
              locations={locationData}
              selectedLocations={selectedPackages}
              initialLocation={initialLocation}
              height={heightScreen}
              handleMarkerClick={handleMarkerClick}
              handleMarkerSelectionArea={handleMultipleMarkerSelection}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewRoutePackagesContainer;
