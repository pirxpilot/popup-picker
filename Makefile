PROJECT=picker
SRC=index.js
CSS=node_modules/@pirxpilot/tip/tip.css picker.css

all: check compile

check: lint

compile: build/build.js build/build.css

build:
	mkdir -p $@

$(CSS): | node_modules

build/build.css: $(CSS) | build
	cat $^ > $@

build/build.js: node_modules $(SRC) | build
	browserify --require ./index.js:$(PROJECT) --outfile $@

.DELETE_ON_ERROR: build/build.js

node_modules: package.json
	npm install && touch $@

lint:
	jshint $(SRC)

clean:
	rm -fr build node_modules

.PHONY: clean lint check all compile
