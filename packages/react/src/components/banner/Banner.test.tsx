import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Banner } from ".";
import type { BannerVariant } from "./Banner.types";

const CustomIcon = () => <svg data-testid="custom-icon" aria-hidden="true" />;

const banner = () => screen.getByRole("region");

const part = (name: string) => banner().querySelector(`[data-component='Banner.${name}']`);

// The actions are laid out the once, so the row is reached for as the part it is
const actions = () => part("Actions") as HTMLElement;

// Every part that carries a name, so that one drawn twice over is caught rather than counted once
const parts = (name: string) => banner().querySelectorAll(`[data-component='Banner.${name}']`);

const variants: BannerVariant[] = ["critical", "info", "success", "upsell", "warning"];

describe("Banner", () => {
    it("renders a region named by its title", () => {
        render(<Banner title="Info" />);
        expect(screen.getByRole("region", { name: "Info" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Info" })).toBeInTheDocument();
    });

    it("renders a section element", () => {
        render(<Banner title="Info" />);
        expect(banner().tagName).toBe("SECTION");
    });

    it("tags the banner and its parts with data-component attributes", () => {
        render(
            <Banner
                title="Info"
                description="Something to know"
                primaryAction={<Banner.PrimaryAction>Turn it on</Banner.PrimaryAction>}
                secondaryAction={<Banner.SecondaryAction>Read more</Banner.SecondaryAction>}
                onDismiss={() => {}}
            />,
        );

        expect(banner()).toHaveAttribute("data-component", "Banner");
        for (const name of [
            "Icon",
            "Content",
            "Actions",
            "Title",
            "Description",
            "PrimaryAction",
            "SecondaryAction",
            "Dismiss",
        ]) {
            expect(part(name)).not.toBeNull();
        }
    });

    it("wraps itself in a query container so it can respond to the room it has", () => {
        render(<Banner title="Info" />);
        expect(banner().parentElement).toHaveClass("banner-container");
    });

    it("takes itself out of the tab order while staying focusable in code", () => {
        render(<Banner title="Info" />);
        expect(banner()).toHaveAttribute("tabindex", "-1");
    });

    it("names the region from its title rather than from a label", () => {
        render(<Banner title="Two-factor authentication" />);
        const heading = screen.getByRole("heading", { name: "Two-factor authentication" });

        expect(banner()).toHaveAttribute("aria-labelledby", heading.id);
        expect(banner()).not.toHaveAttribute("aria-label");
    });

    it("lets a label of its own win over the title", () => {
        render(<Banner aria-label="Repository notice" title="Info" />);
        expect(banner()).toHaveAttribute("aria-label", "Repository notice");
        expect(banner()).not.toHaveAttribute("aria-labelledby");
    });

    it("lets an element named by the caller win over both", () => {
        render(
            <Banner aria-label="Ignored" aria-labelledby="my-title">
                <Banner.Title id="my-title">Explicit title</Banner.Title>
            </Banner>,
        );

        expect(screen.getByRole("region", { name: "Explicit title" })).toHaveAttribute(
            "aria-labelledby",
            "my-title",
        );
        expect(banner()).not.toHaveAttribute("aria-label");
    });

    it("names the region from a title given as a child", () => {
        render(
            <Banner>
                <Banner.Title>Given as a child</Banner.Title>
            </Banner>,
        );

        const heading = screen.getByRole("heading", { name: "Given as a child" });
        expect(heading).toHaveAttribute("id");
        expect(banner()).toHaveAttribute("aria-labelledby", heading.id);
    });

    it("renders its description", () => {
        render(<Banner title="Info" description="Something to know" />);
        expect(screen.getByText("Something to know")).toBeInTheDocument();
        expect(banner()).toContainElement(screen.getByText("Something to know"));
    });

    it("renders its children alongside the title and description", () => {
        render(
            <Banner title="Info" description="Something to know">
                <span>Something more</span>
            </Banner>,
        );
        expect(part("Content")).toContainElement(screen.getByText("Something more"));
    });

    it("keeps a hidden title as the region's name", () => {
        render(<Banner title="Warning" hideTitle description="Something to know" />);

        expect(screen.getByRole("region", { name: "Warning" })).toBeInTheDocument();
        expect(banner()).toHaveAttribute("data-title-hidden", "true");
        expect(screen.getByRole("heading", { name: "Warning" }).parentElement).toHaveClass(
            "sr-only",
        );
    });

    it("falls back to the info variant", () => {
        render(<Banner title="Info" />);
        expect(banner()).toHaveAttribute("data-variant", "info");
        expect(banner()).toHaveClass("banner-info");
    });

    it("colours itself by its variant", () => {
        for (const variant of variants) {
            const { unmount } = render(<Banner title="Info" variant={variant} />);
            expect(banner()).toHaveAttribute("data-variant", variant);
            expect(part("Icon")?.querySelector("svg")).not.toBeNull();
            unmount();
        }
    });

    it("falls back to the default layout", () => {
        render(<Banner title="Info" />);
        expect(banner()).toHaveAttribute("data-layout", "default");
        expect(banner()).toHaveClass("banner-default");
    });

    it("takes less padding when compact", () => {
        render(<Banner title="Info" layout="compact" />);
        expect(banner()).toHaveAttribute("data-layout", "compact");
        expect(banner()).toHaveClass("banner-compact");
    });

    it("gives up its side borders when flush", () => {
        render(<Banner title="Info" flush />);
        expect(banner()).toHaveAttribute("data-flush", "true");
        expect(banner()).toHaveClass("banner-flush");
    });

    it("keeps its side borders otherwise", () => {
        render(<Banner title="Info" />);
        expect(banner()).not.toHaveAttribute("data-flush");
        expect(banner()).not.toHaveClass("banner-flush");
    });

    it("passes extra props onto the section", () => {
        render(<Banner title="Info" data-testid="banner" />);
        expect(screen.getByTestId("banner")).toBe(banner());
    });

    it("forwards a ref to the section", () => {
        const ref = React.createRef<HTMLElement>();
        render(<Banner ref={ref} title="Info" />);
        expect(ref.current).toBe(banner());
    });

    it("merges a custom className onto the section", () => {
        render(<Banner title="Info" className="custom" />);
        expect(banner()).toHaveClass("custom");
    });
});

describe("Banner leading visual", () => {
    it("carries the icon its variant calls for", () => {
        render(<Banner title="Info" />);
        expect(part("Icon")?.querySelector("svg")).not.toBeNull();
    });

    it("takes a visual of its own for the info and upsell variants", () => {
        for (const variant of ["info", "upsell"] as const) {
            const { unmount } = render(
                <Banner title="Info" variant={variant} leadingVisual={<CustomIcon />} />,
            );
            expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
            unmount();
        }
    });

    it("keeps its own icon for the variants that mean something by it", () => {
        for (const variant of ["critical", "success", "warning"] as const) {
            const { unmount } = render(
                <Banner title="Info" variant={variant} leadingVisual={<CustomIcon />} />,
            );
            expect(screen.queryByTestId("custom-icon")).toBeNull();
            expect(part("Icon")?.querySelector("svg")).not.toBeNull();
            unmount();
        }
    });
});

describe("Banner dismiss", () => {
    it("shows no dismiss button by default", () => {
        render(<Banner title="Info" />);
        expect(screen.queryByRole("button", { name: "Dismiss banner" })).toBeNull();
        expect(banner()).not.toHaveAttribute("data-dismissible");
    });

    it("shows a dismiss button once it is given a handler", () => {
        render(<Banner title="Info" onDismiss={() => {}} />);
        expect(screen.getByRole("button", { name: "Dismiss banner" })).toBeInTheDocument();
        expect(banner()).toHaveAttribute("data-dismissible", "true");
    });

    it("calls onDismiss when the button is pressed", () => {
        const onDismiss = vi.fn();
        render(<Banner title="Info" onDismiss={onDismiss} />);

        fireEvent.click(screen.getByRole("button", { name: "Dismiss banner" }));
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("can be dismissed whatever the variant", () => {
        for (const variant of variants) {
            const { unmount } = render(
                <Banner title="Info" variant={variant} onDismiss={() => {}} />,
            );
            expect(screen.getByRole("button", { name: "Dismiss banner" })).toBeInTheDocument();
            unmount();
        }
    });
});

describe("Banner actions", () => {
    const withActions = (props: Partial<React.ComponentProps<typeof Banner>> = {}) =>
        render(
            <Banner
                title="Info"
                description="Something to know"
                primaryAction={<Banner.PrimaryAction>Turn it on</Banner.PrimaryAction>}
                secondaryAction={<Banner.SecondaryAction>Read more</Banner.SecondaryAction>}
                {...props}
            />,
        );

    it("shows no actions by default", () => {
        render(<Banner title="Info" />);
        expect(part("Actions")).toBeNull();
        expect(banner()).not.toHaveAttribute("data-has-actions");
    });

    it("marks itself as having actions", () => {
        withActions();
        expect(banner()).toHaveAttribute("data-has-actions", "true");
    });

    it("styles the primary action as the default button and the secondary as invisible", () => {
        withActions();
        expect(part("PrimaryAction")).toHaveAttribute("data-variant", "default");
        expect(part("SecondaryAction")).toHaveAttribute("data-variant", "invisible");
    });

    it("reports a press on either action", () => {
        const onPrimary = vi.fn();
        const onSecondary = vi.fn();
        withActions({
            primaryAction: (
                <Banner.PrimaryAction onClick={onPrimary}>Turn it on</Banner.PrimaryAction>
            ),
            secondaryAction: (
                <Banner.SecondaryAction onClick={onSecondary}>Read more</Banner.SecondaryAction>
            ),
        });

        fireEvent.click(part("PrimaryAction") as HTMLElement);
        fireEvent.click(part("SecondaryAction") as HTMLElement);

        expect(onPrimary).toHaveBeenCalledTimes(1);
        expect(onSecondary).toHaveBeenCalledTimes(1);
    });

    it("lays each action out the once", () => {
        withActions();

        // An action is drawn where it was handed over rather than in every order it might be
        // read in, so whatever a caller passes is mounted once and only once
        expect(parts("Actions")).toHaveLength(1);
        expect(parts("PrimaryAction")).toHaveLength(1);
        expect(parts("SecondaryAction")).toHaveLength(1);
    });

    it("writes the row primary first, whichever way round it is drawn", () => {
        withActions();

        // Which way round it reads depends on the room the banner has, which is not known
        // while rendering, so the drawing is turned in CSS and the order it is read out and
        // tabbed through stays as it was written
        expect(actions().firstElementChild).toHaveAttribute(
            "data-component",
            "Banner.PrimaryAction",
        );
        expect(actions().lastElementChild).toHaveAttribute(
            "data-component",
            "Banner.SecondaryAction",
        );
    });

    it("falls back to following the room the banner has", () => {
        withActions();
        expect(banner()).toHaveAttribute("data-actions-layout", "default");
        expect(actions()).toHaveClass("banner-actions-reversed-responsive");
    });

    it("keeps inline actions beside the content until the viewport is narrow", () => {
        withActions({ actionsLayout: "inline" });
        expect(banner()).toHaveAttribute("data-actions-layout", "inline");
        expect(actions()).toHaveClass("banner-actions-inline", "banner-actions-reversed-inline");
    });

    it("drops stacked actions below the content whatever the room", () => {
        withActions({ actionsLayout: "stacked" });
        expect(banner()).toHaveAttribute("data-actions-layout", "stacked");
        expect(actions()).toHaveClass("banner-actions-stacked");

        // A row read down the banner is never turned, so it names neither of the two
        expect(actions().className).not.toMatch(/banner-actions-reversed/);
    });

    it("drops the actions below the content where a dismiss button takes their room", () => {
        withActions({ onDismiss: () => {} });

        // The dismiss button stands where the actions would otherwise sit
        expect(actions()).toHaveClass("banner-actions-stacked");
        expect(actions().className).not.toMatch(/banner-actions-reversed/);
    });

    it("keeps inline actions beside the content even when it can be dismissed", () => {
        withActions({ actionsLayout: "inline", onDismiss: () => {} });
        expect(actions()).toHaveClass("banner-actions-reversed-inline");
    });

    it("keeps the actions beside a hidden title", () => {
        withActions({ hideTitle: true, onDismiss: () => {} });
        expect(actions()).toHaveClass("banner-actions-reversed-responsive");
    });
});

describe("Banner.Title", () => {
    it("renders a level two heading by default", () => {
        render(
            <Banner>
                <Banner.Title>Info</Banner.Title>
            </Banner>,
        );
        expect(screen.getByRole("heading", { level: 2, name: "Info" })).toBeInTheDocument();
    });

    it("renders as any heading from level two down", () => {
        const levels = [2, 3, 4, 5, 6] as const;

        for (const level of levels) {
            const { unmount } = render(
                <Banner>
                    <Banner.Title as={`h${level}`}>Level {level}</Banner.Title>
                </Banner>,
            );
            expect(
                screen.getByRole("heading", { level, name: `Level ${level}` }),
            ).toBeInTheDocument();
            unmount();
        }
    });

    it("merges a custom className onto the heading", () => {
        render(
            <Banner>
                <Banner.Title className="custom">Info</Banner.Title>
            </Banner>,
        );
        expect(screen.getByRole("heading", { name: "Info" })).toHaveClass("custom");
    });

    it("passes extra props onto the heading", () => {
        render(
            <Banner>
                <Banner.Title data-testid="title">Info</Banner.Title>
            </Banner>,
        );
        expect(screen.getByTestId("title")).toBe(screen.getByRole("heading", { name: "Info" }));
    });
});

describe("Banner.Description", () => {
    it("merges a custom className onto the description", () => {
        render(
            <Banner title="Info">
                <Banner.Description className="custom">Something to know</Banner.Description>
            </Banner>,
        );
        expect(screen.getByText("Something to know")).toHaveClass("custom");
    });

    it("passes extra props onto the description", () => {
        render(
            <Banner title="Info">
                <Banner.Description data-testid="description">Something to know</Banner.Description>
            </Banner>,
        );
        expect(screen.getByTestId("description")).toHaveTextContent("Something to know");
    });
});
