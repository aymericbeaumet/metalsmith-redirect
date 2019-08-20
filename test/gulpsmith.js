const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const gulpsmith = require('gulpsmith')
const rimraf = require('rimraf')
const test = require('ava')
const redirect = require('..')

// Define the build path
const build = path.join(__dirname, 'build')

// And make sure it's being cleaned after each build
test.afterEach.always.cb(t => rimraf(build, t.end))

// https://github.com/aymericbeaumet/metalsmith-redirect/issues/10
test.serial.cb(
  'metalsmith-redirect should be working with gulp and gulpsmith',
  t => {
    t.plan(2)
    gulp
      .src('*', { ignore: '*' }) // I just want an empty source
      .pipe(gulpsmith().use(redirect({ '/foo': '/bar' })))
      .pipe(gulp.dest(build))
      .once('end', () => {
        fs.lstat(build, (error, stats) => {
          t.falsy(error)
          t.true(stats.isDirectory())
          t.end()
        })
      })
  }
)
