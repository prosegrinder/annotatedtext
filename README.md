# annotatedtext

[![Build Status](https://travis-ci.org/prosegrinder/annotatedtext.svg?branch=master)](https://travis-ci.org/prosegrinder/annotatedtext)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6358e514e62e477d98469e070535eb24)](https://www.codacy.com/app/ProseGrinder/annotatedtext?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=prosegrinder/annotatedtext&amp;utm_campaign=Badge_Grade)

A lightweight JavaScript library for converting markup documents into an annotated text format
consumable by LanguageTool as [AnnotatedText](https://languagetool.org/development/api/org/languagetool/markup/AnnotatedText.html).

## Usage

To generate annotated text from markdown, leveraging [remark-parse](https://github.com/remarkjs/remark/tree/master/packages/remark-parse):

```js
"use strict";
var builder = require("annotatedtext");
var markdown = "# Some Markdown, possibly read from a file.";
var annotatedtext = builder.md(markdown);
JSON.stringify(annotatedtext);
```

To generate annotated text from html, leveraging [rehyp-parse](https://github.com/rehypejs/rehype/tree/master/packages/rehype-parse):

```js
"use strict";
var builder = require("annotatedtext");
var hypertext = "<p>Some HTML, possibly read from a file.</p>";
var annotatedtext = builder.html(hypertext);
JSON.stringify(annotatedtext);
```

Extend for other formats using the [API](#API). See below for details.

## Motivation

Provide an easier way of running LanguageTool on markup documents by separating the text from the markup.

## Installation

npm:

```sh
npm install annotatedtext
```

## API

### `build(text, parse)`

```js
"use strict";
var builder = require("annotatedtext");
const processor = unified()
  .use(mark, { commonmark: true });
var annotatedtext = builder.build(text, processor.parse);
JSON.stringify(annotatedtext);
```

#### `text`

The complete document.

#### `parse`

A function that parses a markup document and returns an abstract syntax tree.
Bonus points for adhering to the [unist](https://github.com/syntax-tree/unist)
specification. Nodes must have attributes for `type` having 'text' for text nodes,
`value` having the original text of the node, and `offset.start` and `offset.end`
having start and end offsets in the original document.

## Tests

Unit tests are also run via npm:

```sh
npm test
```

## License

[MIT](LICENSE) © David L. Day
