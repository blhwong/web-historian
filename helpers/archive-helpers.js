var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, (err, data) => {
    if (err) {
      throw err;
    }
    var string = JSON.stringify(data.toString());
    string = string.slice(1, string.length - 1);
    var array = string.split('\\n');
    callback(array);

  });

};

// is URL listed in the body of /archives/sites.txt?
exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    var test = urls.indexOf(url) >= 0;
    callback(test);
  });
};

// add URL to /archives/sites.txt
exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url, function(err) {
    if (err) {
      throw err;
    }
    callback();
  });
};

// is URL listed as a file in /archives/sites?
exports.isUrlArchived = function(url, callback) {
  fs.access(exports.paths.archivedSites + '/' + url, function(err) {
    callback(!err);
  });
};


exports.downloadUrls = function(urls) {
  _.each(urls, function(url) {
    if (!url) {
      return;
    }
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
};
