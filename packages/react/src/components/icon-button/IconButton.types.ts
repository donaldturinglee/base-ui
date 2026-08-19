import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { ButtonBaseProps, ButtonVisual } from "../button";

// An icon carries no text of its own, so an icon button has to be named for a screen reader
type IconButtonAccessibleName =
    | { "aria-label": string; "aria-labelledby"?: undefined }
    | { "aria-label"?: undefined; "aria-labelledby": string };

type IconButtonOwnProps = ButtonBaseProps & {
    icon: NonNullable<ButtonVisual>;
};

export type IconButtonProps<As extends React.ElementType = "button"> = Omit<
    PolymorphicProps<As, "button", IconButtonOwnProps>,
    "aria-label" | "aria-labelledby"
> &
    IconButtonAccessibleName;

// The same props with the accessible name left open, for reading inside the component
export type IconButtonElementProps = PolymorphicProps<"button", "button", IconButtonOwnProps>;
