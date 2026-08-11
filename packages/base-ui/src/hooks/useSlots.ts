import React from "react";
import { SlotMarker } from "../utilities/types/slots";
import { isSlot } from "../utilities/slot";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = any;
type ComponentMatcher = React.ElementType<Props>;
type ComponentAndPropsMatcher = [ComponentMatcher, (props: Props) => boolean];

export type SlotConfig = Record<string, ComponentMatcher | ComponentAndPropsMatcher>;

type SlotElements<Config extends SlotConfig> = {
    [Property in keyof Config]: SlotValue<Config, Property>;
};

type SlotValue<Config, Property extends keyof Config> = Config[Property] extends React.ElementType
    ? React.ReactElement<React.ComponentPropsWithoutRef<Config[Property]>, Config[Property]>
    : Config[Property] extends readonly [infer ElementType extends React.ElementType, infer _testFn]
      ? React.ReactElement<React.ComponentPropsWithoutRef<ElementType>, ElementType>
      : never;

const childMatchesSlot = (
    child: React.ReactElement,
    slotValue: ComponentMatcher | ComponentAndPropsMatcher,
): boolean => {
    if (Array.isArray(slotValue)) {
        const [component, testFn] = slotValue;
        return (
            (child.type === component || isSlot(child, component as SlotMarker)) &&
            testFn(child.props)
        );
    }
    return child.type === slotValue || isSlot(child, slotValue as SlotMarker);
};

export const useSlots = <Config extends SlotConfig>(
    children: React.ReactNode,
    config: Config,
): [Partial<SlotElements<Config>>, React.ReactNode[]] => {
    const rest: React.ReactNode[] = [];
    const keys = Object.keys(config) as Array<keyof Config>;
    const values = Object.values(config);
    const totalSlots = keys.length;

    const slots: Partial<SlotElements<Config>> = {} as Partial<SlotElements<Config>>;
    for (let i = 0; i < totalSlots; i++) {
        slots[keys[i]] = undefined;
    }

    let slotsFound = 0;

    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) {
            rest.push(child);
            return;
        }

        if (slotsFound === totalSlots) {
            rest.push(child);
            return;
        }

        const matchedIndex = findMatchingSlot(child, values, totalSlots);

        if (matchedIndex === -1) {
            rest.push(child);
            return;
        }

        const slotKey = keys[matchedIndex];

        if (slots[slotKey] !== undefined) {
            return;
        }

        slots[slotKey] = child as SlotValue<Config, keyof Config>;
        slotsFound++;
    });

    return [slots, rest];
};

const findMatchingSlot = (
    child: React.ReactElement,
    values: Array<ComponentMatcher | ComponentAndPropsMatcher>,
    totalSlots: number,
): number => {
    for (let i = 0; i < totalSlots; i++) {
        if (childMatchesSlot(child, values[i])) return i;
    }
    return -1;
};
