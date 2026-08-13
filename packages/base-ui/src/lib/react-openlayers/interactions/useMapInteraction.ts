import * as React from "react";
import type Interaction from "ol/interaction/Interaction";
import { useMap } from "../useMap";

// What every interaction does, whatever it answers to: it is built once, put on the map as soon
// as there is one, and taken off again when whatever asked for it goes. An interaction left on a
// map it has outlived goes on answering to the pointer, which is what taking it off avoids
export const useMapInteraction = <TInteraction extends Interaction>(create: () => TInteraction) => {
    const map = useMap();
    const interactionRef = React.useRef<TInteraction | null>(null);

    if (!interactionRef.current) {
        interactionRef.current = create();
    }

    const interaction = interactionRef.current;

    React.useEffect(() => {
        if (!map) return;

        map.addInteraction(interaction);

        return () => {
            map.removeInteraction(interaction);
        };
    }, [map, interaction]);

    return interaction;
};
