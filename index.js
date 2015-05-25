/**
 * Copyright (C) 2015 tieba.baidu.com
 * index.js
 *
 * changelog
 * 2015-05-19[21:34:55]:revised
 *
 * @author yinyong02@baidu.com
 * @version 0.1.0
 * @since 0.1.0
 */
var async = require('async');
var grunt = require('grunt');
var path = require('path');

var args = process.argv;

var subDir = args[2];

if (!grunt.file.isDir(path.join('resumes', subDir))) {
    console.error(subDir, 'not found');
    process.exit(-1);
}

var collect = function () {

    /*
            var subDirs = grunt.file.expand({
                cwd: 'resumes'
            }, '*').filter(function (dir) {
                return grunt.file.isDir(path.join('resumes', dir));
            });
    */

    async.series([
        /*function (cb) {
            require('./lib/convert')(cb);
        },*/
        function (cb) {
            require('./lib/list')(subDir, cb);
        },
        function (cb) {
            require('./lib/gen')(subDir, cb);
        }
    ], function () {});

};

collect();

module.exports = collect;