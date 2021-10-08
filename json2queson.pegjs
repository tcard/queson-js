// Derived from https://github.com/pegjs/pegjs/blob/master/examples/json.pegjs
//
// MIT License
// 
// Copyright (c) 2010-2016 David Majda
// Copyright (c) 2017+ Futago-za Ryuu
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// JSON Grammar
// ============
//
// Based on the grammar from RFC 7159 [1].
//
// Note that JSON is also specified in ECMA-262 [2], ECMA-404 [3], and on the
// JSON website [4] (somewhat informally). The RFC seems the most authoritative
// source, which is confirmed e.g. by [5].
//
// [1] http://tools.ietf.org/html/rfc7159
// [2] http://www.ecma-international.org/publications/standards/Ecma-262.htm
// [3] http://www.ecma-international.org/publications/standards/Ecma-404.htm
// [4] http://json.org/
// [5] https://www.tbray.org/ongoing/When/201x/2014/03/05/RFC7159-JSON

// ----- 2. JSON Grammar -----

JSON_text
  = ws value:value ws { return value; }

begin_array     = ws "[" ws
begin_object    = ws "{" ws
end_array       = ws "]" ws
end_object      = ws "}" ws
name_separator  = ws ":" ws
value_separator = ws "," ws

ws "whitespace" = [ \t\n\r]*

// ----- 3. Values -----

value
  = false
  / null
  / true
  / object
  / array
  / number
  / string

false = "false"
null  = "null"
true  = "true"

// ----- 4. Objects -----

object
  = begin_object
    members:(
      head:member
      tail:(value_separator m:member { return m; })*
      {
        return [head, ...tail].map(e => e.name + '-' + e.value).join('_');
      }
    )?
    end_object
    { return 'X.' + (members !== null ? members : '') + '.X'; }

member
  = name:string name_separator value:value {
      return { name: name, value: value };
    }

// ----- 5. Arrays -----

array
  = begin_array
    values:(
      head:value
      tail:(value_separator v:value { return v; })*
      { return [head, ...tail].join('_'); }
    )?
    end_array
    { return 'I.' + (values !== null ? values : '') + '.I'; }

// ----- 6. Numbers -----

number "number"
  = a:minus? b:int c:frac? d:exp? { return (a||'') + b + (c||'') + (d||''); }

decimal_point
  = "."

digit1_9
  = [1-9]

e
  = [eE]

exp
  = e s:(minus / plus)? i:DIGIT+ { return 'e' + (s||'') + i.join(''); }

frac
  = decimal_point DIGIT+ { return text(); }

int
  = zero / (digit1_9 DIGIT*) { return text(); }

minus
  = "-"

plus
  = "+" { return ''; }

zero
  = "0"

// ----- 7. Strings -----

string "string"
  = quotation_mark chars:char* quotation_mark { return "w." + chars.join("") + ".w"; }

char
  = "." { return ".."; }
  / "_" { return "._"; }
  / " " { return "_"; }
  / unescaped
  / escape	
    sequence:(
        '"'  { return '"'; }
      / "\\" { return "\\"; }
      / "/"  { return "/"; }
      / "b"  { return ".b"; }
      / "f"  { return ".f"; }
      / "n"  { return ".n"; }
      / "r"  { return ".r"; }
      / "t"  { return ".t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return ".u" + digits.join('');
        }
    )
    { return sequence; }

escape
  = "\\"

quotation_mark
  = '"'

unescaped
  = [^\0-\x1F\x22\x5C]

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i