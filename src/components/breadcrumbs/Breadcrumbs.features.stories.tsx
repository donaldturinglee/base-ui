import type { StoryFn } from "@storybook/react-vite";
import { Breadcrumbs } from ".";

const classes = {
    // A trail is only ever as wide as it is given room for, which is what decides how much
    // of it is moved into the menu
    wide: "w-[36rem]",
    narrow: "w-[20rem]",
};

export default {
    title: "Components/Breadcrumbs/Features",
    parameters: {
        layout: "centered",
    },
};

const steps = ["Home", "Products", "Category", "Subcategory", "Item", "Details", "Current page"];

// Wrapping, where a trail that no longer fits runs onto another line
export const OverflowWrap: StoryFn<typeof Breadcrumbs> = () => (
    <div className={classes.narrow}>
        <Breadcrumbs overflow="wrap">
            {steps.map((step, index) => (
                <Breadcrumbs.Item key={step} href="#" selected={index === steps.length - 1}>
                    {step}
                </Breadcrumbs.Item>
            ))}
        </Breadcrumbs>
    </div>
);

// A Menu, where the middle of the trail is given up before its ends are
export const OverflowMenu: StoryFn<typeof Breadcrumbs> = () => (
    <div className={classes.narrow}>
        <Breadcrumbs overflow="menu">
            {steps.map((step, index) => (
                <Breadcrumbs.Item key={step} href="#" selected={index === steps.length - 1}>
                    {step}
                </Breadcrumbs.Item>
            ))}
        </Breadcrumbs>
    </div>
);

// A Menu That Keeps The Root, so the reader can still see where the trail begins
export const OverflowMenuWithRoot: StoryFn<typeof Breadcrumbs> = () => (
    <div className={classes.narrow}>
        <Breadcrumbs overflow="menu-with-root">
            <Breadcrumbs.Item href="#">github</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Teams</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Engineering</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">core-productivity</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">collaboration-workflows</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#" selected>
                global-navigation-reviewers
            </Breadcrumbs.Item>
        </Breadcrumbs>
    </div>
);

// The Spacious Trail, drawn as a row of boxes rather than as a line of links
export const Spacious: StoryFn<typeof Breadcrumbs> = () => (
    <div className={classes.wide}>
        <Breadcrumbs variant="spacious">
            <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#" selected>
                Current page
            </Breadcrumbs.Item>
        </Breadcrumbs>
    </div>
);

// The Spacious Trail With A Menu, which gives up its middle in the same way
export const SpaciousWithOverflowMenu: StoryFn<typeof Breadcrumbs> = () => (
    <div className={classes.narrow}>
        <Breadcrumbs overflow="menu" variant="spacious">
            {steps.map((step, index) => (
                <Breadcrumbs.Item key={step} href="#" selected={index === steps.length - 1}>
                    {step}
                </Breadcrumbs.Item>
            ))}
        </Breadcrumbs>
    </div>
);

// A Trail Of Two, which has nothing in its middle to give up
export const TwoSteps: StoryFn<typeof Breadcrumbs> = () => (
    <div className={classes.narrow}>
        <Breadcrumbs overflow="menu">
            <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#" selected>
                Current page
            </Breadcrumbs.Item>
        </Breadcrumbs>
    </div>
);

// Steps That Are Not Anchors, for a trail built on a router's own link
export const CustomElement: StoryFn<typeof Breadcrumbs> = () => (
    <Breadcrumbs>
        <Breadcrumbs.Item as="button" type="button" onClick={() => {}}>
            Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item as="button" type="button" onClick={() => {}} selected>
            Current page
        </Breadcrumbs.Item>
    </Breadcrumbs>
);
