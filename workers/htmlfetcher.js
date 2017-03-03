// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('/Users/student/Desktop/hrsf72-web-historian/helpers/archive-helpers');
// archive.downloadUrls();

archive.readListOfUrls(function(urls) {
  console.log('heyyyy', urls);
  archive.downloadUrls(urls);
});