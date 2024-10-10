import { useEffect, useState } from "react";

export const desktop = "(min-width: 820px)";
export const sm = "(min-width: 640px)";

const getMatches = (query: string): boolean => {
  return window.matchMedia(query).matches;
};

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    setMatches(getMatches(query));
  }, []);

  return matches;
}

export default useMediaQuery;
