declare namespace annotatedtext {
  export interface IAnnotation {
    markup?: string;
    interpretAs?: string;
    text?: string;
    offset: {
      start: number;
      end: number;
    };
  }

  export interface IAnnotatedtext {
    annotation: IAnnotation[];
  }

  export interface IOptions {
    children(node: INode): INode[];
    annotatetextnode(node: INode, text: string): IAnnotation | null;
    interpretmarkup(text?: string): string;
  }

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
    ast: any,
    text: string,
    options?: IOptions,
  ): any[];

  export function composeannotation(
    text: string,
    annotatedtextnodes: IAnnotatedtext,
    options?: IOptions,
  ): IAnnotatedtext;

  export function build(
    text: string,
    parse: any,
    options?: IOptions,
  ): IAnnotatedtext;
}

export = annotatedtext;
