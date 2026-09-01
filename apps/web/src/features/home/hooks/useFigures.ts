import * as React from "react";

// A figure as the page knows it. One that could not be read is kept apart from one that has yet
// to arrive, since the two are worth drawing differently: the first is answered with a dash, and
// the second with the room the figure will take once it is there
export type Figure = { state: "waiting" } | { state: "read"; value: number } | { state: "unread" };

// Which figure is which, so a card asks for the one it names rather than the one that happens to
// have come back first
export type FigureId = "downloads" | "stars" | "members";

// Where each figure is read from, and the field it is read out of. Every one of them is answered
// without a key, which is what lets the reader's own browser ask for it: a figure that needed one
// would need somewhere to keep it, and a site built to files has nowhere to keep anything.
//
// The downloads are the last month rather than the week, which is the figure a package is usually
// spoken of by. The members are read off the invite the repository gives out rather than off the
// server itself, since that is the one way in the server is named by
const sources: { id: FigureId; url: string; field: string }[] = [
    {
        id: "downloads",
        url: "https://api.npmjs.org/downloads/point/last-month/@gamecrafters/base-ui",
        field: "downloads",
    },
    {
        id: "stars",
        url: "https://api.github.com/repos/donaldturinglee/base-ui",
        field: "stargazers_count",
    },
    {
        id: "members",
        url: "https://discord.com/api/v10/invites/YsteKRjrSH?with_counts=true",
        field: "approximate_member_count",
    },
];

// Nothing that comes back is taken on trust: it is written by somebody else's server, and a field
// that is missing, or is there but is not a number, leaves the figure unread rather than being
// drawn as whatever it happened to be
const readNumber = (payload: unknown, field: string) => {
    const value = (payload as Record<string, unknown> | null | undefined)?.[field];

    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
};

const waiting: Record<FigureId, Figure> = {
    downloads: { state: "waiting" },
    stars: { state: "waiting" },
    members: { state: "waiting" },
};

// The three figures the band shows, read from npm, GitHub and Discord as the page is opened. They
// are asked for rather than written down, since a number written into the page is a number that
// was true when it was written and is read long afterwards.
//
// Each is asked for on its own and drawn as it arrives, so one server being slow holds up its own
// figure rather than the other two. A request that fails is not tried again: the reader is told
// the figure could not be read, which is worth more than a page that keeps asking
const useFigures = () => {
    const [figures, setFigures] = React.useState(waiting);

    React.useEffect(() => {
        // The requests are dropped if the page goes before they are answered, which under the
        // strict checks of development is every one of them the first time round
        const controller = new AbortController();

        const settle = (id: FigureId, figure: Figure) => {
            if (!controller.signal.aborted) {
                setFigures((current) => ({ ...current, [id]: figure }));
            }
        };

        for (const { id, url, field } of sources) {
            fetch(url, { signal: controller.signal })
                .then((response) => (response.ok ? response.json() : null))
                .then((payload) => {
                    const value = readNumber(payload, field);

                    settle(
                        id,
                        value === undefined ? { state: "unread" } : { state: "read", value },
                    );
                })
                .catch(() => settle(id, { state: "unread" }));
        }

        return () => controller.abort();
    }, []);

    return figures;
};

export default useFigures;
