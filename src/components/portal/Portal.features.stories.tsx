import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import Portal from "./Portal";
import { PortalContext } from "./PortalContext";
import { registerPortalRoot } from "./portalRoot";

const classes = {
    outer: "p-[var(--base-size-12)] bg-background-danger-muted",
    inner: "p-[var(--base-size-12)] bg-background-success-muted",
    section: "m-[var(--base-size-8)] p-[var(--base-size-8)]",
    default: "bg-background-accent-muted",
    context: "bg-background-attention-muted",
    override: "bg-background-success-muted",
    target: "mt-[var(--base-size-8)] p-[var(--base-size-8)] bg-background-inset border-[length:var(--border-width-thin)] border-solid border-border-muted",
};

export default {
    title: "Components/Portal/Features",
};

// Custom Portal Root By Id
export const CustomPortalRootById: StoryFn<typeof Portal> = () => (
    <>
        Root position
        <div className={classes.outer} id="__baseUiPortalRoot__">
            Outer container
            <div className={classes.inner}>
                Inner container
                <Portal>Portaled content rendered at the outer container.</Portal>
            </div>
        </div>
    </>
);

// Custom Portal Root By Registration
export const CustomPortalRootByRegistration: StoryFn<typeof Portal> = () => {
    const outerRef = React.useRef<HTMLDivElement>(null);
    // The container has to be registered before a portal can render into it
    const [registered, setRegistered] = React.useState(false);

    React.useEffect(() => {
        if (outerRef.current) {
            registerPortalRoot(outerRef.current);
            setRegistered(true);
        }
    }, []);

    return (
        <>
            Root position
            <div ref={outerRef} className={classes.outer}>
                Outer container
                <div className={classes.inner}>
                    Inner container
                    {registered ? (
                        <Portal>Portaled content rendered at the outer container.</Portal>
                    ) : null}
                </div>
            </div>
        </>
    );
};

// Multiple Portal Roots
export const MultiplePortalRoots: StoryFn<typeof Portal> = () => {
    const outerRef = React.useRef<HTMLDivElement>(null);
    const innerRef = React.useRef<HTMLDivElement>(null);
    const [registered, setRegistered] = React.useState(false);

    React.useEffect(() => {
        if (outerRef.current && innerRef.current) {
            registerPortalRoot(outerRef.current, "outer");
            registerPortalRoot(innerRef.current, "inner");
            setRegistered(true);
        }
    }, []);

    return (
        <>
            Root position
            <div ref={outerRef} className={classes.outer}>
                Outer container
                <div ref={innerRef} className={classes.inner}>
                    {registered ? (
                        <>
                            <Portal containerName="outer">
                                Portaled content rendered at the outer container.
                            </Portal>
                            <Portal containerName="inner">
                                Portaled content rendered at the end of the inner container.
                            </Portal>
                            <Portal>Portaled content rendered at the default portal root.</Portal>
                        </>
                    ) : null}
                    Inner container
                </div>
            </div>
        </>
    );
};

// With Portal Context
export const WithPortalContext: StoryFn<typeof Portal> = () => {
    const contextRef = React.useRef<HTMLDivElement>(null);
    const overrideRef = React.useRef<HTMLDivElement>(null);
    const [registered, setRegistered] = React.useState(false);

    React.useEffect(() => {
        if (contextRef.current && overrideRef.current) {
            registerPortalRoot(contextRef.current, "context-portal");
            registerPortalRoot(overrideRef.current, "override-portal");
            setRegistered(true);
        }
    }, []);

    return (
        <>
            <div className={classes.outer}>
                <div className={`${classes.section} ${classes.default}`}>
                    Default portal root, with no context
                    {registered ? <Portal>Content in the default portal root.</Portal> : null}
                </div>

                <div className={`${classes.section} ${classes.context}`}>
                    Container named by the context
                    <PortalContext.Provider value={{ portalContainerName: "context-portal" }}>
                        {registered ? <Portal>Content in the context container.</Portal> : null}
                    </PortalContext.Provider>
                </div>

                <div className={`${classes.section} ${classes.override}`}>
                    Context overridden by the containerName prop
                    <PortalContext.Provider value={{ portalContainerName: "context-portal" }}>
                        {registered ? (
                            <Portal containerName="override-portal">
                                Content in the overriding container.
                            </Portal>
                        ) : null}
                    </PortalContext.Provider>
                </div>
            </div>

            <div ref={contextRef} className={classes.target}>
                Context container
            </div>
            <div ref={overrideRef} className={classes.target}>
                Override container
            </div>
        </>
    );
};
