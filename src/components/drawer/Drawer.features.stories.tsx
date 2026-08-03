import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Stack } from "../stack";
import { Text } from "../text";
import { Textarea } from "../textarea";
import { Drawer } from ".";
import type { DrawerNamedSize, DrawerPosition } from "./Drawer.types";

const classes = {
    custom: "bg-background-accent-muted",
    row: "flex flex-wrap gap-[var(--base-size-8)]",
};

const body = (
    <Text as="p">
        A drawer comes in from an edge of the screen and stays anchored to it, for work that runs
        alongside the page rather than in place of it: a set of filters, the details of the row that
        was picked, a form that is filled in without leaving what it belongs to.
    </Text>
);

const longBody = (
    <Stack gap="normal">
        {Array.from({ length: 8 }, (_, index) => (
            <Text as="p" key={index}>
                A drawer comes in from an edge of the screen and stays anchored to it, for work that
                runs alongside the page rather than in place of it: a set of filters, the details of
                the row that was picked, a form that is filled in without leaving what it belongs
                to.
            </Text>
        ))}
    </Stack>
);

const positions: DrawerPosition[] = ["left", "right", "top", "bottom"];

const sizes: DrawerNamedSize[] = ["small", "medium", "large", "xlarge"];

export default {
    title: "Components/Drawer/Features",
    parameters: {
        layout: "centered",
    },
};

// A drawer opened from a button, which takes focus back when it closes
const Example = ({
    label = "Show drawer",
    render,
}: {
    label?: string;
    render: (close: () => void) => React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>{label}</Button>
            {isOpen ? render(() => setIsOpen(false)) : null}
        </>
    );
};

// Which Edge It Settles Against, and the edge it arrives from
export const Positions: StoryFn = () => (
    <div className={classes.row}>
        {positions.map((position) => (
            <Example
                key={position}
                label={position}
                render={(close) => (
                    <Drawer title={`From the ${position}`} position={position} onClose={close}>
                        {body}
                    </Drawer>
                )}
            />
        ))}
    </div>
);

// Sizes, which say how far the drawer comes in from the edge it settles against
export const Sizes: StoryFn = () => (
    <div className={classes.row}>
        {sizes.map((size) => (
            <Example
                key={size}
                label={size}
                render={(close) => (
                    <Drawer title="Filters" size={size} onClose={close}>
                        {body}
                    </Drawer>
                )}
            />
        ))}
    </div>
);

// A Size Of Its Own, for a drawer that no step of the scale fits
export const CustomSize: StoryFn = () => (
    <Example
        render={(close) => (
            <Drawer title="Filters" size="22rem" onClose={close}>
                {body}
            </Drawer>
        )}
    />
);

// Modeless, which leaves the page behind it to be read, scrolled and used while the drawer
// stands open beside it
export const Modeless: StoryFn = () => (
    <Example
        render={(close) => (
            <Drawer
                title="Activity"
                subtitle="Everything that has happened today"
                modal={false}
                onClose={close}
            >
                {body}
            </Drawer>
        )}
    />
);

// With A Footer, which stays put below the body rather than scrolling away with it
export const WithAFooter: StoryFn = () => (
    <Example
        render={(close) => (
            <Drawer title="Filters" subtitle="Narrow down what is listed" onClose={close}>
                {body}
                <Drawer.Footer>
                    <Button onClick={close}>Cancel</Button>
                    <Button variant="primary" onClick={close}>
                        Apply
                    </Button>
                </Drawer.Footer>
            </Drawer>
        )}
    />
);

// More Than It Can Show, where the body scrolls under a header and above a footer that both
// stay where they are
export const Scrolling: StoryFn = () => (
    <Example
        render={(close) => (
            <Drawer title="Release notes" size="small" onClose={close}>
                {longBody}
                <Drawer.Footer>
                    <Button variant="primary" onClick={close}>
                        Done
                    </Button>
                </Drawer.Footer>
            </Drawer>
        )}
    />
);

// A Header Of The Caller's Own, built from the drawer's own parts so that it still names the
// drawer and still knows how to close it
export const CustomHeader: StoryFn = () => (
    <Example
        render={(close) => (
            <Drawer onClose={close}>
                <Drawer.Header className={classes.custom}>
                    <Drawer.Title>Filters</Drawer.Title>
                    <Drawer.CloseButton />
                </Drawer.Header>
                <Drawer.Body>{body}</Drawer.Body>
            </Drawer>
        )}
    />
);

// A Body Of The Caller's Own, in place of the padding the drawer would give it
export const CustomBody: StoryFn = () => (
    <Example
        render={(close) => (
            <Drawer title="Filters" onClose={close}>
                <Drawer.Body className={classes.custom}>{body}</Drawer.Body>
            </Drawer>
        )}
    />
);

// Opening On Something In Particular, rather than on the first thing inside that can take
// focus
export const InitialFocus: StoryFn = () => {
    const noteRef = React.useRef<HTMLTextAreaElement>(null);

    return (
        <Example
            render={(close) => (
                <Drawer title="Add a note" initialFocusRef={noteRef} onClose={close}>
                    <Textarea ref={noteRef} aria-label="Note" block />
                    <Drawer.Footer>
                        <Button variant="primary" onClick={close}>
                            Save
                        </Button>
                    </Drawer.Footer>
                </Drawer>
            )}
        />
    );
};

// Handing Focus Somewhere Else, rather than back to whatever opened the drawer
export const ReturnFocus: StoryFn = () => {
    const returnRef = React.useRef<HTMLButtonElement>(null);

    return (
        <div className={classes.row}>
            <Example
                render={(close) => (
                    <Drawer title="Filters" returnFocusRef={returnRef} onClose={close}>
                        {body}
                    </Drawer>
                )}
            />
            <Button ref={returnRef}>Takes focus when the drawer closes</Button>
        </div>
    );
};
