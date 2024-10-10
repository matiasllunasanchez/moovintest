"use client";
import { useEffect, useState } from "react";
import { GetMooversByDelegate } from "@/app/actions";
import NewRouteCreationContainer from "./creation";
import LoadingBox from "@/components/loading-box";
import NewRoutePackagesContainer from "./packages-container";
import { useUser } from "@/contexts/UserContext";

const NewRoute = () => {
  const [moovers, setMoovers] = useState<Moover[]>();
  const [route, setRoute] = useState<Route>();
  const { user, selectedWarehouse } = useUser();

  useEffect(() => {
    if (user?.delegate != undefined) {
      GetMooversByDelegate(user.delegate.idDelegate).then((res: any) =>
        setMoovers(res.body.content)
      );
    }
  }, []);

  return (
    <>
      {route ? (
        <NewRoutePackagesContainer route={route} />
      ) : moovers && moovers.length > 0 && selectedWarehouse ? (
        <NewRouteCreationContainer
          moovers={moovers}
          setRoute={(route) => setRoute(route)}
        />
      ) : (
        <LoadingBox />
      )}
    </>
  );
};

export default NewRoute;
