var render = require('../render');

describe("A render function", function () {

  it("parses the template with a substitute and block", function () {
    var template = "<h1>Category: {{category}}</h1>\n" +
      "<ol>\n" +
      "{# items must be non-empty for valid markup #}" +
      "{% items %}" +
      "  <li>{{ . }}</li>\n" +
      "{% / %}" +
      "</ol>\n";

    var result = render(template, {
      category: "Fruits",
      items: ["Mango", "Banana", "Orange" ]
    });

    var expected = "<h1>Category: Fruits</h1>\n" +
      "<ol>\n" +
      "  <li>Mango</li>\n" +
      "  <li>Banana</li>\n" +
      "  <li>Orange</li>\n" +
      "</ol>\n";

    expect(result).toEqual(expected);
  });

  it("parses a template with a nested block", function () {
    var data = { table: [
      [1, 2, 3],
      [4, 5, 6]
    ] };

    var template = "<table>\n" +
      "{% table %}" +
      "  <tr>\n" +
      "    {% . %}" +
      "<td>{{ . }}</td>" +
      "{% / %}" +
      "\n  </tr>\n" +
      "{% / %}" +
      "</table>\n";

    var result = render(template, data);

    var expected = "<table>\n" +
      "  <tr>\n" +
      "    <td>1</td><td>2</td><td>3</td>\n" +
      "  </tr>\n" +
      "  <tr>\n" +
      "    <td>4</td><td>5</td><td>6</td>\n" +
      "  </tr>\n" +
      "</table>\n";

    expect(result).toEqual(expected);
  });

  it("matches :default() filter", function () {
    var data = { ok: "ok" };
    var template = "{{ missingValue : default ({{are here!}}) }} {{ ok: default (not replaced)}}";

    var result = render(template, data);
    expect(result).toEqual("{{are here!}} ok");
  });

  it("matches any filters combined", function () {
    var data = { hello: " world  " };
    var template = "{{ hello : upper:capitalize:trim }} {{ hello : capitalize:trim }}";

    var result = render(template, data);
    expect(result).toEqual("WORLD World");
  });

});