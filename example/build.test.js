const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const rimraf = require("rimraf");
const test = require("ava");
const util = require("../test/_util");

const build = path.join(__dirname, "build");
util.cleanBuild(build);

test.serial("the example should build successfully", (t) => {
    return util
        .promiseCb((cb) =>
            execFile(
                "node",
                [path.join(__dirname, "build.js")],
                { cwd: path.join(__dirname, "..") },
                cb
            )
        )
        .then(() => util.promiseCb((cb) => fs.lstat(build, cb)))
        .then((stats) => {
            t.true(stats.isDirectory());
        });
});
