var TCDEMO = {};

TCDEMO.EVENTS = {
    singleTap: 'tap',
    doubleTap: 'doubletap',
    twoFingerTap: 'taptwofinger',
    press: 'press',
    pinch: 'pinch',
    pinchEnd: 'pinchend',
    pinchOut: 'pinchout',
    pinchIn: 'pinchin',
    swipe: 'pan',
    swipeDown: 'pandown',
    swipeUp: 'panup'
};

function EventsController () {    
    var gestures;
    var scenario;
    var isPauseAudioEnabled = false;

    
    function stopDefaultContextMenu (e) {
        e.preventDefault();
    };

    function canEnableZoom (recognizer, input) {
        return !isPauseAudioEnabled;
    };

    function canEnablePauseAudio (recognizer, input) {
        return isPauseAudioEnabled;
    };
   
    function enableAudioPause () {
        isPauseAudioEnabled = true;

        // $(document.body).on("contextmenu", stopDefaultContextMenu);
    };

    function disableAudioPause () {
        isPauseAudioEnabled = false;

        //$(document.body).off("contextmenu", stopDefaultContextMenu);
    };

    function toggleAudioPause () { 
        if (isPauseAudioEnabled) {
            disableAudioPause();
        } else {
            enableAudioPause();    
        }   
    };

    function setupAllRecognizers () { 
        var singleTap = new Hammer.Tap();
        var doubleTap = new Hammer.Tap({ event: TCDEMO.EVENTS.doubleTap, taps: 2, interval: 800 });        
        var twoFingerTap = new Hammer.Tap({ event: TCDEMO.EVENTS.twoFingerTap, taps: 1, pointers: 2, enable: canEnablePauseAudio });        
        var zoom = new Hammer.Pinch({ event: TCDEMO.EVENTS.pinch, enable: canEnableZoom });
        var hold = new Hammer.Press({ time: 500 });
        var swipe = new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL });
        
        doubleTap.recognizeWith(singleTap);
        singleTap.requireFailure(doubleTap);                

        gestures.add([zoom, hold, swipe, twoFingerTap, doubleTap, singleTap]);

        gestures.get(TCDEMO.EVENTS.doubleTap).dropRequireFailure(TCDEMO.EVENTS.singleTap)
    };
    
    function setupRecognizer (event) {
        switch (event) {
            case TCDEMO.EVENTS.singleTap:
                gestures.add(new Hammer.Tap());
                break;
            case TCDEMO.EVENTS.doubleTap:
                var singleTap = new Hammer.Tap();
                var doubleTap = new Hammer.Tap({ 
                    event: TCDEMO.EVENTS.doubleTap,
                    taps: 2,
                    interval: 900 });
                
                doubleTap.recognizeWith(singleTap);
                singleTap.requireFailure(doubleTap);  

                gestures.add([doubleTap, singleTap]);
                gestures.get(TCDEMO.EVENTS.doubleTap).dropRequireFailure(TCDEMO.EVENTS.singleTap);

                break;
            case TCDEMO.EVENTS.twoFingerTap:
                enableAudioPause();
                gestures.add(new Hammer.Tap({ 
                    event: TCDEMO.EVENTS.twoFingerTap, 
                    taps: 1,
                    pointers: 2, 
                    enable: canEnablePauseAudio }));
                break;
            case TCDEMO.EVENTS.press:
                gestures.add(new Hammer.Press({ time: 500 }));
                break;
            case TCDEMO.EVENTS.pinch:
                disableAudioPause();
                gestures.add(new Hammer.Pinch({ 
                    event: TCDEMO.EVENTS.pinch,
                    enable: canEnableZoom }));
                break;
            case TCDEMO.EVENTS.swipe:
                gestures.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }));
                break;
        }
    };

    function setupHandler (event, callback) {
        gestures.on(event, callback);
    };

    function removeHandler (event, callback) {
        gestures.off(event, callback);
    };

    function setupDoubleClickEvent(callback) {
        $(scenario).dblclick(callback);
    };

    function start (elementId) {
        scenario = $('#' + elementId)[0];
        gestures = new Hammer(scenario);
        $(document.body).on("contextmenu", stopDefaultContextMenu);
    };

    function stop () {
        $(document.body).off("contextmenu", stopDefaultContextMenu);
        $(scenario).off( "dblclick" );

        gestures.destroy();
        gestures = null;
        scenario = null;
        isPauseAudioEnabled = false;       
    };

    return {
        setupScenario: start,
        stopScenario: stop,
        setupAllEvents: setupAllRecognizers,
        setupEvent: setupRecognizer,
        setupHandler: setupHandler,
        setupDoubleClick: setupDoubleClickEvent,
        removeHandler: removeHandler,
        toggleAudioPauseEvent: toggleAudioPause 
    }
};
