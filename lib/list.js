/**
 * Copyright (C) 2015 tieba.baidu.com
 * list.js
 *
 * changelog
 * 2015-05-19[21:41:41]:revised
 *
 * @author yinyong02@baidu.com
 * @version 0.1.0
 * @since 0.1.0
 */
var resumeCollect = require('./collect');
var fs = require('fs');
var grunt = require('grunt');
var async = require('async');
var path = require('path');
var trans = require('./trans');

var jsonFilePath = path.join(__dirname, '..', 'list.json');

//grunt.file.write(jsonFilePath, '[]');

module.exports = function (subDir, cb) {
    var txts = grunt.file.expand(path.join(__dirname, '..', 'resumes', subDir + '/*.txt'));

    var tasks = txts.map(function (txt, idx) {
        return (function (txt, idx) {
            return function (fn) {
                console.log('Handling(' + (1 + idx) + '/' + txts.length + ')', txt);

                trans(txt);

                resumeCollect(grunt.file.read(txt), function (data) {
                    console.log(path.basename(txt), 'done');

                    var list = grunt.file.readJSON(jsonFilePath);
                    list.push(data);
                    grunt.file.write(jsonFilePath, JSON.stringify(list, null, 2));

                    grunt.file.delete(txt, {
                        force: true
                    });

                    fn();
                });
            };
        })(txt, idx);
    });

    async.series(tasks, function (error) {
        if (error) {
            console.error(error);
        }
        cb();
    });
};