import * as React from "react";
import { createPortal } from "react-dom";
import LayerGroup from "ol/layer/Group";
import { LayerRegular } from "@gamecrafters/base-ui-icons";
import type BaseLayer from "ol/layer/Base";
import { classNames } from "../../classnames";
import { useMap } from "../useMap";
import { useMapCustomControl } from "./useMapCustomControl";
import type { MapLayersControlProps } from "../types";

const classes = {
    root: "layers-control",
    toggle: "layers-control-toggle",
    layers: "layers-control-layers",
    list: "layers-control-list",
    item: "layers-control-item",
    label: "layers-control-label",
};

const ICON_SIZE = 24;

// One layer as the control reads it. The key is the path down the tree rather than anything the
// layer carries, since nothing on a layer is bound to tell one from another
type LayerNode = {
    key: string;
    layer: BaseLayer;
    name: string;
    children: LayerNode[];
};

const readLayers = (layers: BaseLayer[], path: string): LayerNode[] =>
    layers.map((layer, index) => {
        const key = `${path}${index}`;
        const name = (layer.get("name") as string | undefined) ?? layer.constructor.name;

        return {
            key,
            layer,
            name,
            children:
                layer instanceof LayerGroup
                    ? readLayers(layer.getLayers().getArray(), `${key}.`)
                    : [],
        };
    });

// What the map is drawn from, listed as it is stacked, with each layer open to being shown or
// hidden. Groups are drawn as branches, so a tree of layers reads as a tree.
//
// The list is read off the map each time the control is opened rather than kept alongside it,
// since a layer may have been added or taken away by anything else since it was last looked at
function MapLayersControl({ target, className }: MapLayersControlProps) {
    const map = useMap();
    const element = useMapCustomControl(
        "MapLayersControl",
        classNames(classes.root, className),
        target,
    );

    const [open, setOpen] = React.useState(false);

    // A checkbox is drawn from what the layer says about itself rather than from anything held
    // here, so hiding one has to be followed by reading the layers again
    const [revision, setRevision] = React.useState(0);

    const nodes = React.useMemo(
        () => (map && open ? readLayers(map.getLayers().getArray(), "") : []),
        [map, open, revision],
    );

    const setVisible = (layer: BaseLayer, visible: boolean) => {
        layer.setVisible(visible);
        setRevision((current) => current + 1);
    };

    const renderNodes = (items: LayerNode[]) => (
        <ul className={classes.list}>
            {items.map((node) => (
                <li key={node.key} className={classes.item}>
                    <label className={classes.label}>
                        <input
                            type="checkbox"
                            checked={node.layer.getVisible()}
                            onChange={(event) => setVisible(node.layer, event.target.checked)}
                        />
                        {node.name}
                    </label>
                    {node.children.length > 0 ? renderNodes(node.children) : null}
                </li>
            ))}
        </ul>
    );

    return createPortal(
        <>
            <button
                type="button"
                className={classes.toggle}
                title="Click here to switch layers"
                aria-expanded={open}
                onClick={() => setOpen((wasOpen) => !wasOpen)}
            >
                <LayerRegular size={ICON_SIZE} />
            </button>
            {open ? <div className={classes.layers}>{renderNodes(nodes)}</div> : null}
        </>,
        element,
    );
}

MapLayersControl.displayName = "MapLayersControl";

export { MapLayersControl };
