var hyperquest           = require('hyperquest')
    resolveDownloadLink  = require('./_resolve_download_link.js');


/**
 * return a stream that can be downloaded or pipe to a web response
 *
 * @param  {String} videoId
 * @return {Promise<stream.Readable>}         [description]
 */
function getDownloadStream(videoId) {
  var _this = this;

  return this.info(videoId)
    .then(function(props) {
      return resolveDownloadLink(props.body.download);
    })
    .then(function(linkObj) {
      return hyperquest(linkObj.link);
    })
}

module.exports = getDownloadStream;
