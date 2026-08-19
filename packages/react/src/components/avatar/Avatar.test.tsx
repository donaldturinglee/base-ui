import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Avatar } from ".";

const part = (name: string) =>
    document.querySelector(`[data-component='Avatar.${name}']`) as HTMLElement;

describe("Avatar", () => {
    const composed = (
        <Avatar data-testid="avatar">
            <Avatar.Image src="primer.png" alt="mona" />
            <Avatar.Fallback name="Mona Octocat" />
        </Avatar>
    );

    it("renders a span element by default", () => {
        render(composed);
        expect(screen.getByTestId("avatar").tagName).toBe("SPAN");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <Avatar as="div" data-testid="avatar">
                <Avatar.Fallback name="Mona Octocat" />
            </Avatar>,
        );
        expect(screen.getByTestId("avatar").tagName).toBe("DIV");
    });

    it("is the ground the parts are laid on", () => {
        render(composed);

        expect(screen.getByTestId("avatar")).toHaveClass("avatar", "avatar-circle");
        expect(part("Image")).toBeInTheDocument();
        expect(part("Fallback")).toBeInTheDocument();
    });

    // The picture within is what carries them, so the ground it sits on does not repeat them
    it("leaves the image attributes to the picture inside it", () => {
        render(composed);
        const avatar = screen.getByTestId("avatar");

        expect(avatar).not.toHaveAttribute("src");
        expect(avatar).not.toHaveAttribute("alt");
        expect(avatar).not.toHaveAttribute("width");
        expect(avatar).not.toHaveAttribute("height");
    });

    it("renders a small avatar by default", () => {
        render(composed);
        expect(screen.getByTestId("avatar")).toHaveStyle({ "--avatar-size-regular": "20px" });
    });

    it("respects the size prop", () => {
        render(
            <Avatar size={40} data-testid="avatar">
                <Avatar.Image src="primer.png" alt="mona" />
            </Avatar>,
        );
        expect(screen.getByTestId("avatar")).toHaveStyle({ "--avatar-size-regular": "40px" });
    });

    it("applies a custom property per range for a responsive size", () => {
        render(
            <Avatar size={{ narrow: 16, regular: 24, wide: 32 }} data-testid="avatar">
                <Avatar.Image src="primer.png" alt="mona" />
            </Avatar>,
        );
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute("data-responsive", "true");
        expect(avatar).toHaveStyle({ "--avatar-size-narrow": "16px" });
        expect(avatar).toHaveStyle({ "--avatar-size-regular": "24px" });
        expect(avatar).toHaveStyle({ "--avatar-size-wide": "32px" });
    });

    it("falls back to the default size when a responsive value leaves out a range", () => {
        render(
            <Avatar size={{ narrow: 16 }} data-testid="avatar">
                <Avatar.Image src="primer.png" alt="mona" />
            </Avatar>,
        );
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveStyle({ "--avatar-size-regular": "20px" });
        expect(avatar.style.getPropertyValue("--avatar-size-wide")).toBe("");
    });

    it("rounds the avatar into a circle by default", () => {
        render(composed);
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute("data-shape", "circle");
        expect(avatar).toHaveClass("avatar-circle");
    });

    it("scales the corner radius with the avatar for the square shape", () => {
        render(
            <Avatar shape="square" data-testid="avatar">
                <Avatar.Image src="primer.png" alt="mona" />
            </Avatar>,
        );
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute("data-shape", "square");
        expect(avatar).toHaveClass("avatar-square");
        expect(avatar).not.toHaveClass("avatar-circle");
    });

    it("does not leak the shape prop onto the element", () => {
        render(
            <Avatar shape="square" data-testid="avatar">
                <Avatar.Image src="primer.png" alt="mona" />
            </Avatar>,
        );
        expect(screen.getByTestId("avatar")).not.toHaveAttribute("shape");
    });

    it("leaves the responsive attribute unset by default", () => {
        render(composed);
        expect(screen.getByTestId("avatar")).not.toHaveAttribute("data-responsive");
    });

    it("merges a custom style onto the root element", () => {
        render(
            <Avatar style={{ opacity: 0.5 }} data-testid="avatar">
                <Avatar.Image src="primer.png" alt="mona" />
            </Avatar>,
        );
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveStyle({ opacity: "0.5" });
        expect(avatar).toHaveStyle({ "--avatar-size-regular": "20px" });
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Avatar as="a" href="#mona" data-testid="avatar">
                <Avatar.Image src="primer.png" alt="mona" />
            </Avatar>,
        );
        expect(screen.getByTestId("avatar")).toHaveAttribute("href", "#mona");
    });

    it("tags the root element with a data-component attribute", () => {
        render(composed);
        expect(screen.getByTestId("avatar")).toHaveAttribute("data-component", "Avatar");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(
            <Avatar ref={ref}>
                <Avatar.Image src="primer.png" alt="mona" />
            </Avatar>,
        );
        expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <Avatar className="custom" data-testid="avatar">
                <Avatar.Image src="primer.png" alt="mona" />
            </Avatar>,
        );
        expect(screen.getByTestId("avatar")).toHaveClass("custom");
    });

    it("holds whatever it is handed, parts or not", () => {
        render(
            <Avatar data-testid="avatar">
                <span>MO</span>
            </Avatar>,
        );

        expect(screen.getByTestId("avatar")).toHaveTextContent("MO");
    });

    describe("the picture", () => {
        it("carries the source and the alt text the avatar no longer does", () => {
            render(composed);

            expect(part("Image")).toHaveAttribute("src", "primer.png");
            expect(part("Image")).toHaveAttribute("alt", "mona");
        });

        it("stays in the tree while it is still on its way", () => {
            render(composed);

            expect(part("Image")).toBeInTheDocument();
            expect(part("Image")).toHaveAttribute("data-status", "loading");
        });

        it("says it has arrived once it has loaded", () => {
            render(composed);
            fireEvent.load(part("Image"));

            expect(part("Image")).toHaveAttribute("data-status", "loaded");
            expect(screen.getByTestId("avatar")).toHaveAttribute("data-status", "loaded");
        });

        it("says so when it fails", () => {
            render(composed);
            fireEvent.error(part("Image"));

            expect(part("Image")).toHaveAttribute("data-status", "error");
            expect(screen.getByTestId("avatar")).toHaveAttribute("data-status", "error");
        });

        it("waits on nothing where it was handed no source", () => {
            render(
                <Avatar>
                    <Avatar.Image alt="mona" />
                </Avatar>,
            );

            expect(part("Image")).toHaveAttribute("data-status", "idle");
        });

        it("renders a decorative image when no alt text is provided", () => {
            render(
                <Avatar>
                    <Avatar.Image src="primer.png" />
                </Avatar>,
            );

            expect(part("Image")).toHaveAttribute("alt", "");
        });

        it("calls the load and error handlers it was given", () => {
            const onLoad = vi.fn();
            const onError = vi.fn();

            const { rerender } = render(
                <Avatar>
                    <Avatar.Image src="primer.png" alt="mona" onLoad={onLoad} />
                </Avatar>,
            );
            fireEvent.load(part("Image"));
            expect(onLoad).toHaveBeenCalledTimes(1);

            rerender(
                <Avatar>
                    <Avatar.Image src="primer.png" alt="mona" onError={onError} />
                </Avatar>,
            );
            fireEvent.error(part("Image"));
            expect(onError).toHaveBeenCalledTimes(1);
        });
    });

    describe("the fallback", () => {
        it("stands in while the picture is still on its way", () => {
            render(composed);
            expect(part("Fallback")).toHaveTextContent("MO");
        });

        it("gives way once the picture has arrived", () => {
            render(composed);
            fireEvent.load(part("Image"));

            expect(part("Fallback")).not.toBeInTheDocument();
        });

        it("stays where the picture failed", () => {
            render(composed);
            fireEvent.error(part("Image"));

            expect(part("Fallback")).toHaveTextContent("MO");
        });

        it("stands where there was never a picture at all", () => {
            render(
                <Avatar>
                    <Avatar.Fallback name="Mona Octocat" />
                </Avatar>,
            );

            expect(part("Fallback")).toHaveTextContent("MO");
        });
    });

    describe("the fallback name", () => {
        it("works the initials out from the name", () => {
            render(<Avatar.Fallback name="Mona Octocat" />);
            expect(part("Fallback")).toHaveTextContent("MO");
        });

        it("passes over the words between the first and the last", () => {
            render(<Avatar.Fallback name="Mona Lisa Octocat" />);
            expect(part("Fallback")).toHaveTextContent("MO");
        });

        it("leaves a name of one word with the one letter it has", () => {
            render(<Avatar.Fallback name="Hubot" />);
            expect(part("Fallback")).toHaveTextContent("H");
        });

        it("reads the initials as capitals whatever case the name was written in", () => {
            render(<Avatar.Fallback name="mona octocat" />);
            expect(part("Fallback")).toHaveTextContent("MO");
        });

        it("passes over the space around the words and between them", () => {
            render(<Avatar.Fallback name="  Mona   Lisa   Octocat  " />);
            expect(part("Fallback")).toHaveTextContent("MO");
        });

        it("draws nothing for a name of nothing but space", () => {
            render(<Avatar.Fallback name="   " />);
            expect(part("Fallback").textContent).toBe("");
        });

        // Cutting a character written outside the basic plane by index would leave half a letter
        it("keeps a letter written outside the basic plane whole", () => {
            render(<Avatar.Fallback name="𝒜da Lovelace" />);
            expect(part("Fallback")).toHaveTextContent("𝒜L");
        });

        it("is named for a screen reader rather than spelled out a letter at a time", () => {
            render(<Avatar.Fallback name="Mona Lisa Octocat" />);

            expect(part("Fallback")).toHaveAttribute("role", "img");
            expect(part("Fallback")).toHaveAttribute("aria-label", "Mona Lisa Octocat");
        });

        // The name is the whole of what the fallback holds, so there is nothing beside the letters
        // it was worked down to
        it("draws the initials and nothing else", () => {
            render(<Avatar.Fallback name="Mona Lisa Octocat" />);
            expect(part("Fallback").textContent).toBe("MO");
        });

        it("does not leak the name prop onto the element", () => {
            render(<Avatar.Fallback name="Mona Lisa Octocat" />);
            expect(part("Fallback")).not.toHaveAttribute("name");
        });

        it("stands for whoever the avatar is of while the picture is on its way", () => {
            render(
                <Avatar>
                    <Avatar.Image src="primer.png" alt="Mona Lisa Octocat" />
                    <Avatar.Fallback name="Mona Lisa Octocat" />
                </Avatar>,
            );

            expect(part("Fallback")).toHaveTextContent("MO");
        });
    });

    describe("the parts", () => {
        it("pass the rest of their props down", () => {
            render(
                <Avatar>
                    <Avatar.Image className="picture" src="primer.png" alt="mona" loading="lazy" />
                    <Avatar.Fallback className="initials" aria-label="mona" name="Mona Octocat" />
                </Avatar>,
            );

            expect(part("Image")).toHaveClass("avatar-image", "picture");
            expect(part("Image")).toHaveAttribute("loading", "lazy");
            expect(part("Fallback")).toHaveClass("avatar-fallback", "initials");
            expect(part("Fallback")).toHaveAttribute("aria-label", "mona");
        });

        it("forward refs to the elements they rendered", () => {
            const image = React.createRef<HTMLImageElement>();
            const fallback = React.createRef<HTMLSpanElement>();

            render(
                <Avatar>
                    <Avatar.Image ref={image} src="primer.png" alt="mona" />
                    <Avatar.Fallback ref={fallback} name="Mona Octocat" />
                </Avatar>,
            );

            expect(image.current).toBe(part("Image"));
            expect(fallback.current).toBe(part("Fallback"));
        });

        it("can be rendered on their own, outside an avatar", () => {
            const { rerender } = render(<Avatar.Fallback name="Mona Octocat" />);
            expect(part("Fallback")).toHaveClass("avatar-fallback");

            rerender(<Avatar.Image src="primer.png" alt="mona" />);
            expect(part("Image")).toHaveClass("avatar-image");

            fireEvent.load(part("Image"));
            expect(part("Image")).toHaveAttribute("data-status", "loaded");
        });
    });
});
