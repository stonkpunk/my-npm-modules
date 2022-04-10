var bresenham = require('bresenham');
function drawLine(line,imgData,color,width){
    bresenham(line[0][0], line[0][1], line[1][0], line[1][1], function(x,y){
        imgData[(x+y*width)*4] = color[0];
        imgData[(x+y*width)*4+1] = color[1];
        imgData[(x+y*width)*4+2] = color[2];
    })
}

function drawLine_inv(line,imgData,width){
    bresenham(line[0][0], line[0][1], line[1][0], line[1][1], function(x,y){
        imgData[(x+y*width)*4] = 255-imgData[(x+y*width)*4] ;
        imgData[(x+y*width)*4+1] = 255-imgData[(x+y*width)*4+1] ;
        imgData[(x+y*width)*4+2] = 255-imgData[(x+y*width)*4+2] ;
    })
}

function drawCrossHairs(width,height,_imgData){
    var black = [0,0,0];
    var white = [255,255,255];
    _drawCrossHairs(width,height,_imgData, black, [0,-1])
    _drawCrossHairs(width,height,_imgData, black, [0,+1])
    _drawCrossHairs(width,height,_imgData, black, [-1,0])
    _drawCrossHairs(width,height,_imgData, black, [+1,0])
    _drawCrossHairs(width,height,_imgData, white, [0,0])
}

function drawCrossHairs_Inv(width,height,_imgData, offset=[0,0]){
    var o = offset;
    var hx =Math.floor(width/2);
    var hy =Math.floor(height/2);
    var s = 8.0;
    var gap = 8.0;
    var line2d_e = [[hx+gap+o[0],hy+o[1]],[hx+gap+s+o[0],hy+o[1]]];
    var line2d_w = [[hx-gap+o[0],hy+o[1]],[hx-gap-s+o[0],hy+o[1]]];
    var line2d_n = [[hx+o[0],hy-gap+o[1]],[hx+o[0],hy-gap-s+o[1]]];
    var line2d_s = [[hx+o[0],hy+gap+o[1]],[hx+o[0],hy+gap+s+o[1]]];
    drawLine_inv(line2d_e,_imgData,width);
    drawLine_inv(line2d_w,_imgData,width);
    drawLine_inv(line2d_n,_imgData,width);
    drawLine_inv(line2d_s,_imgData,width);
}

function _drawCrossHairs(width,height,_imgData, _color=[255,255,255], offset=[0,0]){
    var o = offset;
    var hx =Math.floor(width/2);
    var hy =Math.floor(height/2);
    var color = _color;
    var s = 8.0;
    var gap = 8.0;
    var line2d_e = [[hx+gap+o[0],hy+o[1]],[hx+gap+s+o[0],hy+o[1]]];
    var line2d_w = [[hx-gap+o[0],hy+o[1]],[hx-gap-s+o[0],hy+o[1]]];
    var line2d_n = [[hx+o[0],hy-gap+o[1]],[hx+o[0],hy-gap-s+o[1]]];
    var line2d_s = [[hx+o[0],hy+gap+o[1]],[hx+o[0],hy+gap+s+o[1]]];
    drawLine(line2d_e,_imgData,color,width);
    drawLine(line2d_w,_imgData,color,width);
    drawLine(line2d_n,_imgData,color,width);
    drawLine(line2d_s,_imgData,color,width);
}

module.exports = {drawCrossHairs, drawCrossHairs_Inv}
