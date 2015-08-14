var Promise             = require('bluebird'),
    hyperquest          = require('hyperquest'),
    resolveDownloadLink = require('./_resolve_download_link.js');

function duplicate(videoId) {
  var isHD  = false,
      _this = this,
      name, description;

  return this.info(videoId)
    .then(function(props) {
      name        = props.body.name;
      description = props.body.description;
      return resolveDownloadLink(props.body.download);
    })

    .then(function(linkObj) {
      isHD = linkObj.quality == 'hd';
      return hyperquest(linkObj.link);
    })

    .then(function(req) {
      var opts = {
            upTo1080   : isHD,
            name       : name,
            description: description
          };

      // request is hyperquest request - can be piped to uploadStream
      return _this.uploadStream(req, opts);
    });
}


// function getRedirectLink(link) {
//   return new Promise(function(resolve, reject) {
//     var req = hyperquest(link);
//     req.on('response', function(res) {
//       if (res.statusCode != '302') return reject(new Error('no redirect link on download link'));
//       resolve(res.headers.location);
//     });

//     req.on('error', function(err) { reject(err); });
//   });
// }



// function getDownloadLinks(links) {
//   if (!links) throw new Error('no download links');
//   if (!links.length) throw new Error('no download links');

//   var link = fWhile(function(quality) {
//     return findQuality(links, quality);
//   }, ['original', 'source', 'hd', 'sd', 'mobile']);

//   if (link) return link;
// }

// *
//  * return iterator returned value if differente from `undefined`
//  *
//  * @param  {Function} fn   - iterator
//  * @param  {array}   list
//  * @return {mixed}

// function fWhile(fn, list) {
//   var idx = 0;
//   var len = list.length;
//   var v;
//   while (idx < len) {
//     v = fn(list[idx]);
//     if (typeof v !== 'undefined')  return v;
//     idx += 1;
//   }
// }

// /**
//  * find download link index which matches quality parameter
//  *
//  * @param  {array} links
//  * @param  {string} quality
//  * @return {Number}
//  */
// function findQuality(links, quality) {
//   return find(function(link) { return link.quality == quality;}, links);
// }


// /**
//  * returns the first element which matches the predicate `fn` or `undefined` if no element matches.
//  * @param  {Function} fn   - predicate function
//  * @param  {array}   list
//  * @return {Object|undefined}
//  */
// function find(fn, list) {
//   var idx = 0;
//   var len = list.length;
//   while (idx < len) {
//     if (fn(list[idx]))  return list[idx];
//     idx += 1;
//   }
// }

module.exports = duplicate;
