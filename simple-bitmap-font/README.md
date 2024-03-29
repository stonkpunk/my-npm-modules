# simple-bitmap-font

small 8x8 bitmap font for 2d/3d graphics and terminal

```bash
XXXXXX     XX     XXXXXX   XX   XX           XXXXXX              XXX                         X        XX   
 XX  XX           X XX X   XXX XXX            XX  XX            XX XX                       XX       XXXX  
 XX  XX   XXX       XX     XXXXXXX   XXXX     XX  XX            XX       XXXX    XXXXX     XXXXX     XXXX  
 XXXXX     XX       XX     XXXXXXX      XX    XXXXX   XXXXXX   XXXX     XX  XX   XX  XX     XX        XX   
 XX  XX    XX       XX     XX X XX   XXXXX    XX                XX      XX  XX   XX  XX     XX        XX   
 XX  XX    XX       XX     XX   XX  XX  XX    XX                XX      XX  XX   XX  XX     XX X           
XXXXXX    XXXX     XXXX    XX   XX   XXX XX  XXXX              XXXX      XXXX    XX  XX      XX       XX   
```

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [List of Glyphs](#list-of-glyphs) (list of valid characters)

## Installation

```sh
npm i simple-bitmap-font
```

## Usage

```javascript
var bf =  require('simple-bitmap-font');
var BF = new bf();

console.log(BF.getBitmapStringFromString_horizontal('OK')) //print out in block letters horizontal
console.log(BF.getBitmapStringFromString_vertical('OK')) //print out in block letters vertical

//replace the X's with something else...
console.log(BF.getBitmapStringFromString_horizontal('BiTMaP-font!').replace(/X/g,'#'))

//scan effect by adjusting scrollMin, scrollMax params
console.log(BF.getBitmapStringFromString_horizontal('OK',3,20))

console.log(BF.ptsForString('OK')) //list of 3d pts representing pixels in the string [[x,y,z],[x,y,z],...]
console.log(BF.ptsPerLetterForString('OK')) //list of 3d pts, similar to above except there is a separate array per letter
console.log(BF.getPtArrPerLetter_noShift('OK')) //same as above except these pts do not have the letters shift left-to-right [in case we want to position them ourselves later...]

/*
//block printout, horizontal:

  XXX    XXX  XX
 XX XX    XX  XX
XX   XX   XX XX
XX   XX   XXXX
XX   XX   XX XX
 XX XX    XX  XX
  XXX    XXX  XX

//block printout, vertical:

  XXX
 XX XX
XX   XX
XX   XX
XX   XX
 XX XX
  XXX

XXX  XX
 XX  XX
 XX XX
 XXXX
 XX XX
 XX  XX
XXX  XX

//scan effect:

XX    XXX  XX 
 XX    XX  XX 
  XX   XX XX  
  XX   XXXX   
  XX   XX XX  
 XX    XX  XX 
XX    XXX  XX 

//pts for string:
[
    [ 4, -6, 0 ],  [ 3, -6, 0 ],  [ 2, -6, 0 ],  [ 5, -5, 0 ],
    [ 4, -5, 0 ],  [ 2, -5, 0 ],  [ 1, -5, 0 ],  [ 6, -4, 0 ],
    ...
]

//pts per-letter:
[
    [
        [ 4, -6, 0 ], [ 3, -6, 0 ],
        [ 2, -6, 0 ], [ 5, -5, 0 ],
        ...
    ],
    [
        [ 16, -6, 0 ], [ 15, -6, 0 ], [ 12, -6, 0 ],
        [ 11, -6, 0 ], [ 10, -6, 0 ], [ 16, -5, 0 ],
        ...
    ]
]

 */


```

## List of Glyphs

```txt
!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ΢ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψω─━│┃┄┅┆┇┈┉┊┋┌┍┎┏┐┑┒┓└┕┖┗┘┙┚┛├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋╌╍╎╏═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬╭╮╯╰╱╲╳╴╵╶╷╸╹╺╻╼╽╾╿▀▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▐░▒▓▔▕▖▗▘▙▚▛▜▝▞▟ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔ゛゜ゝゞ"
```

