import type { StoryFn } from "@storybook/react-vite";
import { Heading } from "../heading";
import { Stack } from "../stack";
import { Text } from "../text";
import { Map } from ".";

const classes = {
    // A map is drawn to whatever room it is given, so the stories give it a column to stand in
    // rather than letting it run the width of the canvas
    frame: "w-[48rem] max-w-full",
    // Two maps read side by side, each keeping half of the same column
    pair: "grid grid-cols-2 gap-[var(--stack-gap-normal)] w-[48rem] max-w-full",
};

// Somewhere far enough from the default to be told apart at a glance: the Palace of Westminster
const WESTMINSTER = { latitude: 51.4995, longitude: -0.1248 };

export default {
    title: "Components/Map/Features",
};

// The Default Location. A map given nowhere stands at 2261 Market Street, San Francisco, with a
// pin on it and enough of the block around it to say where that is
export const DefaultLocation: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map />
    </div>
);

// Somewhere Else, given as latitude and longitude. The pair is written the way an address is
// looked up rather than the way the map draws it, so nothing has to be converted first
export const ACustomLocation: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map {...WESTMINSTER} aria-label="Palace of Westminster" />
    </div>
);

// Without A Pin, for a map showing the ground around somewhere rather than the somewhere itself
export const WithoutAPin: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map marker={false} />
    </div>
);

// A Pin Painted And Lettered, for a map whose pins are being read against a list beside it
export const AColouredPin: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map markerColor="#0969da" markerLabel="A" />
    </div>
);

// How Far In The Map Is Drawn. Each step up halves what is shown, so twelve holds a city and
// eighteen a building
export const Zoom: StoryFn<typeof Map> = () => (
    <div className={classes.pair}>
        <Map zoom={12} height={280} aria-label="The city" />
        <Map zoom={18} height={280} aria-label="The building" />
    </div>
);

// How Tall The Map Stands. A number is read as pixels; anything else is passed to CSS as it was
// written, so a map can be given a height in whatever units the page is laid out in
export const Height: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map height="60vh" />
    </div>
);

// How Wide The Map Stands. Left out, a map is as wide as whatever it was put in, so this is only
// worth setting for one standing beside other content rather than across it
export const Width: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map width={400} height={280} />
    </div>
);

// Both At Once, for a map cut to a fixed shape wherever it is put
export const Size: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map width="60%" height={240} />
    </div>
);

// Every Extra Control At Once. The ones a reader presses gather in a row of their own, in the
// order they were named; the scale line is read rather than pressed, so it keeps the foot of
// the map
export const Controls: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map controls={["fullScreen", "search", "layers", "draw", "scaleLine"]} />
    </div>
);

// Finding Somewhere By Name. The search is put to the same geocoder the map's tiles come from,
// so a map carries no key and reaches for nothing further
export const Search: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map controls={["search"]} />
    </div>
);

// Drawing On The Map, and saving what was drawn. Escape abandons a shape half drawn, and
// Shift+S writes the lot out as GeoJSON
export const Drawing: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map controls={["draw"]} />
    </div>
);

// What The Map Is Drawn From, listed as it is stacked and each layer open to being hidden.
// Layers written as children are named, so that the list reads as something other than the
// classes they were built from
export const Layers: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map zoom={4} marker={false} controls={["layers"]} aria-label="The world">
            <Map.GraticuleLayer name="Latitude and longitude" showLabels />
        </Map>
    </div>
);

// A Popup Naming Wherever The Map Was Clicked. It is held over the ground rather than over the
// page, so it travels with what it is naming as the map is dragged about. The address is asked
// of a geocoder, so it arrives a moment after the popup does
export const APopup: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map>
            <Map.Overlay>
                {({ lonLat, address }) => (
                    <Stack gap="condensed">
                        <Text weight="semibold">{address || "Looking that up…"}</Text>
                        <Text size="small">
                            {lonLat[1]?.toFixed(4)}, {lonLat[0]?.toFixed(4)}
                        </Text>
                    </Stack>
                )}
            </Map.Overlay>
        </Map>
    </div>
);

// Dropping Pins By Clicking. Each one dropped takes the letter after the last, so a run of them
// reads A, B, C rather than all alike, and clicking one that is already there takes it away
export const DroppingPins: StoryFn<typeof Map> = () => (
    <div className={classes.frame}>
        <Map marker={false}>
            <Map.Marker addOnClick removeOnClick />
        </Map>
    </div>
);

// Named By What Stands Above It. A map is a region of the page, so it carries a name to be found
// and skipped past by. Where a heading already says what it shows, the map is pointed at that
// heading rather than given a name of its own to fall out of step with
export const Named: StoryFn<typeof Map> = () => (
    <Stack gap="condensed" className={classes.frame}>
        <Heading as="h2" size="small" id="office">
            Where we are
        </Heading>
        <Map aria-labelledby="office" height={280} />
    </Stack>
);
