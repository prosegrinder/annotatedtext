"use strict";

var expect = require("chai").expect;
var builder = require("../index");
var fs = require("fs");

describe("#md()", function () {

  it("should return the expected annotated text object", function () {
    const expected = JSON.parse(fs.readFileSync("./test/annotatedtext/markdown.json", "utf8"));
    const result = builder.md(fs.readFileSync("./test/test.md", "utf8"));
    expect(result).to.deep.equal(expected);
  });

  it("should match the original document exactly", function () {
    const expected = fs.readFileSync("./test/test.md", "utf8");
    const annotatedtext = builder.md(expected);
    const annotation = annotatedtext.annotation
    let result = "";
    for (let node of annotation) {
      const text = node.text ? node.text : node.markup;
      result += text;
    }
    expect(result).to.equal(expected);
  });

});

describe("#html()", function () {

  it("should return the expected annotated text object", function () {
    const expected = JSON.parse(fs.readFileSync("./test/annotatedtext/html.json", "utf8"));
    const result = builder.html(fs.readFileSync("./test/test.html", "utf8"));
    expect(result).to.deep.equal(expected);
  });

  it("should match the original document exactly", function () {
    const expected = fs.readFileSync("./test/test.html", "utf8");
    const annotatedtext = builder.html(expected);
    const annotation = annotatedtext.annotation;
    let result = "";
    for (let node of annotation) {
      const text = node.text ? node.text : node.markup;
      result += text;
    }
    expect(result).to.equal(expected);
  });

});
