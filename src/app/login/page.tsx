"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { MOOVIN_URLS } from "@/utils/urls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const router = useRouter();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const mailInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const remember = localStorage.getItem("rememberMe");
    const savedUsername = localStorage.getItem("username");
    mailInputRef.current && mailInputRef.current?.focus();
    if (remember && savedUsername) {
      setRememberMe(true);
      form.setValue("username", savedUsername);
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }
  }, []);

  const formSchema = z.object({
    username: z.string().min(2, {
      message: "El nombre de usuario debe tener al menos 2 caracteres.",
    }),
    password: z.string().min(2, {
      message: "La contraseña debe tener al menos 2 caracteres.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("username", values.username);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("username");
    }
    const result = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
    });

    if (result?.error) {
      form.setError("password", {
        type: "manual",
        message: "Invalid username or password",
      });
    } else {
      console.log("Login response ", JSON.stringify(result));
      router.push(MOOVIN_URLS.DASHBOARD);
    }
  };

  return (
    <div className="h-screen flex md:grid grid-cols-2 items-center justify-center  w-screen">
      <div
        className="hidden md:col-span-1 md:flex w-full bg-[#FDF8F4] h-full justify-center"
        style={{
          backgroundImage: `url("/moover.png")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      >
        <Image
          src="/moovin_logo.png"
          alt="Logo"
          width={150}
          height={50}
          className="absolute left-10 top-10  self-start"
        />
      </div>
      <div className="flex  flex-col bg-white p-8 rounded-lg   gap-2">
        <div className="flex flex-col justify-center items-center mb-6 self-center gap-2">
          <Image
            src="/moovin_logo.png"
            alt="Logo"
            width={150}
            height={50}
            className="mb-6 md:hidden"
          />
          <Label className="text-2xl">Iniciar sesión</Label>
          <Label className="font-light text-[#64748B]">
            Bienvenido a nuestra plataforma para delegados
          </Label>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-[400px] self-center"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <Label>Correo electrónico</Label>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="usuario@email.com"
                      required
                      ref={mailInputRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-[#102833]">Contraseña</Label>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        required
                        ref={passwordInputRef}
                      />
                      <Button
                        type="button"
                        variant={"ghost"}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3 py-2 text-sm mr-2 leading-5 text-gray-500 focus:outline-none w-[60px]"
                      >
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Label className="flex gap-2">
              <Checkbox
                checked={rememberMe}
                className="rounded"
                onClick={() => setRememberMe(!rememberMe)}
              ></Checkbox>
              Recordarme
            </Label>
            <Button
              type="submit"
              className="w-full bg-ring-slate-950 bg-[#173341] hover:ring-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Ingresar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
