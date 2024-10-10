import { ReclaimPackage } from "@/app/actions";
import { GetIcon } from "@/components/common/icon";
import { Button } from "@/components/custom/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
type props = {
  idPackage: number;
  closeModalFunction: () => void;
};
const ReportPackage: React.FC<props> = ({ idPackage, closeModalFunction }) => {
  const { selectedWarehouse, user } = useUser();
  const formSchema = z.object({
    reclaimtext: z
      .string()
      .min(2, {
        message: "Reclaim must be at least 2 characters.",
      })
      .max(100, {
        message: "Reclaim has more than 100 characters.",
      }),

    idPackage: z.number(),
    idWarehouse: z.number(),
    idDelegate: z.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reclaimtext: "",
      idPackage: idPackage,
      idWarehouse: selectedWarehouse?.id,
      idDelegate: user?.delegate?.idDelegate,
    },
  });
  const showSuccessProcess = (text: string) => {
    toast({
      variant: "default",
      title: "Acción realizada",
      description: text,
    });
  };

  const showErrorProcess = (text: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: text,
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await ReclaimPackage({
        idDelegate: values.idDelegate.toString(),
        idWarehouse: values.idWarehouse.toString(),
        packageCode: values.idPackage.toString(),
        observations: values.reclaimtext,
      }).then((res: ReclaimPackageResponse) => {
        if (res.status == "OK") {
          closeModalFunction();
          showSuccessProcess("Paquete reportado correctamente");
        } else {
          showErrorProcess(res.body.message);
        }
      });
    } catch (error: any) {
      showErrorProcess("Se produjo el siguiente error: " + error);
    }
  };

  return (
    <div className="flex flex-col gap-4 min-w-[400px]">
      <Label className="flex flex-row items-center gap-2 text-lg">
        <GetIcon iconName="reclaim-icon"></GetIcon>Reportar paquete: #
        {idPackage}
      </Label>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Label className="">Detalle de la incidencia</Label>
          <FormField
            control={form.control}
            name="reclaimtext"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ingrese la incidendia"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row justify-end gap-2">
            <Button
              variant={"white"}
              type="button"
              className="shadow-none w-fit self-end mt-4"
              onClick={() => closeModalFunction()}
            >
              Cancelar
            </Button>
            <Button
              variant={"red"}
              className="shadow-none w-fit self-end mt-4"
              type="submit"
            >
              Reportar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReportPackage;
