import HeaderBase from "./Header";
import HeaderItem from "./HeaderItem";
import HeaderLink from "./HeaderLink";

export const Header = Object.assign(HeaderBase, {
    Item: HeaderItem,
    Link: HeaderLink,
});

export { HeaderItem, HeaderLink };
export * from "./Header.types";
