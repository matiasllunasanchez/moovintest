import { Button } from "@/components/custom/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GetPackageInfo, ReturnPackageCloseRoute } from "@/app/actions";
import { User } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { routeModule } from "next/dist/build/templates/pages";
type props = {
  packageForClosure: PackageInfoForClosure;
  closeModalFunction: () => void;
  route: RouteDetail;
  handleAddPackageToList: (newStatus: string) => void;
};
const ReturnPackageClosure: React.FC<props> = ({
  packageForClosure,
  closeModalFunction,
  route,
  handleAddPackageToList,
}) => {
  const [newStatus, setNewStatus] = useState<number>();
  const [detail, setDetail] = useState<string>("");
  const [detailPackage, setDetailPackage] = useState<MoovinPackage>();
  const [requiredComment, setRequiredComment] = useState<boolean>(false);
  const { user } = useUser();

  const handleGetPackageDetail = useCallback(() => {
    if (packageForClosure.idPackage) {
      GetPackageInfo(packageForClosure.idPackage.toString()).then(
        (res: any) => {
          setDetailPackage(res);
        }
      );
    }
  }, [packageForClosure]);
  useEffect(() => {
    const status = packageForClosure.listStatus.find(
      (el: any) => el.idStatus === newStatus
    );

    if (status) {
      const requiredCommentFromDetail = status.hasDetail
        ? status.statusDetail.find((detailEl) => detailEl.id === Number(detail))
            ?.commentsRequired === 1
        : false;

      setRequiredComment(
        status.hasDetail ? requiredCommentFromDetail : status.requiredComment
      );
    }
  }, [newStatus, detail]);
  useEffect(() => {
    const body = document.body;
    body.style.overflow = "hidden";
    handleGetPackageDetail();
    return () => {
      body.style.overflow = "auto";
    };
  }, []);
  const formSchema = z.object({
    reclaimtext: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (newStatus) {
            const statusConfig = packageForClosure.listStatus.find(
              (el) => el.idStatus === newStatus
            );
            const requiredCommentFromDetail = statusConfig?.hasDetail
              ? statusConfig.statusDetail.find(
                  (detailEl) => detailEl.id === Number(detail)
                )?.commentsRequired === 1
              : false;
            const isRequired = statusConfig?.hasDetail
              ? requiredCommentFromDetail
              : statusConfig?.requiredComment;
            if (isRequired) {
              return val && val.length >= 2;
            }
          }
          return true;
        },
        {
          message: "La descripción debe contener al menos 2 caracteres.",
        }
      ),
    newStatus: z.number(),
    newDetail: z.string(),
    idPackage: z.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reclaimtext: "",
      newStatus: 0,
      newDetail: "",
      idPackage: packageForClosure.idPackage ? packageForClosure.idPackage : 0,
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
      user?.delegate &&
        (await ReturnPackageCloseRoute({
          idDelegate: user?.delegate?.idDelegate,
          idRoute: route.idRoute,
          codePackage: values.idPackage,
          idStatus: values.newStatus,
          idDetail: values.newDetail,
          observation: values.reclaimtext,
        }).then((res: any) => {
          if (res.status == "OK") {
            handleAddPackageToList(
              packageForClosure.listStatus.find(
                (el) => el.idStatus == values.newStatus
              )?.statusTranslate || ""
            );
            closeModalFunction();
            showSuccessProcess("Proceso completado");
          } else {
            showErrorProcess(res.body.message);
          }
        }));
    } catch (error: any) {
      showErrorProcess("Se produjo el siguiente error: " + error);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:min-w-[400px]">
      <Label className="flex flex-row items-center gap-2 text-lg">
        Devolución de paquete:
      </Label>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-4 mb-4">
            <Label className="text-[#64748B] font-light">ID:</Label>
            <Label>{packageForClosure.idPackage}</Label>
            <Label className="text-[#64748B] font-light">Perfil:</Label>
            <Label>{packageForClosure.profileName}</Label>
          </div>
          <Label className="text-[#64748B] font-light">
            Estado actual {packageForClosure.statusTranslate}
          </Label>
          <FormField
            control={form.control}
            name="newStatus"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    {...field}
                    value={`${field.value}`}
                    onValueChange={(value: string) => {
                      if (value) {
                        field.onChange(Number(value));
                        setNewStatus(Number(value));
                      }
                    }}
                  >
                    <SelectTrigger className="md:w-[300px]">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {packageForClosure.listStatus.map((item) => {
                          return (
                            <SelectItem
                              key={item.status}
                              value={`${item.idStatus}`}
                            >
                              {item.statusTranslate}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {packageForClosure.listStatus.find(
            (el: any) => el.idStatus === newStatus
          )?.hasDetail && (
            <FormField
              control={form.control}
              name="newDetail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      {...field}
                      value={`${field.value}`}
                      onValueChange={(value: string) => {
                        if (value) {
                          field.onChange(value);
                          setDetail(value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-[250px] md:w-[300px] text-start">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {packageForClosure.listStatus
                            .find((el: any) => el.idStatus === newStatus)!
                            .statusDetail.map((item) => {
                              return (
                                <SelectItem key={item.id} value={`${item.id}`}>
                                  {item.description}
                                </SelectItem>
                              );
                            })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="reclaimtext"
            disabled={!requiredComment}
            render={({ field }) => (
              <FormItem>
                <Label className="text-[#64748B] font-light">
                  Motivo devolución
                </Label>
                <FormControl>
                  <Textarea {...field} className=" resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-end gap-2">
            <Button className="shadow-none w-fit self-end mt-4" type="submit">
              Enviar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReturnPackageClosure;
