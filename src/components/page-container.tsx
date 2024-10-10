import { cn } from "@/lib/utils";
import { ReactNode } from "react";
const PageContainer = ({
  children,
  title,
  aside,
}: {
  children: ReactNode;
  title?: string;
  aside?: ReactNode;
}) => {
  return (
    <div className="flex flex-col">
      <div className={cn("w-full flex flex-end", aside && "justify-between")}>
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        {aside && <div className="justify-end">{aside}</div>}
      </div>
      {children}
    </div>
  );
};

export default PageContainer;
