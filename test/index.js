const test = require("ava");
const htmlparser2 = require("htmlparser2");
const metalsmithRedirect = require("..");
const util = require("./_util");

function parseHTML(html) {
    const parser = new htmlparser2.Parser();
    parser.write(html);
    parser.end();
}

function callPlugin(options, files) {
    return util.promiseCb((cb) => {
        metalsmithRedirect(options)(files, null, cb);
    });
}

test("metalsmith-redirect should default to no redirections", (t) => {
    const files = {};
    return callPlugin(undefined, files).then(() => {
        t.is(Object.keys(files).length, 0);
    });
});

test("metalsmith-redirect should use the redirections passed as the options", (t) => {
    const files = {};
    return callPlugin({ redirections: { a: "b" } }, files).then(() => {
        t.is(Object.keys(files).length, 1);
        const contents = files["a/index.html"].contents.toString();
        t.notThrows(() => parseHTML(contents));
        t.is(
            contents,
            `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="0;url=/a/b">
    <link rel="canonical" href="/a/b">
    <script>window.location.replace('/a/b');</script>
  </head>
  <body>This page has been moved to <a href="/a/b">/a/b</a></body>
</html>
`
        );
    });
});

test("metalsmith-redirect should escape the urls", (t) => {
    const files = {};
    return callPlugin({ redirections: { a: "'\"'\"" } }, files).then(() => {
        t.is(Object.keys(files).length, 1);
        const contents = files["a/index.html"].contents.toString();
        t.notThrows(() => parseHTML(contents));
        t.is(
            contents,
            `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="0;url=/a/'\\"'\\"">
    <link rel="canonical" href="/a/'\\"'\\"">
    <script>window.location.replace('/a/\\'"\\'"');</script>
  </head>
  <body>This page has been moved to <a href="/a/'\\"'\\"">/a/'"'"</a></body>
</html>
`
        );
    });
});

test("metalsmith-redirect should support to preserve the hash", (t) => {
    const files = {};
    return callPlugin({
        redirections: { a: "b" },
        preserveHash: true
    }, files).then(() => {
        t.is(Object.keys(files).length, 1);
        const contents = files["a/index.html"].contents.toString();
        t.notThrows(() => parseHTML(contents));
        t.is(
            contents,
            `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="1;url=/a/b">
    <link rel="canonical" href="/a/b">
    <script>window.location.replace('/a/b' + window.location.hash);</script>
  </head>
  <body>This page has been moved to <a href="/a/b">/a/b</a></body>
</html>
`
        );
    });
});

test(
    "metalsmith-redirect should support to preserve the hash with a custom timeout",
    (t) => {
        const files = {};
        return callPlugin({
            redirections: { a: "b" },
            preserveHash: { timeout: 3 }
        }, files).then(() => {
            t.is(Object.keys(files).length, 1);
            const contents = files["a/index.html"].contents.toString();
            t.notThrows(() => parseHTML(contents));
            t.is(
                contents,
                `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="3;url=/a/b">
    <link rel="canonical" href="/a/b">
    <script>window.location.replace('/a/b' + window.location.hash);</script>
  </head>
  <body>This page has been moved to <a href="/a/b">/a/b</a></body>
</html>
`
            );
        });
    }
);

test(
    "metalsmith-redirect should support redirectFrom as a relative url string",
    (t) => {
        const files = {
            about: {
                redirectFrom: "about-bar"
            }
        };
        return callPlugin({ frontmatter: true }, files).then(() => {
            t.is(Object.keys(files).length, 2);
            t.true("about" in files);
            t.true(
                files["about/about-bar/index.html"].contents
                    .toString()
                    .includes('href="/about"')
            );
        });
    }
);

test(
    "metalsmith-redirect should support redirectFrom as an absolute url string",
    (t) => {
        const files = {
            about: {
                redirectFrom: "/about-bar"
            }
        };
        return callPlugin({ frontmatter: true }, files).then(() => {
            t.is(Object.keys(files).length, 2);
            t.true("about" in files);
            t.true(
                files["about-bar/index.html"].contents
                    .toString()
                    .includes('href="/about"')
            );
        });
    }
);

test(
    "metalsmith-redirect should support redirectFrom as an url array",
    (t) => {
        const files = {
            about: {
                redirectFrom: ["/about-bar", "/about-foo"]
            }
        };
        return callPlugin({ frontmatter: true }, files).then(() => {
            t.is(Object.keys(files).length, 3);
            t.true("about" in files);
            t.true(
                files["about-bar/index.html"].contents
                    .toString()
                    .includes('href="/about"')
            );
            t.true(
                files["about-foo/index.html"].contents
                    .toString()
                    .includes('href="/about"')
            );
        });
    }
);

test(
    "metalsmith-redirect should support redirectFrom with a custom key",
    (t) => {
        const files = {
            about: {
                nested: [{ from: "/about-bar" }]
            }
        };
        return callPlugin({
            frontmatter: { redirectFrom: "nested[0].from" }
        }, files).then(() => {
            t.is(Object.keys(files).length, 2);
            t.true("about" in files);
            t.true(
                files["about-bar/index.html"].contents
                    .toString()
                    .includes('href="/about"')
            );
        });
    }
);

test(
    "metalsmith-redirect should support redirectTo as a relative url string",
    (t) => {
        const files = {
            "about-bar": {
                redirectTo: "about"
            }
        };
        return callPlugin({ frontmatter: true }, files).then(() => {
            t.is(Object.keys(files).length, 1);
            t.true(
                files["about-bar/index.html"].contents
                    .toString()
                    .includes('href="/about-bar/about"')
            );
        });
    }
);

test(
    "metalsmith-redirect should support redirectTo as an absolute url string",
    (t) => {
        const files = {
            "about-bar": {
                redirectTo: "/about"
            }
        };
        return callPlugin({ frontmatter: true }, files).then(() => {
            t.is(Object.keys(files).length, 1);
            t.true(
                files["about-bar/index.html"].contents
                    .toString()
                    .includes('href="/about"')
            );
        });
    }
);

test(
    "metalsmith-redirect should support redirectTo with a custom key",
    (t) => {
        const files = {
            "about-bar": {
                nested: [{ to: "/about" }]
            }
        };
        return callPlugin({
            frontmatter: { redirectTo: "nested[0].to" }
        }, files).then(() => {
            t.is(Object.keys(files).length, 1);
            t.true(
                files["about-bar/index.html"].contents
                    .toString()
                    .includes('href="/about"')
            );
        });
    }
);
