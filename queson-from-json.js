import * as json2queson from './json2queson';
export function fromJSON(src) {
    return json2queson.parse(src);
}
export const SyntaxError = json2queson.SyntaxError;
