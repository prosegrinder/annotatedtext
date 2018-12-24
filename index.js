"use strict"

var unified = require("unified");
var mark = require("remark-parse");
var hype = require("rehype-parse")

function collect(tokens, nodes = []) {
  if (Array.isArray(tokens)) {
    for (let token of tokens) {
      const children = token.children;
      if (token.type === "text") {
        nodes.push({
          "text": token.value, "offset":
            { "start": token.position.start.offset, "end": token.position.end.offset }
        });
      }
      if (children) {
        nodes = collect(children, nodes);
      }
    }
    return nodes;
  } else {
    return collect([tokens], nodes);
  }
}

function compose(text, textnodes) {
  var annotatednodes = [];
  var prior = null;
  for (let current of textnodes) {
    if (prior != null) {
      annotatednodes.push({
        "markup": text.substring(prior.offset.end, current.offset.start),
        "offset": { "start": prior.offset.end, "end": current.offset.start }
      });
    } else {
      if (current.offset.start > 0) {
        annotatednodes.push({
          "markup": text.substring(0, current.offset.start),
          "offset": { "start": 0, "end": current.offset.start }
        });
      }
    }
    annotatednodes.push(current);
    prior = current;
  }
  if (text.length > prior.offset.end) {
    annotatednodes.push({
      "markup": text.substring(prior.offset.end, text.length),
      "offset": { "start": prior.offset.end, "end": text.length }
    });
  }
  return { "annotation": annotatednodes };
}

function build(text, parse) {
  const root = parse(text);
  const textnodes = collect(root);
  return compose(text, textnodes);
}

function html(text, rehypeoptions = {emitParseErrors: false, duplicateAttribute: false}) {
  const processor = unified()
    .use(hype, rehypeoptions);
  return build(text, processor.parse);
}

function md(text, remarkoptions = { commonmark: true }) {
  const processor = unified()
    .use(mark, remarkoptions);
  return build(text, processor.parse);
}

module.exports = {
  md,
  html,
  build,
  collect,
  compose
}
