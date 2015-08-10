var Promise    = require('bluebird'),
    hyperquest = require('hyperquest'),
    path       = require('path'),
    concat     = require('concat-stream');


module.exports = uploadStream;

/**
 * function must be attached to Vimeo prototype
 * or context execution must be a Vimeo client instance
 *
 * @param  {stream.Readable} stream
 * @param  {Object} [options]
 * @param  {bool}   [options.upTo1080=false]
 * @param  {string} [options.name=undefined]
 * @param  {string} [options.description=undefined]
 * @return {<Promise>Object}
 * Object has
 *   - {http.Response|Object} res
 *   - {Object} res.headers
 *   - {string} res.statusCode
 *   - {string} res.videoId
 *   - {Object} res.body - json response of name update of the video
 */
function uploadStream(stream, options) {
  var _this    = this, // this is vimeo client instance
      completeUri, videoId, filename, description;

  options = options || {};
  options.upTo1080 = !!options.upTo1080;

  filename = options.name || determineFilename(stream);
  description = options.description;

          // get upload ticket
  return prepareUpload(_this, options)

    // make upload
    .then(function(ticket) {
      completeUri = ticket.complete_uri;
      if (!completeUri) throw new Error('Vimeo - no complete_uri to confirm video uploading finished');
      return doUpload(stream, ticket.upload_link_secure);
    })

    // confirm upload complete
    .then(function(props) { return confirmComplete(_this, completeUri); })

    // set filename to video upload
    .then(function(props) {
      var videoLocation = props.res.headers && props.res.headers.location;
      videoId = getVideoId(videoLocation);
      return _this.patch(videoId, { name: filename, description: description });
    })

    // return update response + videoId
    .then(function(props) {
      props.videoId = videoId;
      return props;
    });
}





function getVideoId(videoLocation) {
  var p = videoLocation.split('/');
  return p.length && p.pop();
}



/**
 * generate ticket to prepare upload
 * @param {Vimeo} vimeo client instance
 * @return {<Promise>Object} ticket returned by vimeo
 */
function prepareUpload(vimeo, pOpts) {
  var options = {
        method : 'POST',
        path : '/me/videos',
        query : {
          type : 'streaming'
        }
      };

  if (pOpts.upTo1080) options.query.upgrade_to_1080 = 'true';

  return new Promise(function(resolve, reject) {
    vimeo.request(options, function(err, ticket) {
      if (err) return reject(err);
      resolve(ticket);
    });
  });
}


/**
 * make upload
 * @param  {stream.Readable} stream [description]
 * @param  {string} uri - upload url provided by vimeo api (ticket)
 * @return {<Promise>Object} object containing body, res
 */
function doUpload(stream, uri) {
  var options = {
        uri: uri,
        headers: {
          'Content-Type': 'video/mp4'
        }
      },
      req = hyperquest.put(options);

  stream.pipe(req);
  return _handleRequest(req);
}


/**
 * [confirmComplete description]
 * @param {Vimeo} vimeo client instance
 * @param  {[type]} completeUri - completeUrl provided by vimeo api (ticket)
 * @return {<Promise>Object} object containing body, res
 */
function confirmComplete(vimeo, completeUri) {
  return new Promise(function(resolve, reject) {
    var options = {
        method: 'DELETE',
        path: completeUri
      };
    vimeo.request(options, function (error, body, status_code, headers) {
        if (error) return reject(error);
        return resolve({body: body, res: {statusCode: status_code, headers: headers} });
      });
  });
}



/**
 * Try to figure out the filename for the given file
 * @param   {Stream} file The file stream
 * @returns {string}      The guessed filename
 */
function determineFilename(file) {
  var filename,
      filenameMatch;

  if (file.hasOwnProperty('httpVersion')) {
    // it's an http response
    // first let's check if there's a content-disposition header...
    if (file.headers['content-disposition']) {
      filenameMatch = /filename=(.*)/.exec(file.headers['content-disposition']);
      filename = filenameMatch[1];
    }
    if (!filename) {
      // try to get the path of the request url
      filename = path.basename(file.client._httpMessage.path);
    }
  } else if (file.path) {
    // it looks like a file, let's just get the path
    filename = path.basename(file.path);
  }

  console.log('determineFilename', filename);
  return filename || 'untitled document';
}



/**
 * handle hyperquest response
 *
 * @param  {Request} req
 * @return {<Promise>Object}
 */
function _handleRequest(req) {
  return new Promise(function(resolve, reject) {
    req.on('response', function(response) {
      _handleResponse(response)
      .then(function(body) {
        resolve({ res: response, body: body });
      })
      .catch(function(err) { reject(err); });
    });

    req.on('error', function(err) {
      reject(err);
    });

  });
}


/**
 * handle hyperquest response - get body and check status code
 *
 * @param  {http.Response} response
 * @return {<Promise>string|Object}
 */
function _handleResponse(response) {
  return _getBodyResponse(response)
    .then(function(body) {
      if (response.statusCode > 399) {
        var err = new Error(body);
        err.statusCode = response.statusCode;
        err.headers = response.headers;
        throw err;
      }
      return body;
    });
}


/**
 * pipe response body
 *
 * @param  {http.Response} response
 * @return {<Promise>string|Object} json body or body
 */
function _getBodyResponse(response) {
  return new Promise(function(resolve /*, reject*/) {
    response.pipe(concat(function (body) {
      try {
        body = body.toString();
        body = JSON.parse(body.toString());
      } catch (e) {
        //do nothing and keep body as it is
      }
      resolve(body);
    }));
  });
}
