var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelper = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var asset;
  if (req.url === '/') {
    asset = archive.paths.siteAssets + '/index.html';
  } else {
    asset = archive.paths.archivedSites + req.url;
  }
  console.log(asset);

  httpHelper.serveAssets(res, asset, function(data) {
    res.end(data);
  });

};
