function demo () {
    var EVENTS = {
        tap: 'tap',
        doubleTap: 'doubletap',
        press: 'press',
        pinch: 'pinch',
        pinchIn: 'pinchin',
        pinchOut: 'pinchout',
        swipe: 'swipe',
        swipeUp: 'swipeup',
        swipeDown: 'swipeDown'
    }
    var scenario1 = $('#scenario1')[0];
    var gestures = new Hammer(scenario1); // { prevent_default: true }

    function setupRecognizers () {      
        // Tap and Double Tap     
        var singleTap = new Hammer.Tap({ event: EVENTS.tap, taps: 1 });
        var doubleTap = new Hammer.Tap({ event: EVENTS.doubleTap, taps: 2 });

        gestures.add([doubleTap, singleTap]);
        
        doubleTap.recognizeWith(singleTap);
        singleTap.requireFailure(doubleTap);        

        // Tap and Hold
        gestures.add(new Hammer.Press({ time: 500 }));     

        // Zoom in/out
        gestures.add(new Hammer.Pinch());
        gestures.get(EVENTS.pinch).set({ enable: true });

        // Swipe up/down (enable vertical swiping first)
        gestures.add(new Hammer.Swipe());        
        gestures.get(EVENTS.swipe).set({ direction: Hammer.DIRECTION_VERTICAL });
        
    }

    function setupEventsGeneral () {
        gestures.on(EVENTS.doubleTap, function (e) {
            alert('show menu');
        });

        // only when menu is visible
        gestures.on('panup pandown', function (e) {
            alert(e.type);
        });
    };

    function setupEventsScene1 () {
        gestures.on(EVENTS.doubleTap, function (e) {
            console.log('play info audio (double tap)- ' + e.tapCount);
        });
        gestures.on(EVENTS.tap, function (e) {
            console.log('play info audio (single tap) - ' + e.tapCount);
        });
        gestures.on(EVENTS.press, function (e) {
            console.log('get info surroundings (press)');
        });

        gestures.on(EVENTS.pinchIn, function (e) {
            console.log('zoom in');
        });
        gestures.on(EVENTS.pinchOut, function (e) {
            console.log('zoom out');
        });

        gestures.on(EVENTS.swipe, function (e) {
            console.log('move menu up - swipe up - ' + e);
        });
        // gestures.on(EVENTS.swipeDown, function (e) {
        //     console.log('move menu down - swipe down');
        // });
    }
    

    setupRecognizers();
    //setupEventsGeneral();
    setupEventsScene1();
}

demo();
