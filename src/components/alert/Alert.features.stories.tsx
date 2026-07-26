import type { StoryFn } from "@storybook/react-vite";
import {
    CheckmarkCircleRegular,
    ErrorCircleRegular,
    InfoRegular,
    WarningRegular,
} from "@gamecrafters/base-ui-icons";
import { Link } from "../link";
import Alert from "./Alert";

const classes = {
    row: "flex items-center",
    icon: "size-[var(--base-size-16)] shrink-0",
    // Pushes the action to the far end of the row
    action: "ml-auto",
};

export default {
    title: "Components/Alert/Features",
};

// Success
export const Success: StoryFn<typeof Alert> = () => (
    <Alert variant="success" className={classes.row}>
        <CheckmarkCircleRegular className={classes.icon} aria-label="Success" />
        Success
    </Alert>
);

// Warning
export const Warning: StoryFn<typeof Alert> = () => (
    <Alert variant="warning" className={classes.row}>
        <WarningRegular className={classes.icon} aria-label="Warning" />
        Warning
    </Alert>
);

// Danger
export const Danger: StoryFn<typeof Alert> = () => (
    <Alert variant="danger" className={classes.row}>
        <ErrorCircleRegular className={classes.icon} aria-label="Danger" />
        Danger
    </Alert>
);

// Full Width
export const Full: StoryFn<typeof Alert> = () => (
    <Alert full className={classes.row}>
        <InfoRegular className={classes.icon} aria-label="Info" />
        Full
    </Alert>
);

// With Icon And Action
export const WithIconAndAction: StoryFn<typeof Alert> = () => (
    <Alert className={classes.row}>
        <InfoRegular className={classes.icon} aria-label="Info" />
        This is an alert message with an icon and an action.
        <Link href="#" className={classes.action}>
            Join waitlist
        </Link>
    </Alert>
);
