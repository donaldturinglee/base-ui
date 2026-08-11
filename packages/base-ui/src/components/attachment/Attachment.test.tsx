import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Attachment } from ".";

const TestIcon = () => <svg data-testid="test-icon" aria-hidden="true" />;

const attachment = () => document.querySelector('[data-component="Attachment"]') as HTMLElement;

const part = (name: string) =>
    document.querySelector(`[data-component="Attachment.${name}"]`) as HTMLElement | null;

const withContent = (props: React.ComponentProps<typeof Attachment> = {}) => (
    <Attachment {...props}>
        <Attachment.Media>
            <TestIcon />
        </Attachment.Media>
        <Attachment.Content>
            <Attachment.Title>report.pdf</Attachment.Title>
            <Attachment.Description>1.2 MB</Attachment.Description>
        </Attachment.Content>
    </Attachment>
);

describe("Attachment", () => {
    it("renders a div by default", () => {
        render(withContent());
        expect(attachment().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(withContent({ as: "li" }));
        expect(attachment().tagName).toBe("LI");
    });

    it("does not forward the as prop to the element", () => {
        render(withContent({ as: "li" }));
        expect(attachment()).not.toHaveAttribute("as");
    });

    it("tags every part it is given with a data-component attribute", () => {
        render(withContent());

        expect(attachment()).not.toBeNull();
        expect(part("Media")).not.toBeNull();
        expect(part("Content")).not.toBeNull();
        expect(part("Title")).not.toBeNull();
        expect(part("Description")).not.toBeNull();
    });

    it("renders what it is given to say about the file", () => {
        render(withContent());

        expect(screen.getByText("report.pdf")).toBeInTheDocument();
        expect(screen.getByText("1.2 MB")).toBeInTheDocument();
        expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    describe("the state", () => {
        it("reads as done by default", () => {
            render(withContent());

            expect(attachment()).toHaveAttribute("data-state", "done");
            expect(attachment()).not.toHaveClass("attachment-state-idle");
            expect(attachment()).not.toHaveClass("attachment-state-error");
        });

        it("is carried on the root as the state it is given", () => {
            render(withContent({ state: "uploading" }));
            expect(attachment()).toHaveAttribute("data-state", "uploading");
        });

        it("is drawn as an outline while it is waiting for a file", () => {
            render(withContent({ state: "idle" }));

            expect(attachment()).toHaveAttribute("data-state", "idle");
            expect(attachment()).toHaveClass("attachment-state-idle");
        });

        it("is drawn as an error once something has gone wrong", () => {
            render(withContent({ state: "error" }));

            expect(attachment()).toHaveAttribute("data-state", "error");
            expect(attachment()).toHaveClass("attachment-state-error");
        });
    });

    describe("the size", () => {
        it("falls back to the medium size", () => {
            render(withContent());

            expect(attachment()).toHaveAttribute("data-size", "medium");
            expect(attachment()).toHaveClass("attachment-size-medium");
        });

        it("is drawn at the size it is given", () => {
            render(withContent({ size: "small" }));

            expect(attachment()).toHaveAttribute("data-size", "small");
            expect(attachment()).toHaveClass("attachment-size-small");
        });

        it("is drawn at the largest size once it is asked for", () => {
            render(withContent({ size: "large" }));

            expect(attachment()).toHaveAttribute("data-size", "large");
            expect(attachment()).toHaveClass("attachment-size-large");
        });
    });

    describe("the orientation", () => {
        it("is laid out as a row by default", () => {
            render(withContent());

            expect(attachment()).toHaveAttribute("data-orientation", "horizontal");
            expect(attachment()).toHaveClass("attachment-horizontal");
        });

        it("is laid out as a column once it is asked to be", () => {
            render(withContent({ orientation: "vertical" }));

            expect(attachment()).toHaveAttribute("data-orientation", "vertical");
            expect(attachment()).toHaveClass("attachment-vertical");
        });
    });

    describe("the media", () => {
        it("stands for a kind of file by default", () => {
            render(withContent());

            expect(part("Media")).toHaveAttribute("data-variant", "icon");
            expect(part("Media")).not.toHaveClass("attachment-media-image");
        });

        it("stands for the file itself once it is given a thumbnail", () => {
            render(
                <Attachment>
                    <Attachment.Media variant="image">
                        <img src="/octocat.png" alt="" />
                    </Attachment.Media>
                </Attachment>,
            );

            expect(part("Media")).toHaveAttribute("data-variant", "image");
            expect(part("Media")).toHaveClass("attachment-media-image");
        });
    });

    describe("the actions", () => {
        it("renders an icon button named for what it does", () => {
            render(
                <Attachment>
                    <Attachment.Actions>
                        <Attachment.Action icon={TestIcon} aria-label="Remove report.pdf" />
                    </Attachment.Actions>
                </Attachment>,
            );

            expect(screen.getByRole("button", { name: "Remove report.pdf" })).toBeInTheDocument();
            expect(part("Actions")).not.toBeNull();
        });

        it("is drawn without a ground of its own", () => {
            render(
                <Attachment>
                    <Attachment.Actions>
                        <Attachment.Action icon={TestIcon} aria-label="Remove" />
                    </Attachment.Actions>
                </Attachment>,
            );

            const action = screen.getByRole("button", { name: "Remove" });
            expect(action).toHaveAttribute("data-variant", "invisible");
            expect(action).toHaveAttribute("data-size", "small");
        });

        it("takes the variant and size it is given", () => {
            render(
                <Attachment>
                    <Attachment.Actions>
                        <Attachment.Action
                            icon={TestIcon}
                            aria-label="Remove"
                            variant="danger"
                            size="medium"
                        />
                    </Attachment.Actions>
                </Attachment>,
            );

            const action = screen.getByRole("button", { name: "Remove" });
            expect(action).toHaveAttribute("data-variant", "danger");
            expect(action).toHaveAttribute("data-size", "medium");
        });

        it("calls the handler it is given when it is pressed", () => {
            const onClick = jest.fn();
            render(
                <Attachment>
                    <Attachment.Actions>
                        <Attachment.Action icon={TestIcon} aria-label="Remove" onClick={onClick} />
                    </Attachment.Actions>
                </Attachment>,
            );

            screen.getByRole("button", { name: "Remove" }).click();
            expect(onClick).toHaveBeenCalledTimes(1);
        });
    });

    describe("the trigger", () => {
        it("renders a button that does not submit a form it stands in", () => {
            render(
                <Attachment>
                    <Attachment.Trigger>Open report.pdf</Attachment.Trigger>
                </Attachment>,
            );

            const trigger = screen.getByRole("button", { name: "Open report.pdf" });
            expect(trigger).toHaveAttribute("type", "button");
        });

        it("takes the type it is given", () => {
            render(
                <Attachment>
                    <Attachment.Trigger type="submit">Open</Attachment.Trigger>
                </Attachment>,
            );
            expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("type", "submit");
        });

        it("leaves the type off whatever else it is drawn as", () => {
            render(
                <Attachment>
                    <Attachment.Trigger as="a" href="/report.pdf">
                        Open report.pdf
                    </Attachment.Trigger>
                </Attachment>,
            );

            const trigger = screen.getByRole("link", { name: "Open report.pdf" });
            expect(trigger).not.toHaveAttribute("type");
            expect(trigger).toHaveAttribute("href", "/report.pdf");
        });

        it("calls the handler it is given when it is pressed", () => {
            const onClick = jest.fn();
            render(
                <Attachment>
                    <Attachment.Trigger onClick={onClick}>Open</Attachment.Trigger>
                </Attachment>,
            );

            screen.getByRole("button", { name: "Open" }).click();
            expect(onClick).toHaveBeenCalledTimes(1);
        });
    });

    describe("a group of attachments", () => {
        it("renders whatever it is given to hold", () => {
            render(
                <Attachment.Group aria-label="Attachments">
                    <Attachment>
                        <Attachment.Content>
                            <Attachment.Title>one.pdf</Attachment.Title>
                        </Attachment.Content>
                    </Attachment>
                    <Attachment>
                        <Attachment.Content>
                            <Attachment.Title>two.pdf</Attachment.Title>
                        </Attachment.Content>
                    </Attachment>
                </Attachment.Group>,
            );

            expect(part("Group")).not.toBeNull();
            expect(document.querySelectorAll('[data-component="Attachment"]')).toHaveLength(2);
        });

        it("passes the rest of its props through", () => {
            render(<Attachment.Group data-testid="run">Run</Attachment.Group>);
            expect(screen.getByTestId("run")).toBe(part("Group"));
        });
    });

    describe("refs and class names", () => {
        it("forwards a ref to the attachment element", () => {
            const ref = React.createRef<HTMLElement>();
            render(withContent({ ref }));
            expect(ref.current).toBe(attachment());
        });

        it("forwards a ref to each of its parts", () => {
            const media = React.createRef<HTMLElement>();
            const content = React.createRef<HTMLElement>();
            const title = React.createRef<HTMLElement>();
            const description = React.createRef<HTMLElement>();

            render(
                <Attachment>
                    <Attachment.Media ref={media}>
                        <TestIcon />
                    </Attachment.Media>
                    <Attachment.Content ref={content}>
                        <Attachment.Title ref={title}>report.pdf</Attachment.Title>
                        <Attachment.Description ref={description}>1.2 MB</Attachment.Description>
                    </Attachment.Content>
                </Attachment>,
            );

            expect(media.current).toBe(part("Media"));
            expect(content.current).toBe(part("Content"));
            expect(title.current).toBe(part("Title"));
            expect(description.current).toBe(part("Description"));
        });

        it("merges a custom className onto the attachment element", () => {
            render(withContent({ className: "custom" }));
            expect(attachment()).toHaveClass("custom");
        });

        it("merges a custom className onto each of its parts", () => {
            render(
                <Attachment>
                    <Attachment.Media className="custom-media">
                        <TestIcon />
                    </Attachment.Media>
                    <Attachment.Content className="custom-content">
                        <Attachment.Title className="custom-title">report.pdf</Attachment.Title>
                    </Attachment.Content>
                </Attachment>,
            );

            expect(part("Media")).toHaveClass("custom-media");
            expect(part("Content")).toHaveClass("custom-content");
            expect(part("Title")).toHaveClass("custom-title");
        });

        it("passes the rest of its props through", () => {
            render(withContent({ "data-testid": "file" }));
            expect(screen.getByTestId("file")).toBe(attachment());
        });
    });
});
