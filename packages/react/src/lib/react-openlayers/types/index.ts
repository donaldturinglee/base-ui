import type * as React from "react";
import type { Coordinate } from "ol/coordinate";
import type { MapOptions } from "ol/Map";
import type { ViewOptions } from "ol/View";
import type { Options as OverlayOptions } from "ol/Overlay";
import type { Options as ControlOptions } from "ol/control/Control";
import type { Options as AttributionControlOptions } from "ol/control/Attribution";
import type { Options as FullScreenControlOptions } from "ol/control/FullScreen";
import type { Options as MousePositionControlOptions } from "ol/control/MousePosition";
import type { Options as OverviewMapControlOptions } from "ol/control/OverviewMap";
import type { Options as ScaleLineControlOptions } from "ol/control/ScaleLine";
import type { Options as LayerGroupOptions } from "ol/layer/Group";
import type { Options as TileLayerOptions } from "ol/layer/BaseTile";
import type { Options as ImageLayerOptions } from "ol/layer/BaseImage";
import type { Options as VectorLayerOptions } from "ol/layer/Vector";
import type { Options as GraticuleLayerOptions } from "ol/layer/Graticule";
import type { Options as HeatmapLayerOptions } from "ol/layer/Heatmap";
import type { Options as WebGLTileLayerOptions } from "ol/layer/WebGLTile";
import type ImageSource from "ol/source/Image";
import type TileSource from "ol/source/Tile";
import type { Options as DragRotateAndZoomOptions } from "ol/interaction/DragRotateAndZoom";
import type { Options as LinkOptions } from "ol/interaction/Link";
import type { Options as PointerOptions } from "ol/interaction/Pointer";
import type { Options as SelectOptions, SelectEvent } from "ol/interaction/Select";
import type { Options as TranslateOptions } from "ol/interaction/Translate";

// The map draws into the element the component renders, so where it draws is not open to being
// passed in. Everything else OpenLayers takes when a map is built is
export type MapProps = Omit<MapOptions, "target"> & {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export type MapViewProps = ViewOptions;

// A marker stands somewhere given as longitude and latitude, or somewhere named as an address
// and looked up. Given both, the pair is taken: it says where without having to ask anyone
export type MapMarkerProps = {
    lonLat?: Coordinate;
    address?: string;
    color?: string;
    // The letter the pin carries. Each marker dropped by a click takes the one after it, so a
    // run of them reads A, B, C rather than all alike
    label?: string;
    addOnClick?: boolean;
    removeOnClick?: boolean;
};

// Where the popup was opened, in the projection the map draws in and in longitude and latitude,
// and what stands there. The address is asked of a geocoder, so it arrives after the rest and
// is empty until it does
export type MapOverlayContent = {
    coordinate: Coordinate;
    lonLat: Coordinate;
    address: string;
};

// The popup draws into an element of its own, so that element is not open to being passed in.
// What it holds can be given as a function, which is called with wherever the popup was opened
export type MapOverlayProps = Omit<OverlayOptions, "element"> & {
    children?: React.ReactNode | ((content: MapOverlayContent) => React.ReactNode);
};

// A layer is named so a reader can tell one from another where they are listed, which is what
// the layers control reads. OpenLayers has no notion of a name, so it is set as a property on
// the layer rather than passed to it
export type MapLayerProps = {
    name?: string;
};

export type MapLayerGroupProps = LayerGroupOptions &
    MapLayerProps & {
        children?: React.ReactNode;
    };

export type MapTileLayerProps = TileLayerOptions<TileSource> & MapLayerProps;

export type MapImageLayerProps = ImageLayerOptions<ImageSource> & MapLayerProps;

export type MapVectorLayerProps = VectorLayerOptions & MapLayerProps;

export type MapGraticuleLayerProps = GraticuleLayerOptions & MapLayerProps;

export type MapHeatmapLayerProps = HeatmapLayerOptions & MapLayerProps;

export type MapWebGLTileLayerProps = WebGLTileLayerOptions & MapLayerProps;

export type MapAttributionControlProps = AttributionControlOptions;

export type MapFullScreenControlProps = FullScreenControlOptions;

export type MapMousePositionControlProps = MousePositionControlOptions;

export type MapOverviewMapControlProps = OverviewMapControlOptions;

export type MapScaleLineControlProps = ScaleLineControlOptions;

// What a control drawing a face of its own is given. The element is the control's own, since
// React draws into it, so what is left is where among the controls it sits and how it is dressed
export type MapCustomControlProps = Pick<ControlOptions, "target"> & {
    className?: string;
};

// What can be drawn on the map. A line is drawn between two points rather than along many, so
// that what it measures is a distance rather than a path
export type MapDrawShape = "Point" | "LineString" | "Circle";

export type MapDrawControlProps = MapCustomControlProps & {
    // What the drawn shapes are saved as when they are written out
    fileName?: string;
};

export type MapLayersControlProps = MapCustomControlProps;

export type MapSearchControlProps = MapCustomControlProps & {
    // How far in the map is drawn once a search has settled on somewhere
    zoom?: number;
    // What colour the marker dropped on the result is drawn
    color?: string;
    placeholder?: string;
};

export type MapDragRotateAndZoomInteractionProps = DragRotateAndZoomOptions;

export type MapLinkInteractionProps = LinkOptions;

export type MapPointerInteractionProps = PointerOptions;

export type MapSelectInteractionProps = SelectOptions & {
    onSelect?: (event: SelectEvent) => void;
};

export type MapTranslateInteractionProps = TranslateOptions;

// What Nominatim answers a search with. Only what is read here is named; an answer carries a
// good deal more than this, and the coordinates come back written out rather than as numbers
export type MapSearchResult = {
    lat: string;
    lon: string;
    display_name: string;
};
