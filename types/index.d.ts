export interface IAnnotation {
  markup?: string;
  interpretAs?: string;
  text?: string;
  offset: {
    start: number;
    end: number
  };
}

export interface IAnnotatedtext {
  annotation: IAnnotation[];
}

export interface IOptions {
  children(node: any): any;
  annotatetextnode(node: any, text: string): IAnnotation | null;
  interpretmarkup(text?: string): string;
}

export interface INode {
  children: INode[];
  type: string;
  position: {
    end: {
      offset: number,
    },
    start: {
      offset: number,
    },
  };
}

declare const defaults: IOptions;

declare function collecttextnodes(ast: any, text: string, options?: IOptions): any[];

declare function composeannotation(text: string, annotatedtextnodes: IAnnotatedtext, options?: IOptions): IAnnotatedtext;

declare function build(text: string, parse: any, options?: IOptions): IAnnotatedtext;
