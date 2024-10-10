"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { MOOVIN_URLS } from "@/utils/urls";
import LoadingBox from "@/components/loading-box";
import { signOut } from "next-auth/react";
import { Layout } from "@/components/custom/layout";
import { TopNav } from "@/components/custom/navigation-menu/top-nav";
import { UserNav } from "@/components/custom/navigation-menu/user-nav";
import { Search } from "@/components/custom/navigation-menu/search";
import { WarehouseSelector } from "@/components/custom/navigation-menu/warehouse-selector";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isLogin = pathname === "/login";
  const isDefaultRoute = pathname === "/";

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.accessToken) {
      if (session) signOut({ callbackUrl: MOOVIN_URLS.LOGIN });
      else {
        router.push(MOOVIN_URLS.LOGIN);
      }
    } else if (status === "authenticated" && (isLogin || isDefaultRoute)) {
      if (isLogin) {
        router.push(MOOVIN_URLS.DASHBOARD);
      }
    }
  }, [status, session?.accessToken, session]);

  if (
    status === "loading" ||
    (status === "unauthenticated" && !isLogin) ||
    (status === "authenticated" && (isLogin || isDefaultRoute))
  ) {
    return <LoadingBox />;
  }

  const topNav = [
    {
      title: "Inicio",
      href: "/dashboard",
      isActive: pathname.startsWith("/dashboard"),
    },
    {
      title: "Paquetes",
      href: "/packages",
      isActive: pathname.startsWith("/packages"),
    },
    {
      title: "Rutas",
      href: "/routes",
      isActive: pathname.startsWith("/routes"),
    },
    {
      title: "Cajón",
      href: "/draw",
      isActive: pathname.startsWith("/draw"),
    },
    {
      title: "Cierre de rutas",
      href: "/route-closure",
      isActive: pathname.startsWith("/route-closure"),
    },
    {
      title: "Estadísticas",
      href: "/statistics",
      isActive: pathname.startsWith("/statistics"),
    },
  ];

  if (status === "authenticated")
    return (
      <Layout>
        <Layout.Header>
          <TopNav links={topNav} />
          <div className="ml-auto flex items-center space-x-4">
            <WarehouseSelector />
            <UserNav />
          </div>
        </Layout.Header>
        <Layout.Body>{children}</Layout.Body>
      </Layout>
    );

  return <>{children}</>;
}
