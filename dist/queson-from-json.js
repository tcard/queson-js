// json2queson.js
function peg$subclass(child, parent) {
  function C() {
    this.constructor = child;
  }
  C.prototype = parent.prototype;
  child.prototype = new C();
}
function peg$SyntaxError(message, expected, found, location) {
  this.message = message;
  this.expected = expected;
  this.found = found;
  this.location = location;
  this.name = "SyntaxError";
  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}
peg$subclass(peg$SyntaxError, Error);
peg$SyntaxError.buildMessage = function(expected, found, location) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function(expectation) {
      return '"' + literalEscape(expectation.text) + '"';
    },
    class: function(expectation) {
      var escapedParts = expectation.parts.map(function(part) {
        return Array.isArray(part) ? classEscape(part[0]) + "-" + classEscape(part[1]) : classEscape(part);
      });
      return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
    },
    any: function() {
      return "any character";
    },
    end: function() {
      return "end of input";
    },
    other: function(expectation) {
      return expectation.description;
    },
    not: function(expectation) {
      return "not " + describeExpectation(expectation.expected);
    }
  };
  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }
  function literalEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function classEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }
  function describeExpected(expected2) {
    var descriptions = expected2.map(describeExpectation);
    var i, j;
    descriptions.sort();
    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }
    switch (descriptions.length) {
      case 1:
        return descriptions[0];
      case 2:
        return descriptions[0] + " or " + descriptions[1];
      default:
        return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
    }
  }
  function describeFound(found2) {
    return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
  }
  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};
function peg$parse(input, options) {
  options = options !== void 0 ? options : {};
  var peg$FAILED = {};
  var peg$startRuleIndices = { JSON_text: 0 };
  var peg$startRuleIndex = 0;
  var peg$literals = [
    "[",
    "{",
    "]",
    "}",
    ":",
    ",",
    "false",
    "null",
    "true",
    ".",
    "-",
    "+",
    "0",
    "_",
    " ",
    '"',
    "\\",
    "/",
    "b",
    "f",
    "n",
    "r",
    "t",
    "u"
  ];
  var peg$regexps = [
    /^[ \t\n\r]/,
    /^[1-9]/,
    /^[eE]/,
    /^[^\0-\x1F"\\]/,
    /^[0-9]/,
    /^[0-9a-f]/i
  ];
  var peg$expectations = [
    peg$literalExpectation("[", false),
    peg$literalExpectation("{", false),
    peg$literalExpectation("]", false),
    peg$literalExpectation("}", false),
    peg$literalExpectation(":", false),
    peg$literalExpectation(",", false),
    peg$otherExpectation("whitespace"),
    peg$literalExpectation("false", false),
    peg$literalExpectation("null", false),
    peg$literalExpectation("true", false),
    peg$otherExpectation("number"),
    peg$otherExpectation("string")
  ];
  var peg$functions = [
    function(value) {
      return value;
    },
    function(head, m) {
      return m;
    },
    function(head, tail) {
      return [head, ...tail].map((e) => e.name + "-" + e.value).join("_");
    },
    function(members) {
      return "X." + (members !== null ? members : "") + ".X";
    },
    function(name, value) {
      return { name, value };
    },
    function(head, v) {
      return v;
    },
    function(head, tail) {
      return [head, ...tail].join("_");
    },
    function(values) {
      return "I." + (values !== null ? values : "") + ".I";
    },
    function(a, b, c, d) {
      return (a || "") + b + (c || "") + (d || "");
    },
    function(s, i) {
      return "e" + (s || "") + i.join("");
    },
    function() {
      return text();
    },
    function() {
      return "";
    },
    function(chars) {
      return "w." + chars.join("") + ".w";
    },
    function() {
      return "..";
    },
    function() {
      return "._";
    },
    function() {
      return "_";
    },
    function() {
      return '"';
    },
    function() {
      return "\\";
    },
    function() {
      return "/";
    },
    function() {
      return ".b";
    },
    function() {
      return ".f";
    },
    function() {
      return ".n";
    },
    function() {
      return ".r";
    },
    function() {
      return ".t";
    },
    function(digits) {
      return ".u" + digits.join("");
    },
    function(sequence) {
      return sequence;
    }
  ];
  var peg$bytecode = [
    peg$decode(`%;';(/)$;'8#: $!!("'#`),
    peg$decode(`%;'7 2 "!6 #/%$;'+#)("'#`),
    peg$decode(`%;'7!2!"!6!#/%$;'+#)("'#`),
    peg$decode(`%;'7"2""!6"#/%$;'+#)("'#`),
    peg$decode(`%;'7#2#"!6##/%$;'+#)("'#`),
    peg$decode(`%;'7$2$"!6$#/%$;'+#)("'#`),
    peg$decode(`%;'7%2%"!6%#/%$;'+#)("'#`),
    peg$decode('7&<$4 "!5!#0(*4 "!5!#&='),
    peg$decode(";).A &;*.; &;+.5 &;,./ &;..) &;/.# &;9"),
    peg$decode(`7'2&"!6&#`),
    peg$decode(`7(2'"!6'#`),
    peg$decode('7)2("!6(#'),
    peg$decode(`%;"/\x7F#%;-/a#$%;&/1#;-/($8":!#"$ ("'#&'#0;*%;&/1#;-/($8":!#"$ ("'#&'#&8":"#"! &'#." &";$/'$8#:#$!!(#'#&'#`),
    peg$decode(`%;9/:#;%/1$;(/($8#:$$"" (#'#("'#&'#`),
    peg$decode(`%;!/\x7F#%;(/a#$%;&/1#;(/($8":%#"$ ("'#&'#0;*%;&/1#;(/($8":%#"$ ("'#&'#&8":&#"! &'#." &";#/'$8#:'$!!(#'#&'#`),
    peg$decode(`7*<%;6." &";5/8$;4." &";3." &"8$:(%$#"! ("'#=`),
    peg$decode('2)"!6)#'),
    peg$decode('4!"!5!#'),
    peg$decode('4""!5!#'),
    peg$decode(`%;2/K#;6.# &;7." &"$;>/&#0#*;>&&&#/($8#:)$"! (#'#&'#`),
    peg$decode(`%;0/<#$;>/&#0#*;>&&&#/&$8":*# ("'#&'#`),
    peg$decode(`;8.A &%%;1/,#$;>0#*;>&+")&'#/& 8!:*! )`),
    peg$decode('2*"!6*#'),
    peg$decode('%2+"!6+#/& 8!:+! )'),
    peg$decode('2,"!6,#'),
    peg$decode("7+<%;</9#$;:0#*;:&;</'$8#:,$!!(#'#&'#="),
    peg$decode(`%2)"!6)#/& 8!:-! ).\u0164 &%2-"!6-#/& 8!:.! ).\u014E &%2."!6.#/& 8!:/! ).\u0138 &;=.\u0132 &%;;/\u0128#%2/"!6/#/& 8!:0! ).\u0105 &%20"!60#/& 8!:1! ).\xEF &%21"!61#/& 8!:2! ).\xD9 &%22"!62#/& 8!:3! ).\xC3 &%23"!63#/& 8!:4! ).\xAD &%24"!64#/& 8!:5! ).\x97 &%25"!65#/& 8!:6! ).\x81 &%26"!66#/& 8!:7! ).k &%27"!67#/\\#%%;?/>#;?/5$;?/,$;?/#$+$)($'#(#'#("'#&'#/"!&,)/'$8":8#! ("'#&'#/'$8":9#! ("'#&'#`),
    peg$decode('20"!60#'),
    peg$decode('2/"!6/#'),
    peg$decode('4#"!5!#'),
    peg$decode('4$"!5!#'),
    peg$decode('4%"!5!#')
  ];
  var peg$currPos = 0;
  var peg$savedPos = 0;
  var peg$posDetailsCache = [{ line: 1, column: 1 }];
  var peg$expected = [];
  var peg$silentFails = 0;
  var peg$result;
  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleIndices)) {
      throw new Error(`Can't start parsing from rule "` + options.startRule + '".');
    }
    peg$startRuleIndex = peg$startRuleIndices[options.startRule];
  }
  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }
  function offset() {
    return peg$savedPos;
  }
  function range() {
    return [peg$savedPos, peg$currPos];
  }
  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }
  function expected(description, location2) {
    location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location2);
  }
  function error(message, location2) {
    location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildSimpleError(message, location2);
  }
  function peg$literalExpectation(text2, ignoreCase) {
    return { type: "literal", text: text2, ignoreCase };
  }
  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts, inverted, ignoreCase };
  }
  function peg$anyExpectation() {
    return { type: "any" };
  }
  function peg$endExpectation() {
    return { type: "end" };
  }
  function peg$otherExpectation(description) {
    return { type: "other", description };
  }
  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos];
    var p;
    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }
      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };
      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }
        p++;
      }
      peg$posDetailsCache[pos] = details;
      return details;
    }
  }
  var peg$VALIDFILENAME = typeof options.filename === "string" && options.filename.length > 0;
  function peg$computeLocation(startPos, endPos) {
    var loc = {};
    if (peg$VALIDFILENAME)
      loc.filename = options.filename;
    var startPosDetails = peg$computePosDetails(startPos);
    loc.start = {
      offset: startPos,
      line: startPosDetails.line,
      column: startPosDetails.column
    };
    var endPosDetails = peg$computePosDetails(endPos);
    loc.end = {
      offset: endPos,
      line: endPosDetails.line,
      column: endPosDetails.column
    };
    return loc;
  }
  function peg$begin() {
    peg$expected.push({ pos: peg$currPos, variants: [] });
  }
  function peg$expect(expected2) {
    var top = peg$expected[peg$expected.length - 1];
    if (peg$currPos < top.pos) {
      return;
    }
    if (peg$currPos > top.pos) {
      top.pos = peg$currPos;
      top.variants = [];
    }
    top.variants.push(expected2);
  }
  function peg$end(invert) {
    var expected2 = peg$expected.pop();
    var top = peg$expected[peg$expected.length - 1];
    var variants = expected2.variants;
    if (top.pos !== expected2.pos) {
      return;
    }
    if (invert) {
      variants = variants.map(function(e) {
        return e.type === "not" ? e.expected : { type: "not", expected: e };
      });
    }
    Array.prototype.push.apply(top.variants, variants);
  }
  function peg$buildSimpleError(message, location2) {
    return new peg$SyntaxError(message, null, null, location2);
  }
  function peg$buildStructuredError(expected2, found, location2) {
    return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected2, found, location2), expected2, found, location2);
  }
  function peg$buildError() {
    var expected2 = peg$expected[0];
    var failPos = expected2.pos;
    return peg$buildStructuredError(expected2.variants, failPos < input.length ? input.charAt(failPos) : null, failPos < input.length ? peg$computeLocation(failPos, failPos + 1) : peg$computeLocation(failPos, failPos));
  }
  function peg$decode(s) {
    return s.split("").map(function(ch) {
      return ch.charCodeAt(0) - 32;
    });
  }
  function peg$parseRule(index) {
    var bc = peg$bytecode[index];
    var ip = 0;
    var ips = [];
    var end = bc.length;
    var ends = [];
    var stack = [];
    var params, paramsLength, paramsN;
    var rule$expects = function(expected2) {
      if (peg$silentFails === 0)
        peg$expect(expected2);
    };
    while (true) {
      while (ip < end) {
        switch (bc[ip]) {
          case 0:
            stack.push("");
            ip++;
            break;
          case 1:
            stack.push(void 0);
            ip++;
            break;
          case 2:
            stack.push(null);
            ip++;
            break;
          case 3:
            stack.push(peg$FAILED);
            ip++;
            break;
          case 4:
            stack.push([]);
            ip++;
            break;
          case 5:
            stack.push(peg$currPos);
            ip++;
            break;
          case 6:
            stack.pop();
            ip++;
            break;
          case 7:
            peg$currPos = stack.pop();
            ip++;
            break;
          case 8:
            stack.length -= bc[ip + 1];
            ip += 2;
            break;
          case 9:
            stack.splice(-2, 1);
            ip++;
            break;
          case 10:
            stack[stack.length - 2].push(stack.pop());
            ip++;
            break;
          case 11:
            stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
            ip += 2;
            break;
          case 12:
            stack.push(input.substring(stack.pop(), peg$currPos));
            ip++;
            break;
          case 41:
            paramsLength = bc[ip + 2];
            paramsN = 3 + paramsLength;
            params = bc.slice(ip + 3, ip + paramsN);
            params = paramsLength === 1 ? stack[stack.length - 1 - params[0]] : params.map(function(p) {
              return stack[stack.length - 1 - p];
            });
            stack.splice(stack.length - bc[ip + 1], bc[ip + 1], params);
            ip += paramsN;
            break;
          case 13:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
            if (stack[stack.length - 1]) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }
            break;
          case 14:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
            if (stack[stack.length - 1] === peg$FAILED) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }
            break;
          case 15:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
            if (stack[stack.length - 1] !== peg$FAILED) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }
            break;
          case 16:
            if (stack[stack.length - 1] !== peg$FAILED) {
              ends.push(end);
              ips.push(ip);
              end = ip + 2 + bc[ip + 1];
              ip += 2;
            } else {
              ip += 2 + bc[ip + 1];
            }
            break;
          case 17:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
            if (input.length > peg$currPos) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }
            break;
          case 18:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);
            if (input.substr(peg$currPos, peg$literals[bc[ip + 1]].length) === peg$literals[bc[ip + 1]]) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }
            break;
          case 19:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);
            if (input.substr(peg$currPos, peg$literals[bc[ip + 1]].length).toLowerCase() === peg$literals[bc[ip + 1]]) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }
            break;
          case 20:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);
            if (peg$regexps[bc[ip + 1]].test(input.charAt(peg$currPos))) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }
            break;
          case 21:
            stack.push(input.substr(peg$currPos, bc[ip + 1]));
            peg$currPos += bc[ip + 1];
            ip += 2;
            break;
          case 22:
            stack.push(peg$literals[bc[ip + 1]]);
            peg$currPos += peg$literals[bc[ip + 1]].length;
            ip += 2;
            break;
          case 23:
            rule$expects(peg$expectations[bc[ip + 1]]);
            ip += 2;
            break;
          case 24:
            peg$savedPos = stack[stack.length - 1 - bc[ip + 1]];
            ip += 2;
            break;
          case 25:
            peg$savedPos = peg$currPos;
            ip++;
            break;
          case 26:
            params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]).map(function(p) {
              return stack[stack.length - 1 - p];
            });
            stack.splice(stack.length - bc[ip + 2], bc[ip + 2], peg$functions[bc[ip + 1]].apply(null, params));
            ip += 4 + bc[ip + 3];
            break;
          case 27:
            stack.push(peg$parseRule(bc[ip + 1]));
            ip += 2;
            break;
          case 28:
            peg$silentFails++;
            ip++;
            break;
          case 29:
            peg$silentFails--;
            ip++;
            break;
          case 38:
            peg$begin();
            ip++;
            break;
          case 39:
            peg$end(bc[ip + 1]);
            ip += 2;
            break;
          default:
            throw new Error("Rule #" + index + ", position " + ip + ": Invalid opcode " + bc[ip] + ".");
        }
      }
      if (ends.length > 0) {
        end = ends.pop();
        ip = ips.pop();
      } else {
        break;
      }
    }
    return stack[0];
  }
  peg$begin();
  peg$result = peg$parseRule(peg$startRuleIndex);
  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$expect(peg$endExpectation());
    }
    throw peg$buildError();
  }
}

// queson-from-json.js
function fromJSON(src) {
  return peg$parse(src);
}
var SyntaxError = peg$SyntaxError;
export {
  SyntaxError,
  fromJSON
};
