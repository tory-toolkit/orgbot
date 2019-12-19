default:
	npm ci

prepare: default

build: default

test:
	node_modules/.bin/mocha

.PHONY: build default prepare test
