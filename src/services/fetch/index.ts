import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authoptions";
import { signOut } from "next-auth/react";

type FetchDebug = Record<FetchServiceContext, boolean>;
const FETCH_DEBUG: FetchDebug = {
  PRIVATE: true,
  PUBLIC: true,
};

export type ExtendedRequestInit = RequestInit & {
  search?: any;
};

const fetchService = async <T>({
  context,
  path,
  options,
}: {
  context: FetchServiceContext;
  path: string;
  options?: ExtendedRequestInit;
}): Promise<T> => {
  // Obtenemos la sesión actual, que incluye el token de acceso
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    console.log("No hay token de acceso, cerrando sesión...");
    signOut({ callbackUrl: "/login" });
    throw new Error("No access token. User is logged out.");
  }

  const baseUrl = `${
    context === "PUBLIC" ? window.location.origin : process.env.API_URL
  }${path}`;
  let url = new URL(baseUrl);

  if (FETCH_DEBUG[context]) {
    console.log(
      `[FETCH ${context} - CALL ] - [${path}] - [${options?.method}]`,
      options?.body,
      options?.headers
    );
  }

  const response = await fetch(url.toString(), {
    ...options,
    credentials: "include",
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${session.accessToken}`, // Usar el token de acceso de la sesión
    },
  });

  // Si el token de acceso está expirado, se maneja el logout
  if (response.status === 401) {
    console.log("Token expirado, cerrando sesión...");
    signOut({ callbackUrl: "/login" });
    throw new Error("Token expirado. Usuario deslogueado.");
  }

  return handleResponse<T>(response, context, path);
};

const handleResponse = async <T>(
  response: Response,
  context: FetchServiceContext,
  path: string
): Promise<T> => {
  if (!response.ok) {
    console.log(
      `[FETCH ${context} - ERROR] - [${path}] - ${response.statusText}`
    );
    throw new Error(`Error: ${response.statusText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    console.log(
      `[FETCH ${context} - WARNING] - ${path} - error parsing response`,
      response
    );
    throw err;
  }

  if (FETCH_DEBUG[context]) {
    console.log(`[FETCH ${context} - SUCCESS] - ${path}`, data);
  }

  return data;
};

const serverFetchService = <T>(path: string, options?: ExtendedRequestInit) =>
  fetchService<T>({ context: "PRIVATE", path, options });

const clientFetchService = <T>(path: string, options?: ExtendedRequestInit) =>
  fetchService<T>({ context: "PUBLIC", path, options });

export { clientFetchService, serverFetchService };
