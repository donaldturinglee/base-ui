import type { UsePresenceOptions } from "./Presence.types";

// Takes the props that are about presence out of a set of them, so a component that manages
// the presence of what it holds can hand those to the hook and pass the rest on to whatever it
// draws
export const splitPresenceProps = <T extends UsePresenceOptions>(
    props: T,
): [UsePresenceOptions, Omit<T, keyof UsePresenceOptions>] => {
    const {
        present,
        lazyMount,
        unmountOnExit,
        hideMode,
        skipAnimationOnMount,
        onEnterComplete,
        onExitComplete,
        ...rest
    } = props;

    return [
        {
            present,
            lazyMount,
            unmountOnExit,
            hideMode,
            skipAnimationOnMount,
            onEnterComplete,
            onExitComplete,
        },
        rest,
    ];
};
