import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/custom/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import classNames from "classnames";
import { useUser } from "@/contexts/UserContext";
import { CreateRoute } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

type props = {
  moovers?: Moover[];
  setRoute: (route: Route) => void;
};

const NewRouteCreationContainer: React.FC<props> = (props) => {
  const { toast } = useToast();
  const { selectedWarehouse, user } = useUser();
  const [selectedMoover, setSelectedMoover] = useState<Moover>();

  const formSchema = z.object({
    date: z.string().min(1, {
      message: "Date must be at least 2 characters.",
    }),
    moover: z.number().min(0, {
      message: "Moover must be at least 2 characters.",
    }),
    name: z.string().min(1, {
      message: "Warehouse must be at least 2 characters.",
    }),
  });

  const showSuccessProcess = (text: string) => {
    toast({
      variant: "default",
      description: text,
      title: "Acción realizada",
    });
  };

  const showErrorProcess = (text: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: text,
    });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date: "",
      moover: 0,
    },
  });
  useEffect(() => {
    if (selectedMoover) {
      form.setValue("moover", selectedMoover.idUser);
    }
  }, [selectedMoover, form]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedWarehouse && values.date && user?.delegate?.idDelegate) {
      try {
        CreateRoute({
          routeName: values.name,
          idMoover: values.moover,
          idDelegate: user?.delegate?.idDelegate,
          idWarehouse: selectedWarehouse?.id,
          deliveredDate: new Date(values.date).toISOString().split("T")[0],
        }).then((res: RouteResponse) => {
          console.log(res, "respuesta");
          if (res.status == "OK") {
            // console.log("Route created: ", res.body.idRoute);
            showSuccessProcess("Ruta creada con éxito");
            props.setRoute(res.body);
          } else {
            showErrorProcess(res.message);
          }
        });
      } catch (error) {
        console.log("Error on route creation", error);
        showErrorProcess("Hubo un error al crear la ruta");
      }
    }
    // console.log(
    //   "FORM SUBMIT: ",
    //   "Nombre ruta: ",
    //   values.name,
    //   "Moover: ",
    //   values.moover,
    //   "warehouse: ",
    //   selectedWarehouse?.id,
    //   "date: ",
    //   values.date
    // );
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex flex-col flex-grow ">
        <Label className="self-start text-lg">Crear ruta</Label>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-2 w-full h-full"
          >
            <div className="flex flex-col">
              <Label className="self-start mt-2">Nombre de ruta</Label>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className=" my-4 w-full justify-between "
                        required
                        placeholder="Ingresar..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col">
              <Label className="self-start">Fecha de salida</Label>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="dd/mm/aaaa"
                        type="date"
                        className="flex my-4 w-full justify-between "
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Label>Elige al mensajero</Label>
            <div className="flex flex-col flex-grow overflow-auto border-b border-slate-200">
              <div className="flex flex-grow max-h-[35vh]">
                <FormField
                  control={form.control}
                  name="moover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          value={selectedMoover?.idUser.toString()}
                          className="hidden my-4 w-full justify-between "
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="h-full w-full flex flex-col flex-grow items-center ">
                  {!!props.moovers ? (
                    <>
                      {props.moovers && props.moovers.length > 0 ? (
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 items-center justify-center gap-4 ">
                          {props.moovers.map((moov: Moover, index: number) => {
                            if (index > 900) return;
                            const userName = moov.name
                              ? `${moov.name} ${moov.lastName}`
                              : moov.idUser;
                            return (
                              <Button
                                key={moov.idUser}
                                className={classNames(
                                  selectedMoover?.idUser == moov.idUser
                                    ? " border-black"
                                    : "border-gray",
                                  "flex flex-col col-span-1 border-2 shadow-none  w-full h-full min-h-[100px] p-2 items-center"
                                )}
                                type="button"
                                variant={"outline"}
                                iconName="truck-icon"
                                iconClassName="justify-start m-0"
                                iconDivClassName="m-0"
                                onClick={() => setSelectedMoover(moov)}
                              >
                                <div className="flex flex-grow w-full  whitespace-break-spaces overflow-auto">
                                  {userName}
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="w-full h-full flex justify-center items-center rounded-sm bg-slate-100">
                          <span>No hay mensajeros disponibles.</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full rounded-sm bg-slate-100 flex flex-col justify-center items-center ">
                      <div className="flexspace-x-2">
                        <Loader2 className="mr-2 h-10 w-10 animate-spin" />
                      </div>
                      <span>Cargando mensajeros...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              variant={"primary"}
              className="mt-auto w-full bg-ring-slate-950 transition-all duration-200 bg-[#102833] hover:ring-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600"
            >
              Crear ruta
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewRouteCreationContainer;
