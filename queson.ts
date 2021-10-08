
import * as queson2json from './queson2json';
import * as json2queson from './json2queson';

export function toJSON(src: string): string {
	return queson2json.parse(src);
}

export function fromJSON(src: string): string {
	return json2queson.parse(src);
}

export const QuesonSyntaxError = queson2json.SyntaxError;

export const JsonSyntaxError = json2queson.SyntaxError;
