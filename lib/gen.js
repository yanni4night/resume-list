/**
 * Copyright (C) 2015 tieba.baidu.com
 * gen.js
 *
 * changelog
 * 2015-05-19[15:07:01]:revised
 *
 * @author yinyong02@baidu.com
 * @version 0.1.0
 * @since 0.1.0
 */


var officegen = require('officegen');
var path = require('path');
var grunt = require('grunt');

var fs = require('fs');

module.exports = function(cb) {

  var xlsx = officegen('xlsx');

  xlsx.on('finalize', function(written) {
    console.log('Finish to create an Excel file.\nTotal bytes created: ' + written + '\n');
  });

  xlsx.on('error', function(err) {
    console.log(err);
  });

  sheet = xlsx.makeNewSheet();
  sheet.name = 'Resume List';

  var resumeList = grunt.file.readJSON(path.join(__dirname, '..', 'list.json'));

  sheet.data[0] = ['序号', '姓名', '性别', '年龄', '生日', '手机', '教育经历', '求职意向', '工作经历'];
  
  resumeList.forEach(function(resume, idx) {
    sheet.data[idx + 1] = [idx + 1, resume['name'], resume['sex'], resume['age'], resume['birthday'], resume['phone'], resume['edu'], resume['wanna'], resume['workExpr']];
  });

  var out = fs.createWriteStream(path.join(__dirname, '..', 'out.xlsx'));

  out.on('error', function(err) {
    console.log(err);
  });

  xlsx.generate(out);

}