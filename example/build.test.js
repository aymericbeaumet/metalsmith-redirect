const path = require('path')
const { execFile } = require('child_process')
const rimraf = require('rimraf')
const test = require('ava')

const build = path.join(__dirname, 'build')
// Make sure the build is cleaned before/after each test
test.beforeEach.cb(t => rimraf(build, t.end))
test.afterEach.always.cb(t => rimraf(build, t.end))

test.serial.cb('the example should build successfully', t => {
  t.plan(1)
  execFile(
    'node',
    [path.join(__dirname, 'build.js')],
    { cwd: path.join(__dirname, '..') },
    error => {
      t.falsy(error)
      t.end()
    }
  )
})
