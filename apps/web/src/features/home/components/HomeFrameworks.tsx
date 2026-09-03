import { Card, Heading, Image, Stack } from "@gamecrafters/base-ui/react";
import nextLogo from "../../../assets/brands/Next.js.svg";
import viteLogo from "../../../assets/brands/Vite.js.svg";

const classes = {
    // The heading is read, the frameworks under it are looked over, so only the heading is held to
    // a measure. What it stands over runs the whole width of the page rather than the one column
    // its measure would sit at the head of, so the measure is set in the middle of that width
    // rather than against its start, and the line is set to the middle with it
    heading: "max-w-[46rem] mx-auto text-center",
    // The frameworks are laid out as many to a line as there is room for, and the line stands in
    // the middle of the page. A square tile is the size it is rather than the size the page has
    // left, so there is nothing for the row to share out and a row that ended short of the page
    // would otherwise sit off to one side of it. They are set apart by the step the page sets its
    // other rows of cards apart by, since that is what they are read as
    grid: "grid grid-cols-[repeat(auto-fit,8rem)] justify-center gap-[var(--base-size-16)]",
    // The card is as tall as it is wide. What stands in it is one mark and nothing else, so it is
    // set in the middle of that square both ways rather than at the head of it, since a mark held
    // to one corner of a square card is a card with a hole beside it.
    //
    // The two ways are not asked for the same way round. Down the card there is height left over
    // once the one row has been given what it stands in, so it is that leftover the row is set in
    // the middle of. Across the card there is nothing left over: the card lays itself out in one
    // track that runs its whole width, so what is set in the middle is the mark within that track
    // rather than the track within the card
    card: "aspect-square content-center justify-items-center",
    // The mark is drawn at the size a card draws the icon it puts at its head. Where it stands is
    // the card's business rather than its own, so nothing is said about that here
    logo: "size-[var(--base-size-32)]",
    // A mark of one colour is drawn in black, and a picture carries its colours in with it rather
    // than taking them from the page, so under the dark scheme it would be a black mark on a ground
    // very nearly as dark. It is turned over there instead, which reads as white: a mark of one
    // colour comes through that and a mark of several would come through it wrong
    monochromeLogo: "size-[var(--base-size-32)] [[data-theme=dark]_&]:invert",
};

// Where the library has been put to work. Each of them stands as its own mark and nothing else,
// since a framework is known by its mark long before its name is read, and naming the two it has
// been built under is not a list of the ones that are allowed: what draws React draws this.
//
// The name is still written down, since a mark is a picture and a picture has to say in words what
// it is a picture of. Whether the mark is drawn in one colour is written down with it, since that
// is what decides whether it can be turned over to be read under the dark scheme
const frameworks = [
    {
        name: "Vite",
        logo: viteLogo,
    },
    {
        name: "Next.js",
        logo: nextLogo,
        monochrome: true,
    },
];

// Where an application built on the library can be built. The library is a set of components and
// a stylesheet rather than an application of its own, so what draws it is the application's
// business: it asks for React, and asks the framework around it for nothing at all
const HomeFrameworks = () => (
    <Stack gap="normal">
        <Heading as="h2" size="medium" className={classes.heading}>
            Works with your favourite application framework
        </Heading>
        <div className={classes.grid}>
            {frameworks.map(({ name, logo, monochrome }) => (
                <Card key={name} className={classes.card}>
                    {/* The card is given its children rather than its parts, since what stands in
                        it is somebody else's mark and not the icon a card would draw on a tile of
                        its own.

                        The mark stands in place of the name rather than over it, so it is what a
                        reader is told the framework by and is given the name to say: a picture
                        left decorative here would leave the card saying nothing at all */}
                    <Image
                        src={logo}
                        alt={name}
                        fit="contain"
                        className={monochrome ? classes.monochromeLogo : classes.logo}
                    />
                </Card>
            ))}
        </div>
    </Stack>
);

export default HomeFrameworks;
