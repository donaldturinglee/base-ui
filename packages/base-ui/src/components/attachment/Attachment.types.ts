import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { IconButtonProps } from "../icon-button";

// How far the file has got. An idle attachment is a place kept for a file that has not been
// chosen yet, which is why it is drawn as an outline rather than as a card; the rest are the
// stages a file passes through once one has
export type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done";

export type AttachmentSize = "small" | "medium" | "large";

// Laid out as a row, which reads as a file in a list, or as a column, which reads as a tile in
// a gallery
export type AttachmentOrientation = "horizontal" | "vertical";

// An icon stands for a file of a kind, an image for the file itself
export type AttachmentMediaVariant = "icon" | "image";

export type AttachmentProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        state?: AttachmentState;
        size?: AttachmentSize;
        orientation?: AttachmentOrientation;
        className?: string;
    }
>;

export type AttachmentMediaProps = React.ComponentPropsWithoutRef<"div"> & {
    variant?: AttachmentMediaVariant;
    className?: string;
};

export type AttachmentContentProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type AttachmentTitleProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type AttachmentDescriptionProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type AttachmentActionsProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// An action is an icon button, so it is named the same way one is
export type AttachmentActionProps<As extends React.ElementType = "button"> = IconButtonProps<As>;

// The trigger is laid over the whole attachment, so whatever it is drawn as is what the reader
// tabs to and what names the attachment
export type AttachmentTriggerProps<As extends React.ElementType = "button"> = PolymorphicProps<
    As,
    "button",
    {
        className?: string;
    }
>;

export type AttachmentGroupProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// What the whole is doing, so the parts inside it are drawn from it rather than each being told
// separately
export type AttachmentContextValue = {
    state?: AttachmentState;
    size?: AttachmentSize;
    orientation?: AttachmentOrientation;
};
