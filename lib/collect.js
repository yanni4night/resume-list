/**
 * Copyright (C) 2015 tieba.baidu.com
 * index.js
 *
 * changelog
 * 2015-05-19[12:25:33]:revised
 *
 * @author yinyong02@baidu.com
 * @version 0.1.0
 * @since 0.1.0
 */

var request = require('request');
var jsdom = require('jsdom');


var globalScripts = ['http://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min.js'];

/**
 * [exports description]
 * @param  {[type]}   content [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
module.exports = function (content, cb) {
    jsdom.env({
        url: "http://www.ygys.net/resumetest.aspx",
        scripts: globalScripts,
        done: function (errors, window) {
            if(errors){
                return cb();
            }
            var $ = window.$;
            var $form = $("form");

            var state = $form.find('[name=__VIEWSTATE]').val();
            var gen = $form.find('[name=__VIEWSTATEGENERATOR]').val();
            var validation = $form.find('[name=__EVENTVALIDATION]').val();

            request.post('http://www.ygys.net/resumetest.aspx', {
                form: {
                    'txtSource': content,
                    '__VIEWSTATE': state,
                    '__VIEWSTATEGENERATOR': gen,
                    '__EVENTVALIDATION': validation,
                    'FileUpload1': '',
                    'ImgSubmit.x': 39,
                    'ImgSubmit.y': 22
                }
            }, function (err, res) {
                if(err){
                    return cb();
                }
                jsdom.env(res.body, globalScripts, function (err, window) {
                    var $ = window.$;
                    var $table = $('table table:last');

                    var data = {};
                    var inKeySearching = false;
                    var keySearching;
                    var values = [];
                    $('tr', $table).each(function (idx, tr) {
                        var $tr = $(tr);
                        var key = $tr.find('td:first').text().trim();

                        var searchValues = function () {
                            var children = $tr.find('td:last')[0].childNodes;

                            for (var i = 0; i < children.length; ++i) {

                                if (children[i].nodeType === 3) {
                                    /*console.log('"',children[i].textContent,'"');
                                    if ('开始时间：' !== children[i].textContent.trim() ||
                                        '学校名称：' !== children[i].textContent.trim()
                                    ) {
                                        if ('结束时间：' === children[i].textContent.trim()) {
                                            values.push('至');
                                        } else {
                                            values.push(children[i].textContent);
                                        }
                                    }*/
                                    if ('结束时间：' === children[i].textContent.trim()) {
                                            values.push('至');
                                        }
                                } else if (children[i].tagName.toLowerCase() ===
                                    'input') {
                                    values.push(children[i].value);
                                } else if ('textarea' === children[i].tagName
                                    .toLowerCase()) {
                                    values.push(children[i].value);
                                }
                            }
                        };

                        if (key) {
                            if (keySearching) {
                                data[keySearching.replace('：', '')] = values.join(
                                    ' ');
                                values = [];
                            }
                            keySearching = key;
                            searchValues();
                        } else {
                            if (keySearching) {
                                searchValues();
                            }
                        }

                    });

                    data[keySearching.replace('：', '')] = values.join(' ');

                    cb({
                        name: data['姓名'],
                        sex: data['性别'],
                        age: data['年龄'],
                        birthday: data['生日'],
                        phone: data['手机'],
                        email: data['电子邮件'],
                        edu: data['教育1'] || (data['毕业院校'] + data['专业']),
                        wanna: data['求职意向'],
                        workExpr: data['工作1'],
                    });
                });
            });

        }
    });

};