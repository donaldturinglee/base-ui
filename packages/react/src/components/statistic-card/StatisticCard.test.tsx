import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { StatisticCard } from ".";
import type {
    StatisticCardProps,
    StatisticCardTrendDirection,
    StatisticCardTrendSentiment,
} from "./StatisticCard.types";

const renderCard = (props: Partial<StatisticCardProps> = {}) =>
    render(
        <StatisticCard data-testid="card" {...props}>
            <StatisticCard.Label>Sessions</StatisticCard.Label>
            <StatisticCard.Value>12.9K</StatisticCard.Value>
            <StatisticCard.Trend direction="increase">8.2%</StatisticCard.Trend>
            <StatisticCard.Description>vs the four weeks before</StatisticCard.Description>
        </StatisticCard>,
    );

const root = () => screen.getByTestId("card");

describe("StatisticCard", () => {
    it("tags the root element with a data-component attribute", () => {
        renderCard();
        expect(root()).toHaveAttribute("data-component", "StatisticCard");
    });

    it("draws the parts it is given", () => {
        renderCard();

        expect(screen.getByText("Sessions")).toHaveAttribute(
            "data-component",
            "StatisticCard.Label",
        );
        expect(screen.getByText("12.9K")).toHaveAttribute("data-component", "StatisticCard.Value");
        expect(screen.getByText("8.2%")).toHaveAttribute("data-component", "StatisticCard.Trend");
        expect(screen.getByText("vs the four weeks before")).toHaveAttribute(
            "data-component",
            "StatisticCard.Description",
        );
    });

    it("stands anything else it is given beside the parts it knows", () => {
        render(
            <StatisticCard data-testid="card">
                <StatisticCard.Label>Sessions</StatisticCard.Label>
                <span>Counted this morning</span>
            </StatisticCard>,
        );

        expect(root()).toContainElement(screen.getByText("Counted this morning"));
    });

    describe("how the parts are laid out", () => {
        it("stands the figure and the move it has made together on a line of their own", () => {
            renderCard();

            const figure = screen.getByText("12.9K").parentElement;
            expect(figure).toHaveClass("statistic-card-figure");
            expect(figure).toContainElement(screen.getByText("8.2%"));
        });

        it("leaves that line out where there is neither a figure nor a move to put on it", () => {
            const { container } = render(
                <StatisticCard data-testid="card">
                    <StatisticCard.Label>Sessions</StatisticCard.Label>
                </StatisticCard>,
            );

            expect(container.querySelector(".statistic-card-figure")).toBeNull();
        });

        it("closes the row with the visual rather than leading the words with it", () => {
            render(
                <StatisticCard data-testid="card">
                    <StatisticCard.Label>Sessions</StatisticCard.Label>
                    <StatisticCard.TrailingVisual>
                        <svg />
                    </StatisticCard.TrailingVisual>
                </StatisticCard>,
            );

            const parts = Array.from(root().children);
            expect(parts[parts.length - 1]).toHaveAttribute(
                "data-component",
                "StatisticCard.TrailingVisual",
            );
        });

        it("holds the visual at the end of the row", () => {
            render(
                <StatisticCard data-testid="card">
                    <StatisticCard.Label>Sessions</StatisticCard.Label>
                    <StatisticCard.TrailingVisual>
                        <svg />
                    </StatisticCard.TrailingVisual>
                </StatisticCard>,
            );

            expect(
                root().querySelector("[data-component='StatisticCard.TrailingVisual']"),
            ).toHaveClass("statistic-card-trailing-visual");
        });

        it("keeps the visual out of the words it stands beside", () => {
            render(
                <StatisticCard data-testid="card">
                    <StatisticCard.Label>Sessions</StatisticCard.Label>
                    <StatisticCard.TrailingVisual>
                        <svg />
                    </StatisticCard.TrailingVisual>
                </StatisticCard>,
            );

            const body = root().querySelector(".statistic-card-body");
            expect(body).not.toContainElement(
                root().querySelector("[data-component='StatisticCard.TrailingVisual']"),
            );
        });
    });

    describe("what names the card", () => {
        it("groups the parts under the line naming the figure", () => {
            renderCard({ id: "sessions" });

            expect(root()).toHaveAttribute("role", "group");
            expect(root()).toHaveAttribute("aria-labelledby", "sessions-label");
            expect(screen.getByText("Sessions")).toHaveAttribute("id", "sessions-label");
        });

        it("is found by that name", () => {
            renderCard();
            expect(screen.getByRole("group", { name: "Sessions" })).toBe(root());
        });

        it("keeps a name the caller has given it", () => {
            renderCard({ "aria-label": "Sessions this month" });

            expect(screen.getByRole("group", { name: "Sessions this month" })).toBe(root());
            expect(root()).not.toHaveAttribute("aria-labelledby");
        });

        it("keeps an id the caller has named", () => {
            renderCard({ "aria-labelledby": "named-elsewhere" });
            expect(root()).toHaveAttribute("aria-labelledby", "named-elsewhere");
        });

        it("gives way to an id a part was given", () => {
            render(
                <StatisticCard id="sessions" data-testid="card">
                    <StatisticCard.Label id="own-label">Sessions</StatisticCard.Label>
                </StatisticCard>,
            );

            expect(screen.getByText("Sessions")).toHaveAttribute("id", "own-label");
            expect(root()).toHaveAttribute("aria-labelledby", "sessions-label");
        });

        it("is no group at all where there is no name to group the parts under", () => {
            render(
                <StatisticCard data-testid="card">
                    <StatisticCard.Value>12.9K</StatisticCard.Value>
                </StatisticCard>,
            );

            expect(root()).not.toHaveAttribute("role");
            expect(root()).not.toHaveAttribute("aria-labelledby");
        });

        it("keeps the caller's id on the card rather than making one up for it", () => {
            renderCard({ id: "sessions" });
            expect(root()).toHaveAttribute("id", "sessions");
        });

        it("carries no id of its own where the caller named none", () => {
            renderCard();
            expect(root()).not.toHaveAttribute("id");
        });
    });

    describe("the move the figure has made", () => {
        const directions: StatisticCardTrendDirection[] = ["increase", "decrease", "neutral"];

        it.each(directions)("records the %s direction", (direction) => {
            render(
                <StatisticCard data-testid="card">
                    <StatisticCard.Trend direction={direction}>8.2%</StatisticCard.Trend>
                </StatisticCard>,
            );

            expect(screen.getByText("8.2%")).toHaveAttribute("data-direction", direction);
        });

        it("draws an arrow for the way the figure went", () => {
            render(
                <StatisticCard data-testid="card">
                    <StatisticCard.Trend direction="increase">8.2%</StatisticCard.Trend>
                </StatisticCard>,
            );

            expect(screen.getByText("8.2%").querySelector("svg")).toBeInTheDocument();
        });

        it("says which way it went in words, since the arrow is only a shape", () => {
            render(
                <StatisticCard data-testid="card">
                    <StatisticCard.Trend direction="decrease">3.1%</StatisticCard.Trend>
                </StatisticCard>,
            );

            expect(screen.getByText("Down")).toHaveClass("sr-only");
        });

        it("takes what the move means from the way it points", () => {
            const expected: Record<StatisticCardTrendDirection, StatisticCardTrendSentiment> = {
                increase: "positive",
                decrease: "negative",
                neutral: "neutral",
            };

            directions.forEach((direction) => {
                const { unmount } = render(
                    <StatisticCard>
                        <StatisticCard.Trend direction={direction}>8.2%</StatisticCard.Trend>
                    </StatisticCard>,
                );

                const trend = screen.getByText("8.2%");
                expect(trend).toHaveAttribute("data-sentiment", expected[direction]);
                expect(trend).toHaveClass(`statistic-card-trend-${expected[direction]}`);

                unmount();
            });
        });

        it("turns that around where the caller says a rise is the bad news", () => {
            render(
                <StatisticCard data-testid="card">
                    <StatisticCard.Trend direction="increase" sentiment="negative">
                        12.5%
                    </StatisticCard.Trend>
                </StatisticCard>,
            );

            const trend = screen.getByText("12.5%");
            // The arrow still points the way the figure went; only what it means is turned round
            expect(trend).toHaveAttribute("data-direction", "increase");
            expect(trend).toHaveAttribute("data-sentiment", "negative");
            expect(trend).toHaveClass("statistic-card-trend-negative");
            expect(trend).not.toHaveClass("statistic-card-trend-positive");
        });

        it("does not leak the trend props onto the element", () => {
            render(
                <StatisticCard data-testid="card">
                    <StatisticCard.Trend direction="increase" sentiment="negative">
                        12.5%
                    </StatisticCard.Trend>
                </StatisticCard>,
            );

            const trend = screen.getByText("12.5%");
            expect(trend).not.toHaveAttribute("direction");
            expect(trend).not.toHaveAttribute("sentiment");
        });
    });

    describe("the trailing visual", () => {
        it("stays out of the accessibility tree while it is unlabelled", () => {
            render(
                <StatisticCard data-testid="card">
                    <StatisticCard.Label>Sessions</StatisticCard.Label>
                    <StatisticCard.TrailingVisual>
                        <svg />
                    </StatisticCard.TrailingVisual>
                </StatisticCard>,
            );

            const visual = root().querySelector("[data-component='StatisticCard.TrailingVisual']");
            expect(visual).toHaveAttribute("aria-hidden", "true");
            expect(visual).not.toHaveAttribute("role");
        });

        it("is read as an image once it has been named", () => {
            render(
                <StatisticCard data-testid="card">
                    <StatisticCard.Label>Sessions</StatisticCard.Label>
                    <StatisticCard.TrailingVisual aria-label="People">
                        <svg />
                    </StatisticCard.TrailingVisual>
                </StatisticCard>,
            );

            expect(screen.getByRole("img", { name: "People" })).toBeInTheDocument();
        });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();

        render(
            <StatisticCard ref={ref} data-testid="card">
                <StatisticCard.Label>Sessions</StatisticCard.Label>
            </StatisticCard>,
        );

        expect(ref.current).toBe(root());
    });

    it("merges a custom className onto the root element", () => {
        renderCard({ className: "custom" });
        expect(root()).toHaveClass("statistic-card", "custom");
    });

    it("merges a custom className onto the parts", () => {
        render(
            <StatisticCard data-testid="card">
                <StatisticCard.Label className="custom-label">Sessions</StatisticCard.Label>
                <StatisticCard.Value className="custom-value">12.9K</StatisticCard.Value>
                <StatisticCard.Trend className="custom-trend" direction="increase">
                    8.2%
                </StatisticCard.Trend>
                <StatisticCard.Description className="custom-description">
                    vs the four weeks before
                </StatisticCard.Description>
                <StatisticCard.TrailingVisual className="custom-visual">
                    <svg />
                </StatisticCard.TrailingVisual>
            </StatisticCard>,
        );

        expect(root().querySelector("[data-component='StatisticCard.TrailingVisual']")).toHaveClass(
            "statistic-card-trailing-visual",
            "custom-visual",
        );
        expect(screen.getByText("Sessions")).toHaveClass("statistic-card-label", "custom-label");
        expect(screen.getByText("12.9K")).toHaveClass("statistic-card-value", "custom-value");
        expect(screen.getByText("8.2%")).toHaveClass("statistic-card-trend", "custom-trend");
        expect(screen.getByText("vs the four weeks before")).toHaveClass(
            "statistic-card-description",
            "custom-description",
        );
    });
});
