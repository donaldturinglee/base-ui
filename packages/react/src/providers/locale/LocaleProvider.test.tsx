import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { useDirection, useIsRtl } from "../direction";
import {
    LocaleProvider,
    useCollator,
    useDateFormatter,
    useFilter,
    useLocaleContext,
    useNumberFormatter,
} from ".";
import type { LocaleProviderProps } from "./Locale.types";

const root = () => document.querySelector('[data-component="LocaleProvider"]');

// jsdom reports en-US, and the language a browser is set to is not writable, so it is shadowed
// for as long as a suite needs it to say something else
const setBrowserLocale = (locale: string | undefined) => {
    Object.defineProperty(window.navigator, "language", {
        configurable: true,
        value: locale,
    });
};

const Locale = () => {
    const { locale, direction } = useLocaleContext();
    return <span data-testid="locale">{`${locale}-${direction}`}</span>;
};

afterEach(() => {
    Reflect.deleteProperty(window.navigator, "language");
});

describe("LocaleProvider", () => {
    it("is read in en-US by default", () => {
        render(
            <LocaleProvider>
                <Locale />
            </LocaleProvider>,
        );

        expect(root()).toHaveAttribute("lang", "en-US");
        expect(root()).toHaveAttribute("dir", "ltr");
        expect(screen.getByTestId("locale")).toHaveTextContent("en-US-ltr");
    });

    it("reads the subtree in the locale it was given", () => {
        render(
            <LocaleProvider locale="de-DE">
                <Locale />
            </LocaleProvider>,
        );

        expect(root()).toHaveAttribute("lang", "de-DE");
        expect(screen.getByTestId("locale")).toHaveTextContent("de-DE-ltr");
    });

    it("turns the subtree around for a locale read right to left", () => {
        render(
            <LocaleProvider locale="ar-EG">
                <Locale />
            </LocaleProvider>,
        );

        expect(root()).toHaveAttribute("lang", "ar-EG");
        expect(root()).toHaveAttribute("dir", "rtl");
        expect(screen.getByTestId("locale")).toHaveTextContent("ar-EG-rtl");
    });

    it("renders a wrapper the language can hang off", () => {
        render(
            <LocaleProvider className="page">
                <span>Hello</span>
            </LocaleProvider>,
        );

        expect(root()?.tagName).toBe("DIV");
        expect(root()).toHaveClass("page");
    });

    describe("working out the direction", () => {
        it("reads the script a tag spells out rather than the language behind it", () => {
            render(<LocaleProvider locale="ku-Latn-TR" />);
            expect(root()).toHaveAttribute("dir", "ltr");
        });

        it("reads a script the language alone would not have named", () => {
            render(<LocaleProvider locale="az-Arab" />);
            expect(root()).toHaveAttribute("dir", "rtl");
        });
    });

    describe("auto", () => {
        it("follows the locale the browser is set to", () => {
            setBrowserLocale("fr-CA");
            render(
                <LocaleProvider locale="auto">
                    <Locale />
                </LocaleProvider>,
            );

            expect(root()).toHaveAttribute("lang", "fr-CA");
            expect(screen.getByTestId("locale")).toHaveTextContent("fr-CA-ltr");
        });

        it("turns around where the browser is set to read right to left", () => {
            setBrowserLocale("he-IL");
            render(<LocaleProvider locale="auto" />);

            expect(root()).toHaveAttribute("dir", "rtl");
        });

        it("moves when the browser is set to another locale", () => {
            setBrowserLocale("en-GB");
            render(<LocaleProvider locale="auto" />);
            expect(root()).toHaveAttribute("lang", "en-GB");

            setBrowserLocale("ar-EG");
            fireEvent(window, new Event("languagechange"));

            expect(root()).toHaveAttribute("lang", "ar-EG");
            expect(root()).toHaveAttribute("dir", "rtl");
        });

        it("falls back where the browser names no locale at all", () => {
            setBrowserLocale(undefined);
            render(<LocaleProvider locale="auto" />);

            expect(root()).toHaveAttribute("lang", "en-US");
        });

        it("falls back where the browser names one no formatter could read", () => {
            setBrowserLocale("not a locale");
            render(<LocaleProvider locale="auto" />);

            expect(root()).toHaveAttribute("lang", "en-US");
        });
    });

    describe("following the props", () => {
        const app = (props: LocaleProviderProps) => (
            <LocaleProvider {...props}>
                <Locale />
            </LocaleProvider>
        );

        it("moves with the locale", () => {
            const { rerender } = render(app({ locale: "en-US" }));
            expect(root()).toHaveAttribute("lang", "en-US");

            rerender(app({ locale: "ar-EG" }));
            expect(root()).toHaveAttribute("lang", "ar-EG");
            expect(screen.getByTestId("locale")).toHaveTextContent("ar-EG-rtl");
        });
    });

    describe("nested", () => {
        const nested = () => document.querySelectorAll('[data-component="LocaleProvider"]')[1];

        it("inherits the locale from the provider above", () => {
            render(
                <LocaleProvider locale="ar-EG">
                    <LocaleProvider>
                        <Locale />
                    </LocaleProvider>
                </LocaleProvider>,
            );

            expect(nested()).toHaveAttribute("lang", "ar-EG");
            expect(nested()).toHaveAttribute("dir", "rtl");
        });

        it("changes only what it was asked to change", () => {
            render(
                <LocaleProvider locale="ar-EG">
                    <LocaleProvider locale="de-DE">
                        <Locale />
                    </LocaleProvider>
                </LocaleProvider>,
            );

            expect(nested()).toHaveAttribute("lang", "de-DE");
            expect(nested()).toHaveAttribute("dir", "ltr");
        });

        it("hands on the locale that auto settled rather than auto itself", () => {
            setBrowserLocale("he-IL");

            render(
                <LocaleProvider locale="auto">
                    <LocaleProvider>
                        <Locale />
                    </LocaleProvider>
                </LocaleProvider>,
            );

            expect(nested()).toHaveAttribute("lang", "he-IL");
        });
    });

    describe("the reading direction", () => {
        const Direction = () => {
            const direction = useDirection();
            const isRtl = useIsRtl();
            return <span data-testid="direction">{`${direction}-${isRtl}`}</span>;
        };

        it("reaches whatever was already reading it off the direction context", () => {
            render(
                <LocaleProvider locale="ar-EG">
                    <Direction />
                </LocaleProvider>,
            );

            expect(screen.getByTestId("direction")).toHaveTextContent("rtl-true");
        });
    });

    describe("useLocaleContext", () => {
        it("answers with en-US outside a provider", () => {
            render(<Locale />);
            expect(screen.getByTestId("locale")).toHaveTextContent("en-US-ltr");
        });
    });

    describe("useCollator", () => {
        const Sorted = () => {
            const collator = useCollator();
            return <span data-testid="sorted">{["z", "ä"].sort(collator.compare).join("")}</span>;
        };

        it("orders the way the locale reads rather than the way the code points run", () => {
            const { rerender } = render(
                <LocaleProvider locale="de-DE">
                    <Sorted />
                </LocaleProvider>,
            );
            expect(screen.getByTestId("sorted")).toHaveTextContent("äz");

            rerender(
                <LocaleProvider locale="sv-SE">
                    <Sorted />
                </LocaleProvider>,
            );
            expect(screen.getByTestId("sorted")).toHaveTextContent("zä");
        });

        it("takes a locale of its own over the one it is read under", () => {
            const Swedish = () => {
                const collator = useCollator({ locale: "sv-SE" });
                return (
                    <span data-testid="swedish">{["z", "ä"].sort(collator.compare).join("")}</span>
                );
            };

            render(
                <LocaleProvider locale="de-DE">
                    <Swedish />
                </LocaleProvider>,
            );

            expect(screen.getByTestId("swedish")).toHaveTextContent("zä");
        });
    });

    describe("useFilter", () => {
        const Matches = ({ term }: { term: string }) => {
            const { startsWith, endsWith, contains } = useFilter({ sensitivity: "base" });
            const text = "Café Bistro";

            return (
                <span data-testid="matches">
                    {`${startsWith(text, term)}-${endsWith(text, term)}-${contains(text, term)}`}
                </span>
            );
        };

        it("matches text the reader could not easily have typed", () => {
            render(
                <LocaleProvider locale="de-DE">
                    <Matches term="cafe" />
                </LocaleProvider>,
            );

            expect(screen.getByTestId("matches")).toHaveTextContent("true-false-true");
        });

        it("matches the end of the text as readily as the start", () => {
            render(
                <LocaleProvider locale="de-DE">
                    <Matches term="bistro" />
                </LocaleProvider>,
            );

            expect(screen.getByTestId("matches")).toHaveTextContent("false-true-true");
        });

        it("matches everything against an empty term", () => {
            render(
                <LocaleProvider locale="de-DE">
                    <Matches term="" />
                </LocaleProvider>,
            );

            expect(screen.getByTestId("matches")).toHaveTextContent("true-true-true");
        });

        it("hands back the same filter across renders, so it can be held on to", () => {
            const filters: unknown[] = [];

            const Held = () => {
                filters.push(useFilter({ sensitivity: "base" }));
                return null;
            };

            const { rerender } = render(
                <LocaleProvider locale="de-DE">
                    <Held />
                </LocaleProvider>,
            );
            rerender(
                <LocaleProvider locale="de-DE">
                    <Held />
                </LocaleProvider>,
            );

            expect(filters).toHaveLength(2);
            expect(filters[0]).toBe(filters[1]);
        });
    });

    describe("useDateFormatter", () => {
        const Formatted = () => {
            const formatter = useDateFormatter({
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
            });

            return (
                <span data-testid="date">{formatter.format(new Date("2026-08-16T00:00:00Z"))}</span>
            );
        };

        it("spells the date out the way the locale spells it", () => {
            const { rerender } = render(
                <LocaleProvider locale="en-US">
                    <Formatted />
                </LocaleProvider>,
            );
            expect(screen.getByTestId("date")).toHaveTextContent("August 16, 2026");

            rerender(
                <LocaleProvider locale="de-DE">
                    <Formatted />
                </LocaleProvider>,
            );
            expect(screen.getByTestId("date")).toHaveTextContent("16. August 2026");
        });
    });

    describe("useNumberFormatter", () => {
        const Formatted = () => {
            const formatter = useNumberFormatter();
            return <span data-testid="number">{formatter.format(1234.5)}</span>;
        };

        it("groups and separates the way the locale does", () => {
            const { rerender } = render(
                <LocaleProvider locale="en-US">
                    <Formatted />
                </LocaleProvider>,
            );
            expect(screen.getByTestId("number")).toHaveTextContent("1,234.5");

            rerender(
                <LocaleProvider locale="de-DE">
                    <Formatted />
                </LocaleProvider>,
            );
            expect(screen.getByTestId("number")).toHaveTextContent("1.234,5");
        });
    });
});
