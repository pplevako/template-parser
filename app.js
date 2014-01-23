/**
 * Module dependencies.
 */
var render = require('./render');

var template = "<table>\n" +
  //TODO: bugged
  "{# This is a comment#}" +
  "{{category}}\n " +
  "{% table %}" +
  "   <tr>\n" +
//    "{% test %}" +
//    " {{ . }} " +
//    "{% / %}" +
  "      {% . %}" +
  "<td>{{ . }}  {{ . }} {{category}}</td>" +
  "{% / %}" +
  "\n   </tr>\n" +
  "{% / %}" +
  "</table>\n";

var data = {
  category: "Fruits",
  table: [
    [1, 2, 3],
    [4, 5, 6]
  ],
  test: [7, 8, 9]
};

var result = render(template, data);
console.log(result);