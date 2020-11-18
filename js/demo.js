function Demo () {    
    var eventsCtrl = new EventsController();
    var menuCtrl = new MenuController();
    var onboardingCtrl = new Onboarding();

    function setupEventsScene1 () {
               
        gestures.on(TCDEMO.EVENTS.singleTap, function (e) {
            console.log('play info audio (single tap)');
        });
        gestures.on(TCDEMO.EVENTS.doubleTap, function (e) {
            menuCtrl.toggle();
        });
        gestures.on(TCDEMO.EVENTS.twoFingerTap, function (e) {            
            console.log('play/pause audio (two finger tap)');                        
        });       

        gestures.on(TCDEMO.EVENTS.press, function (e) {
            console.log('get info surroundings (press)');
        });

        gestures.on(TCDEMO.EVENTS.pinchEnd, function (e) {
            if (e.additionalEvent === TCDEMO.EVENTS.pinchOut) {
                console.log('pinch - zoom out');
            } else if (e.additionalEvent === TCDEMO.EVENTS.pinchIn) {
                console.log('pinch - zoom in');
            }            
        });       
    }
    
    //setupEventsScene1();
   
    var onboardingBtn = $('#onboarding .start');
    onboardingBtn.on('click', function () {
        onboardingBtn.addClass('hide');
        onboardingCtrl.start();        
    });

    $(document).on(TCDEMO.MENU.itemChangedEvent, (data) => {
        console.log('item changed! ' + data.index);
    });
}

Demo();
