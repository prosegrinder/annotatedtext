"use strict";

function collect(astnodes, getoffsetstart, getoffsetend, getchildren, textnodes = []) {
  if (Array.isArray(astnodes)) {
    for (let astnode of astnodes) {
      const astchildren = getchildren(astnode);
      if (astnode.type === "text") {
        textnodes.push({
          "text": astnode.value, "offset":
            { "start": getoffsetstart(astnode), "end": getoffsetend(astnode) }
        });
      }
      if (astchildren) {
        textnodes = collect(astchildren, getoffsetstart, getoffsetend, getchildren, textnodes);
      }
    }
    return textnodes;
  } else {
    return collect([astnodes], getoffsetstart, getoffsetend, getchildren, textnodes);
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

function build(text, parse, getoffsetstart, getoffsetend, getchildren) {
  const astnodes = parse(text);
  const textnodes = collect(astnodes, getoffsetstart, getoffsetend, getchildren);
  return compose(text, textnodes);
}

module.exports = {
  collect,
  compose,
  build
};
