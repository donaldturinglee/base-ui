import AvatarBase, { DEFAULT_AVATAR_SIZE } from "./Avatar";
import AvatarFallback from "./AvatarFallback";
import AvatarImage from "./AvatarImage";

export const Avatar = Object.assign(AvatarBase, {
    Image: AvatarImage,
    Fallback: AvatarFallback,
});

export { AvatarImage, AvatarFallback, DEFAULT_AVATAR_SIZE };
export { AvatarContext } from "./AvatarContext";
export * from "./Avatar.types";
