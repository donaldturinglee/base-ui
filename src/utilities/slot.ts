import { SlotMarker, WithSlotMarker } from "./types/slots";

export const isSlot = (element: unknown, slot: WithSlotMarker<unknown>): boolean => {
    const elementType = typeof element;

    if (elementType !== "object" && elementType !== "function" && element != null) {
        return false;
    }
    const reactElement = element as { type?: SlotMarker } & SlotMarker;

    const elementSlot = reactElement.__SLOT__ ?? reactElement.type?.__SLOT__;
    return slot.__SLOT__ ? elementSlot === slot.__SLOT__ : false;
};

export const asSlot = <T>(component: T, slotSource: WithSlotMarker<unknown>): WithSlotMarker<T> => {
    if (slotSource.__SLOT__) {
        (component as unknown as SlotMarker).__SLOT__ = slotSource.__SLOT__;
    }
    return component as WithSlotMarker<T>;
};
