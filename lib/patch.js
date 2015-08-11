var Promise    = require('bluebird');

module.exports = patch;


/**
 * Patches uploaded video, resolve with metadatas - used to update upload name
 *
 * @param  {Vimeo} vimeo client instance
 * @param  {Number} videoId [description]
 * @param  {Object} data    [description]
 * @return {<Promise>Object} object containing body, res
 */
function patch(videoId, data) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    var options = {
      method: 'PATCH',
      path: '/videos/' + videoId,
      query: data
    };

    _this.request(options, function (error, body, status_code, headers) {
      if (error) return reject(error);
      return resolve({ body: body, videoId: videoId, res: {statusCode: status_code, headers: headers } });
    });
  });
}
