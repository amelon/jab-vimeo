# jab-vimeo
vimeo API + stream support &amp; duplicate &amp; patch &amp; info functions

# Official Node.js library for the Vimeo API (extended).

 * [vimeo API](https://github.com/vimeo/vimeo.js)


# Installation

    npm install jab-vimeo


# API

## `uploadStream(stream [, opts])`

Returns a Promise Object

### Params
<dl>
<dt>
stream
</dt>
<dd>
Readable stream to upload to vimeo
</dd>

<dt>
opts
</dt>
<dd>
Object.
</dd>
</dl>

`opts` is optional

`opts.upTo1080=false` -  do you want to convert your video to HD?
`opts.name=undefined`  - name of video that appears in Vimeo.
If no name is given, function try to determine filename on stream object.

`opts.description=undefined`  - description of video that appears in Vimeo


### Return
Promise is resolved with following properties

<dl>
<dt>
body
</dt>
<dd>
body response of patch on video
</dd>

<dt>
res
</dt>
<dd>
Object.
</dd>
<dt>
videoId
</dt>
<dd>
Number
</dd>
</dl>


### Example
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

## `patch(videoId , data)`

Returns a Promise Object

### Params
<dl>
<dt>
videoId
</dt>
<dd>
existing id of a vimeo video
</dd>

<dt>
data
</dt>
<dd>
Object.
</dd>
</dl>

`data` can be anything available on [Vimeo API](https://developer.vimeo.com/api/spec)


### Return
Promise is resolved with following properties

<dl>
<dt>
body
</dt>
<dd>
body response of patch on video
</dd>

<dt>
res
</dt>
<dd>
Object.
</dd>
<dt>
videoId
</dt>
<dd>
Number
</dd>
</dl>


### Example

```JavaScript
    var Vimeo = require('jab-vimeo').Vimeo;
    var lib   = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);
    var data = {name: 'my new video name', description: 'awesome description of my video'}

    lib.patch(videoId, data)
      .then(function(props) {
        console.log(props.res.headers);
        console.log(props.res.statusCode);
        console.log(props.body);
        console.log(props.videoId);
      });
```


## `duplicate(videoId)`

Returns a Promise Object

### Params
<dl>
<dt>
videoId
</dt>
<dd>
existing id of a vimeo video
</dd>
</dl>

On Vimeo, there are different video quality available for download.

Function try to duplicate video with following priority: `original` `source`  `hd` `sd` `mobile`

### Return
Promise is resolved with following properties:
<dl>
<dt>
body
</dt>
<dd>
body response of patch on video
</dd>

<dt>
res
</dt>
<dd>
Object.
</dd>
<dt>
videoId
</dt>
<dd>
Number
</dd>
</dl>


### Example

```JavaScript
    var Vimeo = require('jab-vimeo').Vimeo;
    var lib   = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);
    var data = {name: 'my new video name', description: 'awesome description of my video'}

    lib.duplicate(videoId)
      .then(function(props) {
        console.log(props.res.headers);
        console.log(props.res.statusCode);
        console.log(props.body);
        console.log(props.videoId);
      });
```



## `info(videoId)`

Returns a Promise Object

### Params
<dl>
<dt>
videoId
</dt>
<dd>
existing id of a vimeo video
</dd>
</dl>

### Return

Promise is resolved with following properties

<dl>
<dt>
body
</dt>
<dd>
body response of patch on video
</dd>

<dt>
res
</dt>
<dd>
Object.
</dd>
<dt>
videoId
</dt>
<dd>
Number
</dd>
</dl>


### Example

```JavaScript
    var Vimeo = require('jab-vimeo').Vimeo;
    var lib   = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

    lib.info(videoId)
      .then(function(props) {
        console.log(props.res.headers);
        console.log(props.res.statusCode);
        console.log(props.body);
        console.log(props.videoId);
      });
```
