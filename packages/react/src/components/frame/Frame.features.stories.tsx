import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Frame } from ".";

const classes = {
    frame: "[border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default",
};

// A frame carries none of the page's styles, so anything drawn inside one is written out with
// styles of its own rather than with the classes the rest of a story would reach for
const inlineStyles = {
    body: { font: "14px system-ui, sans-serif", padding: "16px" },
    stack: { display: "flex", flexDirection: "column", gap: "8px" } as React.CSSProperties,
};

export default {
    title: "Components/Frame/Features",
};

// With Head, where the frame is handed the styles whatever it holds is to be read under
export const WithHead: StoryFn<typeof Frame> = () => (
    <Frame
        title="A frame with styles of its own"
        className={classes.frame}
        width={400}
        height={160}
        head={
            <style>
                {`body { font: 14px system-ui, sans-serif; padding: 16px; }
                  p { color: rebeccapurple; }`}
            </style>
        }
    >
        <p>Read under the styles the frame was handed rather than the page&apos;s.</p>
    </Frame>
);

// Style Isolation, where a rule on the page reaches everything but what stands inside the frame
export const StyleIsolation: StoryFn<typeof Frame> = () => (
    <Stack gap="normal">
        <style>{`.tinted-by-the-page { color: crimson; font-weight: 600; }`}</style>
        <Text className="tinted-by-the-page">
            Outside the frame, the page&apos;s rule reaches me
        </Text>
        <Frame title="Out of the page's reach" className={classes.frame} width={400} height={100}>
            <div className="tinted-by-the-page" style={inlineStyles.body}>
                Inside the frame, the same class says nothing
            </div>
        </Frame>
    </Stack>
);

// Fit To Content, where the frame measures what it holds and is sized from the readings
export const FitToContent: StoryFn<typeof Frame> = () => {
    const [lines, setLines] = React.useState(2);

    return (
        <Stack gap="normal">
            <button type="button" onClick={() => setLines((count) => (count % 5) + 1)}>
                Add a line
            </button>
            <Frame
                title="Sized by what it holds"
                className={classes.frame}
                width={400}
                // The reading the frame took of its own document, which it puts on the element as
                // it measures it. Only the height is taken from it: a block fills whatever width
                // it is given, so a frame sized by the width it measured would chase itself
                style={{ height: "var(--frame-content-height)" }}
            >
                <div style={{ ...inlineStyles.body, ...inlineStyles.stack }}>
                    {Array.from({ length: lines }, (_, index) => (
                        <span key={index}>Line {index + 1} inside the frame</span>
                    ))}
                </div>
            </Frame>
        </Stack>
    );
};

// With A Document Of Its Own, where the caller writes the whole document rather than taking the
// one the frame would have written
export const WithADocumentOfItsOwn: StoryFn<typeof Frame> = () => (
    <Frame
        title="A document of the caller's"
        className={classes.frame}
        width={400}
        height={140}
        srcDoc={
            "<!doctype html><html><head><style>" +
            "body{margin:0;font:14px system-ui,sans-serif;background:#101828;color:#e6edf3}" +
            ".frame-root{padding:16px}" +
            "</style></head><body><div class='frame-root'></div></body></html>"
        }
    >
        <p>Drawn into a document the caller wrote, root and all.</p>
    </Frame>
);

// On Mount, which says when the children reached the frame's document and when they left it
export const OnMount: StoryFn<typeof Frame> = () => {
    const [showing, setShowing] = React.useState(true);
    const [events, setEvents] = React.useState<string[]>([]);

    const record = (event: string) => setEvents((seen) => [...seen, event]);

    return (
        <Stack gap="normal">
            <button type="button" onClick={() => setShowing((open) => !open)}>
                {showing ? "Take the frame away" : "Put the frame back"}
            </button>
            {showing ? (
                <Frame
                    title="A frame that says when it was drawn"
                    className={classes.frame}
                    width={400}
                    height={100}
                    onMount={() => record("mounted")}
                    onUnmount={() => record("unmounted")}
                >
                    <div style={inlineStyles.body}>Watch the log below</div>
                </Frame>
            ) : null}
            <Text>{events.length ? events.join(", ") : "Nothing yet"}</Text>
        </Stack>
    );
};
