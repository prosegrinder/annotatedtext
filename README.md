# annotatedtext

[![Node.js CI](https://github.com/prosegrinder/annotatedtext/actions/workflows/npm-ci.yaml/badge.svg)](https://github.com/prosegrinder/annotatedtext/actions/workflows/npm-ci.yaml)

A lightweight JavaScript library for converting markup documents into an
annotated text format consumable by LanguageTool as
[AnnotatedText](https://languagetool.org/development/api/org/languagetool/markup/AnnotatedText.html).

## Documentation

For details, please see
[https://www.prosegrinder.org/annotatedtext](https://www.prosegrinder.org/annotatedtext).

## Installation

npm:

```sh
npm install annotatedtext –save
```

## Usage

`annotatedtext` provides a basic set of types and functions useful for
converting markup documents into
[AnnotatedText](https://languagetool.org/development/api/org/languagetool/markup/AnnotatedText.html).

For example, to convert [Markdown](https://www.markdownguide.org/) to
[AnnotatedText](https://languagetool.org/development/api/org/languagetool/markup/AnnotatedText.html)
using the nifty
[remark-parse](https://github.com/remarkjs/remark/tree/main/packages/remark-parse)
parser, you would do:

```js
import { compose } from "annotatedtext";
import { parse } from "remark-parse";
import { unified } from "unified";

const text = "This is a sentence.";
const processor = unified()
  .use(remarkparse, options.remarkoptions)
  .use(frontmatter, ["yaml", "toml"])
  .parse(text);

const annotatedtext = compose(text, parse);
JSON.stringify(annotatedtext);
```

Running the object through `JSON.stringfy()` creates a string suitable for
passing to LanguageTool's `data` parameter.

## Implemented Parsers

The following packages wrap `annotatedtext` for specific parsers:

- [`annotatedtext-remark`](https://github.com/prosegrinder/annotatedtext-remark)
  for markdown using
  [remark-parse](https://github.com/remarkjs/remark/tree/main/packages/remark-parse).
- [`annotatedtext-rehype`](https://github.com/prosegrinder/annotatedtext-rehype)
  for html using
  [rehype-parse](https://github.com/rehypejs/rehype/tree/main/packages/rehype-parse).
