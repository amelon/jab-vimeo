var Promise    = require('bluebird'),
    hyperquest = require('hyperquest');

/**
 * from vimeo download property of a video, resolve download link to get best quality format
 *
 * @param  {Array} links
 * @return {Promise<{link: String, quality: String}>} download link (true download link)
 *
 *
 */
function resolveDownloadLinks(links) {
  return Promise.resolve()
    .then(function() {
      // may throw - thus start a promise to handle errors
      return findDownloadLink(links);
    })
    .then(function(linkObj) {
      if (!linkObj) throw new Error('no download link [original, source, hd, sd, mobile]');

      return getRedirectLink(linkObj.link)
        .then(function(downlink) {
          return { link: downlink, quality: linkObj.quality }
        });
    });
}


module.exports = resolveDownloadLinks;

/**
 * from vimeo download property of a video, resolve download link to get best quality format
 *
 * @param  {Array} links
 * @return {Object} download link object
 *
 * download format - want to get link
       "download": [
        {
            "quality": "mobile",
            "link": "https://vimeo.com/api/file/download?...",
            ...
        },
        {
            "quality": "sd",
            "link": "https://vimeo.com/api/file/download?...",
            ...
        },
        { <- Object returned by function
            "quality": "source",
            "link": "https://vimeo.com/api/file/download?...",
            ...
        }
    ]
 *
 *
 */
function findDownloadLink(links) {
  if (!links) throw new Error('no download links');
  if (!links.length) throw new Error('no download links');

  var link = fWhile(function(quality) {
    return findQuality(links, quality);
  }, ['original', 'source', 'hd', 'sd', 'mobile']);

  if (link) return link;

}


/**
 * Vimeo download link return a redirect link - follow it to get real downlink link
 *
 * @param  {String} link - link that will be redirected
 * @return {Promise<String>} redirect link
 */
function getRedirectLink(link) {
  return new Promise(function(resolve, reject) {
    var req = hyperquest(link);
    req.on('response', function(res) {
      if (res.statusCode != '302') return reject(new Error('no redirect link on download link'));
      resolve(res.headers.location);
    });

    req.on('error', function(err) { reject(err); });
  });
}


/**
 * return iterator returned value if differente from `undefined`
 *
 * @param  {Function} fn   - iterator
 * @param  {array}   list
 * @return {mixed}
 */
function fWhile(fn, list) {
  var idx = 0;
  var len = list.length;
  var v;
  while (idx < len) {
    v = fn(list[idx]);
    if (typeof v !== 'undefined')  return v;
    idx += 1;
  }
}

/**
 * find download link index which matches quality parameter
 *
 * @param  {array} links
 * @param  {string} quality
 * @return {Number}
 */
function findQuality(links, quality) {
  return find(function(link) { return link.quality == quality;}, links);
}


/**
 * returns the first element which matches the predicate `fn` or `undefined` if no element matches.
 * @param  {Function} fn   - predicate function
 * @param  {array}   list
 * @return {Object|undefined}
 */
function find(fn, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    if (fn(list[idx]))  return list[idx];
    idx += 1;
  }
}
