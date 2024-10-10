import { GetIcon } from "@/components/common/icon";

type Props = {
  location: string | undefined;
  name: string | undefined;
  percentage: number;
  progress: string;
  color: string;
};

export function LocationRow({
  location = "Route",
  name = "Moover",
  percentage,
  progress,
  color = "black",
}: Props) {
  return (
    <>
      <div className="col-span-2 flex items-center space-x-4 ">
        <GetIcon iconName="location-icon" mainColor={color} />
        <div className="flex flex-col">
          <span className="font-semibold">{location}</span>
          <span className="text-sm text-muted-foreground text-slate-500">
            {name}
          </span>
        </div>
      </div>

      <div className="col-span-1 flex flex-col justify-center ">
        <span className="font-semibold">{percentage.toFixed(0)}%</span>
        <span className="text-sm text-muted-foreground text-slate-500">
          {progress}
        </span>
      </div>
    </>
  );
}
