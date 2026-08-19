import * as React from "react";
import { Map as OlMap } from "ol";
import type BaseLayer from "ol/layer/Base";
import { useMap } from "../useMap";
import { useMapLayerGroup } from "./useMapLayerGroup";

// What every layer does, whatever it draws: it is built once, put on the group it stands within
// where there is one and on the map itself where there is not, and taken off again when it goes.
//
// Building it once is what lets the features on it outlive being moved from one to the other,
// and what keeps a layer redrawn for some other reason from throwing away what it was holding.
// The name is set afterwards rather than passed in, OpenLayers having no notion of one
export const useMapLayer = <TLayer extends BaseLayer>(create: () => TLayer, name?: string) => {
    const map = useMap();
    const group = useMapLayerGroup();
    const layerRef = React.useRef<TLayer | null>(null);

    if (!layerRef.current) {
        layerRef.current = create();
    }

    const layer = layerRef.current;

    React.useEffect(() => {
        if (name !== undefined) {
            layer.set("name", name);
        }
    }, [layer, name]);

    React.useEffect(() => {
        // A group stands nearer than the map, so a layer written inside one goes there even
        // though the map is within reach of both
        const target = group ?? map;
        if (!target) return;

        if (target instanceof OlMap) {
            target.addLayer(layer);
        } else {
            target.getLayers().push(layer);
        }

        return () => {
            if (target instanceof OlMap) {
                target.removeLayer(layer);
            } else {
                target.getLayers().remove(layer);
            }
        };
    }, [map, group, layer]);

    return layer;
};
