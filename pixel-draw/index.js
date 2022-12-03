var td = require('triangle-draw');
var dpt = require('draw-pixel-text').drawTextToBuffer;
var is = require('image-sync');

function pixelCanvas(w=512,h=512,bg=[255,255,255]){
    var img = is.blank(w,h,bg);

    this.image = img;
    this.w=w;
    this.h=h;
    this.bgColor = bg;
    var _this = this;

    function getCropped(x,y,_w,_h, bgColor=bg){ //crop canvas, return new canvas, bigger or smaller
        var newCanvas = new pixelCanvas(_w,_h,bgColor);
        for(var _x=0; _x<_w; _x++){
            for(var _y=0; _y<_h; _y++){
                var ix = x + _x;
                var iy = y + _y;
                if(ix>=0 && ix<w && iy>=0 && iy<h){
                    newCanvas._putPixel(_x,_y,_getPixel(ix,iy));
                }else{
                    newCanvas._putPixel(_x,_y,bgColor);
                }
            }
        }
        return newCanvas;
    }

    this.getCropped = getCropped;

    function drawCanvas(x,y,_canvas,transparentColor=[255,255,255], enableTransparent=true){ //draw contents of _canvas on this canvas at coords x,y
        var data = _canvas.image.data;
        var _w = _canvas.w;
        var _h = _canvas.h;

        var minX = Math.max(0, x);
        var minY = Math.max(0, y);
        var maxX = Math.min(w-1, x+_w);
        var maxY = Math.min(h-1, y+_h);

        if(minX > 0 && minY > 0 && maxX < w-1 && maxY < h-1){
            //without bounds checks
            if(enableTransparent){
                for(var _x=0;_x<_w;_x++){
                    for(var _y=0;_y<_h;_y++){
                        var _o = (_x+_y*_w)*4;
                        var rgb = [data[_o],data[_o+1],data[_o+2]];
                        var isTransparent = Math.abs(data[_o]-transparentColor[0]) + Math.abs(data[_o+1]-transparentColor[1]) + Math.abs(data[_o+2]-transparentColor[2]) == 0;
                        var o = ((x+_x)+(y+_y)*w)*4;
                        if(!isTransparent){
                            img.data[o] = rgb[0];
                            img.data[o+1] = rgb[1];
                            img.data[o+2] = rgb[2];
                        }
                    }
                }
            }else{
                for(var _x=0;_x<_w;_x++){
                    for(var _y=0;_y<_h;_y++){
                        var _o = (_x+_y*_w)*4;
                        var rgb = [data[_o],data[_o+1],data[_o+2]];
                        var o = ((x+_x)+(y+_y)*w)*4;
                        img.data[o] = rgb[0];
                        img.data[o+1] = rgb[1];
                        img.data[o+2] = rgb[2];
                    }
                }
            }

        }else{
            //with bounds checks
            if(enableTransparent){
                for(var _x=0;_x<_w;_x++){
                    if((x+_x) >= 0 && (x+_x)<w){
                        for(var _y=0;_y<_h;_y++){
                            var _o = (_x+_y*_w)*4;
                            var rgb = [data[_o],data[_o+1],data[_o+2]];
                            var o = ((x+_x)+(y+_y)*w)*4;

                            if((y+_y) >= 0 && (y+_y)<h){

                                var isTransparent = Math.abs(data[_o]-transparentColor[0]) + Math.abs(data[_o+1]-transparentColor[1]) + Math.abs(data[_o+2]-transparentColor[2]) == 0;
                                if(!isTransparent){
                                    img.data[o] = rgb[0];
                                    img.data[o+1] = rgb[1];
                                    img.data[o+2] = rgb[2];
                                }

                            }
                        }
                    }
                }
            }else{
                for(var _x=0;_x<_w;_x++){
                    if((x+_x) >= 0 && (x+_x)<w){
                        for(var _y=0;_y<_h;_y++){
                            var _o = (_x+_y*_w)*4;
                            var rgb = [data[_o],data[_o+1],data[_o+2]];
                            var o = ((x+_x)+(y+_y)*w)*4;

                            if((y+_y) >= 0 && (y+_y)<h){
                                img.data[o] = rgb[0];
                                img.data[o+1] = rgb[1];
                                img.data[o+2] = rgb[2];
                            }
                        }
                    }
                }
            }
        }
    }

    this.drawCanvas=drawCanvas;

    this.crop = function(x,y,_w,_h, bgColor=bg){
        _this = getCropped(x,y,_w,_h, bgColor);
        return this;
    }

    function drawText(text, offset, color=[0,0,0], doExpandText=true, maxLineLen=50){
        //note offset must be integers
        dpt(text, offset,color,img.data,w,h,doExpandText,maxLineLen);
    }
    this.drawText=drawText;

    function drawTriangle(tri, color=[255,0,0], edgesOnly=false){
        if(Array.isArray(color[0])){ //vert colors
            td.drawTriangleColored(tri,color,img.data,w,h,edgesOnly);
        }else{
            td.drawTriangle(tri,color,img.data,w,h,edgesOnly);
        }
    }
    this.drawTriangle=drawTriangle;

    function drawRectangle(x,y,_w,_h, color=[255,0,0], filled=true, thickness=2.0){
        var tri0 = [[x,y],[x+_w,y],[x+_w,y+_h]].map(ptFloor);
        var tri1 = [[x+_w,y+_h],[x,y+_h],[x,y]].map(ptFloor);
        if(Array.isArray(color[0])){ //vert colors
            td.drawTriangleColored(tri0,[color[0],color[2],color[1]],img.data,w,h,false);
            td.drawTriangleColored(tri1,[color[2],color[0],color[3]],img.data,w,h,false);
        }else{
            if(filled){
                var minX = Math.floor(Math.max(x,0));
                var maxX = Math.floor(Math.min(x+_w,w-1));
                var minY = Math.floor(Math.max(y,0));
                var maxY = Math.floor(Math.min(y+_h,h-1));
                for(var _x=minX; _x<maxX; _x++){
                    for(var _y=minY; _y<maxY; _y++){
                        var o = (_y*w+_x)*4;
                        img.data[o] = color[0];
                        img.data[o+1] = color[1];
                        img.data[o+2] = color[2];
                    }
                }
                //td.drawTriangle(tri0,color,img.data,w,h,false);
                //td.drawTriangle(tri1,color,img.data,w,h,false);
            }else{
                //draw edges only
                drawRectangle(x,y,_w,thickness,color,true);
                drawRectangle(x,y+_h-thickness,_w,thickness,color,true);
                drawRectangle(x,y,thickness,_h,color,true);
                drawRectangle(x+_w-thickness,y,thickness,_h,color,true);
            }
        }
    }
    this.drawRectangle=drawRectangle;

    function drawCircle(x,y,radius,color=[255,0,0], filled=true, thickness=2.0){
        var radiusSquared = radius*radius;
        var radSmaller = Math.max(0,radius-thickness);
        var radiusMinSquared = filled ? 0 : radSmaller*radSmaller;
        var minX = Math.max(0,x-radius);
        var maxX = Math.min(w-1,x+radius);
        var minY = Math.max(0,y-radius);
        var maxY = Math.min(h-1,y+radius);
        for(var _x=minX;_x<maxX;_x++){
            for(var _y=minY;_y<maxY;_y++){
                var xd = (_x-x); var yd = (_y-y);
                var distSquared = xd*xd+yd*yd;
                if(distSquared>= radiusMinSquared && distSquared <= radiusSquared){
                    var o = (_y*w+_x)*4;
                    img.data[o] = color[0];
                    img.data[o+1] = color[1];
                    img.data[o+2] = color[2];
                }
            }
        }
    }
    this.drawCircle=drawCircle;

    function ptScale(a,s){return [a[0]*s,a[1]*s];}
    function ptAdd(a,b){return [a[0]+b[0],a[1]+b[1]];}
    function ptDiff(a,b){return [a[0]-b[0],a[1]-b[1]];}
    function ptLen(p){return Math.sqrt(p[0]*p[0]+p[1]*p[1]);}
    function ptFloor(p){return p.map(Math.floor)}
    //function ptsAverage(a,b){return ptScale(ptAdd(a,b),0.5)}

    //line = [x0,y0,x1,y1]
    function drawLine(line,color=[0,255,0],thickness=2,endcaps=true){
        var t0;
        var t1;
        if(Array.isArray(thickness)){ //diff start/end thickness
            t0=thickness[0];
            t1=thickness[1];
        }else{
            t0=thickness;
            t1=thickness;
        }

        var lineDir = ptDiff(line[1],line[0]);
        var lineLen = ptLen(lineDir);
        var orthoLineDir = [lineDir[1],-lineDir[0]];
        var orthoLineDirNormalized = ptScale(orthoLineDir,1.0/lineLen);

        var orthoOffset0 = ptScale(orthoLineDirNormalized, t0);
        var orthoOffset1 = ptScale(orthoLineDirNormalized, t1);

        var A = [ptAdd(line[0],orthoOffset0),ptDiff(line[0],orthoOffset0)]; //orthoLine0
        var B = [ptAdd(line[1],orthoOffset1),ptDiff(line[1],orthoOffset1)]; //orthoLine1

        var tri0 = [A[1],A[0],B[0]].map(ptFloor);
        var tri1 = [B[1],B[0],A[1]].map(ptFloor);

        var colorArr = Array.isArray(color[0]);

        if(endcaps){
            var c0 = colorArr ? color[0] : color;
            var c1 = colorArr ? color[1] : color;
            drawCircle(line[0][0],line[0][1],t0,c0);
            drawCircle(line[1][0],line[1][1],t1,c1);
        }

        if(colorArr){ //vert colors
            td.drawTriangleColored(tri0,[color[0],color[1],color[0]],img.data,w,h,false);
            td.drawTriangleColored(tri1,[color[1],color[0],color[1]],img.data,w,h,false);
        }else{
            td.drawTriangle(tri0,color,img.data,w,h,false);
            td.drawTriangle(tri1,color,img.data,w,h,false);
        }
    }
    this.drawLine = drawLine;

    function _putPixel(x,y,rgb){
        x=Math.floor(x);
        y=Math.floor(y);
        var o = (x+y*w)*4;
        img.data[o] = rgb[0];
        img.data[o+1] = rgb[1];
        img.data[o+2] = rgb[2];
    }

    function putPixel(x,y,rgb){
        if(x>=0 && x<w && y>=0 && y<h){_putPixel(x,y,rgb);}
    }

    function _getPixel(x,y){
        var o = (x+y*w)*4;
        return [img.data[o],img.data[o+1],img.data[o+2]];
    }

    function getPixel(x,y){
        if(x>=0 && x<w && y>=0 && y<h){
            return _getPixel(x,y);
        }
        return [0,0,0];
    }

    function clear(color){
        drawRectangle(0,0,w,h,color || [255,255,255])
    }

    function drawFunction(x,y,_w,_h, colorFunc){
        var minX = Math.floor(Math.max(x,0));
        var maxX = Math.floor(Math.min(x+_w,w-1));
        var minY = Math.floor(Math.max(y,0));
        var maxY = Math.floor(Math.min(y+_h,h-1));
        for(var _x=minX; _x<maxX; _x++){
            for(var _y=minY; _y<maxY; _y++){
                var o = (_y*w+_x)*4;
                var color = colorFunc(_x,_y, [img.data[o], img.data[o+1], img.data[o+2]]);
                img.data[o] = color[0];
                img.data[o+1] = color[1];
                img.data[o+2] = color[2];
            }
        }
    }

    this.clear = clear;

    this.getPixel = getPixel;
    this._getPixel = _getPixel;
    this.putPixel = putPixel;
    this._putPixel = _putPixel;

    this.saveAs = img.saveAs;

    this.drawFunction = drawFunction;

    return this;
}

module.exports = pixelCanvas;

