import PageContainer from "@/components/page-container";
import DrawContainer from "@/features/draw";

const PackageDraw = () => {
  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row  gap-6">
        <DrawContainer />
      </div>
    </PageContainer>
  );
};

export default PackageDraw;
