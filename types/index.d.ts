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
export const defaults: IOptions;

export function collecttextnodes(
  ast: unknown,
  text: string,
  options?: IOptions,
): IAnnotation[];

export function composeannotation(
  text: string,
  annotatedtextnodes: IAnnotatedtext,
  options?: IOptions,
): IAnnotatedtext;

export function build(
  text: string,
  parse: unknown,
  options?: IOptions,
): IAnnotatedtext;

export function compose(
  text: string,
  nodes: INode,
  options?: IOptions,
): IAnnotatedtext;
