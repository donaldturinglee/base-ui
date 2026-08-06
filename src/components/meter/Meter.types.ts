import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type MeterSize = "small" | "medium" | "large";

export type MeterVariant =
    "accent" | "attention" | "danger" | "done" | "neutral" | "severe" | "sponsors" | "success";

type MeterOwnProps = {
    // Where the reading stands. A value outside the ends it is measured between is brought back
    // to the end it ran past
    value: number;
    // The ends it is measured between. A meter is a reading within a known range rather than a
    // count of what is left to do, so both ends are the caller's to name
    min?: number;
    max?: number;
    // The shape the reading is written in: a currency, a unit, however many places. Left out, the
    // reading is written as how far along it stands, since a bare number says nothing without the
    // ends it was measured between. Either way it is written under the conventions the runtime is
    // set to, which are the reader's own
    format?: Intl.NumberFormatOptions;
    // What a screen reader is told the reading is, where the written one does not say it well
    // enough on its own
    getAriaValueText?: (formattedValue: string, value: number) => string;
    size?: MeterSize;
    variant?: MeterVariant;
    className?: string;
};

export type MeterProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    MeterOwnProps
>;

// The same props at the element a meter renders by default, for reading inside the component
export type MeterElementProps = MeterProps<"div">;

export type MeterLabelProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        className?: string;
    }
>;

// What the reading is handed to a caller drawing it themselves: the reading in words, and the
// number it was written from
export type MeterValueRenderProps = {
    formattedValue: string;
    value: number;
};

export type MeterValueChildren =
    React.ReactNode | ((props: MeterValueRenderProps) => React.ReactNode);

export type MeterValueProps = Omit<React.ComponentPropsWithoutRef<"span">, "children"> & {
    // The reading is written for the caller unless they would rather write it themselves
    children?: MeterValueChildren;
    className?: string;
};

export type MeterTrackProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        className?: string;
    }
>;

export type MeterIndicatorProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        className?: string;
    }
>;

export type MeterContextValue = {
    // The reading, held to the ends it is measured between
    value?: number;
    // Where it stands between them, as a share of the distance from nought to a hundred
    percentage?: number;
    // The reading in words
    formattedValue?: string;
    labelId?: string;
};
