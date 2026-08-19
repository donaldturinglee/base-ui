import * as React from "react";
import type Control from "ol/control/Control";
import { useMap } from "../useMap";

// What every control does, whatever it draws: it is built once, put on the map as soon as there
// is one, and taken off again when whatever asked for it goes, so a control does not outlive the
// component that put it there and a remounted map is not left with two of everything
export const useMapControl = <TControl extends Control>(create: () => TControl) => {
    const map = useMap();
    const controlRef = React.useRef<TControl | null>(null);

    if (!controlRef.current) {
        controlRef.current = create();
    }

    const control = controlRef.current;

    React.useEffect(() => {
        if (!map) return;

        map.addControl(control);

        return () => {
            map.removeControl(control);
        };
    }, [map, control]);

    return control;
};
