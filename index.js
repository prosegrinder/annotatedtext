"use strict";

const defaults = {
  "children": function (node) {
    return node.children;
  },
  "annotatetextnode": function (node) {
    if (node.type === "text") {
      return {
        "text": node.value,
        "offset": {
          "start": node.position.start.offset,
          "end": node.position.end.offset
        }
      }
    } else {
      return null;
    }
  },
  "interpreter": function (text = "") {
    let count = (text.match(/\n/g) || []).length;
    return "\n".repeat(count);
  }
};

function collecttextnodes(ast, annotatetextnode = defaults.annotatetextnode, getchildren = defaults.children) {
  var textannotations = [];

  function recurse(node) {
    const annotation = annotatetextnode(node);
    if (annotation !== null) {
      textannotations.push(annotation);
    }
    const children = getchildren(node);
    if (children !== null && Array.isArray(children)) {
      children.forEach(recurse);
    }
  }

  recurse(ast);
  return textannotations;
}

function composeannotation(text, annotatedtextnodes, interpreter = defaults.interpreter) {
  let annotations = [];
  let prior = null;
  for (let current of annotatedtextnodes) {
    let priorend = (prior !== null) ? prior.offset.end : 0;
    let markuptext = text.substring(priorend, current.offset.start);
    let interpreted = interpreter(markuptext);
    annotations.push({
      "markup": markuptext,
      "interpretAs": interpreted,
      "offset": { "start": priorend, "end": current.offset.start }
    });
    annotations.push(current);
    prior = current;
  }
  // Always add a final markup node.
  let markuptext = text.substring(prior.offset.end, text.length);
  let interpreted = interpreter(markuptext);
  annotations.push({
    "markup": markuptext,
    "interpretAs": interpreted,
    "offset": { "start": prior.offset.end, "end": text.length }
  });
  return { "annotation": annotations };
}

function build(text, parse, wsinterpreter = defaults.interpreter, annotatetextnode = defaults.annotatetextnode, getchildren = defaults.children) {
  const nodes = parse(text);
  const textnodes = collecttextnodes(nodes, annotatetextnode, getchildren);
  return composeannotation(text, textnodes, wsinterpreter);
}

module.exports = {
  collecttextnodes,
  composeannotation,
  build
};
