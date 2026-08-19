// The colour a label is drawn in is worked out from the one colour it was given, so that
// the text on it stays readable whichever colour that is and whichever theme it is read in.
// The thresholds are the ones the reference design uses

export type IssueLabelPalette = {
    background: string;
    foreground: string;
    border: string;
    // The colour the ring around a picked label is drawn in
    ring: string;
    backgroundHover: string;
};

export type IssueLabelColors = {
    light: IssueLabelPalette;
    dark: IssueLabelPalette;
};

export const DEFAULT_ISSUE_LABEL_FILL_COLOR = "#999999";

// Above this the colour is light enough to want black text on it rather than white
const LIGHT_THRESHOLD = 0.453;

// A darker theme lightens the text instead, up to this point
const DARK_THRESHOLD = 0.6;

// Only a colour this close to white is given a border, since anything darker already stands
// apart from what it is drawn on
const BORDER_THRESHOLD = 0.96;

type Rgb = { r: number; g: number; b: number };

type Hsl = { h: number; s: number; l: number };

const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(value, high));

// A colour worked out from another one can be asked for more lightness than there is, so it
// is held to what a lightness can be rather than left for the browser to hold
const clampLightness = (value: number) => clamp(Math.round(value), 0, 100);

// Only the forms a fill colour is written in are read: three or six digit hex, and `rgb()`
const parseRgb = (color: string): Rgb | null => {
    const value = color.trim();

    if (value.startsWith("#")) {
        const digits = value.slice(1);

        if (digits.length === 3) {
            const [r, g, b] = [...digits].map((digit) => parseInt(digit + digit, 16));
            return Number.isNaN(r + g + b) ? null : { r, g, b };
        }

        if (digits.length === 6) {
            const r = parseInt(digits.slice(0, 2), 16);
            const g = parseInt(digits.slice(2, 4), 16);
            const b = parseInt(digits.slice(4, 6), 16);
            return Number.isNaN(r + g + b) ? null : { r, g, b };
        }

        return null;
    }

    const parts = value.match(/^rgba?\(([^)]+)\)$/i);

    if (!parts) {
        return null;
    }

    const numbers = parts[1]
        .split(/[\s,/]+/)
        .filter(Boolean)
        .map(Number);

    if (numbers.length < 3 || numbers.slice(0, 3).some(Number.isNaN)) {
        return null;
    }

    const [r, g, b] = numbers;
    return { r, g, b };
};

const toHsl = ({ r, g, b }: Rgb): Hsl => {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const range = max - min;
    const lightness = (max + min) / 2;

    if (range === 0) {
        return { h: 0, s: 0, l: Math.round(lightness * 100) };
    }

    const saturation = range / (1 - Math.abs(2 * lightness - 1));

    let hue: number;

    if (max === red) {
        hue = ((green - blue) / range) % 6;
    } else if (max === green) {
        hue = (blue - red) / range + 2;
    } else {
        hue = (red - green) / range + 4;
    }

    hue = Math.round(hue * 60);

    return {
        h: hue < 0 ? hue + 360 : hue,
        s: Math.round(saturation * 100),
        l: Math.round(lightness * 100),
    };
};

// How light the colour reads to the eye rather than how light it is on paper, which is what
// decides whether the text standing on it is black or white
const getPerceivedLightness = ({ r, g, b }: Rgb) => (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;

// Works out every colour a label is drawn in, for both themes at once, so that the one it is
// read in is left to CSS rather than worked out here
export const getIssueLabelColors = (fillColor: string): IssueLabelColors => {
    const rgb = parseRgb(fillColor) ?? (parseRgb(DEFAULT_ISSUE_LABEL_FILL_COLOR) as Rgb);
    const { h, s, l } = toHsl(rgb);
    const perceivedLightness = getPerceivedLightness(rgb);

    const { r, g, b } = rgb;

    // A colour light enough to read black text on gets black text, and everything else gets
    // white
    const lightnessSwitch = clamp(1 / (LIGHT_THRESHOLD - perceivedLightness), 0, 1);
    const borderAlpha = clamp((perceivedLightness - BORDER_THRESHOLD) * 100, 0, 1);
    // A dark theme lightens the text until it stands clear of what it is drawn on
    const lightenBy =
        (DARK_THRESHOLD - perceivedLightness) *
        100 *
        clamp(1 / (DARK_THRESHOLD - perceivedLightness), 0, 1);
    const darkLightness = clampLightness(l + lightenBy);

    return {
        light: {
            background: `rgb(${r}, ${g}, ${b})`,
            foreground: `hsl(0deg, 0%, ${Math.round(lightnessSwitch * 100)}%)`,
            border: `hsla(${h}deg, ${s}%, ${clampLightness(l - 25)}%, ${borderAlpha})`,
            ring: `rgb(${r}, ${g}, ${b})`,
            backgroundHover: `hsl(${h}deg, ${s}%, ${clampLightness(l - 5)}%)`,
        },
        dark: {
            background: `rgba(${r}, ${g}, ${b}, 0.18)`,
            foreground: `hsl(${h}deg, ${s}%, ${darkLightness}%)`,
            border: `hsla(${h}deg, ${s}%, ${darkLightness}%, 0.3)`,
            ring: `hsl(${h}deg, ${s}%, ${darkLightness}%)`,
            backgroundHover: `hsla(${h}deg, ${s}%, ${clampLightness(l + 10)}%, 0.3)`,
        },
    };
};
