import { Heading } from "@gamecrafters/base-ui/react";

const classes = {
    // The name of the page is read by a screen reader alone. Every other page opens with a
    // heading that is read, but the Storybook names itself the moment it is drawn, and a second
    // name above it would take height from the one thing the page is here to show
    heading: "sr-only",
    // The Storybook is an application in its own right and carries the whole of its own
    // furniture, so it is given the height of the viewport rather than a share of the page it is
    // read in — which is what the column of links beside it is given, and for the same reason.
    // The row across the top stands above both of them, so the two run the same distance past the
    // foot of the viewport and the last of either is read by scrolling it into view.
    //
    // A frame is drawn with a border of the browser's own, which would be read as an edge of the
    // page rather than of the browser, so it is taken away
    frame: "h-dvh w-full border-0",
};

// Where the Storybook is read from. While the site is being worked on it is the docs workspace's
// own dev server, standing beside this one on the port that workspace's script is told to listen
// on: what that server hands back names its own files from the root it is served at, so it cannot
// be read through a path of the site's. Once the site is built there is no server left to stand
// beside it, and what `storybook build` left behind is copied in under the site itself, a
// directory along from the page it is read in.
//
// It leaves the feature because the page is not the only way to the Storybook: an example card
// links out to it as well, and the two would fall out of step were the address written twice
export const storybookUrl = import.meta.env.DEV ? "http://localhost:3001/" : "/storybook/";

// The Storybook the components are developed and read in, shown inside the site rather than
// beside it. It is an application of its own, with its own column of stories and its own toolbar,
// so it is put in a frame rather than drawn into the page: what it is written in stays its own,
// and the row across the top of the site stays where it is for the reader to go on from
const Storybook = () => (
    <>
        <Heading as="h1" className={classes.heading}>
            Storybook
        </Heading>
        <iframe className={classes.frame} src={storybookUrl} title="Storybook" />
    </>
);

export default Storybook;
