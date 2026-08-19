import type * as React from "react";
import type { ButtonProps } from "../button";

export type BannerVariant = "critical" | "info" | "success" | "upsell" | "warning";

// A compact banner keeps the same shape on less padding, for somewhere room is short
export type BannerLayout = "default" | "compact";

// Where the actions stand. "default" follows the room the banner itself is given, rather
// than the width of the viewport around it
export type BannerActionsLayout = "default" | "inline" | "stacked";

// The banner names a region, so its title starts at level two and never climbs above it
export type BannerTitleLevel = "h2" | "h3" | "h4" | "h5" | "h6";

export type BannerProps = React.ComponentPropsWithoutRef<"section"> & {
    // Names the region as well as titling it. Required unless Banner.Title is given as a
    // child instead
    title?: React.ReactNode;
    // Says more about the banner, below the title
    description?: React.ReactNode;
    // Keeps the title as the region's name while taking it off the screen
    hideTitle?: boolean;
    // Stands in place of the icon the variant would otherwise carry. Only read for the info
    // and upsell variants, where the icon says nothing the variant has not already said
    leadingVisual?: React.ReactNode;
    variant?: BannerVariant;
    layout?: BannerLayout;
    actionsLayout?: BannerActionsLayout;
    // Gives up the side borders and the corners, for a banner that spans a dialog, a table
    // or a card rather than standing on its own
    flush?: boolean;
    // Shows a dismiss button, and is called when it is pressed
    onDismiss?: () => void;
    primaryAction?: React.ReactNode;
    secondaryAction?: React.ReactNode;
    className?: string;
};

export type BannerTitleProps = React.ComponentPropsWithoutRef<"h2"> & {
    as?: BannerTitleLevel;
    className?: string;
};

export type BannerDescriptionProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// The variant is the action's whole point, so it is not left for a caller to change
export type BannerActionProps = Omit<ButtonProps, "variant">;

export type BannerPrimaryActionProps = BannerActionProps;

export type BannerSecondaryActionProps = BannerActionProps;

export type BannerContextValue = {
    // The id of the element naming the region, which the title carries
    titleId?: string;
};
