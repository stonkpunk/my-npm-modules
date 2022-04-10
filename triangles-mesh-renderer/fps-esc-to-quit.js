module.exports = function(window, onUncaptureMouse, onCaptureMouse){

    window.on('mouseButtonDown', (evt) => {
        if(onCaptureMouse){
            onCaptureMouse();
        }
    })

    window.on('keyDown', (evt) => {
        switch(evt.scancode){
            case 41: //esc
                if(onUncaptureMouse){
                    onUncaptureMouse();
                }
                //MOUSE_IS_CAPTURED=false;
                //process.exit(1);
        }

        if(evt.key == 'c'){
            if(evt.ctrl){
                process.exit(1);
            }
        }

        if(evt.key == 'f'){
            if(evt.ctrl || evt.alt || evt.super){
                window.setFullscreen(!window.fullscreen)
            }
        }

        //console.log("scancode",evt.scancode)

        // {
        //     scancode: 22,
        //     key: 's',
        //     repeat: false,
        //     alt: false,
        //     ctrl: false,
        //     shift: false,
        //     super: false,
        //     altgr: false,
        //     numlock: false,
        //     capslock: false
        // }

        //console.log(evt)
    });

}