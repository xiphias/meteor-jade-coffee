
var template = `p
  | hello world`;

Tinytest.add("JadeCompiler - parse templates", function(test) {
  test.equal(JadeCompiler.parse(template), { children: ["hello world"] });
});

Tinytest.add("JadeCompiler - parse files", function(test) {
  test.throws(
    function(){ JadeCompiler.parse(template, {fileMode: true}); },
    "Tag must be in a template on line 1");

  var template2 = `template(name='hello')
  p
    | hello world`;
  test.equal(JadeCompiler.parse(template2, {fileMode: true}), {
    head: null,
    body: null,
    bodyAttrs: {},
    templates: {
      hello: { children: ["hello world"] }
    }
  });
});

Tinytest.add("JadeCompiler - compile templates", function(test) {
  test.equal(JadeCompiler.compile(template),
  "(function() {\n  return HTML.P(\"hello world\");\n})");
});


var template3 = `template(name='hello')
  if helper arg1 arg2
    | hello world`;

Tinytest.add("JadeCompiler - parse if with named helper", function(test) {
  test.equal(JadeCompiler.parse(template3, {fileMode: true}), {
    head: null,
    body: null,
    bodyAttrs: {},
    templates: {
      hello: {"type":"BLOCKOPEN","path":["if"],
      "path":["if"],
      "args":[["PATH",["helper"]],["PATH",["arg1"]],["PATH",["arg2"]]],
      "content":"hello world"}
    }
  });
});

var template4 = `template(name='hello')
  if (nohelper > 2)
    | hello world`;


Tinytest.add("JadeCompiler - parse anonymous function", function(test) {
  test.equal(JadeCompiler.parse(template4, {fileMode: true}), {
    head: null,
    body: null,
    bodyAttrs: {},
    templates: {
      hello: {"type":"BLOCKOPEN","path":["if"],
      "args":[["PATH",["_jade_line2"]]],
      "origArgs":"nohelper > 2","newArgs":"_jade_line2",
      "content":"hello world",
      "helpers":{"_jade_line2":"nohelper > 2"}
      }
    },
    templatesHelpers: {
      hello: {
        "_jade_line2": "nohelper > 2"
      }
    }
  });
});