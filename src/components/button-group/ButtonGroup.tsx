import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ButtonGroupProps } from "./ButtonGroup.types";

const classes = {
    root: "button-group",
    item: {
        root: "button-group-item",
        first: "button-group-item-first",
        last: "button-group-item-last",
    },
};

const nonInteractiveSelectors = ["[disabled]", "[hidden]", "[inert]"];

// What the arrow keys move between in a toolbar. Anything already taken out of the tab order
// is still matched, since that is what the group does to the buttons it is not resting on
const focusTargetSelector = ["button", "a[href]", "summary"]
    .map((selector) => `${selector}:not(${nonInteractiveSelectors.join("):not(")})`)
    .join(", ");

const getFocusTargets = (group: HTMLElement | null) =>
    group ? Array.from(group.querySelectorAll<HTMLElement>(focusTargetSelector)) : [];

// A toolbar is a single tab stop, so every button but the one focus rests on is taken out of
// the tab order and reached with the arrow keys instead
const setTabStop = (targets: HTMLElement[], stop: HTMLElement | undefined) => {
    for (const target of targets) {
        target.tabIndex = target === stop ? 0 : -1;
    }
};

function ButtonGroup<As extends React.ElementType = "div">(
    props: ButtonGroupProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        children,
        role,
        onFocus,
        onKeyDown,
        ...rest
    } = props as ButtonGroupProps<"div">;

    const groupRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(ref, groupRef);
    const isToolbar = role === "toolbar";

    const updateTabStops = React.useCallback(() => {
        if (!isToolbar) {
            return;
        }

        const targets = getFocusTargets(groupRef.current);
        const focused = targets.find((target) => target === document.activeElement);

        setTabStop(targets, focused ?? targets[0]);
    }, [isToolbar]);

    // The tab stop is handed out again as the buttons come and go, so a toolbar built from a
    // changing set of buttons is never left without one
    React.useEffect(updateTabStops);

    // Buttons that come and go without the group itself being rendered again, such as one
    // that only appears while something is loading, are watched for rather than waited on
    React.useEffect(() => {
        if (!isToolbar || groupRef.current === null) {
            return;
        }

        const group = groupRef.current;
        const observer = new MutationObserver(updateTabStops);
        observer.observe(group, { childList: true, subtree: true });

        return () => {
            observer.disconnect();

            for (const target of getFocusTargets(group)) {
                target.removeAttribute("tabindex");
            }
        };
    }, [isToolbar, updateTabStops]);

    const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
        onFocus?.(event);

        if (!isToolbar) {
            return;
        }

        const targets = getFocusTargets(groupRef.current);

        // Focus landing somewhere the arrow keys do not reach leaves the tab stop where it is,
        // rather than taking it away from the group altogether
        if (targets.includes(event.target)) {
            setTabStop(targets, event.target);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

        if (!isToolbar || step === 0 || event.defaultPrevented) {
            return;
        }

        const targets = getFocusTargets(groupRef.current);
        const current = targets.indexOf(document.activeElement as HTMLElement);

        if (current === -1) {
            return;
        }

        // Focus wraps around rather than stopping at the ends of the group
        event.preventDefault();
        targets[(current + step + targets.length) % targets.length].focus();
    };

    // A child that is not there would take an item of its own and leave the group with a
    // squared off edge, so only the children that really are there are wrapped
    const items = React.Children.toArray(children);

    return (
        <Component
            ref={mergedRef}
            className={classNames(classes.root, className)}
            role={role}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            data-component="ButtonGroup"
            {...rest}
        >
            {items.map((item, index) => (
                <div
                    key={React.isValidElement(item) ? item.key : index}
                    className={classNames(
                        classes.item.root,
                        index === 0 && classes.item.first,
                        index === items.length - 1 && classes.item.last,
                    )}
                    data-component="ButtonGroup.Item"
                >
                    {item}
                </div>
            ))}
        </Component>
    );
}

ButtonGroup.displayName = "ButtonGroup";

export default fixedForwardRef(ButtonGroup);
