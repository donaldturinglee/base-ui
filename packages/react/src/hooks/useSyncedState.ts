import { useState } from "react";

// State that follows the value it was initialised with. When that value changes the state
// moves with it during the same render, rather than an effect and a repaint later.
//
// Adapted from
// https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
//
// The values are compared with `Object.is`, so anything that is not a primitive needs an
// `isEqual` of its own to avoid resetting the state on every render
export const useSyncedState = <T>(
    initialValue: T | (() => T),
    { isPropUpdateDisabled = false, isEqual = Object.is } = {},
) => {
    const [state, setState] = useState(initialValue);
    const [previous, setPrevious] = useState(initialValue);

    const nextInitialValue = initialValue instanceof Function ? initialValue() : initialValue;

    if (!isPropUpdateDisabled && !isEqual(previous, nextInitialValue)) {
        setPrevious(nextInitialValue);
        setState(nextInitialValue);
    }

    return [state, setState] as const;
};
