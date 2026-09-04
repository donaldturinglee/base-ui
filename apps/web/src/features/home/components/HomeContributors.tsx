import { ArrowRightRegular, PeopleCommunityRegular } from "@gamecrafters/base-ui-icons";
import {
    Avatar,
    Button,
    EmptyState,
    Heading,
    Link,
    SkeletonAvatar,
    Stack,
} from "@gamecrafters/base-ui/react";
import { useContributors } from "../hooks";
import type { Contributor, Contributors } from "../hooks";

const classes = {
    // The heading is read, the people under it are looked over, so only the heading is held to a
    // measure. It names the section rather than standing at the head of a column of it, so the
    // measure is set in the middle of the width the section is given rather than against its
    // start, and the line is set to the middle with it
    heading: "max-w-[46rem] mx-auto text-center",
    // The people are laid out as many to a line as there is room for and fold onto the next as the
    // page narrows, since a row of pictures is looked across rather than counted down
    people: "flex flex-wrap gap-[var(--base-size-16)]",
    // The link is a picture and nothing else, so it is laid out as a box rather than as a run of
    // text: an anchor left inline would stand its picture on a baseline and keep the room under it
    // that letters are descended into, which a row of them would sit above rather than in
    person: "inline-flex",
    // The message is set in the middle of the section and its lines with it, so it is given a
    // measure of its own rather than run out to the width of whatever the page is opened in
    message: "max-w-[46rem] mx-auto",
};

// What a link leading off the site is opened with. Everyone named is somewhere other than here, so
// there is nobody this is not true of
const externalLinkProps = {
    target: "_blank",
    rel: "noreferrer",
} as const;

// Where the whole list is kept, which is where a reader is sent when the page cannot read it
const contributorsHref = "https://github.com/donaldturinglee/base-ui/graphs/contributors";

// The picture is drawn at the size a row of them is looked over at rather than at the size a face
// is looked at, since what is being shown is how many have written the library and not a portrait
// of any of them
const avatarSize = 32;

// How many stand in for the people until they arrive. How many are coming is not known before they
// are here, so this is a guess at the room they will take rather than a count of them
const placeholderCount = 4;

// What stands where the people will be until they arrive. A row that grew out of nothing as each
// of them landed would move what the reader was already looking at
const placeholder = (
    <div className={classes.people}>
        {Array.from({ length: placeholderCount }, (_, slot) => (
            <SkeletonAvatar key={slot} size={avatarSize} />
        ))}
    </div>
);

// What is said where nobody could be read. The list is kept on the repository rather than here, so
// the way to it is given instead of the page insisting there is nobody
const unread = (
    <EmptyState
        className={classes.message}
        icon={PeopleCommunityRegular}
        title="Nobody came back from GitHub just now"
        description="The list is kept on the repository, where it can be read instead."
        actions={
            <Button
                as="a"
                href={contributorsHref}
                variant="invisible"
                size="small"
                trailingVisual={ArrowRightRegular}
                {...externalLinkProps}
            >
                Read it on GitHub
            </Button>
        }
    />
);

// One person: the picture, and nothing standing beside it. Nothing else says who it is now, so the
// picture is given the name to say rather than left decorative — a link holding one decorative
// picture is a link with nothing to announce.
//
// The letters stand in the picture's place where it has yet to arrive and keep it where it never
// does, and they carry the name in their turn. Only one of the two is ever in the page, so the name
// is said once however far the picture has got
const renderPerson = ({ login, avatarUrl, href }: Contributor) => (
    <Link key={login} href={href} muted className={classes.person} {...externalLinkProps}>
        <Avatar size={avatarSize}>
            <Avatar.Image src={avatarUrl} alt={login} />
            <Avatar.Fallback name={login} />
        </Avatar>
    </Link>
);

// What stands in the section: the people where they have been read, the room they will take where
// they have yet to arrive, and the way to the list where nobody came back. A list that came back
// with nobody in it is drawn the same way as one that could not be read, since in both cases the
// page has nobody to name and the list is somewhere it can be read instead
const renderPeople = (read: Contributors) => {
    if (read.state === "waiting") {
        return placeholder;
    }

    if (read.state === "unread" || read.people.length === 0) {
        return unread;
    }

    return <div className={classes.people}>{read.people.map(renderPerson)}</div>;
};

// Who has written the library. They are read off the repository as the page is opened rather than
// written into it, so somebody who writes part of it is named here without the page being edited
// to say so: a list of people written down is a list that goes out of date the moment it is right
const HomeContributors = () => {
    const read = useContributors();

    return (
        <Stack gap="normal">
            <Heading as="h2" size="medium" className={classes.heading}>
                Contributors
            </Heading>
            {renderPeople(read)}
        </Stack>
    );
};

export default HomeContributors;
