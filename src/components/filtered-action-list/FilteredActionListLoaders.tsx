import { classNames } from "../../utilities/classnames";
import { SkeletonBox } from "../skeleton-box";
import { Spinner } from "../spinner";
import { Stack } from "../stack";
import type { FilteredActionListBodyLoaderProps } from "./FilteredActionList.types";

const classes = {
    spinner: "grow h-full p-[var(--base-size-16)] content-center text-center",
    skeleton: "grow p-[var(--base-size-8)]",
};

// How tall a skeleton row stands, which is what says how many of them fill the room there is
const SKELETON_ROW_HEIGHT = 24;

// Never so few rows that the wait reads as a list with nothing in it
const SKELETON_MIN_ROWS = 3;

// The rows are drawn at a handful of widths in turn, so that the block reads as lines of
// text rather than as one solid shape
const SKELETON_ROW_WIDTHS = ["80%", "52.5%", "67.5%", "40%", "72.5%"];

// Stands in place of the list while it waits. Which of the two is drawn is the caller's,
// since a list that is being filtered again reads differently from one arriving for the
// first time
export function FilteredActionListBodyLoader(props: FilteredActionListBodyLoaderProps) {
    const { loadingType, height = 0, className, ...rest } = props;

    if (loadingType === "input") {
        // The wait is shown in the field instead, and the list is left where it is
        return null;
    }

    if (loadingType === "body-skeleton") {
        const rows = Math.max(Math.floor(height / SKELETON_ROW_HEIGHT), SKELETON_MIN_ROWS);

        return (
            <Stack
                gap="condensed"
                justify="center"
                className={classNames(classes.skeleton, className)}
                data-component="FilteredActionList.Skeleton"
                {...rest}
            >
                {Array.from({ length: rows }, (_, index) => (
                    <Stack key={index} direction="horizontal" gap="condensed" align="center">
                        <SkeletonBox width="16px" height="16px" />
                        <SkeletonBox
                            width={SKELETON_ROW_WIDTHS[index % SKELETON_ROW_WIDTHS.length]}
                            height="10px"
                        />
                    </Stack>
                ))}
            </Stack>
        );
    }

    return (
        <div
            className={classNames(classes.spinner, className)}
            data-component="FilteredActionList.Spinner"
            {...rest}
        >
            <Spinner />
        </div>
    );
}

FilteredActionListBodyLoader.displayName = "FilteredActionList.BodyLoader";
