# annotatedtext

[![Node.js CI](https://github.com/prosegrinder/annotatedtext/actions/workflows/npm-ci.yaml/badge.svg)](https://github.com/prosegrinder/annotatedtext/actions/workflows/npm-ci.yaml)

A lightweight JavaScript library for converting markup documents into an
annotated text format consumable by LanguageTool as
[AnnotatedText](https://languagetool.org/development/api/org/languagetool/markup/AnnotatedText.html).

## Usage

See [API](#API) below for details.

## Motivation

Provide an easier way of running LanguageTool on documents by separating the
text from the markup.

## Installation

npm:

```sh
npm install annotatedtext
```

## API

### `build(text, parse, options = defaults)`

Returns Annotated Text as described by LanguageTool's API:

```json
{
  "annotation": [
    { "text": "A " },
    { "markup": "<b>" },
    { "text": "test" },
    { "markup": "</b>" }
  ]
}
```

Run the object through `JSON.stringfy()` to get a string suitable for passing to
LanguageTool's `data` parameter.

This is the main function you'll use in implementing for different parsers.

```js
import * as builder from ‘annotatedtext’;
const processor = unified().use(mark, { commonmark: true });
var annotatedtext = builder.build(text, processor.parse);
JSON.stringify(annotatedtext);
```

- `text`: The text from the markup document in its original form.
- `parse`: A function that parses a markup document and returns an abstract
  syntax tree.
- _`options`_: (optional) See [`defaults`](#defaults).

### `collecttextnodes(ast, options = defaults)`

Returns an array of [annotated text nodes](<#annotatetextnode(node)>) used in
the final annotated text object.

- `ast`: An abstract syntax tree.
- _`options`_: (optional) See [`defaults`](#defaults).

### `composeannotation(text, annotatedtextnodes, options = defaults)`

- `text`: The text from the markup document in its original form.
- `annotatedtextnodes`: An array of an array of
  [annotated text nodes](<#annotatetextnode(node)>) such as produced by
  [`collecttextnodes`](<#collecttextnodes(ast,_options_=_defaults)>).
- _`options`_: (optional) See [`defaults`](#defaults).

### `defaults`

`annotatedtext` comes with the following default functions used throughout.

```js
const defaults = {
  children: function (node) {
    return node.children;
  },
  annotatetextnode: function (node) {
    if (node.type === "text") {
      return {
        text: node.value,
        offset: {
          start: node.position.start.offset,
          end: node.position.end.offset,
        },
      };
    } else {
      return null;
    }
  },
  interpretmarkup: function (text = "") {
    return "";
  },
};
```

Functions can be overriden by making a copy and assigning a new function. For
example, the tests use markdown and need to interpret new lines in the markup as
new lines. The interpretmarkup function is overriden as:

```js
var options = builder.defaults;
options.interpretmarkup = function (text) {
  let count = (text.match(/\n/g) || []).length;
  return "\n".repeat(count);
};
```

#### `children(node)`

Expected to return an array of child nodes.

#### `annotatetextnode(node)`

Expected to return a struture for a text ast node with at least the following:

- `text` is the natural language text from the node, devoid of all markup.
- `offset` contains offsets used to extract markup text from the original
  document.
  - `start` is the offset start of the text
  - `end` is the offset end of the text

```json
{
  "text": "A snippet of the natural language text from the document.",
  "offset": {
    "start": 1,
    "end": 57
  }
}
```

If the node is not a text node, it must return `null`;

#### `interpretmarkup(node)`

Used to make sure LanguageTool knows when markup represents some form of
whitespace. As mentioned above, the tests override this function to ensure new
lines captured as markup are also visible to LanguageTool.

```js
var options = builder.defaults;
options.interpretmarkup = function (text) {
  let count = (text.match(/\n/g) || []).length;
  return "\n".repeat(count);
};
```

## Tests

Unit tests are also run via npm:

```sh
npm test
```

## Implemented Parsers

The following packages wrap `annotatedtext` for specific parsers:

- [`annotatedtext-remark`](https://github.com/prosegrinder/annotatedtext-remark)
  for markdown using
  [remark-parse](https://github.com/remarkjs/remark/tree/main/packages/remark-parse).
- [`annotatedtext-rehype`](https://github.com/prosegrinder/annotatedtext-rehype)
  for html using
  [rehype-parse](https://github.com/rehypejs/rehype/tree/main/packages/rehype-parse).

## License

[MIT](LICENSE) © David L. Day
