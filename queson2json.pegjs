queson
    = 'true'
    / 'false'
    / 'null'
    / number
    / string
    / array
    / object

number "number"
    = '-'?
      ( '0' / ([1-9]+ [0-9]*) )
      ( '.' [0-9]+ )?
      ( [eE] '-'? [0-9]+ )?
        { return text(); }

string "string"
    = "w." contents:character* ".w"
        { return '"' + contents.join('') + '"'; }

character
    = "._"
        { return "_"; }
    / ".."
        { return "."; }
    / "_"
        { return " "; }
    / ".u" codepoint:(hex hex hex hex)
        { return '\\\\u' + codepoint.join(''); }
    / "." specialChar:[bfnrt]
        { return '\\\\' + specialChar; }
    / [\"\\/]
        { return '\\' + text(); }
    / [^.\0-\x1F\x22\x5C]

hex
    = [a-fA-F0-9]

array "array"
    = 'I.' elements:elements '.I'
        { return '[' + elements + ']' ; }
    
elements
    = head:queson tail:('_' queson)*
        { return [head, ...tail.map(e => e[1])].join(','); }
    / ''

object "object"
    = 'X.' properties:properties '.X'
        { return '{' + properties + '}' ; }

properties
    = head:property tail:('_' property)*
        { return [head, ...tail.map(e => e[1])].join(','); }
    / ''

property
    = key:string '-' value:queson
        { return key + ':' + value; }
