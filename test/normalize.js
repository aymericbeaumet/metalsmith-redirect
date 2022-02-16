const test = require("ava");
const normalize = require("../lib/normalize");

test("normalize().get() should handle Unix style path", (t) => {
    const refs = {
        "/foo/bar": "/foo/bar"
    };
    for (const [key, expected] of Object.entries(refs)) {
        t.deepEqual(normalize(key).get(), expected);
    }
});

test("normalize().get() should handle Windows style path", (t) => {
    const refs = {
        "\\foo\\bar": "/foo/bar"
    };
    for (const [key, expected] of Object.entries(refs)) {
        t.deepEqual(normalize(key).get(), expected);
    }
});

test("normalize().appendHTMLIndexIfNeeded().get() should return the path without any modification if it's not a directory", (t) => {
    const refs = [
        "foo/index.md",
        "/foo/index.md",
        "index.md",
        "/index.md",
        "http://github.com/index.html",
        "../../index.md"
    ];
    for (const ref of refs) {
        t.deepEqual(normalize(ref).appendHTMLIndexIfNeeded().get(), ref);
    }
});

test("normalize().appendHTMLIndexIfNeeded().get() should return the path with a HTML index appended if it's a directory", (t) => {
    const refs = {
        foo: "foo/index.html",
        "/foo": "/foo/index.html",
        "": "index.html",
        ".": "index.html",
        "/": "/index.html",
        "/////": "/index.html"
    };
    for (const [key, expected] of Object.entries(refs)) {
        t.deepEqual(normalize(key).appendHTMLIndexIfNeeded().get(), expected);
    }
});

test("normalize().appendHTMLIndexIfNeeded().get() should properly support protocols (http://, ...)", (t) => {
    t.is(
        normalize("http://foobar").appendHTMLIndexIfNeeded().get(),
        "http://foobar/index.html"
    );
});

test("normalize().ensureHTML() should not throw an exception if the wrapped path ends with a HTML file", (t) => {
    const refs = [
        "index.html",
        "/index.html",
        "./index.html",
        "/foo/bar/baz.html",
        "http://foo.bar/index.html"
    ];
    for (const ref of refs) {
        t.notThrows(() => normalize(ref).ensureHTML());
    }
});

test("normalize().ensureHTML() should throw an exception if the wrapped path doesn't end with a HTML file", (t) => {
    t.throws(() => normalize("index.md").ensureHTML(), {
        message: / is not a valid HTML path$/
    });
});

test("normalize().ensureHTML() should not be confused by extensions in middle of the filename", (t) => {
    t.throws(() => normalize("index.html.md").ensureHTML(), {
        message: / is not a valid HTML path$/
    });
});

test("normalize().ensureHTML() should not throw if the extension has been whitelisted", (t) => {
    t.notThrows(() =>
        normalize("index.md").ensureHTML({ htmlExtensions: [".md"] })
    );
});

test("normalize().relativeTo().get() should return the destination path relative to the source", (t) => {
    /* Ref / relative dir / result */
    const refs = [
        // 1st readme example
        ["foo", "/", "/foo"],
        ["hidden.html", "/foo", "/foo/hidden.html"],
        // 2nd readme example
        ["/foo/bar.html", "/", "/foo/bar.html"],
        ["baz", "/foo", "/foo/baz"],
        // 3rd readme example
        ["/github", "/", "/github"],
        ["https://github.com/segmentio", "", "https://github.com/segmentio"]
    ];
    for (const ref of refs) {
        t.deepEqual(normalize(ref[0]).relativeTo(ref[1]).get(), ref[2]);
    }
});
