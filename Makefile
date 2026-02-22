PROJECT=picker
SRC=index.js
CSS=node_modules/@pirxpilot/tip/tip.css picker.css

all: check compile

check: lint

compile: build/build.js build/build.css

build:
	mkdir -p $@

build/build.css: $(CSS) | build
	cat $^ > $@

build/build.js: $(SRC) | build
	node_modules/.bin/esbuild \
		--bundle $< \
		--define:DEBUG=true \
		--global-name=$(PROJECT) \
		--sourcemap \
		--outfile=$@

clean:
	rm -fr build

.PHONY: clean check all compile

check: lint

lint:
	node_modules/.bin/biome ci

format:
	node_modules/.bin/biome check --fix

.PHONY: check format lint
