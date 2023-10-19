/* eslint-disable @typescript-eslint/no-var-requires */
// "use strict";

import chai from "chai";
import { unified } from "unified";
import remarkparse from "remark-parse";
import * as builder from "../out/index.js";
import fs from "fs";

var options = builder.defaults;
options.interpretmarkup = function (text) {
  let count = (text.match(/\n/g) || []).length;
  return "\n".repeat(count);
};

describe("#collecttextnodes()", function () {
  it("should return the expected array of text nodes", function () {
    const text = fs.readFileSync("./tests/test.md", "utf8");
    const ast = JSON.parse(fs.readFileSync("./tests/ast.json", "utf8"));
    const expected = JSON.parse(
      fs.readFileSync("./tests/textnodes.json", "utf8"),
    );
    const result = builder.collecttextnodes(ast, text, options);
    // fs.writeFileSync("./out/ts/textnodes.json", JSON.stringify(result), "utf8");
    chai.expect(result).to.deep.equal(expected);
  });
});

describe("#composeannotation()", function () {
  it("should return the expected annotated text object", function () {
    const expected = JSON.parse(
      fs.readFileSync("./tests/annotatedtext.json", "utf8"),
    );
    const text = fs.readFileSync("./tests/test.md", "utf8");
    const textnodes = JSON.parse(
      fs.readFileSync("./tests/textnodes.json", "utf8"),
    );
    const result = builder.composeannotation(text, textnodes, options);
    // fs.writeFileSync(
    //   "./out/ts/annotatedtext-compose.json",
    //   JSON.stringify(result),
    //   "utf8",
    // );
    chai.expect(result).to.deep.equal(expected);
  });
});

// describe("#build()", function () {
//   it("should return the expected annotated text object", function () {
//     const expected = JSON.parse(
//       fs.readFileSync("./tests/annotatedtext.json", "utf8"),
//     );
//     const text = fs.readFileSync("./tests/test.md", "utf8");
//     const processor = unified().use(remarkparse, { commonmark: true });
//     const result = builder.build(text, processor.parse, options);
//     // fs.writeFileSync(
//     //   "./out/ts/annotatedtext-build.json",
//     //   JSON.stringify(result),
//     //   "utf8",
//     // );
//     chai.expect(result).to.deep.equal(expected);
//   });

//   it("should match the original document exactly", function () {
//     const expected = fs.readFileSync("./tests/test.md", "utf8");
//     const processor = unified().use(remarkparse, {
//       commonmark: false,
//       gfm: true,
//     });
//     const annotatedtext = builder.build(expected, processor.parse, options);
//     const annotation = annotatedtext.annotation;
//     let result = "";
//     for (let node of annotation) {
//       const text = node.text ? node.text : node.markup;
//       result += text;
//     }
//     // fs.writeFileSync("./out/ts/test.md", result, "utf8");
//     chai.expect(result).to.equal(expected);
//   });

//   it("should return the expected annotated text with backslashes object", function () {
//     const expected = JSON.parse(
//       fs.readFileSync("./tests/escape-character.json", "utf8"),
//     );
//     const text = fs.readFileSync("./tests/escape-character.md", "utf8");
//     const processor = unified().use(remarkparse, { commonmark: true });
//     const result = builder.build(text, processor.parse, options);
//     // fs.writeFileSync(
//     //   "./out/ts/escape-character.json",
//     //   JSON.stringify(result),
//     //   "utf8",
//     // );
//     chai.expect(result).to.deep.equal(expected);
//   });

//   it("should match the original document with backslashes exactly", function () {
//     const expected = fs.readFileSync("./tests/escape-character.md", "utf8");
//     const processor = unified().use(remarkparse, { commonmark: true });
//     const annotatedtext = builder.build(expected, processor.parse, options);
//     const annotation = annotatedtext.annotation;
//     let result = "";
//     for (let node of annotation) {
//       const text = node.text ? node.text : node.markup;
//       result += text;
//     }
//     // fs.writeFileSync("./out/ts/escape-character.md", result, "utf8");
//     chai.expect(result).to.equal(expected);
//   });
// });

describe("#compose()", function () {
  it("should return the expected annotated text object", function () {
    const expected = JSON.parse(
      fs.readFileSync("./tests/annotatedtext.json", "utf8"),
    );
    const text = fs.readFileSync("./tests/test.md", "utf8");
    const nodes = JSON.parse(fs.readFileSync("./tests/nodes.json", "utf8"));
    const result = builder.compose(text, nodes, options);
    chai.expect(result).to.deep.equal(expected);
  });

  it("should match the original document exactly", function () {
    const expected = fs.readFileSync("./tests/test.md", "utf8");
    const nodes = JSON.parse(fs.readFileSync("./tests/nodes.json", "utf8"));
    const annotatedtext = builder.compose(expected, nodes, options);
    const annotation = annotatedtext.annotation;
    let result = "";
    for (let node of annotation) {
      const text = node.text ? node.text : node.markup;
      result += text;
    }
    chai.expect(result).to.equal(expected);
  });

  it("should return the expected annotated text with backslashes object", function () {
    const expected = JSON.parse(
      fs.readFileSync("./tests/escape-character.json", "utf8"),
    );
    const text = fs.readFileSync("./tests/escape-character.md", "utf8");
    const nodes = JSON.parse(
      fs.readFileSync("./tests/escape-character-nodes.json", "utf8"),
    );
    const result = builder.compose(text, nodes, options);
    chai.expect(result).to.deep.equal(expected);
  });

  it("should match the original document with backslashes exactly", function () {
    const expected = fs.readFileSync("./tests/escape-character.md", "utf8");
    const nodes = unified()
      .use(remarkparse, { commonmark: true })
      .parse(expected);
    const annotatedtext = builder.compose(expected, nodes, options);
    const annotation = annotatedtext.annotation;
    let result = "";
    for (let node of annotation) {
      const text = node.text ? node.text : node.markup;
      result += text;
    }
    chai.expect(result).to.equal(expected);
  });
});
