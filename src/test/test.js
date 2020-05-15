"use strict";

var expect = require("chai").expect;
var unified = require("unified");
var remarkparse = require("remark-parse");
var builder = require("../../out/index");
var fs = require("fs");

var options = builder.defaults;
options.interpretmarkup = function (text) {
  let count = (text.match(/\n/g) || []).length;
  return "\n".repeat(count);
};

describe("#collecttextnodes()", function () {

  it("should return the expected array of text nodes", function () {
    const text = fs.readFileSync("./src/test/test.md", "utf8");
    const ast = JSON.parse(fs.readFileSync("./src/test/ast.json", "utf8"));
    const expected = JSON.parse(fs.readFileSync("./src/test/textnodes.json", "utf8"));
    const result = builder.collecttextnodes(ast, text, options);
    fs.writeFileSync("./out/test/textnodes.json", JSON.stringify(result), "utf8");
    expect(result).to.deep.equal(expected);
  });

});

describe("#composeannotation()", function () {

  it("should return the expected annotated text object", function () {
    const expected = JSON.parse(fs.readFileSync("./src/test/annotatedtext.json", "utf8"));
    const text = fs.readFileSync("./src/test/test.md", "utf8");
    const textnodes = JSON.parse(fs.readFileSync("./src/test/textnodes.json", "utf8"));
    const result = builder.composeannotation(text, textnodes, options);
    expect(result).to.deep.equal(expected);
  });

});

describe("#build()", function () {

  it("should return the expected annotated text object", function () {
    const expected = JSON.parse(fs.readFileSync("./src/test/annotatedtext.json", "utf8"));
    const text = fs.readFileSync("./src/test/test.md", "utf8");
    const processor = unified()
      .use(remarkparse, { commonmark: true });
    const result = builder.build(text, processor.parse, options);
    expect(result).to.deep.equal(expected);
  });

  it("should match the original document exactly", function () {
    const expected = fs.readFileSync("./src/test/test.md", "utf8");
    const processor = unified()
      .use(remarkparse, { commonmark: false, gfm: true });
    const annotatedtext = builder.build(expected, processor.parse, options);
    const annotation = annotatedtext.annotation;
    let result = "";
    for (let node of annotation) {
      const text = node.text ? node.text : node.markup;
      result += text;
    }
    expect(result).to.equal(expected);
  });

  it("should return the expected annotated text with backslashes object", function () {
    const expected = JSON.parse(fs.readFileSync("./src/test/escape-character.json", "utf8"));
    const text = fs.readFileSync("./src/test/escape-character.md", "utf8");
    const processor = unified()
      .use(remarkparse, { commonmark: true });
    const result = builder.build(text, processor.parse, options);
    expect(result).to.deep.equal(expected);
  });

  it("should match the original document with backslashes exactly", function () {
    const expected = fs.readFileSync("./src/test/escape-character.md", "utf8");
    const processor = unified()
      .use(remarkparse, { commonmark: true });
    const annotatedtext = builder.build(expected, processor.parse, options);
    const annotation = annotatedtext.annotation;
    let result = "";
    for (let node of annotation) {
      const text = node.text ? node.text : node.markup;
      result += text;
    }
    expect(result).to.equal(expected);
  });

});
