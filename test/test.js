"use strict";

var expect = require("chai").expect;
var unified = require("unified");
var remarkparse = require("remark-parse");
var builder = require("../index");
var fs = require("fs");

const getchildren = function (node) { return node.children; };
const getoffsetstart = function (node) { return node.position.start.offset; };
const getoffsetend = function (node) { return node.position.end.offset; };

describe("#collect()", function () {

  it("should return the expected array of text nodes", function () {
    const ast = JSON.parse(fs.readFileSync("./test/ast.json", "utf8"));
    const expected = JSON.parse(fs.readFileSync("./test/textnodes.json", "utf8"));
    const result = builder.collect(ast, getoffsetstart, getoffsetend, getchildren);
    expect(result).to.deep.equal(expected);
  });

});

describe("#compose()", function () {

  it("should return the expected annotated text object", function () {
    const expected = JSON.parse(fs.readFileSync("./test/annotatedtext.json", "utf8"));
    const text = fs.readFileSync("./test/test.md", "utf8");
    const textnodes = JSON.parse(fs.readFileSync("./test/textnodes.json", "utf8"));
    const result = builder.compose(text, textnodes);
    expect(result).to.deep.equal(expected);
  });

});

describe("#build()", function () {

  it("should return the expected annotated text object", function () {
    const expected = JSON.parse(fs.readFileSync("./test/annotatedtext.json", "utf8"));
    const text = fs.readFileSync("./test/test.md", "utf8");
    const processor = unified()
      .use(remarkparse, { commonmark: true });
    const result = builder.build(text, processor.parse, getoffsetstart, getoffsetend, getchildren);
    expect(result).to.deep.equal(expected);
  });

  it("should match the original document exactly", function () {
    const expected = fs.readFileSync("./test/test.md", "utf8");
    const processor = unified()
      .use(remarkparse, { commonmark: true });
    const annotatedtext = builder.build(expected, processor.parse, getoffsetstart, getoffsetend, getchildren);
    const annotation = annotatedtext.annotation;
    let result = "";
    for (let node of annotation) {
      const text = node.text ? node.text : node.markup;
      result += text;
    }
    expect(result).to.equal(expected);
  });

});
