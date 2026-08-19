import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { encodeQR } from "../../lib/qr-code/core/index";
import { renderQRCodeSVG } from "../../lib/qr-code/utilities/svg";
import { QRCode } from ".";
import type { QRCodeDotType } from "./QRCode.types";

// A code that could not be made draws no picture, and so claims no picture role either. The root
// is found by what it is rather than by what it stands as, so both are read the same way here
const code = () => document.querySelector<HTMLElement>("[data-component='QRCode']")!;

const canvas = () => code().querySelector("svg");

const background = () => code().querySelector(".qr-code-background");

const modules = () => code().querySelector(".qr-code-modules");

const corners = () => code().querySelectorAll(".qr-code-corner");

const logo = () => code().querySelector(".qr-code-logo");

const fallback = () => code().querySelector(".qr-code-fallback");

// The step the code is drawn at, read off the first square in the path. A code holding more
// modules is drawn at a smaller step, which is how the version it was encoded at can be told
// from the outside
const moduleStep = () => {
    const [, step] = /h([\d.]+)v/.exec(modules()?.getAttribute("d") ?? "") ?? [];
    return Number(step);
};

describe("QRCode", () => {
    it("renders a div element", () => {
        render(<QRCode value="https://example.com" />);
        expect(code().tagName).toBe("DIV");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<QRCode value="https://example.com" />);
        expect(code()).toHaveAttribute("data-component", "QRCode");
    });

    it("exposes an img role for assistive technology", () => {
        render(<QRCode value="https://example.com" />);
        expect(screen.getByRole("img")).toBe(code());
    });

    it("claims no img role where there is no picture to stand for", () => {
        render(<QRCode value="" />);
        expect(screen.queryByRole("img")).toBeNull();
    });

    it("names the code by its value, since a reader cannot point a camera at it", () => {
        render(<QRCode value="https://example.com" />);
        expect(code()).toHaveAttribute("aria-label", "https://example.com");
    });

    it("lets a label win over the value as the accessible name", () => {
        render(<QRCode value="https://example.com" label="Scan to open your ticket" />);
        expect(code()).toHaveAttribute("aria-label", "Scan to open your ticket");
    });

    it("keeps the drawing from a screen reader, since the root already names it", () => {
        render(<QRCode value="https://example.com" />);
        expect(canvas()).toHaveAttribute("aria-hidden", "true");
    });

    it("keeps the drawing out of the tab order", () => {
        render(<QRCode value="https://example.com" />);
        expect(canvas()).toHaveAttribute("focusable", "false");
    });

    it("draws the modules as a single path", () => {
        render(<QRCode value="https://example.com" />);
        expect(modules()).toBeInTheDocument();
        expect(modules()?.getAttribute("d")).toMatch(/^M/);
    });

    it("lays the modules where the library's own renderer would lay them", () => {
        // The component draws the code as React elements rather than as the string the library
        // writes, so what holds the two together is that the modules land in the same places.
        // A drift in either would show here rather than in a code that quietly stopped scanning
        const value = "https://example.com";
        const options = { size: 200, margin: 4, dotType: "rounded" as const, dotSize: 0.9 };
        const [, expected] =
            /<path d="([^"]+)"/.exec(renderQRCodeSVG(encodeQR(value), options)) ?? [];

        render(<QRCode value={value} {...options} />);
        expect(modules()?.getAttribute("d")).toBe(expected);
    });

    it("draws the same code for the same value", () => {
        const { unmount } = render(<QRCode value="https://example.com" mask={0} />);
        const first = modules()?.getAttribute("d");
        unmount();

        render(<QRCode value="https://example.com" mask={0} />);
        expect(modules()?.getAttribute("d")).toBe(first);
    });

    it("draws a different code for a different value", () => {
        const { unmount } = render(<QRCode value="https://example.com" mask={0} />);
        const first = modules()?.getAttribute("d");
        unmount();

        render(<QRCode value="https://example.org" mask={0} />);
        expect(modules()?.getAttribute("d")).not.toBe(first);
    });

    it("draws a larger code at a higher error correction level, for the same value", () => {
        const { unmount } = render(<QRCode value="https://example.com" ecLevel="L" mask={0} />);
        const sparse = modules()?.getAttribute("d")?.length ?? 0;
        unmount();

        render(<QRCode value="https://example.com" ecLevel="H" mask={0} />);
        expect(modules()?.getAttribute("d")?.length ?? 0).toBeGreaterThan(sparse);
    });

    it("falls back to a size of two hundred", () => {
        render(<QRCode value="https://example.com" />);
        expect(canvas()).toHaveAttribute("width", "200");
        expect(canvas()).toHaveAttribute("height", "200");
        expect(canvas()).toHaveAttribute("viewBox", "0 0 200 200");
    });

    it("respects the size prop", () => {
        render(<QRCode value="https://example.com" size={320} />);
        expect(canvas()).toHaveAttribute("width", "320");
        expect(canvas()).toHaveAttribute("height", "320");
        expect(canvas()).toHaveAttribute("viewBox", "0 0 320 320");
    });

    it("lays a quiet zone around the code, so the first module is held off the edge", () => {
        render(<QRCode value="https://example.com" size={200} margin={4} />);
        const [, x] = /^M([\d.]+),([\d.]+)/.exec(modules()?.getAttribute("d") ?? "") ?? [];
        expect(Number(x)).toBeGreaterThan(0);
    });

    it("gives the quiet zone back when the margin is taken away", () => {
        render(<QRCode value="https://example.com" margin={0} />);
        const [, x, y] = /^M([\d.]+),([\d.]+)/.exec(modules()?.getAttribute("d") ?? "") ?? [];
        expect(Number(x)).toBe(0);
        expect(Number(y)).toBe(0);
    });

    it("paints the quiet zone across the whole of the drawing", () => {
        render(<QRCode value="https://example.com" />);
        expect(background()).toHaveAttribute("width", "100%");
        expect(background()).toHaveAttribute("height", "100%");
    });

    it("falls back to square modules", () => {
        render(<QRCode value="https://example.com" />);
        expect(code()).toHaveAttribute("data-dot-type", "square");
    });

    it("respects the dotType prop", () => {
        const dotTypes: QRCodeDotType[] = [
            "square",
            "rounded",
            "dots",
            "diamond",
            "classy",
            "classy-rounded",
            "extra-rounded",
            "vertical-line",
            "horizontal-line",
            "small-square",
            "tiny-square",
        ];

        for (const dotType of dotTypes) {
            const { unmount } = render(<QRCode value="https://example.com" dotType={dotType} />);
            expect(code()).toHaveAttribute("data-dot-type", dotType);
            expect(modules()).toBeInTheDocument();
            unmount();
        }
    });

    it("draws the corners as modules when none are asked for", () => {
        render(<QRCode value="https://example.com" />);
        expect(corners()).toHaveLength(0);
    });

    it("draws an outer and an inner shape for each of the three corners", () => {
        render(
            <QRCode value="https://example.com" corners={{ topLeft: { outerShape: "dots" } }} />,
        );
        expect(corners()).toHaveLength(6);
    });

    it("cuts the hole through the outer corner shape rather than painting over it", () => {
        render(<QRCode value="https://example.com" corners={{ topLeft: {} }} />);
        expect(corners()[0]).toHaveAttribute("fill-rule", "evenodd");
    });

    it("paints a corner the colour it was given", () => {
        render(
            <QRCode
                value="https://example.com"
                corners={{ topLeft: { outerColor: "#0969da", innerColor: "#1a7f37" } }}
            />,
        );
        expect(corners()[0]).toHaveStyle({ fill: "#0969da" });
        expect(corners()[1]).toHaveStyle({ fill: "#1a7f37" });
    });

    it("leaves an uncoloured corner to the colour the modules take", () => {
        render(<QRCode value="https://example.com" corners={{ topLeft: {} }} />);
        expect(corners()[0]).not.toHaveAttribute("style", expect.stringContaining("fill"));
    });

    it("leaves the modules under the corners out, so the two are not laid on one another", () => {
        const { unmount } = render(<QRCode value="https://example.com" mask={0} />);
        const whole = modules()?.getAttribute("d")?.length ?? 0;
        unmount();

        render(<QRCode value="https://example.com" mask={0} corners={{ topLeft: {} }} />);
        expect(modules()?.getAttribute("d")?.length ?? 0).toBeLessThan(whole);
    });

    it("paints the modules and the quiet zone from the colours it was given", () => {
        render(<QRCode value="https://example.com" color="#0969da" background="#eff6ff" />);
        expect(code()).toHaveStyle({ "--qr-code-color": "#0969da" });
        expect(code()).toHaveStyle({ "--qr-code-background": "#eff6ff" });
    });

    it("draws no logo when none is given", () => {
        render(<QRCode value="https://example.com" />);
        expect(logo()).toBeNull();
    });

    it("lays a logo over the middle of the code", () => {
        render(<QRCode value="https://example.com" logo={<span>Logo</span>} />);
        expect(logo()).toHaveTextContent("Logo");
    });

    it("keeps the logo from a screen reader, since the root already names the code", () => {
        render(<QRCode value="https://example.com" logo={<span>Logo</span>} />);
        expect(logo()).toHaveAttribute("aria-hidden", "true");
    });

    it("gives the logo the share of the box its share of the code comes to", () => {
        render(<QRCode value="https://example.com" logo={<span>Logo</span>} logoSize={0.3} />);
        // A code of 25 modules in a box of 33 is three quarters of what is drawn, so a logo over
        // three tenths of the code covers rather less of the box than that
        expect(code().getAttribute("style")).toMatch(/--qr-code-logo-size:\s*2[0-9.]+%/);
    });

    it("leaves the modules the logo covers out of the code", () => {
        const { unmount } = render(<QRCode value="https://example.com" ecLevel="H" mask={0} />);
        const whole = modules()?.getAttribute("d")?.length ?? 0;
        unmount();

        render(<QRCode value="https://example.com" mask={0} logo={<span>Logo</span>} />);
        expect(modules()?.getAttribute("d")?.length ?? 0).toBeLessThan(whole);
    });

    it("raises a code carrying a logo to the most error correction it can hold", () => {
        // The logo hides modules of its own, so the two codes cannot be counted module for
        // module. The step they are drawn at is what gives the version away, and a code raised
        // to H needs a larger version to hold the same value than the default level does
        const { unmount } = render(<QRCode value="https://example.com" ecLevel="H" />);
        const highest = moduleStep();
        unmount();

        const withoutLogo = render(<QRCode value="https://example.com" />);
        expect(moduleStep()).toBeGreaterThan(highest);
        withoutLogo.unmount();

        render(<QRCode value="https://example.com" logo={<span>Logo</span>} />);
        expect(moduleStep()).toBe(highest);
    });

    it("leaves an error correction level asked for by name alone", () => {
        const { unmount } = render(<QRCode value="https://example.com" ecLevel="L" />);
        const lowest = moduleStep();
        unmount();

        render(<QRCode value="https://example.com" ecLevel="L" logo={<span>Logo</span>} />);
        expect(moduleStep()).toBe(lowest);
    });

    it("draws nothing where there is nothing to encode", () => {
        render(<QRCode value="" />);
        expect(canvas()).toBeNull();
        expect(code()).toHaveAttribute("data-empty", "true");
    });

    it("stands a fallback in place of a code that could not be made", () => {
        render(<QRCode value="" fallback="Nothing to encode" />);
        expect(fallback()).toHaveTextContent("Nothing to encode");
    });

    it("stands a fallback in rather than throwing when the data will not fit", () => {
        render(
            <QRCode
                value={"the quick brown fox jumps over the lazy dog ".repeat(4)}
                version={1}
                fallback="Too much data"
            />,
        );
        expect(canvas()).toBeNull();
        expect(fallback()).toHaveTextContent("Too much data");
    });

    it("draws a code for data the version it was given can hold", () => {
        render(<QRCode value="https://example.com" version={10} />);
        expect(modules()).toBeInTheDocument();
    });

    it("does not leak the drawing props onto the element", () => {
        render(
            <QRCode
                value="https://example.com"
                size={120}
                margin={2}
                dotType="dots"
                dotSize={0.8}
                logoSize={0.2}
            />,
        );
        expect(code()).not.toHaveAttribute("value");
        expect(code()).not.toHaveAttribute("size");
        expect(code()).not.toHaveAttribute("margin");
        expect(code()).not.toHaveAttribute("dotSize");
        expect(code()).not.toHaveAttribute("logoSize");
    });

    it("keeps a style passed in alongside the ones it paints the code with", () => {
        render(<QRCode value="https://example.com" color="#0969da" style={{ opacity: 0.5 }} />);
        expect(code()).toHaveStyle({ opacity: "0.5" });
        expect(code()).toHaveStyle({ "--qr-code-color": "#0969da" });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<QRCode ref={ref} value="https://example.com" />);
        expect(ref.current).toBe(code());
    });

    it("forwards a ref to the root element where there is nothing to encode", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<QRCode ref={ref} value="" />);
        expect(ref.current).toBe(code());
    });

    it("merges a custom className onto the root element", () => {
        render(<QRCode className="custom" value="https://example.com" />);
        expect(code()).toHaveClass("qr-code", "custom");
    });

    it("passes extra props onto the root element", () => {
        render(<QRCode id="pairing-code" value="https://example.com" />);
        expect(code()).toHaveAttribute("id", "pairing-code");
    });
});
