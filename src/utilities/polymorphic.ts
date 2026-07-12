/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any */

import type * as React from "react";
import type { JSX } from "react";

export interface SlotMarker {
    /** Marker to denote the custom child slot for a component */
    __SLOT__?: symbol;
}

export type WithSlotMarker<T> = T & SlotMarker;

export type FCWithSlotMarker<P> = WithSlotMarker<React.FC<P>>;

/* Utility types */

type Merge<P1 = {}, P2 = {}> = Omit<P1, keyof P2> & P2;

/**
 * Infers the Props if E is a ForwardRefExoticComponentWithAs
 */
type Props<E> = E extends ForwardRefComponent<any, infer P> ? P : {};

/**
 * Infers the JSX.IntrinsicElement if E is a ForwardRefExoticComponentWithAs
 */
type IntrinsicElement<E> = E extends ForwardRefComponent<infer I, any> ? I : never;

type ForwardRefExoticComponent<E, Props> = React.ForwardRefExoticComponent<
    Merge<E extends React.ElementType ? React.ComponentPropsWithRef<E> : never, Props & { as?: E }>
>;

/* ForwardRefComponent */

interface ForwardRefComponent<
    IntrinsicElementString,
    Props = {},
    /**
     * Extends original type to ensure built in React types play nice
     * with polymorphic components still e.g. `React.ElementRef` etc.
     */
>
    extends ForwardRefExoticComponent<IntrinsicElementString, Props>, SlotMarker {
    /**
     * When `as` prop is passed, use this overload.
     * Merges original own props (without DOM props) and the inferred props
     * from `as` element with the own props taking precedence.
     *
     * We explicitly avoid `React.ElementType` and manually narrow the prop types
     * so that events are typed when using JSX.IntrinsicElements.
     */
    <As = IntrinsicElementString>(
        props: As extends ""
            ? { as: keyof JSX.IntrinsicElements }
            : As extends React.ComponentType<infer P>
              ? Merge<P, Props & { as: As }>
              : As extends keyof JSX.IntrinsicElements
                ? Merge<JSX.IntrinsicElements[As], Props & { as: As }>
                : never,
    ): React.ReactElement<any> | null;
}

export type { ForwardRefComponent, Props, IntrinsicElement, Merge };
