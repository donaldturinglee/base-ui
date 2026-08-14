import type { StoryFn, Meta } from "@storybook/react-vite";
import { Map } from ".";
import type { MapProps } from "./Map.types";

const classes = {
    // A map is drawn to whatever room it is given, so the stories give it a column to stand in
    // rather than letting it run the width of the canvas
    frame: "w-[48rem] max-w-full",
};

export default {
    title: "Components/Map",
    component: Map,
} as Meta<typeof Map>;

export const Default: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map />
    </div>
);

export const Playground: StoryFn<MapProps> = (args) => (
    <div className={classes.frame}>
        <Map {...args} />
    </div>
);

Playground.args = {
    latitude: 37.7649804,
    longitude: -122.4323829,
    zoom: 16,
    width: 768,
    height: 384,
    marker: true,
    controls: ["fullScreen", "search"],
};

Playground.argTypes = {
    latitude: {
        control: {
            type: "number",
            min: -90,
            max: 90,
            step: 0.0001,
        },
        description: "How far north the map is pointed, in degrees",
    },
    longitude: {
        control: {
            type: "number",
            min: -180,
            max: 180,
            step: 0.0001,
        },
        description: "How far east the map is pointed, in degrees",
    },
    zoom: {
        control: {
            type: "number",
            min: 1,
            max: 20,
            step: 1,
        },
        description: "How far in the map is drawn",
    },
    width: {
        control: {
            type: "number",
            min: 160,
            max: 800,
            step: 16,
        },
        description: "How wide the map stands, in pixels",
    },
    height: {
        control: {
            type: "number",
            min: 160,
            max: 800,
            step: 16,
        },
        description: "How tall the map stands, in pixels",
    },
    controls: {
        control: {
            type: "check",
        },
        options: ["draw", "fullScreen", "layers", "scaleLine", "search"],
        description: "Which of the extra controls are drawn",
    },
    marker: {
        control: {
            type: "boolean",
        },
        description: "Whether a pin is dropped where the map is pointed",
    },
    markerColor: {
        control: {
            type: "color",
        },
        description: "What the pin is painted",
    },
    markerLabel: {
        control: {
            type: "text",
        },
        description: "The letter the pin carries",
    },
    children: {
        table: {
            disable: true,
        },
    },
    ref: {
        table: {
            disable: true,
        },
    },
};
