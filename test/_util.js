const test = require('ava');
const rimraf = require('rimraf');

const util = {
    cleanBuild: (folder) => {
        const clean = () => util.promiseCb(cb => rimraf(folder, cb));
        test.beforeEach(clean);
        test.afterEach.always(clean);
    },

    promiseCb: (cb) => {
        return new Promise((resolve, reject) => {
            cb((err, ...data) => {
                if (err) reject(err);
                resolve(...data);
            });
        });
    }
};

module.exports = util;
