import { IAnnotatedtext, IAnnotation, INode, IOptions } from "../types";

export default class AnnotatedText {
  defaults: IOptions = {
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

  collecttextnodes(
    ast: unknown,
    text: string,
    options: IOptions = this.defaults,
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

  composeannotation(
    text: string,
    annotatedtextnodes: IAnnotation[],
    options: IOptions = this.defaults,
  ): IAnnotatedtext {
    const annotations: IAnnotation[] = [];
    let prior: IAnnotation = {
      offset: {
        end: 0,
        start: 0,
      },
    };
    for (const current of annotatedtextnodes) {
      const currenttext = text.substring(
        prior.offset.end,
        current.offset.start,
      );
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

  build(
    text: string,
    parse: (_text: string) => void,
    options: IOptions = this.defaults,
  ): IAnnotatedtext {
    const nodes: INode | void = parse(text);
    const textnodes: IAnnotation[] = this.collecttextnodes(
      nodes,
      text,
      options,
    );
    return this.composeannotation(text, textnodes, options);
  }
}

// const defaults: IOptions = {
//   children(node: INode): INode[] {
//     return node.children;
//   },
//   annotatetextnode(node: INode, text: string) {
//     if (node.type === "text") {
//       return {
//         offset: {
//           end: node.position.end.offset,
//           start: node.position.start.offset,
//         },
//         text: text.substring(
//           node.position.start.offset,
//           node.position.end.offset,
//         ),
//       };
//     } else {
//       return null;
//     }
//   },
//   interpretmarkup(text = "") {
//     return text;
//   },
// };

// function collecttextnodes(
//   ast: unknown,
//   text: string,
//   options: IOptions = defaults,
// ): IAnnotation[] {
//   const textannotations: IAnnotation[] = [];

//   function recurse(node: INode) {
//     const annotation = options.annotatetextnode(node, text);
//     if (annotation !== null) {
//       textannotations.push(annotation);
//     }
//     const children = options.children(node);
//     if (children !== null && Array.isArray(children)) {
//       children.forEach(recurse);
//     }
//   }

//   recurse(ast as INode);
//   return textannotations;
// }

// function composeannotation(
//   text: string,
//   annotatedtextnodes: IAnnotation[],
//   options: IOptions = defaults,
// ): IAnnotatedtext {
//   const annotations: IAnnotation[] = [];
//   let prior: IAnnotation = {
//     offset: {
//       end: 0,
//       start: 0,
//     },
//   };
//   for (const current of annotatedtextnodes) {
//     const currenttext = text.substring(prior.offset.end, current.offset.start);
//     annotations.push({
//       interpretAs: options.interpretmarkup(currenttext),
//       markup: currenttext,
//       offset: {
//         end: current.offset.start,
//         start: prior.offset.end,
//       },
//     });
//     annotations.push(current);
//     prior = current;
//   }
//   // Always add a final markup node to esnure trailing whitespace is added.
//   const finaltext = text.substring(prior.offset.end, text.length);
//   annotations.push({
//     interpretAs: options.interpretmarkup(finaltext),
//     markup: finaltext,
//     offset: {
//       end: text.length,
//       start: prior.offset.end,
//     },
//   });
//   return { annotation: annotations };
// }

// function build(
//   text: string,
//   parse: (_text: string) => void,
//   options: IOptions = defaults,
// ): IAnnotatedtext {
//   const nodes: INode | void = parse(text);
//   const textnodes: IAnnotation[] = collecttextnodes(nodes, text, options);
//   return composeannotation(text, textnodes, options);
// }

// export { build, collecttextnodes, composeannotation, defaults };
