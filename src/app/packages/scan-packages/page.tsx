import PageContainer from "@/components/page-container";
import { Dialog } from "@/components/ui/dialog";
import PackagesContainer from "@/features/packages/package-load";

const QrScanPage = () => {
  return (
    <Dialog>
      <PageContainer title={"Recepción de carga"}>
        <div className="flex flex-col md:flex-row  gap-6">
          <PackagesContainer />
        </div>
      </PageContainer>
    </Dialog>
  );
};

export default QrScanPage;
