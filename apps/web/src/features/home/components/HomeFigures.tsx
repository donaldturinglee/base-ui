import type { ElementType } from "react";
import { ArrowDownloadRegular, PeopleRegular, StarRegular } from "@gamecrafters/base-ui-icons";
import {
    FormatNumber,
    Heading,
    SkeletonText,
    Stack,
    StatisticCard,
} from "@gamecrafters/base-ui/react";
import { useFigures } from "../hooks";
import type { Figure, FigureId } from "../hooks";

const classes = {
    // The heading is read, the figures under it are looked at, so only the heading is held to a
    // measure. It names the section rather than standing at the head of a column of it, so the
    // measure is set in the middle of the width the section is given rather than against its
    // start, and the line is set to the middle with it
    heading: "max-w-[46rem] mx-auto text-center",
    // Three figures, laid out as many to a line as there is room for. They are read across as one
    // row on a page wide enough for it and fold to a column on one that is not
    grid: "grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-[var(--base-size-16)]",
    // The figure is set in the middle of the room the words are given rather than against the
    // start of it. It is the one thing on the card drawn large, so where it stands is where the
    // card is read from, and the middle is where the eye goes first
    value: "mx-auto",
    // The bar standing in for the figure is drawn to a width of its own rather than left to fill
    // what holds it. What holds it is the figure's own place, which is only as wide as the figure
    // now that it is set in the middle rather than run across the card, so a bar asked to fill it
    // would be given nothing to fill and would not be seen at all
    placeholder: "w-[4rem]",
    // The mark now stands on the line with the words rather than at the end of the row, so the
    // two are laid out across and set against each other's middles, and the room between them is
    // the least step the scale gives.
    //
    // What is written there says what the figure is counted in rather than where it was counted,
    // so it is read with the figure rather than after it: the pair are set to the middle of the
    // room the words are given, under a figure that is set to the middle of it as well
    description: "flex items-center justify-center gap-[var(--base-size-4)]",
};

// How a figure is written: grouped in thousands and shortened past them, so a number that grows
// by an order is still read at a glance rather than counted across
const format = { notation: "compact", maximumFractionDigits: 1 } as const;

// What stands where the figure will be until it arrives, which is the height and roughly the
// width the figure itself takes. A row that grew as each number landed would move what the reader
// was already looking at
const placeholder = <SkeletonText size="titleLarge" className={classes.placeholder} />;

// What is said where a figure could not be read at all. It is a dash rather than a nought, since
// nought is a figure and this is the absence of one
const unread = "—";

// The mark is drawn to the height of the small text it now stands on the line with, rather than to
// the size the card drew it at when it stood on its own at the end of the row
const iconSize = 16;

// The three figures, in the order they are read across: how often the package is taken, how many
// have marked the repository, and how many are in the room where it is talked about
const figures: { id: FigureId; label: string; description: string; icon: ElementType }[] = [
    {
        id: "downloads",
        label: "",
        description: "downloads / month",
        icon: ArrowDownloadRegular,
    },
    {
        id: "stars",
        label: "",
        description: "GitHub stars",
        icon: StarRegular,
    },
    {
        id: "members",
        label: "",
        description: "Discord members",
        icon: PeopleRegular,
    },
];

// What stands in the card: the figure where it has been read, the room it will take where it has
// yet to arrive, and a dash where it could not be read at all
const renderValue = (figure: Figure) => {
    if (figure.state === "waiting") {
        return placeholder;
    }

    if (figure.state === "unread") {
        return unread;
    }

    return <FormatNumber value={figure.value} format={format} />;
};

// How far the library has got, in the three numbers that are counted somewhere other than here.
// They are read from npm, GitHub and Discord as the page is opened rather than written into it,
// so the page says what is true of it at the time it is read: a figure written down is a figure
// that was true once, and a page that has to be edited to stay true is a page that will not be
const HomeFigures = () => {
    const read = useFigures();

    return (
        <Stack gap="normal">
            <Heading as="h2" size="medium" className={classes.heading}>
                Built for developers
            </Heading>
            <div className={classes.grid}>
                {figures.map(({ id, label, description, icon: Icon }) => (
                    <StatisticCard key={id}>
                        {/* The card is named after the line naming the figure, and a line with
                            nothing written on it names nothing: a label left standing empty would
                            leave the card grouped under a name it has not got. It is left out
                            instead, so the card is read as the parts it holds rather than as a
                            group with nothing to call it by */}
                        {label ? <StatisticCard.Label>{label}</StatisticCard.Label> : null}
                        <StatisticCard.Value className={classes.value}>
                            {renderValue(read[id])}
                        </StatisticCard.Value>
                        {/* The mark stands on the line with the words rather than at the end of
                            the row, so what is being counted is said in the one place by the two
                            of them together. The words say it, so the mark says nothing a reader
                            would not already have been told and is kept out of the way of one
                            being read to */}
                        <StatisticCard.Description className={classes.description}>
                            <Icon size={iconSize} aria-hidden />
                            {description}
                        </StatisticCard.Description>
                    </StatisticCard>
                ))}
            </div>
        </Stack>
    );
};

export default HomeFigures;
