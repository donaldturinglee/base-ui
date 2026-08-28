import type * as React from "react";
import type { TreeViewProps } from "../tree-view";

// What a value turns out to be once it has been looked at. The names are the ones a reader would
// use rather than the ones `typeof` gives, so a list is a list rather than an object and a date is
// a date rather than whatever it happens to be built out of.
//
// `circular` is the one that is not a kind of value at all: it is a value that holds itself, which
// has to be named so that the tree has somewhere to stop
export type JSONNodeType =
    | "object"
    | "array"
    | "map"
    | "set"
    | "class"
    | "error"
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "null"
    | "undefined"
    | "symbol"
    | "function"
    | "date"
    | "regex"
    | "circular";

// One value in the tree, and whatever stands under it
export type JSONNode = {
    // What tells one row from another and holds its open state. It is the path of places down to
    // the value rather than the path of names, since a name is free to hold whatever it likes and
    // two paths of names could otherwise come out the same
    id: string;
    // What the value is called where it stands. A tree built from a value that holds nothing has
    // the one row, and that row is not called anything
    key?: string;
    type: JSONNodeType;
    value: unknown;
    // What stands under the value. Only something worth opening has any: a list or an object that
    // holds nothing is a leaf drawn as a pair of empty brackets, since there is nothing to open
    children?: JSONNode[];
    // Whether the name was hidden from an ordinary walk of the thing holding it
    nonEnumerable?: boolean;
};

// What a piece of a written-out value is doing in the line, where it is the writing around the
// value rather than the value itself
export type JSONTokenKind = "bracket" | "constructor" | "separator" | "more";

// One piece of a value as it is written out. A piece is either the value, and carries what sort of
// value it is, or the writing around it, and carries what it is doing there
export type JSONToken = {
    text: string;
    type?: JSONNodeType;
    kind?: JSONTokenKind;
};

// Draws a value some other way than the component would. Handed each piece of the written-out
// value along with the row it belongs to; given nothing back, the component draws the piece the
// way it would have
export type JSONTreeViewRenderValue = (
    token: JSONToken,
    node: JSONNode,
) => React.ReactNode | undefined;

// How much of what it holds a row gives away, and how much of it is looked at in the first place.
// The tree and the parts under it are given these the same way, so a row deep in the tree is
// written by the same rules as the one at the top of it
export type JSONTreeViewOptions = {
    // How many of the names it holds a closed row gives away before it says only that there are
    // more. Nought gives none of them away
    maxPreviewItems?: number;
    // How long a string is allowed to run before it is cut. Nought lets it run
    collapseStringsAfterLength?: number;
    // Draws quotes around the names, the way a JSON file writes them
    quotesOnKeys?: boolean;
    // Breaks a long list into runs of this many, so that a thousand rows are opened a run at a
    // time rather than all at once. Nought leaves the list whole
    groupArraysAfterLength?: number;
    // Shows the names an ordinary walk of a thing passes over
    showNonEnumerable?: boolean;
};

type JSONTreeViewOwnProps = JSONTreeViewOptions & {
    // The value to draw. Anything at all: JSON, but also the maps, sets, dates, functions and
    // errors that a JSON file has no way of writing down
    data: unknown;
    // How many levels down stand open to begin with, counting from one. Nought opens none of them
    defaultExpandedDepth?: number;
    renderValue?: JSONTreeViewRenderValue;
    className?: string;
};

// The tree draws its own rows from the data it was given, so there are no children to pass it
export type JSONTreeViewProps = Omit<TreeViewProps, "children"> & JSONTreeViewOwnProps;

export type JSONTreeViewNodeProps = {
    node: JSONNode;
    // How deep the row stands, counting from one
    depth: number;
};

export type JSONTreeViewKeyProps = {
    node: JSONNode;
};

export type JSONTreeViewValueProps = {
    node: JSONNode;
};

export type JSONTreeViewContextValue = JSONTreeViewOptions & {
    defaultExpandedDepth?: number;
    renderValue?: JSONTreeViewRenderValue;
};
