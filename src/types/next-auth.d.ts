import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

interface CustomUser extends DefaultUser {
  id: string;
  name: string;
  email?: string;
  username?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  delegate?: UserDelegateInfo;
  warehouses?: DelegateWarehouse[];
}

interface CustomJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    user?: CustomUser;
  }

  interface User extends CustomUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends CustomJWT {}
}
