function demo () {
    var EVENTS = {
        singleTap: 'tap',
        doubleTap: 'doubletap',
        twoFingerTap: 'taptwofinger',
        press: 'press',
        pinch: 'pinch',
        pinchEnd: 'pinchend',
        pinchOut: 'pinchout',
        pinchIn: 'pinchin'
    };
    var scenario1 = $('#scenario1')[0];
    var gestures = new Hammer(scenario1); // { prevent_default: true }

    function playAudio () {
        // enable Two Finger Tap to pause/resume
        // disable zoom while audio is playing

        gestures.get(EVENTS.twoFingerTap).set({ enable: true });
        gestures.get(EVENTS.pinch).set({ enable: false });
    };
    function stopAudio () {
        // disable Two Finger Tap
        // enable zoom

        gestures.get(EVENTS.twoFingerTap).set({ enable: false });
        gestures.get(EVENTS.pinch).set({ enable: true });
    };

    function setupRecognizers () { 
        var singleTap = new Hammer.Tap();
        var doubleTap = new Hammer.Tap({ event: EVENTS.doubleTap, taps: 2, interval: 800 });        
        var twoFingerTap = new Hammer.Tap({ event: EVENTS.twoFingerTap, taps: 1, pointers: 2 });        
        var zoom = new Hammer.Pinch({ event: EVENTS.pinch});
        var hold = new Hammer.Press({ time: 500 });
        
        doubleTap.recognizeWith(singleTap);
        singleTap.requireFailure(doubleTap);        

        gestures.add([zoom, hold, twoFingerTap, doubleTap, singleTap]);
        
        stopAudio();    
    }  

    function setupEventsScene1 () {
        $(document.body).on("contextmenu", function(e){
            e.preventDefault();
        });
        
        gestures.on(EVENTS.singleTap, function (e) {
            console.log('play info audio (single tap)');
        });
        gestures.on(EVENTS.doubleTap, function (e) {
            console.log('play info audio (double tap)- ' + e.tapCount);
        });
        gestures.on(EVENTS.twoFingerTap, function (e) {            
            console.log('play/pause audio (two finger tap)');                        
        });       

        gestures.on(EVENTS.press, function (e) {
            console.log('get info surroundings (press)');
        });
        
        gestures.on(EVENTS.pinchEnd, function (e) {
            if (e.additionalEvent === EVENTS.pinchOut) {
                console.log('pinch - zoom out');
            } else if (e.additionalEvent === EVENTS.pinchIn) {
                console.log('pinch - zoom in');
            }            
        });       
    }
    

    setupRecognizers();
    setupEventsScene1();

    $(document).ready(function() {
        $('.menu-slider').slick({
            centerMode: true,
            centerPadding: '60px',
            slidesToShow: 3,
            arrows: false,
            touchMove: true,
            vertical: true,
            verticalSwiping: true
        });
    });    
}

demo();
