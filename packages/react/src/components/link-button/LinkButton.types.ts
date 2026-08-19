import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { ButtonBaseProps, ButtonContentProps } from "../button";

export type LinkButtonProps<As extends React.ElementType = "a"> = PolymorphicProps<
    As,
    "a",
    ButtonBaseProps & ButtonContentProps
>;
