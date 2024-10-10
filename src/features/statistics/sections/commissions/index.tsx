import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const CommissionsStatisticsContainer = () => {
  return (
    <div className="flex flex-col h-full md:px-2 pt-4 md:pt-0">
      <Label className="text-[22px] font-semibold">Comisiones</Label>
      <div className="flex flex-col gap-4 mt-4 justify-between flex-grow h-full">
        <Card className="flex-grow pt-6">
          <CardContent className="flex flex-col h-full justify-between">
            <Label className="font-normal text-md text-[#64748B]">
              Por cobrar
            </Label>
            <Label className="text-3xl">$ 0.00</Label>
          </CardContent>
        </Card>
        <Card className="flex-grow pt-6">
          <CardContent className="flex flex-col h-full justify-between">
            <Label className="font-normal text-md text-[#64748B]">
              Por cobrar
            </Label>
            <Label className="text-3xl">$ 0.00</Label>
          </CardContent>
        </Card>
        <Card className="flex-grow pt-6">
          <CardContent className="flex flex-col h-full justify-between">
            <Label className="font-normal text-md text-[#64748B]">
              Por cobrar
            </Label>
            <Label className="text-3xl">$ 0.00</Label>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommissionsStatisticsContainer;
