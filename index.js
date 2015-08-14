var vimeo_module = require('vimeo');
var Vimeo        = vimeo_module.Vimeo;

Vimeo.prototype.uploadStream      = require('./lib/upload_stream.js');
Vimeo.prototype.patch             = require('./lib/patch.js');
Vimeo.prototype.info              = require('./lib/info.js');
Vimeo.prototype.duplicate         = require('./lib/duplicate.js');
Vimeo.prototype.getDownloadStream = require('./lib/get_download_stream.js');

module.exports = vimeo_module;
