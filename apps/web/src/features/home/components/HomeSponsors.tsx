import { ArrowRightRegular, HeartRegular } from "@gamecrafters/base-ui-icons";
import { Card, EmptyState, Heading, LinkButton, Stack } from "@gamecrafters/base-ui/react";

const classes = {
    // The heading is read, the sponsors under it are looked over, so only the heading is held to a
    // measure. It names the section rather than standing at the head of a column of it, so the
    // measure is set in the middle of the width the section is given rather than against its
    // start, and the line is set to the middle with it
    heading: "max-w-[46rem] mx-auto text-center",
    // The sponsors are laid out as many to a line as there is room for and share out whatever is
    // left over, so a line of them ends where the page does rather than raggedly
    grid: "grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-[var(--base-size-16)]",
    // The message is set in the middle of the section and its lines with it, so it is given a
    // measure of its own rather than run out to the width of whatever the page is opened in
    message: "max-w-[46rem] mx-auto",
    // The heart is drawn in the colour a sponsor's heart is drawn in wherever sponsoring is asked
    // for, rather than in the muted one a button gives the mark beside its words. It stands for the
    // thing itself the way a brand's mark does, so it is given the value outright: a token would
    // resolve to one colour under one scheme and another under the other, and a heart that changed
    // colour with the page would no longer be the one being borrowed.
    //
    // It is said to the mark rather than to the button, since what is being coloured is the heart
    // and not the word beside it, and the button hands its visual a colour of its own to be
    // overruled here
    sponsorMark: "[&_.button-leading-visual]:text-[#bf3989]",
};

// What a link leading off the site is opened with. Every sponsor is somewhere other than here, so
// there is no sponsor this is not true of
const externalLinkProps = {
    target: "_blank",
    rel: "noreferrer",
} as const;

// Where a reader who wants to pay for the work is sent, which is the one page that can take the
// money rather than a page of this site saying how it would be taken
const sponsorHref = "https://github.com/sponsors/donaldturinglee";

// A sponsor as the page names them: what they are called, a line saying who they are, and where
// they are to be found
type Sponsor = {
    name: string;
    note: string;
    href: string;
};

// Nobody yet. They are written down here rather than read as the page is opened, which is what the
// figures beside this section are: what sponsors a repository is answered by GitHub's GraphQL API
// alone, and only to a request carrying a key, and a site built to files has nowhere to keep one.
//
// So a sponsor is added by writing one in. Until there is one, the section says so rather than
// being left off the page: a page that names sponsors only once it has them is a page that never
// gets round to asking
const sponsors: Sponsor[] = [];

// Who pays for the work, and the way to be one of them. The library is given away and goes on
// being given away whether or not anyone pays for it, so this is written as an invitation rather
// than as a toll: what a sponsor buys is the time, which is the one thing about it that is not free
const HomeSponsors = () => (
    <Stack gap="normal">
        <Heading as="h2" size="medium" className={classes.heading}>
            Sponsors
        </Heading>
        {sponsors.length ? (
            <div className={classes.grid}>
                {sponsors.map(({ name, note, href }) => (
                    <Card key={href}>
                        <Card.Heading>{name}</Card.Heading>
                        <Card.Description>{note}</Card.Description>
                        {/* A sponsor is named on their own terms, so the way to them leads where
                            they are rather than to a page here written about them */}
                        <Card.Action>
                            <LinkButton
                                href={href}
                                variant="invisible"
                                size="small"
                                trailingVisual={ArrowRightRegular}
                                {...externalLinkProps}
                            >
                                Visit {name}
                            </LinkButton>
                        </Card.Action>
                    </Card>
                ))}
            </div>
        ) : (
            <EmptyState
                className={classes.message}
                title="Nobody sponsors it yet"
                description={""}
                actions={
                    <LinkButton
                        href={sponsorHref}
                        variant="default"
                        size="small"
                        leadingVisual={HeartRegular}
                        className={classes.sponsorMark}
                        {...externalLinkProps}
                    >
                        Sponsor
                    </LinkButton>
                }
            />
        )}
    </Stack>
);

export default HomeSponsors;
