import { forwardRef } from "react";
import type * as React from "react";
import type { ComponentPropsWithRef, ElementType, JSX } from "react";
import type { SlotMarker } from "./types/slots";

type Merge<P1 = object, P2 = object> = Omit<P1, keyof P2> & P2;

type ForwardRefExoticComponent<E, OwnProps> = React.ForwardRefExoticComponent<
    Merge<E extends ElementType ? ComponentPropsWithRef<E> : never, OwnProps & { as?: E }>
>;

interface ForwardRefComponent<IntrinsicElementString, OwnProps = object>
    extends ForwardRefExoticComponent<IntrinsicElementString, OwnProps>, SlotMarker {
    <As = IntrinsicElementString>(
        props: As extends ""
            ? { as: keyof JSX.IntrinsicElements }
            : As extends React.ComponentType<infer P>
              ? Merge<P, OwnProps & { as: As }>
              : As extends keyof JSX.IntrinsicElements
                ? Merge<JSX.IntrinsicElements[As], OwnProps & { as: As }>
                : never,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): React.ReactElement<any> | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OwnProps<E> = E extends ForwardRefComponent<any, infer P> ? P : object;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IntrinsicElement<E> = E extends ForwardRefComponent<infer I, any> ? I : never;

export type { ForwardRefComponent, OwnProps, IntrinsicElement, Merge };

export type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends unknown
    ? Omit<T, TOmitted>
    : never;

export type PolymorphicProps<
    TAs extends ElementType,
    TDefaultElement extends ElementType = "div",
    Props = object,
> = DistributiveOmit<
    ComponentPropsWithRef<ElementType extends TAs ? TDefaultElement : TAs> & Props,
    "as"
> & {
    as?: TAs;
};

type FixedForwardRef = <T, P = object>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode;

export const fixedForwardRef = forwardRef as FixedForwardRef;
