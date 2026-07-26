import * as React from "react";
import { isResponsiveValue } from "../../hooks/useResponsive";
import { classNames } from "../../utilities/classnames";
import { hasInteractiveNodes } from "../../utilities/interactive";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { DEFAULT_AVATAR_SIZE } from "../avatar/Avatar";
import type { AvatarShape, AvatarSize } from "../avatar/Avatar.types";
import type { AvatarStackProps, AvatarStackVariant } from "./AvatarStack.types";

const ranges = ["narrow", "regular", "wide"] as const;

type Range = (typeof ranges)[number];

type AvatarStackWidth = "two" | "three" | "more";

const classes = {
    root: "relative flex isolate h-[var(--avatar-stack-size)] min-w-[var(--avatar-stack-size)] [--avatar-stack-border-width:1px] [--avatar-stack-mask-size:calc(100%+(var(--avatar-stack-border-width)*2))] [--avatar-stack-opacity-step:15%]",
    // The viewport ranges are exclusive, so an unset narrow or wide size keeps the regular one
    responsive:
        "max-medium:[--avatar-stack-size:var(--avatar-stack-size-narrow)] medium:max-xxlarge:[--avatar-stack-size:var(--avatar-stack-size-regular)] xxlarge:[--avatar-stack-size:var(--avatar-stack-size-wide)]",
    // The mask slides to the opposite edge when the stack runs right to left
    alignLeft: "[--avatar-stack-mask-start:-1]",
    alignRight: "[direction:rtl] [--avatar-stack-mask-start:1]",
    variant: {
        cascade:
            "[--avatar-stack-overlap:calc(var(--avatar-stack-size)*0.55)] [--avatar-stack-overlap-large:calc(var(--avatar-stack-size)*0.85)]",
        stack: "[--avatar-stack-overlap:calc(var(--avatar-stack-size)*0.55)] [--avatar-stack-overlap-large:calc(var(--avatar-stack-size)*0.55)]",
    } satisfies Record<AvatarStackVariant, string>,
    // One avatar per visible slot, so the track widens by the uncovered part of each one
    width: {
        cascade: {
            two: "min-w-[calc(var(--avatar-stack-size)+(var(--avatar-stack-size)-var(--avatar-stack-overlap)))]",
            three: "min-w-[calc(var(--avatar-stack-size)+(var(--avatar-stack-size)-var(--avatar-stack-overlap))+(var(--avatar-stack-size)-var(--avatar-stack-overlap-large)))]",
            more: "min-w-[calc(var(--avatar-stack-size)+(var(--avatar-stack-size)-var(--avatar-stack-overlap))+(var(--avatar-stack-size)-var(--avatar-stack-overlap-large))*2)]",
        },
        stack: {
            two: "min-w-[calc(var(--avatar-stack-size)+(var(--avatar-stack-size)-var(--avatar-stack-overlap)))]",
            three: "min-w-[calc(var(--avatar-stack-size)+(var(--avatar-stack-size)-var(--avatar-stack-overlap-large))*2)]",
            more: "min-w-[calc(var(--avatar-stack-size)+(var(--avatar-stack-size)-var(--avatar-stack-overlap-large))*3)] [--avatar-stack-overlap:var(--avatar-stack-overlap-large)]",
        },
    } satisfies Record<AvatarStackVariant, Record<AvatarStackWidth, string>>,
    body: {
        collapsed: "relative flex",
        // `group` lets the avatars react to the whole stack being hovered or focused
        expandable: "group absolute flex hover:w-auto focus-within:w-auto",
    },
    item: {
        root: "relative flex shrink-0 overflow-hidden w-[var(--avatar-stack-size)] h-[var(--avatar-stack-size)] [--avatar-size-regular:var(--avatar-stack-size)] transition-[margin,opacity,mask-position,mask-size] duration-[var(--motion-duration-short)] ease-[var(--motion-easing-move)]",
        first: "ms-0",
        // The padding keeps a hairline of the underlying element from showing at the edges
        overlapped:
            "ms-[calc(var(--avatar-stack-overlap)*-1)] p-[0.1px] [mask-repeat:no-repeat,no-repeat] [mask-composite:exclude] [mask-size:var(--avatar-stack-mask-size)_var(--avatar-stack-mask-size),auto] [mask-position:calc((var(--avatar-stack-size)-var(--avatar-stack-overlap))*var(--avatar-stack-mask-start)-var(--avatar-stack-border-width))_center,0_0]",
        // Punches the next avatar's outline out of this one, so the two never touch
        mask: "[mask-image:radial-gradient(at_50%_50%,rgb(0,0,0)_70%,rgb(0,0,0,0)_71%),linear-gradient(rgb(0,0,0)_0_0)]",
        shape: {
            circle: "rounded-[var(--border-radius-full)]",
            square: "rounded-[clamp(var(--base-size-4),calc(var(--avatar-stack-size)_-_var(--base-size-24)),var(--border-radius-medium))]",
        } satisfies Record<AvatarShape, string>,
        // Square avatars cannot be masked into each other, so a hairline separates them
        edge: {
            circle: "[&:is(img)]:[box-shadow:0_0_0_var(--avatar-stack-border-width)_transparent]",
            square: "[&:is(img)]:[box-shadow:1px_0_var(--avatar-border-color)]",
        } satisfies Record<AvatarShape, string>,
        edgeAlignRight: "[&:is(img)]:[box-shadow:-1px_0_var(--avatar-border-color)]",
        // Square avatars overlap without a mask, so the earlier ones have to sit on top
        layer: ["z-5", "z-4", "z-3", "z-2", "z-1"],
        // Indexed by child position: the first two stay solid, then each avatar fades a
        // step further back
        fade: [
            "",
            "",
            "[--avatar-stack-overlap:var(--avatar-stack-overlap-large)] opacity-[calc(100%-2*var(--avatar-stack-opacity-step))]",
            "opacity-[calc(100%-3*var(--avatar-stack-opacity-step))]",
            "opacity-[calc(100%-4*var(--avatar-stack-opacity-step))]",
        ],
        overflow: "invisible opacity-0",
        expanded:
            "group-hover:ms-[var(--base-size-4)] group-hover:visible group-hover:opacity-100 group-hover:[--avatar-stack-mask-size:100%] group-hover:[mask-position:calc(var(--avatar-stack-size)*var(--avatar-stack-mask-start))_center,0_0] group-focus-within:ms-[var(--base-size-4)] group-focus-within:visible group-focus-within:opacity-100 group-focus-within:[--avatar-stack-mask-size:100%] group-focus-within:[mask-position:calc(var(--avatar-stack-size)*var(--avatar-stack-mask-start))_center,0_0]",
        expandedFirst: "group-hover:ms-0 group-focus-within:ms-0",
    },
};

// Without a size of its own the stack takes the smallest size its avatars ask for, so no
// avatar is ever cropped
const getChildSize = (children: React.ReactNode) => {
    const collected: Record<Range, number[]> = { narrow: [], regular: [], wide: [] };

    for (const child of React.Children.toArray(children)) {
        if (!React.isValidElement<{ size?: AvatarSize }>(child)) {
            continue;
        }

        const size = child.props.size;

        for (const range of ranges) {
            collected[range].push(
                isResponsiveValue(size)
                    ? (size[range] ?? DEFAULT_AVATAR_SIZE)
                    : (size ?? DEFAULT_AVATAR_SIZE),
            );
        }
    }

    return Object.fromEntries(
        ranges.map((range) => [
            range,
            collected[range].length > 0 ? Math.min(...collected[range]) : DEFAULT_AVATAR_SIZE,
        ]),
    ) as Record<Range, number>;
};

function AvatarStack<As extends React.ElementType = "span">(
    props: AvatarStackProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        children,
        variant = "cascade",
        shape = "circle",
        size,
        alignRight,
        disableExpand,
        style,
        ...rest
    } = props as AvatarStackProps<"span">;

    const bodyRef = React.useRef<HTMLDivElement>(null);
    const [hasInteractiveChildren, setHasInteractiveChildren] = React.useState(false);

    // A stack that already contains something focusable does not need a focus stop of its own
    React.useEffect(() => {
        if (!bodyRef.current) {
            return;
        }

        const body = bodyRef.current;
        const update = () => {
            setHasInteractiveChildren(hasInteractiveNodes(body));
        };

        const observer = new MutationObserver(update);
        observer.observe(body, { childList: true });
        update();

        return () => {
            observer.disconnect();
        };
    }, []);

    const count = React.Children.count(children);
    const widthKey: AvatarStackWidth | undefined =
        count > 3 ? "more" : count === 3 ? "three" : count === 2 ? "two" : undefined;
    const isResponsive = !size || isResponsiveValue(size);
    const expandable = !disableExpand;

    const sizeVariables: Record<string, string> = {};

    if (isResponsiveValue(size)) {
        for (const range of ranges) {
            sizeVariables[`--avatar-stack-size-${range}`] =
                `${size[range] ?? DEFAULT_AVATAR_SIZE}px`;
        }
    } else if (size) {
        sizeVariables["--avatar-stack-size"] = `${size}px`;
    } else {
        const childSize = getChildSize(children);
        for (const range of ranges) {
            sizeVariables[`--avatar-stack-size-${range}`] = `${childSize[range]}px`;
        }
    }

    const items = React.Children.map(children, (child, index) => {
        if (!React.isValidElement<{ className?: string }>(child)) {
            return child;
        }

        return React.cloneElement(child, {
            className: classNames(
                classes.item.root,
                index === 0 ? classes.item.first : classes.item.overlapped,
                classes.item.shape[shape],
                alignRight && shape === "square"
                    ? classes.item.edgeAlignRight
                    : classes.item.edge[shape],
                index > 0 && shape === "circle" && classes.item.mask,
                shape === "square" && classes.item.layer[Math.min(index, 4)],
                variant === "cascade" && classes.item.fade[index],
                index > 4 && classes.item.overflow,
                expandable && classes.item.expanded,
                expandable && index === 0 && classes.item.expandedFirst,
                child.props.className,
            ),
        });
    });

    return (
        <Component
            ref={ref}
            className={classNames(
                classes.root,
                classes.variant[variant],
                widthKey && classes.width[variant][widthKey],
                alignRight ? classes.alignRight : classes.alignLeft,
                isResponsive && classes.responsive,
                className,
            )}
            style={{ ...style, ...sizeVariables } as React.CSSProperties}
            data-component="AvatarStack"
            data-variant={variant}
            data-shape={shape}
            data-avatar-count={count > 3 ? "3+" : count}
            data-align-right={alignRight}
            data-responsive={isResponsive || undefined}
            {...rest}
        >
            <div
                ref={bodyRef}
                className={expandable ? classes.body.expandable : classes.body.collapsed}
                tabIndex={expandable && !hasInteractiveChildren ? 0 : undefined}
                data-component="AvatarStack.Body"
                data-disable-expand={disableExpand}
            >
                {items}
            </div>
        </Component>
    );
}

AvatarStack.displayName = "AvatarStack";

export default fixedForwardRef(AvatarStack);
