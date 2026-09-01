import * as React from "react";

// Somebody who has written part of it, as the page draws them: the name they are known by where
// the work is kept, the picture that stands beside it, and the way to them
export type Contributor = {
    login: string;
    avatarUrl: string;
    href: string;
};

// The list as the page knows it. One that could not be read is kept apart from one that has yet to
// arrive, since the two are worth drawing differently: the first is said in words, and the second
// with the room the people will take once they are there
export type Contributors =
    { state: "waiting" } | { state: "read"; people: Contributor[] } | { state: "unread" };

// Where the list is read from. It is answered without a key, which is what lets the reader's own
// browser ask for it, and it comes back in the order the page wants it in: whoever has written the
// most of it first. One page of it is asked for and no more, since a landing page naming everyone
// who has ever touched the repository is a landing page of nothing else
const source = "https://api.github.com/repos/donaldturinglee/base-ui/contributors?per_page=24";

// Nothing that comes back is taken on trust: it is written by somebody else's server, so anyone
// missing any of the three things they are drawn from is left out rather than drawn with a hole
// where one of them should have been.
//
// The accounts that open their own pull requests are counted as contributors by the API and are
// not people, so they are left off a section naming people
const readPerson = (entry: unknown): Contributor | undefined => {
    const person = entry as Record<string, unknown> | null | undefined;
    const { login, avatar_url: avatarUrl, html_url: href, type } = person ?? {};

    if (type === "Bot") {
        return undefined;
    }

    if (typeof login !== "string" || typeof avatarUrl !== "string" || typeof href !== "string") {
        return undefined;
    }

    return { login, avatarUrl, href };
};

// A payload that is not a list at all is not a list with nobody in it, so it is left unread rather
// than drawn as an empty section
const readPeople = (payload: unknown) => {
    if (!Array.isArray(payload)) {
        return undefined;
    }

    return payload.map(readPerson).filter((person): person is Contributor => person !== undefined);
};

// Who has written the library, read from GitHub as the page is opened rather than written into it.
// A list written down is a list that was true when it was written, and the one thing certain about
// this one is that it is meant to grow.
//
// A request that fails is not tried again: the reader is told the list could not be read, which is
// worth more than a page that keeps asking
const useContributors = () => {
    const [contributors, setContributors] = React.useState<Contributors>({ state: "waiting" });

    React.useEffect(() => {
        // The request is dropped if the page goes before it is answered, which under the strict
        // checks of development is the first one every time
        const controller = new AbortController();

        const settle = (read: Contributors) => {
            if (!controller.signal.aborted) {
                setContributors(read);
            }
        };

        fetch(source, { signal: controller.signal })
            .then((response) => (response.ok ? response.json() : null))
            .then((payload) => {
                const people = readPeople(payload);

                settle(people === undefined ? { state: "unread" } : { state: "read", people });
            })
            .catch(() => settle({ state: "unread" }));

        return () => controller.abort();
    }, []);

    return contributors;
};

export default useContributors;
