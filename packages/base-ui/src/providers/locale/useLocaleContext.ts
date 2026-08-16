import { useContext } from "react";
import { LocaleContext } from "./LocaleContext";

// The locale the subtree settled on, for anything that has to be spelled out the way the reader
// reads it rather than the way it was written in the source. Which way it is read comes back
// alongside it, though `useDirection` answers that on its own for anything that only needs the
// direction
export const useLocaleContext = () => useContext(LocaleContext);
