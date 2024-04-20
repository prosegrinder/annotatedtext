/**
 * @module annotatedtext
 * @example
 * import { compose } from "annotatedtext";
 * import { parse } from "remark-parse";
 * import { unified } from "unified";
 *
 * const text = "This is a sentence.";
 * const processor = unified()
 *    .use(remarkparse, options.remarkoptions)
 *    .use(frontmatter, ["yaml", "toml"])
 *    .parse(text);
 *
 * const annotatedtext = compose(text, parse);
 * console.log(annotatedtext);
 *
 * @description
 * This module provides functions for building annotated text
 * suitable for use with LanguageTool.
 *
 * @see https://languagetool.org/http-api/
 */

/**
 * @property {string} markup The markup that the text was generated from.
 * @property {string} interpretAs The interpretation of the markup.
 * @property {string} text The text that the annotation was generated from.
 * @property {object} offset The offset of the annotation in the text.
 * @property {number} offset.start The start offset of the annotation.
 * @property {number} offset.end The end offset of the annotation.
 * @interface
 */
export interface IAnnotation {
  markup?: string;
  interpretAs?: string;
  text?: string;
  offset: {
    start: number;
    end: number;
  };
}

/**
 * @interface IAnnotatedtext
 * @property {IAnnotation[]} annotation An array of annotations.
 */
export interface IAnnotatedtext {
  annotation: IAnnotation[];
}

/**
 * @interface IOptions
 * @property {function} children A function that returns the children of a node.
 * @property {function} annotatetextnode A function that returns an annotated
 *  text node.
 * @property {function} interpretmarkup A function that returns a string
 *  representing how markup should be interpreted.
 */
export interface IOptions {
  children(node: INode): INode[];
  annotatetextnode(node: INode, text: string): IAnnotation | null;
  interpretmarkup(text?: string): string;
}

/**
 * @interface INode
 * @property {INode[]} children An array of child nodes.
 * @property {string} type The type of the node.
 * @property {object} position The position of the node in the text.
 * @property {object} position.end The end position of the node in the text.
 * @property {number} position.end.offset The end offset of the node in the
 *  text.
 * @property {object} position.start The start position of the node in the text.
 * @property {number} position.start.offset The start offset of the node in the
 *  text.
 */
export interface INode {
  children: INode[];
  type: string;
  position: {
    end: {
      offset: number;
    };
    start: {
      offset: number;
    };
  };
}

/**
 * Default options for building annotated text.
 *
 * @property {function} children A function that returns the children of a node.
 * @property {function} annotatetextnode A function that returns an annotation
 *  for a text node.
 * @property {function} interpretmarkup A function that returns a string to use
 *  as the `interpretAs` property of an annotation.
 */
export const defaults: IOptions;

/**
 * Collect text nodes from an AST.
 *
 * @param ast The AST to collect text nodes from.
 * @param text The text that the AST was generated from.
 * @param options Options to control how the text is parsed.
 * @returns An array of annotations for text nodes.
 */
export function collecttextnodes(
  ast: unknown,
  text: string,
  options?: IOptions,
): IAnnotation[];

/**
 * Compose an annotated text from an array of text nodes.
 *
 * @param text The text that the AST was generated from.
 * @param annotatedtextnodes An array of annotations for text nodes.
 * @param options Options to control how the text is parsed.
 * @returns An annotated text suitable for use with LanguageTool.
 */
export function composeannotation(
  text: string,
  annotatedtextnodes: IAnnotatedtext,
  options?: IOptions,
): IAnnotatedtext;

/**
 * Build an annotated text from a parser and some text
 * suitable for use with LanguageTool.
 *
 * @deprecated since version 1.2.0.
 * Will be deleted in version 2.0.
 *
 * Use `compose` instead. This was done to remove the
 * test dependencies on unified and remark-parse. This
 * library was never meant to be specific to those libraries
 * or any particularly text format (HTML, markdown, etc.).
 *
 * Libraries that use this library should be responsible for
 * parsing the text and passing the AST to this library.
 *
 * @param text The text to parse.
 * @param parse A function that parses the text and returns an AST.
 * @param options Options to control how the text is parsed.
 *
 */
export function build(
  text: string,
  parse: unknown,
  options?: IOptions,
): IAnnotatedtext;

/**
 * Compose an annotated text from an AST and some text
 * suitable for use with LanguageTool.
 *
 * @param text The text to parse.
 * @param nodes The AST to use.
 * @param options Options to control how the text is parsed.
 * @returns An annotated text suitable for use with LanguageTool.
 *
 */
export function compose(
  text: string,
  nodes: INode,
  options?: IOptions,
): IAnnotatedtext;
