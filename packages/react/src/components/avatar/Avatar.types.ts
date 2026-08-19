import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type AvatarSize = number | ResponsiveValue<number>;

export type AvatarShape = "circle" | "square";

// How far the picture has got. An avatar handed no picture at all stays idle, which the fallback
// is drawn from in the same way as a picture still on its way, since in both cases there is
// nothing yet to show
export type AvatarLoadingStatus = "idle" | "loading" | "loaded" | "error";

// The avatar is the ground its parts are laid on rather than a picture of its own, so it is drawn
// as a span and carries nothing an image would
export type AvatarProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        size?: AvatarSize;
        shape?: AvatarShape;
        className?: string;
    }
>;

// The picture is an image and nothing else, laid inside the avatar rather than wrapped in ground
// of its own
export type AvatarImageProps = React.ComponentPropsWithoutRef<"img"> & {
    className?: string;
};

// The name is whoever the avatar is of, and the whole of what the fallback is drawn from: the
// initials are worked out from it, and it is what a screen reader is given in place of letters it
// would otherwise spell out one at a time. Nothing is written inside the fallback, so a column of
// them drawn from a list of people cannot disagree with itself over how a name is shortened
export type AvatarFallbackProps = Omit<React.ComponentPropsWithoutRef<"span">, "children"> & {
    name: string;
    className?: string;
};

// How far the picture has got, answered once on the avatar so the picture and the fallback take
// turns rather than each deciding for itself
export type AvatarContextValue = {
    status?: AvatarLoadingStatus;
    setStatus?: (status: AvatarLoadingStatus) => void;
};
