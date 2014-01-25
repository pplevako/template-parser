/**
 * Module dependencies.
 */
var render = require('./render');

//var test = ".";
//
//var res = test.split(':');

var template =
  "{{ capitals:capitalize }}\n" +
  "{{ wowSoManySpaces:trim:upper }}\n" +
  "{{ lower:lower }}\n" +
  "<table>\n" +
  "{# This is a comment#}" +
  "{% table %}" +
  "  <tr>\n" +
  "    {% . %}" +
  "<td>" +
  "{{fruits:upper}}" +
  "{% nested %}" +
  " {{ .:upper }}" +
  "{% / %}" +
  " {{ . }}" +
  "</td>" +
  "{% / %}\n" +
  "  </tr>\n" +
  "{% / %}" +
  "</table>\n";

console.log("Template:\n" + template);

var data = {
  fruits: "Fruits",
  table: [
    [1, 2, 3],
    [4, 5, 6]
  ],
  nested: ["are", "nested"],
  lower: "LOWER",
  wowSoManySpaces: "  spaaaaace  ",
  capitals: "london paris oslo"
};

var result = render(template, data);
console.log("Result:\n" + result);