import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { ButtonProps } from "../button";

// What closed the dialog, so a caller can tell one way of dismissing it from another
export type DialogCloseGesture = "close-button" | "escape";

// An alert dialog is for a decision that has to be made before anything else can happen
export type DialogRole = "dialog" | "alertdialog";

export type DialogNamedWidth = "small" | "medium" | "large" | "xlarge";

// A named width takes a step of the overlay scale; anything else is passed straight
// through as a CSS width
export type DialogWidth = DialogNamedWidth | Exclude<React.CSSProperties["width"], undefined>;

// A dialog is only as tall as it needs to be unless it is asked to hold a step of the
// overlay scale
export type DialogHeight = "small" | "large" | "auto";

export type DialogPosition = "center" | "left" | "right";

// A narrow viewport has no room either side of a dialog, so it takes the bottom of the
// screen or the whole of it instead
export type DialogNarrowPosition = "center" | "bottom" | "fullscreen";

// Only the narrow and regular ranges are laid out differently, so a wide position would
// have nothing of its own to say
export type DialogResponsivePosition = Pick<
    ResponsiveValue<DialogPosition, DialogNarrowPosition>,
    "narrow" | "regular"
>;

// Where a centred dialog sits down the screen
export type DialogAlign = "top" | "center" | "bottom";

// Whether the footer buttons wrap onto another line or are scrolled through sideways
export type DialogFooterButtonLayout = "wrap" | "scroll";

// "normal" is another name for "default", kept for callers that already use it
export type DialogButtonType = "default" | "primary" | "danger" | "normal";

// The label comes from `content` rather than from children, so the buttons can be given
// as plain objects
export type DialogButtonProps = Omit<ButtonProps, "children"> & {
    buttonType?: DialogButtonType;
    // The button's inner text
    content: React.ReactNode;
    // Takes focus as the dialog opens, where it is the first button asking for it
    autoFocus?: boolean;
    ref?: React.RefObject<HTMLButtonElement | null>;
};

// `title`, `role` and `onClose` all mean something else on a plain div, so the div's own
// versions are dropped in favour of the dialog's
export type DialogProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "title" | "role" | "onClose"
> & {
    // Names the dialog to a screen reader as well as titling it
    title?: React.ReactNode;
    // Rendered below the title in smaller type, and describes the dialog to a screen
    // reader
    subtitle?: React.ReactNode;
    // Renders the header in place of the default one, edge to edge and down to the body.
    // A custom renderer may well step outside what the design system asks for
    renderHeader?: DialogRenderer<DialogHeaderRenderProps>;
    // Renders the body in place of the default one, edge to edge between header and
    // footer
    renderBody?: DialogRenderer<DialogRenderProps>;
    // Renders the footer in place of the default one, edge to edge from the body down
    renderFooter?: DialogRenderer<DialogRenderProps>;
    // The buttons the footer holds
    footerButtons?: DialogButtonProps[];
    // Called when the dialog is dismissed, with the gesture that dismissed it
    onClose: (gesture: DialogCloseGesture) => void;
    role?: DialogRole;
    width?: DialogWidth;
    height?: DialogHeight;
    position?: DialogPosition | DialogResponsivePosition;
    // Only read where the dialog is centred, since a side sheet fills the height anyway
    align?: DialogAlign;
    // Takes focus once the dialog closes, in place of whatever held it beforehand
    returnFocusRef?: React.RefObject<HTMLElement | null>;
    // Takes focus as the dialog opens, in place of the first thing inside it that can
    initialFocusRef?: React.RefObject<HTMLElement | null>;
    className?: string;
};

// A renderer is called rather than rendered, so that one which renders nothing can be
// told apart from one that is simply empty
export type DialogRenderer<Props> = (props: Props) => React.ReactElement | null;

// What a custom renderer is handed: everything the dialog was given, and the children it
// was given them with
export type DialogRenderProps = React.PropsWithChildren<DialogProps>;

export type DialogHeaderRenderProps = DialogRenderProps & {
    // The id of the element naming the dialog, which the title carries
    dialogLabelId: string;
    // The id of the element describing the dialog, which the subtitle carries
    dialogDescriptionId: string;
};

export type DialogHeaderProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type DialogTitleProps<As extends React.ElementType = "h1"> = PolymorphicProps<
    As,
    "h1",
    {
        className?: string;
    }
>;

export type DialogSubtitleProps<As extends React.ElementType = "h2"> = PolymorphicProps<
    As,
    "h2",
    {
        className?: string;
    }
>;

export type DialogBodyProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type DialogFooterProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type DialogButtonsProps = {
    buttons: DialogButtonProps[];
};

// The button is named for a screen reader by the dialog itself, so there is nothing left
// for a caller to name it with
export type DialogCloseButtonProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "onClick" | "aria-label" | "aria-labelledby"
> & {
    // Called when the button is pressed, so the dialog can close itself
    onClose: () => void;
    className?: string;
};

export type DialogContextValue = {
    // The footer button that takes focus as the dialog opens
    autoFocusRef?: React.RefObject<HTMLButtonElement | null>;
};
