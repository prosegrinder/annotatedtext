[![Build Status](https://travis-ci.org/languagetool-language-server/annotatedtext.svg?branch=master)](https://travis-ci.org/languagetool-language-server/annotatedtext)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6358e514e62e477d98469e070535eb24)](https://www.codacy.com/app/LanguageTool-Language-Server/annotatedtext?utm_source=github.com&utm_medium=referral&utm_content=languagetool-language-server/annotatedtext&utm_campaign=Badge_Grade)

# annotatedtext

A lightweight JavaScript library for converting markup documents into an annotated text format consumable by LanguageTool.

# Usage

To generate annotated text from markdown, leveraging [remark-parse](https://github.com/remarkjs/remark/tree/master/packages/remark-parse):

```js
"use strict";
var builder = require("annotatedtext");
var markdown = "# Some Markdown, possibly read from a file.";
var annotatedtext = builder.md(markdown);
```

To generate annotated text from html, leveraging [rehyp-parse](https://github.com/rehypejs/rehype/tree/master/packages/rehype-parse):

```js
"use strict";
var builder = require("annotatedtext");
var hypertext = "# Some HTML, possibly read from a file.";
var annotatedtext = builder.html(hypertext);
```

Additional formats can be implemented using the [API](#API). See below for details.


# Motivation

Provide an easier way of running LanguageTool on markup documents by separating the text from the markup.

# Installation

npm:

```sh
npm install annotatedtext
```

# API

## `build(text, parse)`

## `compose(text, textnodes)`

## `collect(tokens, [nodes])`

# Tests

Unit tests are also run via npm:

```sh
npm test
```

# Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

# License

[MIT](LICENSE) © David L. Day
