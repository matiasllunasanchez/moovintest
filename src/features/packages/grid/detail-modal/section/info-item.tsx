import { Label } from "@/components/ui/label";

export const InfoItem = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <div className="grid grid-cols-1 gap-1 overflow-hidden">
      <Label className="text-[14px] font-light">{title}</Label>
      <Label className="text-[14px] font-semibold break-words">{value}</Label>
    </div>
  );
};
