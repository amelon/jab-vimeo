
var Promise = require('bluebird');

module.exports = info;

function info(videoId) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    _this.request('/videos/' + videoId, function (error, body, status_code, headers) {
      if (status_code == '404') {
        console.error('Vimeo : Video not found (id : ' + videoId + ')');
        return reject(new Error('Vimeo : Video not found (id : ' + videoId + ')'));
      }
      if (error) return reject(error);
      resolve({ body: body, videoId: videoId, res: { headers: headers, statusCode: status_code } });
    });
  });
}
