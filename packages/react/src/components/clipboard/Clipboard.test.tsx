import * as React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Button } from "../button";
import { FormControl } from "../form-control";
import { Clipboard, useClipboard } from ".";
import type { ClipboardProps } from "./Clipboard.types";

const VALUE = "https://example.com/base-ui.git";

const writeText = vi.fn<(value: string) => Promise<void>>();

const execCommand = vi.fn<(commandId: string) => boolean>();

// jsdom carries neither the asynchronous clipboard nor the command the older way of copying runs,
// so both are laid down here and each test says which of them the page is allowed
const setClipboard = (value: { writeText: typeof writeText } | undefined) => {
    Object.defineProperty(navigator, "clipboard", {
        value,
        configurable: true,
        writable: true,
    });
};

const clipboard = (props: Partial<ClipboardProps> = {}) => (
    <Clipboard value={VALUE} {...props}>
        <Clipboard.Label>Repository URL</Clipboard.Label>
        <Clipboard.Control>
            <Clipboard.Input />
            <Clipboard.Trigger />
        </Clipboard.Control>
    </Clipboard>
);

const root = () => document.querySelector('[data-component="Clipboard"]') as HTMLElement;

const control = () => document.querySelector('[data-component="Clipboard.Control"]');

const label = () => document.querySelector('[data-component="Clipboard.Label"]');

const field = () => screen.getByLabelText("Repository URL") as HTMLInputElement;

const trigger = () => screen.getByRole("button", { name: "Copy" });

const indicator = () => document.querySelector('[data-component="Clipboard.Indicator"]');

const valueText = () => document.querySelector('[data-component="Clipboard.ValueText"]');

const copyText = () => document.querySelector('[data-component="Clipboard.CopyText"]');

const announcement = () => document.querySelector('[data-component="Clipboard.Announcement"]');

// The write is a promise, so the press is flushed before anything is asked about what it did
const press = async (button: HTMLElement = trigger()) => {
    await act(async () => {
        fireEvent.click(button);
    });
};

beforeEach(() => {
    writeText.mockReset();
    writeText.mockResolvedValue(undefined);
    execCommand.mockReset();
    execCommand.mockReturnValue(true);

    setClipboard({ writeText });
    Object.defineProperty(document, "execCommand", {
        value: execCommand,
        configurable: true,
        writable: true,
    });
});

describe("Clipboard", () => {
    it("renders a plain box by default", () => {
        render(clipboard());
        expect(root().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(
            <Clipboard as="section" value={VALUE}>
                <Clipboard.Trigger />
            </Clipboard>,
        );
        expect(root().tagName).toBe("SECTION");
    });

    it("tags the clipboard and its parts with data-component attributes", () => {
        render(
            <Clipboard value={VALUE}>
                <Clipboard.Label>Repository URL</Clipboard.Label>
                <Clipboard.Control>
                    <Clipboard.ValueText />
                    <Clipboard.Input />
                    <Clipboard.Trigger>
                        <Clipboard.CopyText />
                    </Clipboard.Trigger>
                </Clipboard.Control>
            </Clipboard>,
        );

        for (const name of [
            "Clipboard",
            "Clipboard.Label",
            "Clipboard.Control",
            "Clipboard.ValueText",
            "Clipboard.Input",
            "Clipboard.Trigger",
            "Clipboard.Indicator",
            "Clipboard.CopyText",
            "Clipboard.Announcement",
        ]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("starts with nothing copied", () => {
        render(clipboard());

        expect(root()).toHaveAttribute("data-copied", "false");
        expect(control()).toHaveAttribute("data-copied", "false");
        expect(indicator()).toHaveAttribute("data-copied", "false");
        expect(announcement()).toBeEmptyDOMElement();
    });

    describe("copying", () => {
        it("puts the value on the clipboard when the trigger is pressed", async () => {
            render(clipboard());

            await press();

            expect(writeText).toHaveBeenCalledWith(VALUE);
        });

        it("says the value has been copied", async () => {
            render(clipboard());

            await press();

            expect(root()).toHaveAttribute("data-copied", "true");
            expect(indicator()).toHaveAttribute("data-copied", "true");
        });

        it("reports that the value was taken", async () => {
            const onStatusChange = vi.fn();
            render(clipboard({ onStatusChange }));

            await press();

            expect(onStatusChange).toHaveBeenCalledWith(true);
        });

        it("goes on offering a copy after the value has been taken", async () => {
            render(clipboard());

            await press();
            await press();

            expect(writeText).toHaveBeenCalledTimes(2);
        });

        it("copies the value it is holding now rather than the one it started with", async () => {
            const { rerender } = render(clipboard());

            rerender(clipboard({ value: "second" }));
            await press();

            expect(writeText).toHaveBeenCalledWith("second");
        });

        it("copies the value it was started with where the caller keeps hold of none", async () => {
            render(
                <Clipboard defaultValue={VALUE}>
                    <Clipboard.Trigger />
                </Clipboard>,
            );

            await press();

            expect(writeText).toHaveBeenCalledWith(VALUE);
        });
    });

    describe("saying so", () => {
        it("tells a reader who cannot see the tick", async () => {
            render(clipboard());

            await press();

            expect(announcement()).toHaveTextContent("Copied to clipboard");
        });

        it("reads out whatever it is told to say", async () => {
            render(clipboard({ copiedAnnouncement: "The URL is yours" }));

            await press();

            expect(announcement()).toHaveTextContent("The URL is yours");
        });

        it("waits its turn, so nothing the reader is doing is cut across", () => {
            render(clipboard());
            expect(announcement()).toHaveAttribute("aria-live", "polite");
        });
    });

    describe("the tick", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("is taken away once it has stood long enough", async () => {
            render(clipboard({ timeout: 1000 }));

            await press();
            expect(root()).toHaveAttribute("data-copied", "true");

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(root()).toHaveAttribute("data-copied", "false");
        });

        it("reports that it has gone again", async () => {
            const onStatusChange = vi.fn();
            render(clipboard({ timeout: 1000, onStatusChange }));

            await press();

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(onStatusChange).toHaveBeenLastCalledWith(false);
        });

        it("starts its wait over where the value is copied again", async () => {
            render(clipboard({ timeout: 1000 }));

            await press();

            act(() => {
                vi.advanceTimersByTime(600);
            });

            await press();

            act(() => {
                vi.advanceTimersByTime(600);
            });

            expect(root()).toHaveAttribute("data-copied", "true");
        });

        it("stands until the value is copied again where it is told to wait for nothing", async () => {
            render(clipboard({ timeout: 0 }));

            await press();

            act(() => {
                vi.advanceTimersByTime(60000);
            });

            expect(root()).toHaveAttribute("data-copied", "true");
        });
    });

    describe("where the clipboard cannot be reached", () => {
        it("falls back to the older way of copying", async () => {
            setClipboard(undefined);
            const onStatusChange = vi.fn();
            render(clipboard({ onStatusChange }));

            await press();

            expect(execCommand).toHaveBeenCalledWith("copy");
            expect(onStatusChange).toHaveBeenCalledWith(true);
        });

        it("tries the older way where the page was refused the newer one", async () => {
            writeText.mockRejectedValue(new Error("Denied"));
            render(clipboard());

            await press();

            expect(execCommand).toHaveBeenCalledWith("copy");
            expect(root()).toHaveAttribute("data-copied", "true");
        });

        it("takes the field it copied through back off the page", async () => {
            setClipboard(undefined);
            render(clipboard());

            await press();

            expect(document.querySelectorAll("textarea")).toHaveLength(0);
        });

        it("reports a refusal neither way could answer", async () => {
            const error = new Error("Denied");
            writeText.mockRejectedValue(error);
            execCommand.mockReturnValue(false);

            const onCopyError = vi.fn();
            render(clipboard({ onCopyError }));

            await press();

            expect(onCopyError).toHaveBeenCalledWith(error);
            expect(root()).toHaveAttribute("data-copied", "false");
        });

        it("leaves the value uncopied where there is no way to copy it at all", async () => {
            setClipboard(undefined);
            execCommand.mockReturnValue(false);

            const onStatusChange = vi.fn();
            const onCopyError = vi.fn();
            render(clipboard({ onStatusChange, onCopyError }));

            await press();

            expect(onStatusChange).not.toHaveBeenCalled();
            await waitFor(() => expect(onCopyError).toHaveBeenCalled());
        });
    });

    describe("disabled", () => {
        it("stops the trigger being used", async () => {
            const onStatusChange = vi.fn();
            render(clipboard({ disabled: true, onStatusChange }));

            expect(trigger()).toBeDisabled();
            expect(root()).toHaveAttribute("data-disabled", "true");

            await press();

            expect(writeText).not.toHaveBeenCalled();
            expect(onStatusChange).not.toHaveBeenCalled();
        });

        it("leaves the value showing, so it can still be read", () => {
            render(clipboard({ disabled: true }));
            expect(field()).toHaveValue(VALUE);
        });

        it("says as much on the name over the row", () => {
            render(clipboard({ disabled: true }));
            expect(label()).toHaveAttribute("data-disabled", "true");
        });
    });

    describe("the trigger", () => {
        it("gives it a type, so it does not send the form it stands in", () => {
            render(clipboard());
            expect(trigger()).toHaveAttribute("type", "button");
        });

        it("is named for what pressing it does, and stays named that once it has", async () => {
            render(clipboard());

            await press();

            expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
        });

        it("takes a name of its own", () => {
            render(
                <Clipboard value={VALUE}>
                    <Clipboard.Trigger label="Copy the clone URL" />
                </Clipboard>,
            );
            expect(screen.getByRole("button", { name: "Copy the clone URL" })).toBeInTheDocument();
        });

        it("is named by its children where it was given any", () => {
            render(
                <Clipboard value={VALUE}>
                    <Clipboard.Trigger>Copy the clone URL</Clipboard.Trigger>
                </Clipboard>,
            );
            expect(screen.getByRole("button", { name: "Copy the clone URL" })).toBeInTheDocument();
        });

        it("carries one indicator, not two, where it was written out with one of its own", () => {
            render(
                <Clipboard value={VALUE}>
                    <Clipboard.Trigger>
                        <Clipboard.Indicator copied={<span>Taken</span>}>
                            <span>Take</span>
                        </Clipboard.Indicator>
                        Copy the clone URL
                    </Clipboard.Trigger>
                </Clipboard>,
            );

            expect(
                document.querySelectorAll('[data-component="Clipboard.Indicator"]'),
            ).toHaveLength(1);
            expect(indicator()).toHaveTextContent("Take");
            expect(screen.getByRole("button", { name: "Copy the clone URL" })).toBeInTheDocument();
        });

        it("still calls a press handler of the caller's own", async () => {
            const onClick = vi.fn();
            render(
                <Clipboard value={VALUE}>
                    <Clipboard.Trigger onClick={onClick} />
                </Clipboard>,
            );

            await press();

            expect(onClick).toHaveBeenCalledTimes(1);
            expect(writeText).toHaveBeenCalledWith(VALUE);
        });

        it("leaves the value alone where the caller has answered the press", async () => {
            render(
                <Clipboard value={VALUE}>
                    <Clipboard.Trigger onClick={(event) => event.preventDefault()} />
                </Clipboard>,
            );

            await press();

            expect(writeText).not.toHaveBeenCalled();
        });
    });

    describe("the indicator", () => {
        it("swaps the sheets for a tick and back again", async () => {
            render(clipboard({ timeout: 0 }));

            const before = indicator()?.getAttribute("data-copied");
            await press();

            expect(before).toBe("false");
            expect(indicator()).toHaveAttribute("data-copied", "true");
            expect(indicator()).toHaveClass("clipboard-indicator-copied");
        });

        it("shows whatever it was given for either state", async () => {
            render(
                <Clipboard value={VALUE} timeout={0}>
                    <Clipboard.Trigger>
                        <Clipboard.Indicator copied={<span>Taken</span>}>
                            <span>Take</span>
                        </Clipboard.Indicator>
                        Copy
                    </Clipboard.Trigger>
                </Clipboard>,
            );

            expect(indicator()).toHaveTextContent("Take");

            await press();

            expect(indicator()).toHaveTextContent("Taken");
        });

        it("keeps out of the way of a screen reader", () => {
            render(clipboard());
            expect(indicator()).toHaveAttribute("aria-hidden", "true");
        });
    });

    describe("the field", () => {
        it("shows the value the clipboard is holding", () => {
            render(clipboard());
            expect(field()).toHaveValue(VALUE);
        });

        it("holds the value back from being changed without shutting it away", () => {
            render(clipboard());

            expect(field()).toHaveAttribute("readonly");
            expect(field()).not.toBeDisabled();
        });

        it("selects the whole value as it is arrived at", () => {
            render(clipboard());

            fireEvent.focus(field());

            expect(field().selectionStart).toBe(0);
            expect(field().selectionEnd).toBe(VALUE.length);
        });

        it("leaves the selection alone where the caller has answered the arrival", () => {
            render(
                <Clipboard value={VALUE}>
                    <Clipboard.Input
                        aria-label="Repository URL"
                        onFocus={(event) => event.preventDefault()}
                    />
                </Clipboard>,
            );

            fireEvent.focus(field());

            expect(field().selectionStart).toBe(field().selectionEnd);
        });

        it("is wired into the field it stands in", () => {
            render(
                <FormControl id="repository">
                    <FormControl.Label>Repository URL</FormControl.Label>
                    <Clipboard value={VALUE}>
                        <Clipboard.Control>
                            <Clipboard.Input />
                            <Clipboard.Trigger />
                        </Clipboard.Control>
                    </Clipboard>
                    <FormControl.Caption>Clone over HTTPS</FormControl.Caption>
                </FormControl>,
            );

            expect(field()).toHaveAttribute("id", "repository");
            expect(field()).toHaveAttribute(
                "aria-describedby",
                expect.stringContaining("repository-caption") as unknown as string,
            );
        });

        it("is never marked as one that has to be filled", () => {
            render(
                <FormControl id="repository" required>
                    {/* A required field marks its name with an asterisk, so the input is
                        reached for by the id the field gave it rather than by that name */}
                    <FormControl.Label>Repository URL</FormControl.Label>
                    <Clipboard value={VALUE}>
                        <Clipboard.Input />
                    </Clipboard>
                </FormControl>,
            );

            expect(document.getElementById("repository")).not.toBeRequired();
        });
    });

    describe("the name over the row", () => {
        it("points at the field showing the value", () => {
            render(clipboard());
            expect(label()).toHaveAttribute("for", field().getAttribute("id"));
        });

        it("follows a field that was given an id of its own", () => {
            render(
                <Clipboard value={VALUE}>
                    <Clipboard.Label>Repository URL</Clipboard.Label>
                    <Clipboard.Control>
                        <Clipboard.Input id="clone-url" />
                    </Clipboard.Control>
                </Clipboard>,
            );

            expect(label()).toHaveAttribute("for", "clone-url");
        });

        it("points at nothing where there is no field to point at", () => {
            render(
                <Clipboard value={VALUE}>
                    <Clipboard.Label>Repository URL</Clipboard.Label>
                    <Clipboard.Control>
                        <Clipboard.ValueText />
                        <Clipboard.Trigger />
                    </Clipboard.Control>
                </Clipboard>,
            );

            expect(label()).not.toHaveAttribute("for");
        });

        it("names whatever stands around it where it is not a label at all", () => {
            render(
                <Clipboard value={VALUE}>
                    <Clipboard.Label as="span">Repository URL</Clipboard.Label>
                    <Clipboard.Control>
                        <Clipboard.Input aria-label="Repository URL" />
                    </Clipboard.Control>
                </Clipboard>,
            );

            expect(label()?.tagName).toBe("SPAN");
            expect(label()).not.toHaveAttribute("for");
        });
    });

    describe("the value as text", () => {
        it("shows the value the clipboard is holding", () => {
            render(
                <Clipboard value={VALUE}>
                    <Clipboard.Control>
                        <Clipboard.ValueText />
                    </Clipboard.Control>
                </Clipboard>,
            );

            expect(valueText()).toHaveTextContent(VALUE);
        });

        it("shows whatever it was given instead, and copies the value all the same", async () => {
            render(
                <Clipboard value={VALUE}>
                    <Clipboard.Control>
                        <Clipboard.ValueText>example.com</Clipboard.ValueText>
                        <Clipboard.Trigger />
                    </Clipboard.Control>
                </Clipboard>,
            );

            expect(valueText()).toHaveTextContent("example.com");

            await press();

            expect(writeText).toHaveBeenCalledWith(VALUE);
        });
    });

    describe("the words on the trigger", () => {
        const withCopyText = (props: Partial<ClipboardProps> = {}) => (
            <Clipboard value={VALUE} {...props}>
                <Clipboard.Trigger>
                    <Clipboard.Indicator />
                    <Clipboard.CopyText />
                </Clipboard.Trigger>
            </Clipboard>
        );

        it("says what pressing the trigger does, and what it did", async () => {
            render(withCopyText({ timeout: 0 }));

            expect(copyText()).toHaveTextContent("Copy");

            await press(screen.getByRole("button", { name: "Copy" }));

            expect(copyText()).toHaveTextContent("Copied");
        });

        it("says whatever it was told to say for either state", async () => {
            render(
                <Clipboard value={VALUE} timeout={0}>
                    <Clipboard.Trigger>
                        <Clipboard.CopyText copied="Taken">Take</Clipboard.CopyText>
                    </Clipboard.Trigger>
                </Clipboard>,
            );

            expect(copyText()).toHaveTextContent("Take");

            await press(screen.getByRole("button", { name: "Take" }));

            expect(copyText()).toHaveTextContent("Taken");
        });

        it("names the trigger, so the name follows what has just happened", async () => {
            render(withCopyText({ timeout: 0 }));

            await press(screen.getByRole("button", { name: "Copy" }));

            expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
        });

        it("names a trigger drawn as an icon without being read on the page", () => {
            render(
                <Clipboard value={VALUE}>
                    <Clipboard.Trigger>
                        <Clipboard.CopyText visuallyHidden />
                    </Clipboard.Trigger>
                </Clipboard>,
            );

            expect(copyText()).toHaveClass("sr-only");
            expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
        });

        it("is left out of the row where the clipboard reports the copy itself", () => {
            render(withCopyText());
            expect(announcement()).not.toBeNull();
        });
    });

    describe("the announcement", () => {
        it("is left off where something else on the row says as much", async () => {
            render(
                <Clipboard value={VALUE} copiedAnnouncement={null}>
                    <Clipboard.Trigger>
                        <Clipboard.CopyText />
                    </Clipboard.Trigger>
                </Clipboard>,
            );

            expect(announcement()).toBeNull();

            await press(screen.getByRole("button", { name: "Copy" }));

            expect(copyText()).toHaveTextContent("Copied");
        });
    });

    describe("useClipboard", () => {
        // The hook standing on its own, which is what a copy control built by hand is working
        // from rather than the parts
        const Store = ({ value = VALUE, timeout }: { value?: string; timeout?: number }) => {
            const clipboard = useClipboard({ value, timeout });

            return <Button onClick={clipboard.copy}>{clipboard.copied ? "Copied" : "Copy"}</Button>;
        };

        it("puts the value on the clipboard", async () => {
            render(<Store />);

            await press(screen.getByRole("button", { name: "Copy" }));

            expect(writeText).toHaveBeenCalledWith(VALUE);
        });

        it("says the value has been copied", async () => {
            render(<Store timeout={0} />);

            await press(screen.getByRole("button", { name: "Copy" }));

            expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
        });

        it("holds a value of its own where it was given none to follow", async () => {
            const Uncontrolled = () => {
                const clipboard = useClipboard({ defaultValue: "first" });

                return (
                    <>
                        <Button onClick={clipboard.copy}>Copy</Button>
                        <Button onClick={() => clipboard.setValue("second")}>Change</Button>
                    </>
                );
            };

            render(<Uncontrolled />);

            fireEvent.click(screen.getByRole("button", { name: "Change" }));
            await press(screen.getByRole("button", { name: "Copy" }));

            expect(writeText).toHaveBeenCalledWith("second");
        });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Clipboard ref={ref} value={VALUE}>
                <Clipboard.Trigger />
            </Clipboard>,
        );
        expect(ref.current).toBe(root());
    });

    it("forwards a ref to the trigger", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Clipboard value={VALUE}>
                <Clipboard.Trigger ref={ref} />
            </Clipboard>,
        );
        expect(ref.current).toBe(trigger());
    });

    it("forwards a ref to the field", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(
            <Clipboard value={VALUE}>
                <Clipboard.Input ref={ref} aria-label="Repository URL" />
            </Clipboard>,
        );
        expect(ref.current).toBe(field());
    });

    it("merges a custom className onto each part", () => {
        render(
            <Clipboard className="root" value={VALUE}>
                <Clipboard.Label className="name">Repository URL</Clipboard.Label>
                <Clipboard.Control className="row">
                    <Clipboard.Input className="field" />
                    <Clipboard.Trigger className="action" />
                </Clipboard.Control>
            </Clipboard>,
        );

        expect(root()).toHaveClass("root");
        expect(label()).toHaveClass("name");
        expect(control()).toHaveClass("row");
        expect(document.querySelector('[data-component="TextInput"]')).toHaveClass("field");
        expect(trigger()).toHaveClass("action");
    });
});
