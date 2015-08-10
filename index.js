var vimeo_module = require('vimeo');
var Vimeo        = vimeo_module.Vimeo;

var uploadStream = require('./lib/upload_stream');
var patch        = require('./lib/patch');
var info         = require('./lib/info');
var duplicate    = require('./lib/duplicate');

Vimeo.prototype.uploadStream = uploadStream;
Vimeo.prototype.patch = patch;
Vimeo.prototype.info = info;
Vimeo.prototype.duplicate = duplicate;

module.exports = vimeo_module;
