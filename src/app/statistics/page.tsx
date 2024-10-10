import PageContainer from "@/components/page-container";
import { PieChartContainer } from "@/components/ui/pie-chart";
import StatisticsContainer from "@/features/statistics";

const Statistics = () => {
  return (
    <PageContainer title={"Estadísticas"}>
      <StatisticsContainer />
    </PageContainer>
  );
};

export default Statistics;
