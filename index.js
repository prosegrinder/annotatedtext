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
  }
};

function collecttext(ast, annotatetextnode = defaults.annotatetextnode, getchildren = defaults.children) {
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

function compose(text, annotatedtextnodes) {
  let annotations = [];
  let prior = null;
  for (let current of annotatedtextnodes) {
    if (prior !== null) {
      annotations.push({
        "markup": text.substring(prior.offset.end, current.offset.start),
        "offset": { "start": prior.offset.end, "end": current.offset.start }
      });
    } else {
      if (current.offset.start > 0) {
        annotations.push({
          "markup": text.substring(0, current.offset.start),
          "offset": { "start": 0, "end": current.offset.start }
        });
      }
    }
    annotations.push(current);
    prior = current;
  }
  // Always add a final markup node.
  annotations.push({
    "markup": text.substring(prior.offset.end, text.length),
    "offset": { "start": prior.offset.end, "end": text.length }
  });
  return { "annotation": annotations };
}

function build(text, parse, annotatetextnode = defaults.annotatetextnode, getchildren = defaults.children) {
  const nodes = parse(text);
  const textnodes = collecttext(nodes, annotatetextnode, getchildren);
  return compose(text, textnodes);
}

module.exports = {
  collecttext,
  compose,
  build
};
