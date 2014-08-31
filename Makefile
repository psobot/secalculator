build: node_modules/.bin/gulp
	bin/gulp build

node_modules/.bin/gulp:
	npm install

watch: node_modules/.bin/gulp
	bin/gulp watch

