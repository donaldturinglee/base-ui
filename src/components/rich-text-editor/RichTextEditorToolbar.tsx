import * as React from "react";
import {
    ArrowRedoRegular,
    ArrowUndoRegular,
    CodeRegular,
    LinkRegular,
    TextBoldRegular,
    TextBulletListLtrRegular,
    TextHeader_1Regular,
    TextHeader_2Regular,
    TextHeader_3Regular,
    TextItalicRegular,
    TextNumberListLtrRegular,
    TextQuoteRegular,
    TextStrikethroughRegular,
    TextUnderlineRegular,
} from "@gamecrafters/base-ui-icons";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
    $isListNode,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    $isQuoteNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from "lexical";
import { useFocusZone } from "../../hooks/useFocusZone";
import { classNames } from "../../lib/classnames";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { TextInput } from "../text-input";
import { RichTextEditorContext } from "./RichTextEditorContext";
import type {
    RichTextEditorBlockType,
    RichTextEditorControl,
    RichTextEditorTextFormat,
    RichTextEditorToolbarProps,
} from "./RichTextEditor.types";
import type { HeadingTagType } from "@lexical/rich-text";

// Every run of controls, in the order a toolbar reads them where it was not told otherwise
export const DEFAULT_RICH_TEXT_EDITOR_CONTROLS: readonly RichTextEditorControl[] = [
    "history",
    "inline",
    "block",
    "list",
    "link",
];

const classes = {
    root: "rich-text-editor-toolbar",
    controls: "rich-text-editor-toolbar-controls",
    group: "rich-text-editor-toolbar-group",
    divider: "rich-text-editor-toolbar-divider",
    linkField: "rich-text-editor-link-field",
    linkInput: "rich-text-editor-link-input",
};

const inlineButtons = [
    { format: "bold", icon: TextBoldRegular, label: "Bold" },
    { format: "italic", icon: TextItalicRegular, label: "Italic" },
    { format: "underline", icon: TextUnderlineRegular, label: "Underline" },
    { format: "strikethrough", icon: TextStrikethroughRegular, label: "Strikethrough" },
    { format: "code", icon: CodeRegular, label: "Code" },
] satisfies { format: RichTextEditorTextFormat; icon: React.ElementType; label: string }[];

const headingButtons = [
    { tag: "h1", icon: TextHeader_1Regular, label: "Heading 1" },
    { tag: "h2", icon: TextHeader_2Regular, label: "Heading 2" },
    { tag: "h3", icon: TextHeader_3Regular, label: "Heading 3" },
] satisfies { tag: HeadingTagType; icon: React.ElementType; label: string }[];

const noFormats = {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
} satisfies Record<RichTextEditorTextFormat, boolean>;

// The buttons that give the editor its commands. What each one says about itself is read back
// out of the writing the cursor sits in rather than kept here, so a toolbar tells the truth
// however the writing was reached: by a button, by a keystroke, or by moving the cursor into
// something that was already written that way
function RichTextEditorToolbar(props: RichTextEditorToolbarProps) {
    const {
        className,
        children,
        controls = DEFAULT_RICH_TEXT_EDITOR_CONTROLS,
        "aria-label": ariaLabel = "Formatting",
        ...rest
    } = props;

    const [editor] = useLexicalComposerContext();
    const { readOnly } = React.useContext(RichTextEditorContext);

    const controlsRef = React.useRef<HTMLDivElement>(null);
    // A toolbar is one stop on the way round the page, so the arrow keys move between the
    // buttons standing within it
    useFocusZone({ containerRef: controlsRef, direction: "horizontal", wrap: true });

    const [formats, setFormats] =
        React.useState<Record<RichTextEditorTextFormat, boolean>>(noFormats);
    const [blockType, setBlockType] = React.useState<RichTextEditorBlockType>("paragraph");
    const [isLink, setIsLink] = React.useState(false);
    const [canUndo, setCanUndo] = React.useState(false);
    const [canRedo, setCanRedo] = React.useState(false);
    const [linkDraft, setLinkDraft] = React.useState<string | null>(null);

    // What the buttons are read against. It runs inside a read of the editor state, which is
    // what makes the selection there to be asked about
    const readSelection = React.useCallback(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
            return;
        }

        setFormats({
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
            strikethrough: selection.hasFormat("strikethrough"),
            code: selection.hasFormat("code"),
        });

        const node = selection.anchor.getNode();
        // A list item answers with the list it belongs to, which is what carries whether the
        // list is bulleted or numbered
        const block = node.getKey() === "root" ? node : node.getTopLevelElement();

        if ($isListNode(block)) {
            setBlockType(block.getListType() === "number" ? "number" : "bullet");
        } else if ($isHeadingNode(block)) {
            const tag = block.getTag();
            setBlockType(tag === "h1" || tag === "h2" || tag === "h3" ? tag : "paragraph");
        } else if ($isQuoteNode(block)) {
            setBlockType("quote");
        } else {
            setBlockType("paragraph");
        }

        // A link is the run the words sit in rather than the words themselves, so both the node
        // the cursor is in and the one holding it are asked
        setIsLink($isLinkNode(node) || $isLinkNode(node.getParent()));
    }, []);

    React.useEffect(
        () =>
            mergeRegister(
                editor.registerUpdateListener(({ editorState }) => {
                    editorState.read(readSelection);
                }),
                // Moving the cursor is not an update, so the selection is listened for as well
                editor.registerCommand(
                    SELECTION_CHANGE_COMMAND,
                    () => {
                        readSelection();
                        return false;
                    },
                    COMMAND_PRIORITY_CRITICAL,
                ),
                editor.registerCommand(
                    CAN_UNDO_COMMAND,
                    (payload) => {
                        setCanUndo(payload);
                        return false;
                    },
                    COMMAND_PRIORITY_CRITICAL,
                ),
                editor.registerCommand(
                    CAN_REDO_COMMAND,
                    (payload) => {
                        setCanRedo(payload);
                        return false;
                    },
                    COMMAND_PRIORITY_CRITICAL,
                ),
            ),
        [editor, readSelection],
    );

    // Pressing the button for the writing that is already in force turns it back into an
    // ordinary paragraph, which is what leaves every block reachable without a button of its own
    const setBlock = (next: RichTextEditorBlockType) => {
        editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) {
                return;
            }

            if (blockType === next) {
                $setBlocksType(selection, () => $createParagraphNode());
                return;
            }

            $setBlocksType(selection, () =>
                next === "quote" ? $createQuoteNode() : $createHeadingNode(next as HeadingTagType),
            );
        });
    };

    const setList = (next: "bullet" | "number") => {
        if (blockType === next) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            return;
        }

        editor.dispatchCommand(
            next === "bullet" ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
            undefined,
        );
    };

    // A run that is already a link is unlinked outright; one that is not needs somewhere to say
    // where it should point, which is what the field below the buttons is for
    const toggleLink = () => {
        if (isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
            return;
        }

        setLinkDraft((current) => (current === null ? "" : null));
    };

    const applyLink = () => {
        if (linkDraft) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkDraft);
        }

        setLinkDraft(null);
        editor.focus();
    };

    const button = (
        key: string,
        label: string,
        icon: React.ElementType,
        pressed: boolean,
        onClick: () => void,
        disabled?: boolean,
    ) => (
        <IconButton
            key={key}
            icon={icon}
            size="small"
            variant="invisible"
            aria-label={label}
            aria-pressed={pressed}
            disabled={readOnly || disabled}
            onClick={onClick}
            data-component={`RichTextEditor.${key}`}
        />
    );

    const groups: Record<RichTextEditorControl, React.ReactNode> = {
        history: (
            <>
                <IconButton
                    icon={ArrowUndoRegular}
                    size="small"
                    variant="invisible"
                    aria-label="Undo"
                    disabled={readOnly || !canUndo}
                    onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                    data-component="RichTextEditor.Undo"
                />
                <IconButton
                    icon={ArrowRedoRegular}
                    size="small"
                    variant="invisible"
                    aria-label="Redo"
                    disabled={readOnly || !canRedo}
                    onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                    data-component="RichTextEditor.Redo"
                />
            </>
        ),
        inline: (
            <>
                {inlineButtons.map(({ format, icon, label }) =>
                    button(label, label, icon, formats[format], () =>
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format),
                    ),
                )}
            </>
        ),
        block: (
            <>
                {headingButtons.map(({ tag, icon, label }) =>
                    button(label, label, icon, blockType === tag, () => setBlock(tag)),
                )}
                {button("Quote", "Quote", TextQuoteRegular, blockType === "quote", () =>
                    setBlock("quote"),
                )}
            </>
        ),
        list: (
            <>
                {button(
                    "Bulleted list",
                    "Bulleted list",
                    TextBulletListLtrRegular,
                    blockType === "bullet",
                    () => setList("bullet"),
                )}
                {button(
                    "Numbered list",
                    "Numbered list",
                    TextNumberListLtrRegular,
                    blockType === "number",
                    () => setList("number"),
                )}
            </>
        ),
        link: button(
            "Link",
            isLink ? "Remove link" : "Link",
            LinkRegular,
            isLink || linkDraft !== null,
            toggleLink,
        ),
    };

    return (
        <div
            className={classNames(classes.root, className)}
            data-component="RichTextEditor.Toolbar"
        >
            <div
                ref={controlsRef}
                role="toolbar"
                aria-label={ariaLabel}
                aria-orientation="horizontal"
                className={classes.controls}
                {...rest}
            >
                {controls.map((control, index) => (
                    <React.Fragment key={control}>
                        {index > 0 ? (
                            <span
                                aria-hidden="true"
                                className={classes.divider}
                                data-component="RichTextEditor.ToolbarDivider"
                            />
                        ) : null}
                        <div className={classes.group} data-control={control}>
                            {groups[control]}
                        </div>
                    </React.Fragment>
                ))}
                {children}
            </div>

            {/* The field stands outside the toolbar rather than in it, because the arrow keys
                inside a toolbar belong to the toolbar and inside a field belong to the caret */}
            {linkDraft === null ? null : (
                <div className={classes.linkField} data-component="RichTextEditor.LinkField">
                    <TextInput
                        autoFocus
                        size="small"
                        type="url"
                        value={linkDraft}
                        placeholder="https://example.com"
                        aria-label="Link address"
                        className={classes.linkInput}
                        onChange={(event) => setLinkDraft(event.currentTarget.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                applyLink();
                            }

                            if (event.key === "Escape") {
                                setLinkDraft(null);
                                editor.focus();
                            }
                        }}
                    />
                    <Button size="small" onClick={applyLink}>
                        Apply
                    </Button>
                </div>
            )}
        </div>
    );
}

RichTextEditorToolbar.displayName = "RichTextEditor.Toolbar";

export default RichTextEditorToolbar;
