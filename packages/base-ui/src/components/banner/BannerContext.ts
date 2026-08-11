import { createContext } from "react";
import type { BannerContextValue } from "./Banner.types";

export const BannerContext = createContext<BannerContextValue>({});
