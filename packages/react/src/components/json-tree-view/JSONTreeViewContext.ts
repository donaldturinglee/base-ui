import { createContext, useContext } from "react";
import type { JSONTreeViewContextValue } from "./JSONTreeView.types";

export const JSONTreeViewContext = createContext<JSONTreeViewContextValue>({});

// How the tree around a row was asked to draw what it holds: how much of a closed row is given
// away, how a name is written, and whether the caller draws any of the values themselves. A row
// reads them from here rather than being handed them again by the row above it, since they belong
// to the tree rather than to any one row of it
export const useJSONTreeViewContext = () => useContext(JSONTreeViewContext);
