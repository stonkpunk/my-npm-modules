const robot = require("robotjs");
var MOUSE_POS=null;

function getMousePos(){
    return MOUSE_POS;
}

var MOUSE_INTERVAL = null;

function stopFreeMouse(){
    clearInterval(MOUSE_INTERVAL);
}

function startFreeMouse(onMouseUpdated){
    var MOUSE_PERIOD = 100;
    var screenSize = robot.getScreenSize();
    MOUSE_INTERVAL = setInterval(function(){
        var mouse = robot.getMousePos();
        MOUSE_POS=mouse;
        var buffer = 5;
        var ENABLE_X_FREE = true;
        var ENABLE_Y_FREE = false;
        if(ENABLE_X_FREE){
            if(mouse.x < buffer){
                robot.moveMouse(screenSize.width-buffer,mouse.y);
            }
            if(mouse.x > screenSize.width-buffer){
                robot.moveMouse(buffer,mouse.y);
            }
        }
        if(ENABLE_Y_FREE){
            if(mouse.y < buffer){
                robot.moveMouse(mouse.x,screenSize.height-buffer);
            }
            if(mouse.y > screenSize.height-buffer){
                robot.moveMouse(mouse.x,buffer);
            }
        }
        onMouseUpdated(screenSize,mouse);
        //console.log(screenSize, mouse);
    }, MOUSE_PERIOD)
}

module.exports={stopFreeMouse, startFreeMouse,getMousePos}