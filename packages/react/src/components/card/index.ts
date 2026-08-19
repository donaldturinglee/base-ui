import CardBase from "./Card";
import CardAction from "./CardAction";
import CardDescription from "./CardDescription";
import CardHeading from "./CardHeading";
import CardIcon from "./CardIcon";
import CardImage from "./CardImage";
import CardMetadata from "./CardMetadata";

export const Card = Object.assign(CardBase, {
    Icon: CardIcon,
    Image: CardImage,
    Heading: CardHeading,
    Description: CardDescription,
    Metadata: CardMetadata,
    Action: CardAction,
});

export { CardIcon, CardImage, CardHeading, CardDescription, CardMetadata, CardAction };
export * from "./Card.types";
