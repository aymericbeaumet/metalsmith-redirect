const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const gulpsmith = require("gulpsmith");
const test = require("ava");
const metalsmithRedirect = require("../..");
const util = require("../_util");

const build = path.join(__dirname, "build");

util.cleanBuild(build);

// https://github.com/aymericbeaumet/metalsmith-redirect/issues/10

test.serial("metalsmith-redirect should work with gulp and gulpsmith", (t) => {
    return util
        .promiseCb((cb) => {
            gulp.src("*")
                .pipe(
                    gulpsmith().use(
                        metalsmithRedirect({
                            redirections: { "/foo": "/bar" }
                        })
                    )
                )
                .pipe(gulp.dest(build))
                .once("end", cb);
        })
        .then(() => {
            return util.promiseCb((cb) => {
                fs.readFile(path.join(build, "foo/index.html"), cb);
            });
        })
        .then((data) => {
            t.true(data.toString().includes("/bar"));
        });
});
