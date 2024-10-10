import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

type Props = {
  containerClass?: string;
  width?: string;
  height?: string;
  locations?: MoovinLocation[];
  selectedLocations?: MoovinLocation[];
  initialLocation?: [number, number];
  handleMarkerClick?: (id: string) => void;
  handleMarkerSelectionArea?: (ids: string[]) => void;
};

const Map = ({
  containerClass,
  width,
  height,
  locations,
  selectedLocations,
  initialLocation,
  handleMarkerClick,
  handleMarkerSelectionArea,
}: Props) => {
  const CustomMap = useMemo(
    () =>
      dynamic(() => import("@/components/map/"), {
        loading: () => <p>The map is loading</p>,
        ssr: false,
      }),
    []
  );

  const [isSatellite, setIsSatellite] = useState<boolean>(false);

  return (
    <div className="relative w-full">
      <Tabs
        defaultValue={isSatellite ? "satellite" : "streets"}
        className="absolute z-20 right-0 p-2"
      >
        <TabsList>
          <TabsTrigger
            value="satellite"
            className={"bg-gray-200"}
            onClick={() => {
              setIsSatellite(true);
            }}
          >
            Satellite
          </TabsTrigger>
          <TabsTrigger
            value="streets"
            className={"bg-gray-200"}
            onClick={() => {
              setIsSatellite(false);
            }}
          >
            Map
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div
        className={classNames(
          "bg-white-700 mx-auto w-full min-h-[480px] relative z-10",
          containerClass
        )}
      >
        <CustomMap
          initialLocation={initialLocation}
          selectedLocations={selectedLocations}
          locations={locations}
          width={width}
          height={height}
          handleMarkerClick={handleMarkerClick}
          satellite={isSatellite}
          handleMarkerSelectionArea={handleMarkerSelectionArea}
        />
      </div>
    </div>
  );
};

export default Map;
