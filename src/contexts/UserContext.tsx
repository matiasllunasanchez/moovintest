"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { GetUserInfo } from "@/app/actions";
import { useSession } from "next-auth/react";
import { CustomUser } from "@/types/next-auth";

type User = {
  extradata?: string;
} & CustomUser;

type SelectedWarehouse = {
  id: number;
  name: string;
  latitud: number;
  longitud: number;
};

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedWarehouse: SelectedWarehouse | null;
  changeWarehouse: (id: number) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<SelectedWarehouse | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (session && session?.user) {
        try {
          const userInfo: UserInfoResponse = await GetUserInfo(); // TODO: Type on user response
          const delegateInfo = userInfo.body;

          const selectedDelegate = delegateInfo.delegates.find(
            (x: any) => x.isDefault === 1
          );

          // TODO: Remove when warehouses are ready
          const fakeWarehouses = [
            {
              ...delegateInfo.warehouses[0],
              latitud: 9.867271278846882,
              longitud: -83.9208562793513,
            },
            {
              ...delegateInfo.warehouses[1],
              latitud: 9.858922134403036,
              longitud: -83.91838619240208,
            },
          ];

          setUser({
            id: session.user.id!,
            name: session.user.name!,
            email: session.user.email!,
            username: session.user.username!,
            preferred_username: session.user.preferred_username,
            family_name: session.user.family_name,
            given_name: session.user.given_name,
            delegate: selectedDelegate,
            warehouses: delegateInfo.warehouses,
          });

          // setSelectedWarehouse({
          //   id: defaultdWarehouse?.idWarehouse,
          //   name: defaultdWarehouse?.warehouseName,
          //   latitud: defaultdWarehouse.latitud,
          //   longitud: defaultdWarehouse.longitud,
          // });
        } catch (error) {
          console.error("Failed to fetch user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, [session]);

  const changeWarehouse = useCallback(
    (id: number) => {
      const newWarehouse =
        user &&
        user.warehouses &&
        user.warehouses?.find((x: DelegateWarehouse) => x.idWarehouse === id);

      if (newWarehouse) {
        let currentWarehouse: SelectedWarehouse = {
          id: newWarehouse?.idWarehouse,
          name: newWarehouse?.warehouseName,
          latitud: newWarehouse.latitud,
          longitud: newWarehouse.longitud,
        };

        setSelectedWarehouse(currentWarehouse);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user && user.warehouses) {
      const defaultdWarehouse = user?.warehouses.find(
        (x: DelegateWarehouse) => x.isDefault === 1
      );
      if (defaultdWarehouse) changeWarehouse(defaultdWarehouse.idWarehouse);
    }
  }, [changeWarehouse, user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        selectedWarehouse,
        changeWarehouse,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
