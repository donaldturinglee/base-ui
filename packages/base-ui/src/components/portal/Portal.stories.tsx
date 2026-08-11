import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import Portal from "./Portal";
import { registerPortalRoot } from "./portalRoot";
import type { PortalProps } from "./Portal.types";

const classes = {
    outer: "p-[var(--base-size-12)] bg-background-danger-muted",
    inner: "p-[var(--base-size-12)] bg-background-success-muted",
};

export default {
    title: "Components/Portal",
    component: Portal,
} as Meta<typeof Portal>;

export const Default: StoryFn<typeof Portal> = () => (
    <>
        Root position
        <div className={classes.outer}>
            Outer container
            <div className={classes.inner}>
                Inner container
                <Portal>Portaled content rendered at the default portal root.</Portal>
            </div>
        </div>
    </>
);

export const Playground: StoryFn<PortalProps> = (args) => {
    const outerRef = React.useRef<HTMLDivElement>(null);
    const innerRef = React.useRef<HTMLDivElement>(null);
    // The containers have to exist before a portal can render into them
    const [registered, setRegistered] = React.useState(false);

    React.useEffect(() => {
        if (outerRef.current && innerRef.current) {
            registerPortalRoot(outerRef.current, "playground-outer");
            registerPortalRoot(innerRef.current, "playground-inner");
            setRegistered(true);
        }
    }, []);

    return (
        <>
            Root position
            <div ref={outerRef} className={classes.outer}>
                Outer container
                <div ref={innerRef} className={classes.inner}>
                    Inner container
                </div>
            </div>
            {registered ? <Portal {...args}>Portaled content</Portal> : null}
        </>
    );
};

Playground.args = {
    containerName: "playground-outer",
};

Playground.argTypes = {
    containerName: {
        control: {
            type: "radio",
        },
        options: ["playground-outer", "playground-inner"],
        description: "Name of the registered container the children render into",
    },
    onMount: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
};
