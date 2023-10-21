import { IAnnotatedtext, IAnnotation, INode, IOptions } from "../types";

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
 * Default options for building annotated text.
 *
 * @property {function} children A function that returns the children of a node.
 * @property {function} annotatetextnode A function that returns an annotation
 *  for a text node.
 * @property {function} interpretmarkup A function that returns a string to use
 *  as the `interpretAs` property of an annotation.
 */
const defaults: IOptions = {
  children(node: INode): INode[] {
    return node.children;
  },
  annotatetextnode(node: INode, text: string) {
    if (node.type === "text") {
      return {
        offset: {
          end: node.position.end.offset,
          start: node.position.start.offset,
        },
        text: text.substring(
          node.position.start.offset,
          node.position.end.offset,
        ),
      };
    } else {
      return null;
    }
  },
  interpretmarkup(text = "") {
    return text;
  },
};

/**
 * Collect text nodes from an AST.
 *
 * @param ast The AST to collect text nodes from.
 * @param text The text that the AST was generated from.
 * @param options Options to control how the text is parsed.
 * @returns An array of annotations for text nodes.
 */
function collecttextnodes(
  ast: unknown,
  text: string,
  options: IOptions = defaults,
): IAnnotation[] {
  const textannotations: IAnnotation[] = [];

  function recurse(node: INode) {
    const annotation = options.annotatetextnode(node, text);
    if (annotation !== null) {
      textannotations.push(annotation);
    }
    const children = options.children(node);
    if (children !== null && Array.isArray(children)) {
      children.forEach(recurse);
    }
  }

  recurse(ast as INode);
  return textannotations;
}

/**
 * Compose an annotated text from an array of text nodes.
 *
 * @param text The text that the AST was generated from.
 * @param annotatedtextnodes An array of annotations for text nodes.
 * @param options Options to control how the text is parsed.
 * @returns An annotated text suitable for use with LanguageTool.
 */
function composeannotation(
  text: string,
  annotatedtextnodes: IAnnotation[],
  options: IOptions = defaults,
): IAnnotatedtext {
  const annotations: IAnnotation[] = [];
  let prior: IAnnotation = {
    offset: {
      end: 0,
      start: 0,
    },
  };
  for (const current of annotatedtextnodes) {
    const currenttext = text.substring(prior.offset.end, current.offset.start);
    annotations.push({
      interpretAs: options.interpretmarkup(currenttext),
      markup: currenttext,
      offset: {
        end: current.offset.start,
        start: prior.offset.end,
      },
    });
    annotations.push(current);
    prior = current;
  }
  // Always add a final markup node to esnure trailing whitespace is added.
  const finaltext = text.substring(prior.offset.end, text.length);
  annotations.push({
    interpretAs: options.interpretmarkup(finaltext),
    markup: finaltext,
    offset: {
      end: text.length,
      start: prior.offset.end,
    },
  });
  return { annotation: annotations };
}

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
function build(
  text: string,
  parse: (_text: string) => void,
  options: IOptions = defaults,
): IAnnotatedtext {
  const nodes: INode | void = parse(text);
  if (nodes === undefined) {
    throw new Error("Parser did not return a node");
  }
  return compose(text, nodes, options);
}

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
function compose(
  text: string,
  nodes: INode,
  options: IOptions = defaults,
): IAnnotatedtext {
  const textnodes: IAnnotation[] = collecttextnodes(nodes, text, options);
  return composeannotation(text, textnodes, options);
}

export { build, compose, collecttextnodes, composeannotation, defaults };
