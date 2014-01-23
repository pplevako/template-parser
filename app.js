/**
 * Module dependencies.
 */
var render = require('./render');

var template = "<table>\n" +
  "{# This is a comment#}" +
  "{% table %}" +
  "  <tr>\n" +
  "    {% . %}" +
  "<td>" +
  "{{fruits}}" +
  "{% nested %}" +
  " {{ . }}" +
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
  nested: ["are", "nested"]
};

var result = render(template, data);
console.log("Result:\n" + result);