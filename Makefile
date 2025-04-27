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

build/build.js: $(SRC) | node_modules build
	esbuild \
		--bundle $< \
		--define:DEBUG=true \
		--global-name=$(PROJECT) \
		--sourcemap \
		--outfile=$@

node_modules: package.json
	yarn
	touch $@

clean:
	rm -fr build node_modules

.PHONY: clean check all compile

check: lint

lint:
	biome ci

format:
	biome check --fix

.PHONY: check format lint

