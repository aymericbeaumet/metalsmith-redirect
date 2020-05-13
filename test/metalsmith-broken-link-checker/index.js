const path = require('path');
const test = require('ava');
const rimraf = require('rimraf');
const metalsmith = require('metalsmith');
const metalsmithBrokenLinkChecker = require('metalsmith-broken-link-checker');
const metalsmithRedirect = require('../..');

const build = path.join(__dirname, 'build');
// Make sure the build is cleaned before/after each test
test.beforeEach.cb(t => {
	rimraf(build, t.end);
});
test.afterEach.always.cb(t => {
	rimraf(build, t.end);
});

// https://github.com/aymericbeaumet/metalsmith-redirect/issues/19

test.serial.cb(
	'metalsmith-broken-link-checker should succeed when used after metalsmith-redirect',
	t => {
		t.plan(1);
		metalsmith(__dirname)
			.use(metalsmithRedirect({frontmatter: true}))
			.use(metalsmithBrokenLinkChecker())
			.destination(build)
			.build(error => {
				t.falsy(error);
				t.end();
			});
	}
);

test.serial.cb(
	'metalsmith-broken-link-checker should error when used before metalsmith-redirect',
	t => {
		t.plan(1);
		metalsmith(__dirname)
			.use(metalsmithBrokenLinkChecker())
			.use(metalsmithRedirect({frontmatter: true}))
			.destination(build)
			.build(error => {
				t.true(error.toString().startsWith('Error: You have 1 broken links:'));
				t.end();
			});
	}
);
