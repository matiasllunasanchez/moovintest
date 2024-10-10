"use client";

import { Pie, PieChart } from "recharts";

import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label } from "./label";
import { GetIcon } from "../common/icon";
import { Loader2, X } from "lucide-react";

type props = {
  chartData: MoovinChartItem[];
  chartConfig: any;
  isLoadingData: boolean;
};

export function PieChartContainer({
  chartData,
  chartConfig,
  isLoadingData,
}: props) {
  const isEmptyData = !(chartData && chartData.find((x) => x.value > 0));
  return (
    <div className="flex flex-row items-center justify-center">
      {isLoadingData ? (
        <div className="flex flex-col min-h-[250px] flex-grow justify-center items-center p-5 text-center text-gray-500 text-xl fade-in-20">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        </div>
      ) : isEmptyData ? (
        <>
          <div className="flex flex-col min-h-[250px] flex-grow justify-center items-center p-5 text-center text-gray-500 text-xl fade-in-20">
            <span>No hay datos disponibles para mostrar el gráfico.</span>
          </div>
        </>
      ) : (
        <>
          <CardContent className="flex-1 p-0 ">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={chartData} dataKey="value" nameKey="key" />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <div className="flex-1 flex flex-col">
            {chartData.map((chart) => {
              return (
                <div key={chart.key} className="flex flex-row items-center">
                  <div style={{ color: chart.fill }} className="p-0">
                    <GetIcon
                      iconName="dot-icon"
                      className="fill-current w-10 h-10"
                    />
                  </div>
                  <Label>{chart.key}</Label>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
