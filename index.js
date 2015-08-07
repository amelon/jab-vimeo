var vimeo_module = require('vimeo');
var Vimeo        = vimeo_module.Vimeo;



/**
 *
 * @param  {stream.Readable} stream
 * @return {<Promise>Object}
 *
 *  returned object has following properties
 *    - body : response of name update
 *    - res
 *    - res.headers
 *    - res.statusCode
 *    - videoId
 *
 */
Vimeo.prototype.uploadStream = require('./lib/upload_stream');



module.exports = vimeo_module;
