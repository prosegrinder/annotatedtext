'use strict'

var unified = require('unified');
var mark = require('remark-parse');
var hype = require('rehype-parse')

module.exports = {
  md,
  html,
  build,
  collect,
  compose
}

function html(text, rehypeoptions = {emitParseErrors: false, duplicateAttribute: false}) {
  const processor = unified()
    .use(hype, rehypeoptions);
    const annotatedtext = build(text, processor.parse);
    return annotatedtext;
}

function md(text, remarkoptions = { commonmark: true }) {
  const processor = unified()
    .use(mark, remarkoptions)
  const annotatedtext = build(text, processor.parse);
  return annotatedtext;
}

function build(text, parse) {
  const root = parse(text);
  const textnodes = collect([root]);
  const annotatedtext = compose(text, textnodes);
  return annotatedtext;
}

function collect(tokens, nodes = []) {
  for (var i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const children = token.children;
    if (token.type == 'text') {
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
}

function compose(text, textnodes) {
  var annotatednodes = [];
  var prior = null;
  for (var i = 0; i < textnodes.length; i++) {
    const current = textnodes[i];
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
