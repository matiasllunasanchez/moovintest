import { GetIcon } from "@/components/common/icon";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { divIcon } from "leaflet";

type Props = {
  locations?: MoovinLocation[];
  topRightComponent?: ReactNode;
  onLocationReorder: (updatedLocations: MoovinLocation[]) => void;
  header?: boolean;
};

const LocationList = ({
  locations,
  topRightComponent,
  onLocationReorder,
  header,
}: Props) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedLocations = Array.from(locations!);
    const [movedItem] = updatedLocations.splice(result.source.index, 1);
    updatedLocations.splice(result.destination.index, 0, movedItem);

    onLocationReorder(updatedLocations);
  };
  const hasLocations = locations && locations.length > 0;

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="locations">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col text-sm text-[#71717A] mb-2 relative"
            >
              {header ? (
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <GetIcon iconName="package-box" className="" />
                    <Label className="text-lg overflow-hidden font-semibold">
                      Paquetes
                    </Label>
                    <div className="ml-auto"> {topRightComponent}</div>
                  </div>
                  {hasLocations && (
                    <Label className="text-sm">
                      {locations.length}{" "}
                      {locations.length > 1
                        ? "paquetes seleccionados"
                        : "paquete seleccionado"}
                    </Label>
                  )}
                </div>
              ) : (
                <div className="py-2">
                  <Label className="text-md overflow-hidden ">
                    Paquetes seleccionados
                  </Label>
                </div>
              )}
              {hasLocations ? (
                locations.map((location, idx) => (
                  <Draggable
                    key={location.id}
                    draggableId={location.id}
                    index={idx}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex flex-row w-full items-center p-3 mb-2 hover:bg-slate-100 rounded  overflow-hidden cursor-grab transition-all duration-300"
                      >
                        <div className="flex flex-col gap-2 mb-3 w-full">
                          <div className="flex flex-row items-center w-full">
                            <GetIcon
                              iconName="location-icon"
                              mainColor="#C7C7C7"
                              className="mr-2"
                            />
                            <div className="flex flex-col w-full">
                              <div className="flex items-center mb-2 gap-2">
                                <Label className="font-bold text-md">
                                  {"#" + location.id + " - " + location.address}
                                </Label>
                              </div>
                              <div className="flex gap-2">
                                <Label className="font-bold">Peso:</Label>
                                <Label className=" text-nowrap">
                                  {location.acronym} - {location.weight} kg
                                </Label>
                              </div>
                            </div>
                            <GetIcon
                              iconName="drag-icon"
                              mainColor="#C7C7C7"
                              className=""
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <div>
                  <Label className="italic">
                    Todavía no ha seleccionado ninguna ubicación
                  </Label>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default LocationList;
