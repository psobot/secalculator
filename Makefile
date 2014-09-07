build: node_modules/.bin/gulp bower_components/d3/d3.js
	bin/gulp build

#	Could use more than just D3 here to
#	make sure we have *all* the dependencies
#	installed after calling make...
bower_components/d3/d3.js:
	node_modules/.bin/bower install

node_modules/.bin/gulp:
	npm install

watch: build
	bin/gulp watch

