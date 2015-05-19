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

var collect =  function () {

    async.series([
        function (cb) {
            require('./lib/convert')(cb);
        },
        function (cb) {
            require('./lib/list')(cb);
        },
        function (cb) {
            require('./lib/gen')(cb);
        }
    ], function () {});

};

collect();

module.exports = collect;