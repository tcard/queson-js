
all: queson2json.js json2queson.js queson.js dist/queson.js dist/queson.min.js

queson2json.js: queson2json.pegjs
	./node_modules/pegjs/bin/peg.js --format es --optimize size < queson2json.pegjs > queson2json.js

json2queson.js: json2queson.pegjs
	./node_modules/pegjs/bin/peg.js --format es --optimize size < json2queson.pegjs > json2queson.js

queson.js: queson.ts
	tsc

dist/queson.js: queson.js
	./node_modules/.bin/esbuild queson.js --outfile=dist/queson.js --bundle --format=esm

dist/queson.min.js: queson.js
	./node_modules/.bin/esbuild queson.js --outfile=dist/queson.min.js --bundle --minify --format=esm
