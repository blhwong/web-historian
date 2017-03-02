var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelper = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var asset;
  var statusCode = 200;
  // if we are at landing page, call index
  if (req.url === '/') {
    asset = archive.paths.siteAssets + '/index.html';

    // helpHandleReq(statusCode, req, res, asset, data);

    httpHelper.serveAssets(res, asset, function(data) {
      res.writeHead(statusCode, httpHelper.headers);
      res.end(data);
    });

  // if URL is archived, load page from archive
  } else { // if (archive.isUrlArchived(req.url)) {
    console.log('ENTERED ARCHIVES!');
    console.log('expect this to be true or false:', archive.isUrlArchived(req.url, function() {}));
    asset = archive.paths.archivedSites + req.url;
    console.log(asset);

    // helpHandleReq(statusCode, req, res, asset, data);

    httpHelper.serveAssets(res, asset, function(data) {
      res.writeHead(statusCode, httpHelper.headers);
      res.end(data);
    });
  // // if URL is in URL list, load loading.html
  // } else if (archive.isUrlInList(req.url)) {
  //   console.log('entered list');
  //   asset = archive.paths.siteAssets + '/loading.html';

  //   // helpHandleReq(statusCode, req, res, asset, data);

  //   httpHelper.serveAssets(res, asset, function(data) {
  //     res.writeHead(statusCode, httpHelper.headers);
  //     res.end(data);
  //   });
  // // if none of the above, return 404 error
  // } else {
  //   res.writeHead(404, httpHelper.headers);
  //   res.end();
  // }
  }
};

exports.helpHandleReq = function (statusCode, req, res, asset, data) {
  httpHelper.serveAssets(res, asset, function(data) {
    res.writeHead(statusCode, httpHelper.headers);
    res.end(data);
  });
};