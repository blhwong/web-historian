var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelper = require('./http-helpers.js');
// require more modules/folders here!
// var request = require('request');

var sendResponse = function(res, statusCode, data) {
  res.writeHead(statusCode, httpHelper.headers);
  res.end(data);
};

var checkUrls = function(res, statusCode, url, type) {
  archive.isUrlArchived(url, function(exists) {
  if (exists) {
    asset = archive.paths.archivedSites + url;
    httpHelper.serveAssets(res, asset, function(data) {
      sendResponse(res, statusCode, data);
    });
  } else {
    // if URL is in URL list, load loading.html
    archive.isUrlInList(url.slice(1), function(exists) {
      if (exists) {
        asset = archive.paths.siteAssets + '/loading.html';
        httpHelper.serveAssets(res, asset, function(data) {
          sendResponse(res, statusCode, data);
        });
      // else send fail response
      } else {
        if (type === 'get') {
          statusCode = 404;
          sendResponse(res, statusCode);
        } else {
          url = url.slice(1) + '\n';
          archive.addUrlToList(url, function(exists) {
            asset = archive.paths.siteAssets + '/loading.html';
            httpHelper.serveAssets(res, asset, function(data) {
              sendResponse(res, statusCode, data);
            });
          });
        }
      }
    });
  }
});
};

exports.handleRequest = function (req, res) {
  var asset;
  var statusCode;
  // GET REQUEST
  if (req.method === 'GET') {
    // if we are at landing page, call index
    statusCode = 200;
    if (req.url === '/') {
      asset = archive.paths.siteAssets + '/index.html';
      httpHelper.serveAssets(res, asset, function(data) {
        sendResponse(res, statusCode, data);
      });
    } else {
      checkUrls(res, statusCode, req.url, 'get');
    }
  // POST REQUEST
  } else {
    var url = []
    req.on('data', function(chunk) {
      url.push(chunk);
    }).on('end', function() {
      url = Buffer.concat(url).toString();
      var urlTokens = url.split('=');
      if (urlTokens[0] === 'url') {
        statusCode = 302;
        checkUrls(res, statusCode, '/' + urlTokens[1], 'post');
      }
    });
  }
};