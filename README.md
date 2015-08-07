# jab-vimeo
vimeo API + stream support &amp; duplicate function

# Official Node.js library for the Vimeo API (extended).

 * [vimeo API](https://github.com/vimeo/vimeo.js)


# Installation

    npm install jab-vimeo


# Uploading stream

```JavaScript
    var Vimeo = require('jab-vimeo').Vimeo;
    var lib   = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

    var fs    = require('fs');
    var streamToUpload = fs.createReadStream(path.join(__dirname, 'your_video.mp4'));

    lib.uploadStream(streamToUpload)
      .then(function(props) {
        console.log(props.res.headers);
        console.log(props.res.statusCode);
        console.log(props.body);
        console.log(props.videoId);
      });
```
