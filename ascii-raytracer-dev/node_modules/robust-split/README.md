# robust-split

Use this package when you want to split a double precision floating point number into a 2-part non-overlapping sequence.

Why would you ever want to do that? Well these sequences are an efficient way to perform
_exact_ mathmatical operations on numbers in javascript.

# install

`npm install robust-split`

If you want to use this in the browser, check out [browserify](http://browserify.org)

# use

```javascript

var rsplit = require('robust-split');

var p = rsplit(0.3);

console.log(p); //[ 2.980232227667301e-9,
                //  0.29999999701976776 ]
```

You could then pass the sequence into `[robust-estimate-float](https://github.com/tmpvar/robust-estimate-float)`

```javascript
var num = require('robust-estimate-float');

var r = num(p);

console.log(r) // 0.3
```

See the rest of the [robust family of packages](http://npmsearch.com/?q=keywords:robust)

# credits

This code is pulled from Mikola Lysenko's [Robust arithmetic in JavaScript](https://github.com/mikolalysenko/robust-arithmetic-notes) class notes.

