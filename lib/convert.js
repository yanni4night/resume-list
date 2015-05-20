/**
 * Copyright (C) 2015 tieba.baidu.com
 * convert.js
 *
 * changelog
 * 2015-05-19[14:13:09]:revised
 *
 * @author yinyong02@baidu.com
 * @version 0.1.0
 * @since 0.1.0
 */

var mammoth = require('mammoth');
var grunt = require('grunt');
var path = require('path');
var async = require('async');


var convert = function (cb) {
    var docxes = grunt.file.expand(path.join(__dirname, '..', 'doc/**/*.docx'));
    var errors = 0;
    var tasks = docxes.map(function (doc) {
        return (function (doc) {
            return function (fn) {
                mammoth.extractRawText({
                    path: doc
                }).then(function (result) {
                    var html = result.value;
                    grunt.file.write(path.join(__dirname, '..', 'resumes/' + path.basename(
                        doc).slice(0, -4) + 'txt'), html);
                    fn();
                }, function () {
                    console.error(doc, 'FAILED(' + (++errors) + ')');
                    fn();
                });
            };
        })(doc);
    });

    async.series(tasks, cb);

};

module.exports = convert;