var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');
//test
var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../ff-qnamaker-testbotservice.zip');
var kuduApi = 'https://ff-qnamaker-testbotservice.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$ff-qnamaker-testbotservice';
var password = 'kosflYR5h9d9uHveFWJAZr0NGjPwnGbRl9rY16Q6ptC3TAF467xLmXx4rg8P';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('ff-qnamaker-testbotservice publish');
  } else {
    console.error('failed to publish ff-qnamaker-testbotservice', err);
  }
});