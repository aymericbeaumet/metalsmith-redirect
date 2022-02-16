const path = require("path");
const test = require("ava");
const rimraf = require("rimraf");
const metalsmith = require("metalsmith");
const metalsmithBrokenLinkChecker = require("@fidian/metalsmith-broken-link-checker");
const metalsmithRedirect = require("../..");
const util = require("../_util");

const build = path.join(__dirname, "build");

util.cleanBuild(build);

// https://github.com/aymericbeaumet/metalsmith-redirect/issues/19

test.serial(
    "metalsmith-broken-link-checker should succeed when used after metalsmith-redirect",
    (t) => {
        return util
            .promiseCb((cb) =>
                metalsmith(__dirname)
                    .use(metalsmithRedirect({ frontmatter: true }))
                    .use(metalsmithBrokenLinkChecker())
                    .destination(build)
                    .build(cb)
            )
            .then(() => t.pass());
    }
);

test.serial(
    "metalsmith-broken-link-checker should error when used before metalsmith-redirect",
    (t) => {
        return util
            .promiseCb((cb) =>
                metalsmith(__dirname)
                    .use(metalsmithBrokenLinkChecker())
                    .use(metalsmithRedirect({ frontmatter: true }))
                    .destination(build)
                    .build(cb)
            )
            .then(
                () => {
                    throw new Error("No error was generated");
                },
                (err) => {
                    t.true(
                        err
                            .toString()
                            .startsWith("Error: You have 1 broken links:")
                    );
                }
            );
    }
);
