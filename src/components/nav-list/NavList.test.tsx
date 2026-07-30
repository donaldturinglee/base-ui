import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { BookRegular, PersonRegular } from "@gamecrafters/base-ui-icons";
import { NavList } from ".";

const nav = () => screen.getByRole("navigation");

const link = (name: string) => screen.getByRole("link", { name });

const disclosure = (name: string) => screen.getByRole("button", { name });

describe("NavList", () => {
    it("renders a landmark named by the caller", () => {
        render(
            <NavList aria-label="Settings">
                <NavList.Item href="/profile">Profile</NavList.Item>
            </NavList>,
        );

        expect(nav()).toHaveAccessibleName("Settings");
        expect(nav()).toHaveAttribute("data-component", "NavList");
    });

    it("names the landmark from its own heading where the caller gives no name", () => {
        render(
            <NavList>
                <NavList.Heading>Settings</NavList.Heading>
                <NavList.Item href="/profile">Profile</NavList.Item>
            </NavList>,
        );

        expect(nav()).toHaveAccessibleName("Settings");
        expect(screen.getByRole("heading", { name: "Settings", level: 2 })).toBeInTheDocument();
    });

    it("leaves a name of the caller's own in place of the heading", () => {
        render(
            <NavList aria-label="Site">
                <NavList.Heading>Settings</NavList.Heading>
                <NavList.Item href="/profile">Profile</NavList.Item>
            </NavList>,
        );

        expect(nav()).toHaveAccessibleName("Site");
    });

    it("hides the heading from the page while leaving it to be read", () => {
        render(
            <NavList>
                <NavList.Heading visuallyHidden>Settings</NavList.Heading>
                <NavList.Item href="/profile">Profile</NavList.Item>
            </NavList>,
        );

        expect(screen.getByRole("heading", { name: "Settings" })).toHaveClass("sr-only");
    });

    it("renders its items as links", () => {
        render(
            <NavList aria-label="Settings">
                <NavList.Item href="/profile">Profile</NavList.Item>
                <NavList.Item href="/account">Account</NavList.Item>
            </NavList>,
        );

        expect(link("Profile")).toHaveAttribute("href", "/profile");
        expect(screen.getAllByRole("link")).toHaveLength(2);
    });

    it("shows the item standing for the page being read", () => {
        render(
            <NavList aria-label="Settings">
                <NavList.Item href="/profile" aria-current="page">
                    Profile
                </NavList.Item>
                <NavList.Item href="/account">Account</NavList.Item>
            </NavList>,
        );

        expect(link("Profile")).toHaveAttribute("aria-current", "page");
        expect(link("Profile").closest("li")).toHaveAttribute("data-active");
        expect(link("Account").closest("li")).not.toHaveAttribute("data-active");
    });

    it("does not show an item that says it is not the current page", () => {
        render(
            <NavList aria-label="Settings">
                <NavList.Item href="/profile" aria-current="false">
                    Profile
                </NavList.Item>
            </NavList>,
        );

        expect(link("Profile").closest("li")).not.toHaveAttribute("data-active");
    });

    it("draws the visuals an item is given", () => {
        render(
            <NavList aria-label="Settings">
                <NavList.Item href="/profile">
                    <NavList.LeadingVisual>
                        <PersonRegular />
                    </NavList.LeadingVisual>
                    Profile
                    <NavList.TrailingVisual>3</NavList.TrailingVisual>
                    <NavList.Description>Your public details</NavList.Description>
                </NavList.Item>
            </NavList>,
        );

        const item = link("Profile 3").closest("li");
        expect(item?.querySelector("[data-component='ActionList.LeadingVisual']")).toBeTruthy();
        expect(item?.querySelector("[data-component='ActionList.TrailingVisual']")).toBeTruthy();
        expect(screen.getByText("Your public details")).toBeInTheDocument();
    });

    it("renders an item as whatever the caller asks for", () => {
        const Link = ({ to, children }: { to: string; children?: React.ReactNode }) => (
            <a href={to}>{children}</a>
        );

        render(
            <NavList aria-label="Settings">
                <NavList.Item as={Link} to="/profile">
                    Profile
                </NavList.Item>
            </NavList>,
        );

        expect(link("Profile")).toHaveAttribute("href", "/profile");
    });

    describe("sub-lists", () => {
        const renderNested = (props: { defaultOpen?: boolean; current?: boolean } = {}) =>
            render(
                <NavList aria-label="Settings">
                    <NavList.Item defaultOpen={props.defaultOpen}>
                        Account
                        <NavList.SubNav>
                            <NavList.Item
                                href="/email"
                                aria-current={props.current ? "page" : undefined}
                            >
                                Email
                            </NavList.Item>
                            <NavList.Item href="/password">Password</NavList.Item>
                        </NavList.SubNav>
                    </NavList.Item>
                </NavList>,
            );

        it("renders an item holding a list as a button that opens it", () => {
            renderNested();

            expect(disclosure("Account")).toHaveAttribute("aria-expanded", "false");
            expect(screen.queryByRole("link", { name: "Email" })).toBeNull();
        });

        it("names the sub-list from the item that opens it", () => {
            renderNested({ defaultOpen: true });

            const list = screen.getByRole("list", { name: "Account" });
            expect(list).toHaveAttribute("data-component", "NavList.SubNav");
            expect(disclosure("Account")).toHaveAttribute("aria-controls", list.id);
        });

        it("opens and closes the sub-list when the item is pressed", () => {
            renderNested();

            fireEvent.click(disclosure("Account"));
            expect(disclosure("Account")).toHaveAttribute("aria-expanded", "true");
            expect(link("Email")).toBeInTheDocument();

            fireEvent.click(disclosure("Account"));
            expect(disclosure("Account")).toHaveAttribute("aria-expanded", "false");
        });

        it("opens a sub-list the caller asked to start open", () => {
            renderNested({ defaultOpen: true });

            expect(disclosure("Account")).toHaveAttribute("aria-expanded", "true");
        });

        it("opens the sub-list that holds the page being read", () => {
            renderNested({ current: true });

            expect(disclosure("Account")).toHaveAttribute("aria-expanded", "true");
        });

        it("keeps the chevron beside a trailing visual of the caller's own", () => {
            render(
                <NavList aria-label="Settings">
                    <NavList.Item>
                        Account
                        <NavList.TrailingVisual>7</NavList.TrailingVisual>
                        <NavList.SubNav>
                            <NavList.Item href="/email">Email</NavList.Item>
                        </NavList.SubNav>
                    </NavList.Item>
                </NavList>,
            );

            const visual = screen
                .getByRole("button")
                .querySelector("[data-component='ActionList.TrailingVisual']");

            expect(visual).toHaveTextContent("7");
            expect(visual?.querySelector("svg")).toBeTruthy();
        });

        it("draws nothing for a sub-list written outside an item", () => {
            render(
                <NavList aria-label="Settings">
                    <NavList.SubNav>
                        <NavList.Item href="/email">Email</NavList.Item>
                    </NavList.SubNav>
                </NavList>,
            );

            expect(screen.queryByRole("link", { name: "Email" })).toBeNull();
        });
    });

    describe("groups", () => {
        it("collects items under a heading of their own", () => {
            render(
                <NavList aria-label="Settings">
                    <NavList.Group title="Account">
                        <NavList.Item href="/email">Email</NavList.Item>
                    </NavList.Group>
                </NavList>,
            );

            expect(screen.getByRole("heading", { name: "Account", level: 3 })).toBeInTheDocument();
            expect(screen.getByRole("list", { name: "Account" })).toBeInTheDocument();
        });

        it("heads a group one level below the list's own heading", () => {
            render(
                <NavList>
                    <NavList.Heading as="h3">Settings</NavList.Heading>
                    <NavList.Group title="Account">
                        <NavList.Item href="/email">Email</NavList.Item>
                    </NavList.Group>
                </NavList>,
            );

            expect(screen.getByRole("heading", { name: "Account", level: 4 })).toBeInTheDocument();
        });

        it("sets a group apart from what comes before it", () => {
            const { container } = render(
                <NavList aria-label="Settings">
                    <NavList.Group title="Account">
                        <NavList.Item href="/email">Email</NavList.Item>
                    </NavList.Group>
                </NavList>,
            );

            expect(container.querySelector("[data-component='ActionList.Divider']")).toBeTruthy();
        });

        it("leaves out the line where the caller asks it to", () => {
            const { container } = render(
                <NavList aria-label="Settings">
                    <NavList.Group title="Account" hideDivider>
                        <NavList.Item href="/email">Email</NavList.Item>
                    </NavList.Group>
                </NavList>,
            );

            expect(container.querySelector("[data-component='ActionList.Divider']")).toBeNull();
        });

        it("takes a heading written out in place of the title", () => {
            render(
                <NavList aria-label="Settings">
                    <NavList.Group>
                        <NavList.GroupHeading>
                            <a href="/account">Account</a>
                        </NavList.GroupHeading>
                        <NavList.Item href="/email">Email</NavList.Item>
                    </NavList.Group>
                </NavList>,
            );

            const heading = screen.getByRole("heading", { name: "Account", level: 3 });
            expect(heading).toHaveAttribute("data-component", "NavList.GroupHeading");
            // The heading stands above the group's items and names them, rather than
            // being left to stand among them
            expect(screen.getByRole("list", { name: "Account" })).not.toContainElement(heading);
        });
    });

    describe("expanding a group", () => {
        const items = [
            { text: "Alpha", href: "/alpha", leadingVisual: BookRegular },
            { text: "Beta", href: "/beta" },
            { text: "Gamma", href: "/gamma" },
            { text: "Delta", href: "/delta" },
        ];

        it("holds the items back behind a button", () => {
            render(
                <NavList aria-label="Settings">
                    <NavList.Group title="Books">
                        <NavList.GroupExpand items={items} />
                    </NavList.Group>
                </NavList>,
            );

            expect(screen.queryByRole("link", { name: "Alpha" })).toBeNull();
            expect(disclosure("Show more")).toBeInTheDocument();
        });

        it("shows every item at once where no pages were asked for", () => {
            render(
                <NavList aria-label="Settings">
                    <NavList.Group title="Books">
                        <NavList.GroupExpand items={items} />
                    </NavList.Group>
                </NavList>,
            );

            fireEvent.click(disclosure("Show more"));

            expect(screen.getAllByRole("link")).toHaveLength(items.length);
            expect(screen.queryByRole("button", { name: "Show more" })).toBeNull();
        });

        it("shows the items a page at a time where pages were asked for", () => {
            render(
                <NavList aria-label="Settings">
                    <NavList.Group title="Books">
                        <NavList.GroupExpand items={items} pages={2} label="More books" />
                    </NavList.Group>
                </NavList>,
            );

            fireEvent.click(disclosure("More books"));
            expect(screen.getAllByRole("link")).toHaveLength(2);

            fireEvent.click(disclosure("More books"));
            expect(screen.getAllByRole("link")).toHaveLength(4);
            expect(screen.queryByRole("button", { name: "More books" })).toBeNull();
        });

        it("sends the reader to the first of the items it has just shown", () => {
            render(
                <NavList aria-label="Settings">
                    <NavList.Group title="Books">
                        <NavList.GroupExpand items={items} pages={2} />
                    </NavList.Group>
                </NavList>,
            );

            fireEvent.click(disclosure("Show more"));
            expect(link("Alpha")).toHaveFocus();

            fireEvent.click(disclosure("Show more"));
            expect(link("Gamma")).toHaveFocus();
        });

        it("leaves the items to a renderer of the caller's own", () => {
            const renderItem = jest.fn((item: { text: string }) => (
                <li key={item.text}>{item.text} (custom)</li>
            ));

            render(
                <NavList aria-label="Settings">
                    <NavList.Group title="Books">
                        <NavList.GroupExpand items={items} renderItem={renderItem} />
                    </NavList.Group>
                </NavList>,
            );

            fireEvent.click(disclosure("Show more"));

            expect(screen.getByText("Alpha (custom)")).toBeInTheDocument();
        });
    });

    it("takes a class name of the caller's own", () => {
        render(
            <NavList aria-label="Settings" className="custom">
                <NavList.Item href="/profile">Profile</NavList.Item>
            </NavList>,
        );

        expect(nav()).toHaveClass("custom");
    });
});
