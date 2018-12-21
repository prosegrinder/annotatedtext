'use strict';

var expect = require('chai').expect;
var builder = require('../index');
var fs = require('fs');

describe("#md()", function () {

  it('should return the expected annotated text object', function () {
    var expected = JSON.parse(fs.readFileSync('./test/annotatedtext/markdown.json', 'utf8'));
    var result = builder.md(fs.readFileSync('./test/test.md', 'utf8'));
    expect(result).to.deep.equal(expected);
  });

  it('should match the original document exactly', function () {
    var expected = fs.readFileSync('./test/test.md', 'utf8');
    var annotatedtext = builder.md(expected);
    var annotation = annotatedtext.annotation
    var result = '';
    for (var i = 0; i < annotation.length; i++) {
      var node = annotation[i];
      var text = node.text ? node.text : node.markup;
      result += text;
    }
    expect(result).to.equal(expected);
  });

});

describe("#html()", function () {

  it('should return the expected annotated text object', function () {
    var expected = JSON.parse(fs.readFileSync('./test/annotatedtext/html.json', 'utf8'));
    var result = builder.html(fs.readFileSync('./test/test.html', 'utf8'));
    expect(result).to.deep.equal(expected);
  });

  it('should match the original document exactly', function () {
    var expected = fs.readFileSync('./test/test.html', 'utf8');
    var annotatedtext = builder.html(expected);
    var annotation = annotatedtext.annotation
    var result = '';
    for (var i = 0; i < annotation.length; i++) {
      var node = annotation[i];
      var text = node.text ? node.text : node.markup;
      result += text;
    }
    expect(result).to.equal(expected);
  });

});
