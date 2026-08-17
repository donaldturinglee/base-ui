import * as React from "react";
import { isResponsiveValue } from "../../hooks/useResponsive";
import { classNames } from "../../lib/classnames";
import { hasInteractiveNodes } from "../../utilities/interactive";
import { fixedForwardRef } from "../../utilities/polymorphic";
import Avatar, { DEFAULT_AVATAR_SIZE } from "../avatar/Avatar";
import type { AvatarShape, AvatarSize } from "../avatar/Avatar.types";
import type {
    AvatarStackAlign,
    AvatarStackChild,
    AvatarStackProps,
    AvatarStackVariant,
} from "./AvatarStack.types";

const ranges = ["narrow", "regular", "wide"] as const;

type Range = (typeof ranges)[number];

type AvatarStackWidth = "two" | "three" | "more";

const classes = {
    root: "avatar-stack",
    responsive: "avatar-stack-responsive",
    align: {
        left: "avatar-stack-align-left",
        right: "avatar-stack-align-right",
    } satisfies Record<AvatarStackAlign, string>,
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

// A size read the way an avatar reads its own: the regular range stands in wherever a range was
// left out, rather than the default doing so, since an avatar handed only a regular size keeps
// that size at every width and a stack that read it otherwise would crop it
const resolveSize = (size: AvatarSize | undefined): Record<Range, number> => {
    if (!isResponsiveValue(size)) {
        const fixed = size ?? DEFAULT_AVATAR_SIZE;

        return { narrow: fixed, regular: fixed, wide: fixed };
    }

    const regular: number = size.regular ?? DEFAULT_AVATAR_SIZE;

    return { narrow: size.narrow ?? regular, regular, wide: size.wide ?? regular };
};

const isAvatar = (child: React.ReactNode): child is AvatarStackChild =>
    React.isValidElement(child) && child.type === Avatar;

// A fragment is not one of the run but a way of writing several of it at once, and
// `React.Children` hands it back whole rather than opening it up
const isFragment = (
    child: React.ReactNode,
): child is React.ReactElement<{ children?: React.ReactNode }> =>
    React.isValidElement(child) && child.type === React.Fragment;

// The run the stack was written with. Only an avatar is dealt a place in it, since an avatar is
// what carries the size the run is cut to and the class the edge between two of them is drawn on.
// Anything else is left out rather than laid down half dressed, and is not counted either, so the
// track is never widened for something that was never shown
const collectAvatars = (children: React.ReactNode): AvatarStackChild[] =>
    React.Children.toArray(children).flatMap((child) => {
        if (isFragment(child)) {
            return collectAvatars(child.props.children);
        }

        return isAvatar(child) ? [child] : [];
    });

// Without a size of its own the stack takes the smallest size its avatars ask for, so no
// avatar is ever cropped
const getChildSize = (avatars: AvatarStackChild[]) => {
    const collected: Record<Range, number[]> = { narrow: [], regular: [], wide: [] };

    for (const avatar of avatars) {
        const size = resolveSize(avatar.props.size);

        for (const range of ranges) {
            collected[range].push(size[range]);
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
        align = "left",
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

    const avatars = collectAvatars(children);
    const count = avatars.length;
    const widthKey: AvatarStackWidth | undefined =
        count > 3 ? "more" : count === 3 ? "three" : count === 2 ? "two" : undefined;
    const isResponsive = !size || isResponsiveValue(size);
    const expandable = !disableExpand;

    const sizeVariables: Record<string, string> = {};

    if (isResponsiveValue(size)) {
        const responsiveSize = resolveSize(size);

        for (const range of ranges) {
            sizeVariables[`--avatar-stack-size-${range}`] = `${responsiveSize[range]}px`;
        }
    } else if (size) {
        sizeVariables["--avatar-stack-size"] = `${size}px`;
    } else {
        const childSize = getChildSize(avatars);
        for (const range of ranges) {
            sizeVariables[`--avatar-stack-size-${range}`] = `${childSize[range]}px`;
        }
    }

    const items = avatars.map((avatar, index) =>
        React.cloneElement(avatar, {
            className: classNames(
                classes.item.root,
                index === 0 ? classes.item.first : classes.item.overlapped,
                classes.item.shape[shape],
                align === "right" && shape === "square"
                    ? classes.item.edgeAlignRight
                    : classes.item.edge[shape],
                index > 0 && shape === "circle" && classes.item.mask,
                shape === "square" && classes.item.layer[Math.min(index, 4)],
                variant === "cascade" && classes.item.fade[index],
                index > 4 && classes.item.overflow,
                expandable && classes.item.expanded,
                expandable && index === 0 && classes.item.expandedFirst,
                avatar.props.className,
            ),
        }),
    );

    return (
        <Component
            ref={ref}
            className={classNames(
                classes.root,
                classes.variant[variant],
                widthKey && classes.width[variant][widthKey],
                classes.align[align],
                isResponsive && classes.responsive,
                className,
            )}
            style={{ ...style, ...sizeVariables } as React.CSSProperties}
            data-component="AvatarStack"
            data-variant={variant}
            data-shape={shape}
            data-avatar-count={count > 3 ? "3+" : count}
            data-align={align}
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
