import { Link as RouterLink } from "react-router";
import { Link, Stack, Text } from "@gamecrafters/base-ui/react";

const classes = {
    // The ways out are laid out as many to a line as there is room for and fold onto the next as
    // the page narrows, since a row of them run past the end of the page would be reached by
    // scrolling after it rather than read where it stands
    links: "flex flex-wrap items-center gap-[var(--base-size-24)]",
    // The line the page closes on is said quietly and last: it is the one thing at the foot of the
    // page that is not a way anywhere, so it is drawn in the quieter of the two colours
    copyrightNotice: "text-[var(--foreground-color-muted)]",
};

// What a link leading off the site is opened with. One that stays on it is left to the router, so
// there is nothing to say about it here
const externalLinkProps = {
    target: "_blank",
    rel: "noreferrer",
} as const;

// Somewhere the page can be left for once it has been read to the end
type FooterLink = {
    label: string;
    href: string;
    external?: boolean;
};

// Where a reader goes from here: the rest of the site first, then the two places the library
// itself is kept and talked about. A reader who has read to the foot of the page has finished with
// what it had to say, so what stands here is the way on rather than any one of the things the page
// happened to be about
const links: FooterLink[] = [
    { label: "Docs", href: "/overview/installation" },
    { label: "GitHub", href: "https://github.com/donaldturinglee/base-ui", external: true },
    { label: "Discord", href: "https://discord.gg/YsteKRjrSH", external: true },
];

// The line the page closes on. It names the project the library is published under, which is the
// name the package is scoped to and the one the page opens by naming. The LICENSE at the root of
// the repository names the person holding the copyright instead, so the two are not the one
// statement written twice and a change to either is not a change to the other
const copyrightNotice = "Copyright © 2026 GameCrafters.";

// One way out. A link that stays on the site is followed by the router rather than by the browser,
// so the page it leads to is drawn in place of the one being read and the row across the top is
// left where it is. One that leads off the site is an ordinary anchor, since there is nothing for
// the router to draw at the other end of it.
//
// The two are written out separately rather than as one link handed different props, since what a
// link is drawn as decides which props it takes and a single one would have to be both
const renderLink = ({ label, href, external }: FooterLink) =>
    external ? (
        <Link key={href} href={href} muted {...externalLinkProps}>
            {label}
        </Link>
    ) : (
        <Link key={href} as={RouterLink} to={href} muted>
            {label}
        </Link>
    );

// The foot of the page: where it can be left for, and what it is all given under. It closes what
// the page has been saying rather than adding to it, and is set apart from the last section by
// the room the page puts between every one of them, which is the whole of what says one has been
// finished with and the next begun.
//
// The two things it holds stand on one line rather than one under the other, since neither of them
// is read at length: the line the page closes on is held to the start of it, under the name the row
// across the top opens with, and the ways out to the end, under the controls that row closes on.
// They fall one under the other only on a page with no room for both, which is the only way either
// of them would have to be cut short.
//
// It is this page's foot rather than the site's, since it is drawn inside the region the layout
// gives a page to be read in and the row across the top is the only thing standing around every
// page. That region is the page's `main`, and a `footer` inside one is still read as the content
// information of the page, so it is announced from within the region it stands in rather than
// beside it. A foot that stood under every page would be the layout's rather than this one's, and
// would be written beside the row across the top, where it would be announced beside `main`
const HomeFooter = () => (
    <Stack
        as="footer"
        direction="horizontal"
        gap="normal"
        align="center"
        justify="space-between"
        wrap="wrap"
    >
        <Text as="p" size="small" className={classes.copyrightNotice}>
            {copyrightNotice}
        </Text>
        <div className={classes.links}>{links.map(renderLink)}</div>
    </Stack>
);

export default HomeFooter;
