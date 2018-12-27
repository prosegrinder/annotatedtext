"use strict";

const offsetstart = function (node) { return node.position.start.offset; };
const offsetend = function (node) { return node.position.end.offset; };
const children = function (node) { return node.children; };
const textnode = function (node) { return node.type === "text"; };
const textnodevalue = function (node) { return node.value; };

function collect(nodes, istextnode = textnode, gettext = textnodevalue,
    getoffsetstart = offsetstart, getoffsetend = offsetend, getchildren = children, textnodes = []) {
  if (Array.isArray(nodes)) {
    for (let node of nodes) {
      const children = getchildren(node);
      if (istextnode(node)) {
        textnodes.push({
          "text": gettext(node), "offset":
            { "start": getoffsetstart(node), "end": getoffsetend(node) }
        });
      }
      if (children) {
        textnodes = collect(children, istextnode, gettext, getoffsetstart, getoffsetend, getchildren, textnodes);
      }
    }
    return textnodes;
  } else {
    return collect([nodes], istextnode, gettext, getoffsetstart, getoffsetend, getchildren, textnodes);
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

function build(text, parse, istextnode = textnode, gettext = textnodevalue,
    getoffsetstart = offsetstart, getoffsetend = offsetend, getchildren = children) {
  const nodes = parse(text);
  const textnodes = collect(nodes, istextnode, gettext, getoffsetstart, getoffsetend, getchildren);
  return compose(text, textnodes);
}

module.exports = {
  collect,
  compose,
  build
};
