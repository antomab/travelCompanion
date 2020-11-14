function demo () {
    var EVENTS = {
        tap: 'tap',
        doubleTap: 'doubletap',
        hold: 'presshold',
        zoomIn: 'zoomin',
        zoomOut: 'zoomout',
        swipeUp: 'swipeup',
        swipeDown: 'swipeDown'
    }
    var scenario1 = $('#scenario1')[0];
    var gestures = new Hammer(scenario1);

    function setupRecognizers () {           
        var singleTap = new Hammer.Tap({ event: EVENTS.tap });
        var doubleTap = new Hammer.Tap({ event: EVENTS.doubleTap, taps: 2 });

        gestures.add([doubleTap, singleTap]);
        
        doubleTap.recognizeWith(singleTap);
        singleTap.requireFailure(doubleTap);
        

        // Tap and Hold
        //gestures.add(new Hammer.Press({ event: 'taphold' }));

        // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
        // gestures.get('doubletap').recognizeWith('singletap');
        // // we only want to trigger a tap, when we don't have detected a doubletap
        // gestures.get('singletap').requireFailure('doubletap');

        // Zoom in/out
        gestures.add(new Hammer.Pinch());

        // Swipe up/down
       // gestures.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
    }

    function setupEventsGeneral () {
        gestures.on('doubletap', function (e) {
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

//         $(scenario1).bind(EVENTS.tap, function(e) {
//             console.log('User tapped #myElement');
//         });
// //  put class="doubleTap" on the elements you need to double tap
// $(scenario1).doubleTap(function(){
//     console.log('User double tapped #myElement');
// });

        gestures.on(EVENTS.zoomIn, function (e) {
            console.log('zoom in');
        });
        
        //   $(scenario1).hammer().bind('singletap', function (e) {
        //       console.log('play info auidio - again');
        //   });
        // gestures.on('taphold', function(e) {
        //     alert('description of surroundings');
        // })
    }
    

    setupRecognizers();
    //setupEventsGeneral();
    setupEventsScene1();
}


(function($) {
    $.fn.doubleTap = function(doubleTapCallback) {
        return this.each(function(){
           var elm = this;
           var lastTap = 0;
           $(elm).bind('vmousedown', function (e) {
                               var now = (new Date()).valueOf();
               var diff = (now - lastTap);
                               lastTap = now ;
                               if (diff < 250) {
                           if($.isFunction( doubleTapCallback ))
                           {
                              doubleTapCallback.call(elm);
                           }
                               }      
           });
        });
   }
})(jQuery);


demo();
