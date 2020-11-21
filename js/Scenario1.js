/*
Waiting at the bus stop. 
Select which bus was taken
*/
var TCDEMO = TCDEMO || {};
TCDEMO.SCENARIO1 = {
    finishedEvent: 'scenario1::finished'
};

function Scenario1 () {
    var $scenario;
    var audioCtrl = new AudioController();
    var eventsCtrl = new EventsController();
    var menuCtrl = new MenuController();    
    var badgeMenuCtrl = new BadgeMenuController();

    var scenarioInfo = {
        selectorId: 'scenario1',
        surroundings: {
            audioSrc: 'assets/audios/scenario1/surroundings.mp3',
            length: 4000
        },
        onArrival: {
            audioSrc: 'assets/audios/scenario1/onArrival.mp3',
            length: 7000
        }
    };
    
    // single tap to activate badge (select 1st item) or
    // to exit badge if already active
    function onSingleTap () {
        if (badgeMenuCtrl.isActive()) {
            badgeMenuCtrl.deactivate();
        } else {
            badgeMenuCtrl.activate();
        }
    };

    // Show menu on double tap 
    function onDoubleTap () {
        if (!menuCtrl.isOpen()) {
            // deactivate all other events, but double tap
            destroyEventHandlers();       
            eventsCtrl.setupHandler(TCDEMO.EVENTS.doubleTap, onDoubleTap);   

            menuCtrl.open();                      
        } else {
            menuCtrl.close();

            // reactivate events for this scenario
            setupEventHandlers();
        }
    };

    // Pause audio
    function onTwoFingerTap () {
        audioCtrl.toggle();
    }

    // Swipe down to select 2nd item        
    // Swipe up to select 1st item again
    function onSwipe (event) {
        if (event.additionalEvent === TCDEMO.EVENTS.swipeDown) {
            badgeMenuCtrl.activateSecond();
        } else if (event.additionalEvent === TCDEMO.EVENTS.swipeUp) {
            badgeMenuCtrl.activateFirst();
        }
    };

    // If badgeMenu is active, Hold will select active item
    // If badgeMenu is NOT active, Hold will describe surroundings
    function onPress () {
        if (badgeMenuCtrl.isActive()) {
            var activeItem = badgeMenuCtrl.getActive();
            audioCtrl.play(activeItem.audio.onSelected.audioSrc, false);

            setTimeout(endScenario, activeItem.audio.onSelected.length + 2000);
        } else {
            // pause handler for single tap
            eventsCtrl.removeHandler(TCDEMO.EVENTS.singleTap, onSingleTap);  

            audioCtrl.play(scenarioInfo.surroundings.audioSrc, false);

            // resume listening for single tap when audio stops
            setInterval(() => {
                eventsCtrl.setupHandler(TCDEMO.EVENTS.singleTap, onSingleTap);   
            }, scenarioInfo.surroundings.length);
        }
    };

    function setupEventHandlers () {
        eventsCtrl.setupHandler(TCDEMO.EVENTS.singleTap, onSingleTap);        
        eventsCtrl.setupHandler(TCDEMO.EVENTS.swipe, (ev) => onSwipe(ev));                
        eventsCtrl.setupHandler(TCDEMO.EVENTS.press, onPress);                
        eventsCtrl.setupHandler(TCDEMO.EVENTS.doubleTap, onDoubleTap);    
        eventsCtrl.setupHandler(TCDEMO.EVENTS.twoFingerTap, onTwoFingerTap);    
    };

    function destroyEventHandlers () {
        eventsCtrl.removeHandler(TCDEMO.EVENTS.singleTap, onSingleTap);        
        eventsCtrl.removeHandler(TCDEMO.EVENTS.swipe, (ev) => onSwipe(ev));                
        eventsCtrl.removeHandler(TCDEMO.EVENTS.press, onPress);                
        eventsCtrl.removeHandler(TCDEMO.EVENTS.doubleTap, onDoubleTap);
        eventsCtrl.removeHandler(TCDEMO.EVENTS.twoFingerTap, onTwoFingerTap);
    };

    function startScenario () {
        $scenario = $('#' + scenarioInfo.selectorId);
        $scenario.removeClass('hide');

        eventsCtrl.setupScenario(scenarioInfo.selectorId);
        eventsCtrl.setupAllEvents();
        setupEventHandlers();
        
        // set up parallax
        parallaxOnboarding = new Parallax($scenario[0], {
            relativeInput: true,
            pointerEvents: true
        });

        badgeMenuCtrl.show();

        // audio cues
        audioCtrl.play(scenarioInfo.onArrival.audioSrc, false);
    };

    function endScenario () {
        badgeMenuCtrl.hide();

        audioCtrl.stop();

        destroyEventHandlers();
        eventsCtrl.stopScenario();

        $scenario.addClass('hide');
        $scenario = null;
        
        $.event.trigger({
            type: TCDEMO.SCENARIO1.finishedEvent
        });
    }

    return {
        start: startScenario,
        stop: endScenario
    }
};