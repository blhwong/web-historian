var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelper = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var asset;
  var statusCode = 200;
  
  // GET REQUEST
  if (req.method === 'GET') { 
    // if we are at landing page, call index
    if (req.url === '/') {
      asset = archive.paths.siteAssets + '/index.html';

      // helpHandleReq(statusCode, req, res, asset, data);

      httpHelper.serveAssets(res, asset, function(data) {
        res.writeHead(statusCode, httpHelper.headers);
        res.end(data);
      });
    
    } else { 

      // if URL is archived, load page from archive
      archive.isUrlArchived(req.url, function(exists) {
        if (exists) {
          asset = archive.paths.archivedSites + req.url;
          httpHelper.serveAssets(res, asset, function(data) {
            res.writeHead(statusCode, httpHelper.headers);
            res.end(data);
          });
        } else {
          // if URL is in URL list, load loading.html
          archive.isUrlInList(req.url, function(exists) {
            if (exists) {
              asset = archive.paths.siteAssets + '/loading.html';
              httpHelper.serveAssets(res, asset, function(data) {
                res.writeHead(statusCode, httpHelper.headers);
                res.end(data);
              });
            // else send fail response
            } else {
              statusCode = 404;
              res.writeHead(statusCode, httpHelper.headers);
              res.end();
            }
          }); 
        }
      });
    }

  // POST REQUEST
  } else {
    req.on('data', function(url) {

      var url = url.toString();
      url = url.slice(4) + '\n';

      statusCode = 302;
      archive.addUrlToList(url, function(exists) {
        res.writeHead(statusCode, httpHelper.headers);
        res.end();

      });
    });
  }

};

exports.helpHandleReq = function (statusCode, req, res, asset, data) {
  httpHelper.serveAssets(res, asset, function(data) {
    res.writeHead(statusCode, httpHelper.headers);
    res.end(data);
  });
};