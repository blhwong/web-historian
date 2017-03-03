var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

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
  console.log('url to be appended', url);
  fs.appendFile(exports.paths.list, url, function(err) {
    if (err) {
      throw err;
    }
    callback();
  });
};

// is URL listed as a file in /archives/sites?
exports.isUrlArchived = function(url, callback) {
  console.log('we are in helper url archived');
  fs.access(exports.paths.archivedSites + '/' + url, function(err) {
    callback(!err);
  });
};


exports.downloadUrls = function(urls) {
  var savedData = '';
  console.log('downloading...');
  for (var i = 0; i < urls.length - 1; i++) {
      // console.log('fd', fd);
      // to do: might need to refactor
    console.log('early i', i);
    console.log(urls[i]);
    options = {
      host: urls[i],
      port: 80,
      path: '/index.html'
    };
    // request HTML from website with http.get
    http.get(options, function(res) {
      // clear the sites page

      res.on('data', function(data) {
        // console.log(savedData);
        savedData += data.toString();
        fs.writeFile(exports.paths.archivedSites + '/' + options.host, savedData, (err) => {
          if (err) { throw err; }
        });

      });


    }).on('error', function(e) {
      // console.log(urls[i]);
      console.log('Got error:' + e.message);
    });
    // console.log('i hope you exist!', urls[i]);
    // console.log('savedData', savedData);


    // fs.open(exports.paths.archivedSites + '/' + urls[i], 'w', function(err, fd) {
    // });
  }
};
