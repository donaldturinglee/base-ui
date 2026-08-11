import * as React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { FormControl } from "../form-control";
import { Clipboard } from ".";
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
        <Clipboard.Input aria-label="Repository URL" />
        <Clipboard.Trigger />
    </Clipboard>
);

const root = () => document.querySelector('[data-component="Clipboard"]') as HTMLElement;

const field = () => screen.getByLabelText("Repository URL") as HTMLInputElement;

const trigger = () => screen.getByRole("button", { name: "Copy" });

const indicator = () => document.querySelector('[data-component="Clipboard.Indicator"]');

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
        render(clipboard());

        for (const name of [
            "Clipboard",
            "Clipboard.Input",
            "Clipboard.Trigger",
            "Clipboard.Indicator",
            "Clipboard.Announcement",
        ]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("starts with nothing copied", () => {
        render(clipboard());

        expect(root()).toHaveAttribute("data-copied", "false");
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

        it("reports the text that reached the clipboard", async () => {
            const onCopy = vi.fn();
            render(clipboard({ onCopy }));

            await press();

            expect(onCopy).toHaveBeenCalledWith(VALUE);
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
            const onCopy = vi.fn();
            render(clipboard({ onCopy }));

            await press();

            expect(execCommand).toHaveBeenCalledWith("copy");
            expect(onCopy).toHaveBeenCalledWith(VALUE);
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

            const onCopy = vi.fn();
            const onCopyError = vi.fn();
            render(clipboard({ onCopy, onCopyError }));

            await press();

            expect(onCopy).not.toHaveBeenCalled();
            await waitFor(() => expect(onCopyError).toHaveBeenCalled());
        });
    });

    describe("disabled", () => {
        it("stops the trigger being used", async () => {
            const onCopy = vi.fn();
            render(clipboard({ disabled: true, onCopy }));

            expect(trigger()).toBeDisabled();
            expect(root()).toHaveAttribute("data-disabled", "true");

            await press();

            expect(writeText).not.toHaveBeenCalled();
            expect(onCopy).not.toHaveBeenCalled();
        });

        it("leaves the value showing, so it can still be read", () => {
            render(clipboard({ disabled: true }));
            expect(field()).toHaveValue(VALUE);
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

        it("swaps the sheets for a tick and back again", async () => {
            render(clipboard({ timeout: 0 }));

            const before = indicator()?.getAttribute("data-copied");
            await press();

            expect(before).toBe("false");
            expect(indicator()).toHaveAttribute("data-copied", "true");
            expect(indicator()).toHaveClass("clipboard-indicator-copied");
        });

        it("keeps the indicator out of the way of a screen reader", () => {
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
                        <Clipboard.Input />
                        <Clipboard.Trigger />
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
                <Clipboard.Input className="field" aria-label="Repository URL" />
                <Clipboard.Trigger className="action" />
            </Clipboard>,
        );

        expect(root()).toHaveClass("root");
        expect(document.querySelector('[data-component="TextInput"]')).toHaveClass("field");
        expect(trigger()).toHaveClass("action");
    });
});
