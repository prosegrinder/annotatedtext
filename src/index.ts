import {INode, IOptions, IAnnotation} from "./index.d";

const defaults: IOptions = {
  children(node: INode) {
    return node.children;
  },
  annotatetextnode(node: INode, text: string) {
    if (node.type === "text") {
      return {
        "text": text.substring(node.position.start.offset, node.position.end.offset),
        "offset": {
          "start": node.position.start.offset,
          "end": node.position.end.offset
        }
      };
    } else {
      return null;
    }
  },
  interpretmarkup(tex: string = "") {
    return "";
  }
};

function collecttextnodes(ast: any, text: string, options: IOptions = defaults) {
  var textannotations: IAnnotation[] = [];

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

  recurse(ast);
  return textannotations;
}

function composeannotation(text: string, annotatedtextnodes: IAnnotation[], options: IOptions = defaults) {
  let annotations: IAnnotation[] = [];
  let prior: IAnnotation | null = null;
  let priorend: number = 0;
  for (let current of annotatedtextnodes) {
    priorend = (prior !== null) ? prior.offset.end : 0;
    let markuptext = text.substring(priorend, current.offset.start);
    let interpreted = options.interpretmarkup(markuptext);
    annotations.push({
      "markup": markuptext,
      "interpretAs": interpreted,
      "offset": { "start": priorend, "end": current.offset.start }
    });
    annotations.push(current);
    prior = current;
  }
  // Always add a final markup node to esnure trailing whitespace is added.
  let markuptext = text.substring(priorend, text.length);
  let interpreted = options.interpretmarkup(markuptext);
  annotations.push({
    "markup": markuptext,
    "interpretAs": interpreted,
    "offset": { "start": priorend, "end": text.length }
  });
  return { "annotation": annotations };
}

function build(text: string, parse: any, options: IOptions = defaults) {
  const nodes: INode = parse(text);
  const textnodes: IAnnotation[] = collecttextnodes(nodes, text, options);
  return composeannotation(text, textnodes, options);
}

module.exports = {
  defaults,
  collecttextnodes,
  composeannotation,
  build
};
