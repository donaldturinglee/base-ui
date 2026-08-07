import * as React from "react";
import { isResponsiveValue } from "../../hooks/useResponsive";
import { classNames } from "../../lib/classnames";
import { hasInteractiveNodes } from "../../utilities/interactive";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { DEFAULT_AVATAR_SIZE } from "../avatar/Avatar";
import type { AvatarShape, AvatarSize } from "../avatar/Avatar.types";
import type { AvatarStackProps, AvatarStackVariant } from "./AvatarStack.types";

const ranges = ["narrow", "regular", "wide"] as const;

type Range = (typeof ranges)[number];

type AvatarStackWidth = "two" | "three" | "more";

const classes = {
    root: "avatar-stack",
    responsive: "avatar-stack-responsive",
    alignLeft: "avatar-stack-align-left",
    alignRight: "avatar-stack-align-right",
    variant: {
        cascade: "avatar-stack-cascade",
        stack: "avatar-stack-stack",
    } satisfies Record<AvatarStackVariant, string>,
    width: {
        cascade: {
            two: "avatar-stack-cascade-two",
            three: "avatar-stack-cascade-three",
            more: "avatar-stack-cascade-more",
        },
        stack: {
            two: "avatar-stack-stack-two",
            three: "avatar-stack-stack-three",
            more: "avatar-stack-stack-more",
        },
    } satisfies Record<AvatarStackVariant, Record<AvatarStackWidth, string>>,
    body: {
        collapsed: "avatar-stack-body",
        expandable: "avatar-stack-body-expandable",
    },
    item: {
        root: "avatar-stack-item",
        first: "avatar-stack-item-first",
        overlapped: "avatar-stack-item-overlapped",
        mask: "avatar-stack-item-mask",
        shape: {
            circle: "avatar-stack-item-circle",
            square: "avatar-stack-item-square",
        } satisfies Record<AvatarShape, string>,
        edge: {
            circle: "avatar-stack-item-edge-circle",
            square: "avatar-stack-item-edge-square",
        } satisfies Record<AvatarShape, string>,
        edgeAlignRight: "avatar-stack-item-edge-align-right",
        // Square avatars overlap without a mask, so the earlier ones have to sit on top
        layer: ["z-5", "z-4", "z-3", "z-2", "z-1"],
        // Indexed by child position: the first two stay solid, then each avatar fades a
        // step further back
        fade: [
            "",
            "",
            "avatar-stack-item-fade-third",
            "avatar-stack-item-fade-fourth",
            "avatar-stack-item-fade-fifth",
        ],
        overflow: "avatar-stack-item-overflow",
        expanded: "avatar-stack-item-expanded",
        expandedFirst: "avatar-stack-item-expanded-first",
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
