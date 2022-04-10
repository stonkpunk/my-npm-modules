# draw-pixel-text

print basic text directly onto a pixel buffer 

uses the public domain 8x8 VGA bitmap font created by Daniel Hepper / Marcel Sondaar / IBM (via `simple-bitmap-font`)

## Installation

```sh
npm i draw-pixel-text
```

## Usage 

example drawing text onto a buffer and rendering it with SDL
```javascript
var drawTextToBuffer = require('draw-pixel-text').drawTextToBuffer;

var sdl = require('@kmamal/sdl');
var window = sdl.video.createWindow({ resizable: true })
var { width, height } = window
var stride = width * 4
var buffer = Buffer.alloc(stride * height)

//buffer has flat rgba int format [r,g,b,a,  r,g,b,a,  r,g,b,a ...]

//set the buffer to white
for(var i=0;i<buffer.length;i++){
    buffer[i]=255;
}

var theText =
    "Here is some text!\nYou can even write unicode\ncharacters!\n\n" +
    "Here is the full set\nof characters:\n\n!\"#$%&'()*+,-./0123456789:;<=>?\n" +
    "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]\n^_`abcdefghijklmnopqrstuvwxyz{|}\n~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»\n" +
    "¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝ\nÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿΐ\nΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ΢ΣΤΥΦΧΨ\n" +
    "ΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψω─━\n│┃┄┅┆┇┈┉┊┋┌┍┎┏┐┑┒┓└┕┖┗┘┙┚┛├┝┞┟┠┡┢┣┤┥┦┧┨\n" +
    "┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋╌╍╎╏\n═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬\n╭╮╯╰╱╲╳╴╵╶╷╸╹╺╻╼╽╾╿▀\n" +
    "▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▐░▒▓▔▕▖▗▘▙▚▛▜▝▞▟\nぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢ\n" +
    "っつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆ\nょよらりるれろゎわゐゑをんゔ゛゜ゝゞ\n" +
    "\n\n" +
    "here is an example of a very long line that goes over the length limit and wraps to the next line!";

//note -- descenders on letters like j,g etc get slightly cut off 

var doExpandText = true; //expand text render by 2x
var textColor = [0,0,255]; //color [r,g,b]
var textOffset = [5,5];
var maxLineLen = 50;
drawTextToBuffer(theText, textOffset,textColor,buffer,width,height, doExpandText, maxLineLen);

window.render(width, height, stride, 'rgba32', buffer)
```

result with `doExpandText = true`
![result2](https://i.imgur.com/cBWU2YD.png)

result with `doExpandText = false`
![result1](https://i.imgur.com/QcVnrxy.png)

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



