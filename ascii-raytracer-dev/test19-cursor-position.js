var freeCursor = require('./cursor-freedom.js');

function onMouseUpdated(screenSize,mousePos){
    var screenCoords01 = [mousePos.x/screenSize.width, mousePos.y/screenSize.height];
    console.log(screenSize,mousePos, screenCoords01);
}

freeCursor.startFreeMouse(onMouseUpdated);