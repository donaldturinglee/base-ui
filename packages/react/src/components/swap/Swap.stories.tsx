import * as React from "react";
import { WeatherMoonRegular, WeatherSunnyRegular } from "@gamecrafters/base-ui-icons";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { IconButton } from "../icon-button";
import { Swap } from ".";
import type { SwapProps } from "./Swap.types";

export default {
    title: "Components/Swap",
    component: Swap,
} as Meta<typeof Swap>;

export const Default: StoryFn<typeof Swap> = () => {
    const [dark, setDark] = React.useState(false);

    return (
        <IconButton
            aria-label={dark ? "Switch to the light theme" : "Switch to the dark theme"}
            onClick={() => setDark((previous) => !previous)}
            icon={
                <Swap swap={dark}>
                    <Swap.Indicator type="on">
                        <WeatherMoonRegular />
                    </Swap.Indicator>
                    <Swap.Indicator type="off">
                        <WeatherSunnyRegular />
                    </Swap.Indicator>
                </Swap>
            }
        />
    );
};

Default.parameters = {
    layout: "centered",
};

// The swap has nothing to press, so which indicator is shown is a control here rather than
// something the story holds. The icons are drawn larger than they would be inside a button, since
// standing on its own is the one place the movement is worth reading
export const Playground: StoryFn<SwapProps> = (args) => (
    <Swap {...args}>
        <Swap.Indicator type="on">
            <WeatherMoonRegular size={24} />
        </Swap.Indicator>
        <Swap.Indicator type="off">
            <WeatherSunnyRegular size={24} />
        </Swap.Indicator>
    </Swap>
);

Playground.args = {
    swap: false,
    transition: "fade",
};

Playground.argTypes = {
    swap: {
        control: {
            type: "boolean",
        },
        description: "Which of the two indicators is shown",
    },
    transition: {
        control: {
            type: "radio",
        },
        options: ["fade", "flip", "rotate", "scale", "none"],
        description: "How one indicator gives way to the other",
    },
    children: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
