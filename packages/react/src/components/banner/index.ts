import BannerBase from "./Banner";
import BannerDescription from "./BannerDescription";
import BannerPrimaryAction from "./BannerPrimaryAction";
import BannerSecondaryAction from "./BannerSecondaryAction";
import BannerTitle from "./BannerTitle";

export const Banner = Object.assign(BannerBase, {
    Title: BannerTitle,
    Description: BannerDescription,
    PrimaryAction: BannerPrimaryAction,
    SecondaryAction: BannerSecondaryAction,
});

export { BannerTitle, BannerDescription, BannerPrimaryAction, BannerSecondaryAction };
export { BannerContext } from "./BannerContext";
export * from "./Banner.types";
