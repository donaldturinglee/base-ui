import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { ThemeProvider, useColorSchemeVar, useTheme } from ".";
import type { ThemeProviderProps } from "./Theme.types";

const root = () => document.querySelector('[data-component="ThemeProvider"]');

// jsdom has no `matchMedia`, so auto mode falls back to day until one is put in place
const setSystemPrefersDark = (prefersDark: boolean) => {
    Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: (query: string) => ({
            matches: prefersDark,
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }),
    });
};

const Scheme = () => {
    const { colorScheme, colorMode, resolvedColorMode } = useTheme();
    return <span data-testid="scheme">{`${colorScheme}-${colorMode}-${resolvedColorMode}`}</span>;
};

afterEach(() => {
    Reflect.deleteProperty(window, "matchMedia");
});

describe("ThemeProvider", () => {
    it("settles on the light scheme by default", () => {
        render(
            <ThemeProvider>
                <Scheme />
            </ThemeProvider>,
        );

        expect(root()).toHaveAttribute("data-theme", "light");
        expect(root()).toHaveAttribute("data-color-mode", "day");
        expect(screen.getByTestId("scheme")).toHaveTextContent("light-day-day");
    });

    it("settles on the dark scheme in night mode", () => {
        render(
            <ThemeProvider colorMode="night">
                <Scheme />
            </ThemeProvider>,
        );

        expect(root()).toHaveAttribute("data-theme", "dark");
    });

    it("takes light and dark as aliases for day and night", () => {
        const { rerender } = render(
            <ThemeProvider colorMode="dark">
                <Scheme />
            </ThemeProvider>,
        );
        expect(root()).toHaveAttribute("data-theme", "dark");

        rerender(
            <ThemeProvider colorMode="light">
                <Scheme />
            </ThemeProvider>,
        );
        expect(root()).toHaveAttribute("data-theme", "light");
    });

    it("shows the scheme each mode has been pointed at", () => {
        render(
            <ThemeProvider colorMode="day" dayScheme="dark" nightScheme="light">
                <Scheme />
            </ThemeProvider>,
        );

        expect(root()).toHaveAttribute("data-theme", "dark");
    });

    it("renders a wrapper the design tokens can hang off", () => {
        render(
            <ThemeProvider className="page">
                <span>Hello</span>
            </ThemeProvider>,
        );

        expect(root()?.tagName).toBe("DIV");
        expect(root()).toHaveClass("page");
    });

    describe("auto", () => {
        it("follows a system asking for light", () => {
            setSystemPrefersDark(false);
            render(
                <ThemeProvider colorMode="auto">
                    <Scheme />
                </ThemeProvider>,
            );

            expect(root()).toHaveAttribute("data-theme", "light");
            expect(screen.getByTestId("scheme")).toHaveTextContent("light-auto-day");
        });

        it("follows a system asking for dark", () => {
            setSystemPrefersDark(true);
            render(
                <ThemeProvider colorMode="auto">
                    <Scheme />
                </ThemeProvider>,
            );

            expect(root()).toHaveAttribute("data-theme", "dark");
            expect(screen.getByTestId("scheme")).toHaveTextContent("dark-auto-night");
        });

        it("says it is following the system, where the scheme alone cannot", () => {
            setSystemPrefersDark(true);
            render(
                <ThemeProvider colorMode="auto">
                    <Scheme />
                </ThemeProvider>,
            );

            expect(root()).toHaveAttribute("data-color-mode", "auto");
        });

        it("falls back to day where there is no `matchMedia` to ask", () => {
            render(
                <ThemeProvider colorMode="auto">
                    <Scheme />
                </ThemeProvider>,
            );

            expect(root()).toHaveAttribute("data-theme", "light");
        });
    });

    describe("following the props", () => {
        const app = (props: ThemeProviderProps) => (
            <ThemeProvider {...props}>
                <Scheme />
            </ThemeProvider>
        );

        it("moves with the colour mode", () => {
            const { rerender } = render(app({ colorMode: "day" }));
            expect(root()).toHaveAttribute("data-theme", "light");

            rerender(app({ colorMode: "night" }));
            expect(root()).toHaveAttribute("data-theme", "dark");
        });

        it("moves with the day scheme", () => {
            const { rerender } = render(app({ colorMode: "day", dayScheme: "light" }));
            expect(root()).toHaveAttribute("data-theme", "light");

            rerender(app({ colorMode: "day", dayScheme: "dark" }));
            expect(root()).toHaveAttribute("data-theme", "dark");
        });

        it("moves with the night scheme", () => {
            const { rerender } = render(app({ colorMode: "night", nightScheme: "dark" }));
            expect(root()).toHaveAttribute("data-theme", "dark");

            rerender(app({ colorMode: "night", nightScheme: "light" }));
            expect(root()).toHaveAttribute("data-theme", "light");
        });
    });

    describe("nested", () => {
        const nested = () => document.querySelectorAll('[data-component="ThemeProvider"]')[1];

        it("inherits the colour mode from the provider above", () => {
            render(
                <ThemeProvider colorMode="night">
                    <ThemeProvider>
                        <Scheme />
                    </ThemeProvider>
                </ThemeProvider>,
            );

            expect(nested()).toHaveAttribute("data-theme", "dark");
        });

        it("inherits the schemes from the provider above", () => {
            render(
                <ThemeProvider colorMode="night" dayScheme="dark" nightScheme="light">
                    <ThemeProvider colorMode="day">
                        <Scheme />
                    </ThemeProvider>
                </ThemeProvider>,
            );

            expect(nested()).toHaveAttribute("data-theme", "dark");
        });

        it("changes only what it was asked to change", () => {
            render(
                <ThemeProvider colorMode="day" nightScheme="light">
                    <ThemeProvider colorMode="night">
                        <Scheme />
                    </ThemeProvider>
                </ThemeProvider>,
            );

            expect(nested()).toHaveAttribute("data-theme", "light");
        });

        it("takes the opposite of a mode the system settled", () => {
            setSystemPrefersDark(true);

            const Inverse = () => {
                const { resolvedColorMode } = useTheme();
                return (
                    <ThemeProvider colorMode={resolvedColorMode === "day" ? "night" : "day"}>
                        <Scheme />
                    </ThemeProvider>
                );
            };

            render(
                <ThemeProvider colorMode="auto">
                    <Inverse />
                </ThemeProvider>,
            );

            expect(nested()).toHaveAttribute("data-theme", "light");
        });
    });

    describe("the setters", () => {
        const Toggle = ({ children }: { children?: React.ReactNode }) => (
            <ThemeProvider colorMode="day" dayScheme="light" nightScheme="dark">
                {children}
            </ThemeProvider>
        );

        it("changes the colour mode", () => {
            const Button = () => {
                const { colorMode, setColorMode } = useTheme();
                return (
                    <button onClick={() => setColorMode(colorMode === "day" ? "night" : "day")}>
                        Toggle
                    </button>
                );
            };

            render(
                <Toggle>
                    <Button />
                </Toggle>,
            );

            fireEvent.click(screen.getByRole("button"));
            expect(root()).toHaveAttribute("data-theme", "dark");
        });

        it("changes the day scheme", () => {
            const Button = () => {
                const { setDayScheme } = useTheme();
                return <button onClick={() => setDayScheme("dark")}>Toggle</button>;
            };

            render(
                <Toggle>
                    <Button />
                </Toggle>,
            );

            fireEvent.click(screen.getByRole("button"));
            expect(root()).toHaveAttribute("data-theme", "dark");
        });

        it("changes the night scheme", () => {
            const Button = () => {
                const { setNightScheme } = useTheme();
                return <button onClick={() => setNightScheme("light")}>Toggle</button>;
            };

            render(
                <ThemeProvider colorMode="night">
                    <Button />
                </ThemeProvider>,
            );

            fireEvent.click(screen.getByRole("button"));
            expect(root()).toHaveAttribute("data-theme", "light");
        });
    });

    describe("contextOnly", () => {
        it("leaves the wrapper out", () => {
            render(
                <ThemeProvider contextOnly>
                    <span>Hello</span>
                </ThemeProvider>,
            );

            expect(root()).toBeNull();
            expect(screen.getByText("Hello")).toBeInTheDocument();
        });

        it("still hands the theme to whatever asks for it", () => {
            render(
                <ThemeProvider contextOnly colorMode="night" dayScheme="dark">
                    <Scheme />
                </ThemeProvider>,
            );

            expect(screen.getByTestId("scheme")).toHaveTextContent("dark-night-night");
        });
    });

    describe("useTheme", () => {
        it("answers with no scheme at all outside a provider", () => {
            render(<Scheme />);
            expect(screen.getByTestId("scheme")).toHaveTextContent("undefined-undefined-undefined");
        });

        it("leaves its setters as no-ops outside a provider", () => {
            const Button = () => {
                const { setColorMode } = useTheme();
                return <button onClick={() => setColorMode("night")}>Toggle</button>;
            };

            render(<Button />);

            expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
        });
    });

    describe("useColorSchemeVar", () => {
        const Swatch = () => {
            const background = useColorSchemeVar({ light: "red", dark: "blue" }, "inherit");
            return <span data-testid="swatch" style={{ backgroundColor: background }} />;
        };

        it("picks the value belonging to the active scheme", () => {
            const { rerender } = render(
                <ThemeProvider colorMode="day">
                    <Swatch />
                </ThemeProvider>,
            );
            expect(screen.getByTestId("swatch")).toHaveStyle("background-color: rgb(255, 0, 0)");

            rerender(
                <ThemeProvider colorMode="night">
                    <Swatch />
                </ThemeProvider>,
            );
            expect(screen.getByTestId("swatch")).toHaveStyle("background-color: rgb(0, 0, 255)");
        });

        it("falls back where the scheme has no value of its own", () => {
            const Fallback = () => {
                const background = useColorSchemeVar({ dark: "blue" }, "red");
                return <span data-testid="fallback" style={{ backgroundColor: background }} />;
            };

            render(
                <ThemeProvider colorMode="day">
                    <Fallback />
                </ThemeProvider>,
            );

            expect(screen.getByTestId("fallback")).toHaveStyle("background-color: rgb(255, 0, 0)");
        });

        it("falls back outside a provider", () => {
            render(<Swatch />);
            expect(screen.getByTestId("swatch")).toHaveStyle("background-color: inherit");
        });
    });
});
