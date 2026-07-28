import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Banner } from ".";
import type { BannerVariant } from "./Banner.types";

const CustomIcon = () => <svg data-testid="custom-icon" aria-hidden="true" />;

const banner = () => screen.getByRole("region");

const part = (name: string) => banner().querySelector(`[data-component='Banner.${name}']`);

// Both orders of the actions are laid out, so a query has to say which one it means
const actionsFor = (order: "leading" | "trailing") =>
    banner().querySelector(`[data-primary-action='${order}']`) as HTMLElement;

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
        expect(banner().parentElement).toHaveClass("@container/banner");
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
        expect(banner()).toHaveClass(
            "[--banner-background-color:var(--background-color-accent-muted)]",
        );
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
        expect(banner()).toHaveClass("p-[var(--base-size-8)]");
    });

    it("takes less padding when compact", () => {
        render(<Banner title="Info" layout="compact" />);
        expect(banner()).toHaveAttribute("data-layout", "compact");
        expect(banner()).toHaveClass("p-[var(--base-size-4)]");
    });

    it("gives up its side borders when flush", () => {
        render(<Banner title="Info" flush />);
        expect(banner()).toHaveAttribute("data-flush", "true");
        expect(banner()).toHaveClass("border-x-0");
        expect(banner()).toHaveClass("rounded-none");
    });

    it("keeps its side borders otherwise", () => {
        render(<Banner title="Info" />);
        expect(banner()).not.toHaveAttribute("data-flush");
        expect(banner()).not.toHaveClass("border-x-0");
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
        const onDismiss = jest.fn();
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
        const onPrimary = jest.fn();
        const onSecondary = jest.fn();
        withActions({
            primaryAction: (
                <Banner.PrimaryAction onClick={onPrimary}>Turn it on</Banner.PrimaryAction>
            ),
            secondaryAction: (
                <Banner.SecondaryAction onClick={onSecondary}>Read more</Banner.SecondaryAction>
            ),
        });

        fireEvent.click(
            actionsFor("leading").querySelector(
                "[data-component='Banner.PrimaryAction']",
            ) as HTMLElement,
        );
        fireEvent.click(
            actionsFor("leading").querySelector(
                "[data-component='Banner.SecondaryAction']",
            ) as HTMLElement,
        );

        expect(onPrimary).toHaveBeenCalledTimes(1);
        expect(onSecondary).toHaveBeenCalledTimes(1);
    });

    it("lays both orders out and leaves only one of them standing", () => {
        withActions();

        // The order that reads correctly depends on the room the banner has, which is not
        // known while rendering, so one of the two is taken away in CSS
        expect(actionsFor("leading").firstElementChild).toHaveAttribute(
            "data-component",
            "Banner.PrimaryAction",
        );
        expect(actionsFor("trailing").firstElementChild).toHaveAttribute(
            "data-component",
            "Banner.SecondaryAction",
        );
    });

    it("falls back to following the room the banner has", () => {
        withActions();
        expect(banner()).toHaveAttribute("data-actions-layout", "default");
        expect(actionsFor("trailing")).toHaveClass("@max-[500px]/banner:hidden");
        expect(actionsFor("leading")).toHaveClass("@max-[500px]/banner:flex");
    });

    it("keeps inline actions beside the content until the viewport is narrow", () => {
        withActions({ actionsLayout: "inline" });
        expect(banner()).toHaveAttribute("data-actions-layout", "inline");
        expect(actionsFor("trailing")).toHaveClass("max-medium:hidden");
        expect(actionsFor("leading")).toHaveClass("max-medium:flex");
    });

    it("drops stacked actions below the content whatever the room", () => {
        withActions({ actionsLayout: "stacked" });
        expect(banner()).toHaveAttribute("data-actions-layout", "stacked");
        expect(actionsFor("trailing")).toHaveClass("hidden");
        expect(actionsFor("leading")).toHaveClass("flex");
    });

    it("drops the actions below the content where a dismiss button takes their room", () => {
        withActions({ onDismiss: () => {} });

        // The dismiss button stands where the actions would otherwise sit
        expect(actionsFor("trailing")).toHaveClass("hidden");
        expect(actionsFor("leading")).toHaveClass("flex");
    });

    it("keeps inline actions beside the content even when it can be dismissed", () => {
        withActions({ actionsLayout: "inline", onDismiss: () => {} });
        expect(actionsFor("trailing")).toHaveClass("max-medium:hidden");
    });

    it("keeps the actions beside a hidden title", () => {
        withActions({ hideTitle: true, onDismiss: () => {} });
        expect(actionsFor("trailing")).toHaveClass("@max-[500px]/banner:hidden");
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
