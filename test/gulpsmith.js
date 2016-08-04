import fs from 'fs'
import gulp from 'gulp'
import gulpsmith from 'gulpsmith'
import path from 'path'
import rimraf from 'rimraf'
import test from 'ava'
import redirect from '..'

// Define the build path, and make sure it's being cleaned before and after each
// build
const build = path.join(__dirname, 'build')
const cleanBuildHook = (t) => rimraf(build, t.end)
test.cb.before(cleanBuildHook)
test.cb.after(cleanBuildHook)

// https://github.com/aymericbeaumet/metalsmith-redirect/issues/10
test.cb('metalsmith-redirect should be working with gulp and gulpsmith', (t) => {
  t.plan(2)
  gulp.src([])
    .pipe(gulpsmith().use(redirect({ '/foo': '/bar' })))
    .pipe(gulp.dest(build))
    .on('end', () => {
      fs.lstat(build, (error, stats) => {
        t.ifError(error)
        t.true(stats.isDirectory())
        t.end()
      })
    })
})
