"use strict";

const defaults = {
  children(node) {
    return node.children;
  },
  annotatetextnode(node) {
    if (node.type === "text") {
      return {
        "text": node.value,
        "offset": {
          "start": node.position.start.offset,
          "end": node.position.end.offset
        }
      };
    } else {
      return null;
    }
  },
  interpretmarkup(text = "") {
    return "";
  }
};

function collecttextnodes(ast, options = defaults) {
  var textannotations = [];

  function recurse(node) {
    const annotation = options.annotatetextnode(node);
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

function composeannotation(text, annotatedtextnodes, options = defaults) {
  let annotations = [];
  let prior = null;
  for (let current of annotatedtextnodes) {
    let priorend = (prior !== null) ? prior.offset.end : 0;
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
  let markuptext = text.substring(prior.offset.end, text.length);
  let interpreted = options.interpretmarkup(markuptext);
  annotations.push({
    "markup": markuptext,
    "interpretAs": interpreted,
    "offset": { "start": prior.offset.end, "end": text.length }
  });
  return { "annotation": annotations };
}

function build(text, parse, options = defaults) {
  const nodes = parse(text);
  const textnodes = collecttextnodes(nodes, options);
  return composeannotation(text, textnodes, options);
}

module.exports = {
  defaults,
  collecttextnodes,
  composeannotation,
  build
};
