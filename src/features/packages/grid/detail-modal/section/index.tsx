"use client";
import React, { ReactNode, useState } from "react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/custom/button";
import { InfoItem } from "./info-item";
import { Label } from "@/components/ui/label";

type Props = {
  title: string;
  children: ReactNode;
  cols?: number;
};

const SectionModal = ({ title, children, cols = 2 }: Props) => {
  return (
    <div>
      <Label className="text-[16px] font-semibold">{title}</Label>
      <Separator className="mt-1 mb-3" />
      <div className={`grid grid-cols-${cols} gap-2 gap-y-4`}>{children}</div>
    </div>
  );
};

export default SectionModal;
