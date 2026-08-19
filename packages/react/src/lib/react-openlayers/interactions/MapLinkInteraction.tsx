import Link from "ol/interaction/Link";
import { useMapInteraction } from "./useMapInteraction";
import type { MapLinkInteractionProps } from "../types";

// Keeps where the map is looking in the address bar, so that a map somebody has moved about can
// be linked to, kept and come back to standing where it was left
function MapLinkInteraction(props: MapLinkInteractionProps) {
    useMapInteraction(() => new Link(props));

    return null;
}

MapLinkInteraction.displayName = "MapLinkInteraction";

export { MapLinkInteraction };
