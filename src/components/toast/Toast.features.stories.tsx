import * as React from "react";
import { SparkleRegular } from "@gamecrafters/base-ui-icons";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Text } from "../text";
import { Toaster, toast } from ".";
import type { ToastPosition, ToasterProps } from "./Toast.types";

const classes = {
    row: "flex flex-wrap gap-[var(--base-size-8)]",
    custom: "flex w-full items-center gap-[var(--base-size-8)] rounded-[var(--border-radius-medium)] bg-[var(--background-color-upsell-muted)] p-[var(--base-size-12)] [box-shadow:var(--shadow-floating-small)]",
};

const positions: ToastPosition[] = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
];

const variants = ["default", "success", "error", "warning", "info", "loading"] as const;

// The ones that carry a colour of their own, which rich colours take the whole toast from
const colouredVariants = ["success", "error", "warning", "info"] as const;

// A row of buttons that put toasts up, and the one place they all come out at
const Example = ({ children, ...props }: ToasterProps & { children: React.ReactNode }) => (
    <>
        <div className={classes.row}>{children}</div>
        <Toaster {...props} />
    </>
);

const wait = (ms: number) =>
    new Promise((settle) => {
        window.setTimeout(settle, ms);
    });

export default {
    title: "Components/Toast/Features",
    parameters: {
        layout: "centered",
    },
};

// What The Toast Is Saying, which settles the icon it carries
export const Variants: StoryFn = () => (
    <Example>
        {variants.map((variant) => (
            <Button
                key={variant}
                onClick={() =>
                    variant === "default"
                        ? toast("Your changes have been saved")
                        : toast[variant]("Your changes have been saved")
                }
            >
                {variant}
            </Button>
        ))}
    </Example>
);

// A Description, for what the first line leaves out
export const WithADescription: StoryFn = () => (
    <Example>
        <Button
            onClick={() =>
                toast.success("Your changes have been saved", {
                    description: "Everything on this page is up to date as of just now",
                })
            }
        >
            Show a toast
        </Button>
    </Example>
);

// Something To Do About It, which sees the toast off once it has been pressed
export const WithAnAction: StoryFn = () => (
    <Example>
        <Button
            onClick={() =>
                toast("The draft has been deleted", {
                    action: {
                        label: "Undo",
                        onClick: () => toast.success("The draft is back"),
                    },
                })
            }
        >
            Delete the draft
        </Button>
        <Button
            onClick={() =>
                toast("Leave without saving?", {
                    action: { label: "Leave" },
                    cancel: { label: "Stay" },
                    duration: Infinity,
                })
            }
        >
            Ask before leaving
        </Button>
    </Example>
);

// A Close Button, for a reader who would rather not wait the toast out
export const WithACloseButton: StoryFn = () => (
    <Example closeButton>
        <Button onClick={() => toast("Your changes have been saved")}>Show a toast</Button>
    </Example>
);

// Rich Colours, where the whole toast takes what it is saying rather than only its icon
export const RichColors: StoryFn = () => (
    <Example richColors>
        {colouredVariants.map((variant) => (
            <Button key={variant} onClick={() => toast[variant]("Your changes have been saved")}>
                {variant}
            </Button>
        ))}
    </Example>
);

// Where They Gather, which is the corner or the edge of the viewport the stack is anchored to
export const Positions: StoryFn = () => {
    const [position, setPosition] = React.useState<ToastPosition>("bottom-right");

    return (
        <Example position={position}>
            {positions.map((option) => (
                <Button
                    key={option}
                    variant={option === position ? "primary" : "default"}
                    onClick={() => {
                        setPosition(option);
                        toast(`Gathering at the ${option.replace("-", " ")}`);
                    }}
                >
                    {option}
                </Button>
            ))}
        </Example>
    );
};

// A Stack Laid Out In Full, rather than one gathered into a pile until the reader comes to it
export const Expanded: StoryFn = () => (
    <Example expand>
        <Button onClick={() => toast("Your changes have been saved")}>Show a toast</Button>
    </Example>
);

// How Many Stand At Once, with the rest waiting behind them until there is room
export const HowManyStandAtOnce: StoryFn = () => (
    <Example visibleToasts={5}>
        <Button
            onClick={() => {
                for (let index = 1; index <= 6; index += 1) {
                    toast(`Message ${index}`);
                }
            }}
        >
            Show six toasts
        </Button>
    </Example>
);

// How Long They Stand, which a toast can settle for itself
export const HowLongTheyStand: StoryFn = () => (
    <Example duration={2000}>
        <Button onClick={() => toast("Gone in two seconds")}>The Toaster's own time</Button>
        <Button onClick={() => toast("Gone in ten seconds", { duration: 10000 })}>
            A time of its own
        </Button>
        <Button
            onClick={() =>
                toast("Here until it is dismissed", { duration: Infinity, closeButton: true })
            }
        >
            No time at all
        </Button>
    </Example>
);

// A Toast That Stands For A Promise, which waits while it runs and says how it went
export const WithAPromise: StoryFn = () => (
    <Example>
        <Button
            onClick={() =>
                toast.promise(
                    wait(2000).then(() => "the draft"),
                    {
                        loading: "Saving",
                        success: (name) => `Saved ${name}`,
                        error: "Could not save the draft",
                    },
                )
            }
        >
            Save the draft
        </Button>
        <Button
            onClick={() =>
                toast.promise(
                    wait(2000).then(() => Promise.reject(new Error("nope"))),
                    {
                        loading: "Saving",
                        success: "Saved the draft",
                        error: "Could not save the draft",
                    },
                )
            }
        >
            Save and give out
        </Button>
    </Example>
);

// Changing A Toast Where It Stands, by putting it up again under the id it already has
export const ChangingAToast: StoryFn = () => (
    <Example>
        <Button
            onClick={() => {
                toast.loading("Uploading", { id: "upload" });
                window.setTimeout(
                    () => toast.success("Uploaded", { id: "upload", description: "3 files" }),
                    2000,
                );
            }}
        >
            Upload
        </Button>
        <Button onClick={() => toast.dismiss()}>Dismiss them all</Button>
    </Example>
);

// An Icon Of The Caller's Own, in place of the one the variant carries
export const WithAnIcon: StoryFn = () => (
    <Example>
        <Button onClick={() => toast("A new theme is ready", { icon: <SparkleRegular /> })}>
            Show a toast
        </Button>
        <Button onClick={() => toast.success("Your changes have been saved", { icon: null })}>
            Without any icon
        </Button>
    </Example>
);

// A Toast The Caller Lays Out Themselves, in place of everything the toast would lay out
export const CustomToast: StoryFn = () => (
    <Example>
        <Button
            onClick={() =>
                toast.custom((item) => (
                    <div className={classes.custom}>
                        <SparkleRegular />
                        <Text>A toast laid out from end to end by hand</Text>
                        <Button size="small" onClick={() => toast.dismiss(item.id)}>
                            Close
                        </Button>
                    </div>
                ))
            }
        >
            Show a toast
        </Button>
    </Example>
);
