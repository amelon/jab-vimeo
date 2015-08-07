var vimeo_module = require('vimeo');
var Vimeo        = vimeo_module.Vimeo;

Vimeo.prototype.uploadStream = require('./lib/upload_stream');

module.exports = vimeo_module;
