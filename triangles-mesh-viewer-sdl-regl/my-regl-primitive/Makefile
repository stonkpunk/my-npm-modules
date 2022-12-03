
BUDO := node_modules/.bin/budo
BFLAGS += -t babelify

.PHONY: example
example: node_modules
	$(BUDO) example/index.js -p 3000 -d $@ -l -- $(BFLAGS)

node_modules:
	npm install
