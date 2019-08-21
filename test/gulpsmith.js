const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const gulpsmith = require('gulpsmith')
const rimraf = require('rimraf')
const test = require('ava')
const metalsmithRedirect = require('..')

// Define the build path
const build = path.join(__dirname, 'build')

// And make sure it's being cleaned after each build
test.afterEach.always.cb(t => rimraf(build, t.end))

// https://github.com/aymericbeaumet/metalsmith-redirect/issues/10
test.serial.cb('metalsmith-redirect should work with gulp and gulpsmith', t => {
  t.plan(2)
  gulp
    .src('*')
    .pipe(gulpsmith().use(metalsmithRedirect({ '/foo': '/bar' })))
    .pipe(gulp.dest(build))
    .once('end', () => {
      fs.readFile(path.join(build, 'foo/index.html'), (error, data) => {
        t.falsy(error)
        t.true(data.toString().includes('/bar'))
        t.end()
      })
    })
})
