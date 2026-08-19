import { useContext } from "react";
import { MapContext } from "./MapContext";

// The map the nearest `Map` above put within reach. It comes back undefined until that map has
// been built, which is what everything attaching itself to a map waits on
export const useMap = () => useContext(MapContext);
