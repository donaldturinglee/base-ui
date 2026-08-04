import CodeBlockBase from "./CodeBlock";
import CodeBlockCode from "./CodeBlockCode";
import CodeBlockContent from "./CodeBlockContent";
import CodeBlockHeader from "./CodeBlockHeader";
import CodeBlockTitle from "./CodeBlockTitle";

export const CodeBlock = Object.assign(CodeBlockBase, {
    Header: CodeBlockHeader,
    Title: CodeBlockTitle,
    Content: CodeBlockContent,
    Code: CodeBlockCode,
});

export { CodeBlockHeader, CodeBlockTitle, CodeBlockContent, CodeBlockCode };
export { CodeBlockContext } from "./CodeBlockContext";
export * from "./CodeBlock.types";
