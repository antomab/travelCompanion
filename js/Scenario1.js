/*
Waiting at the bus stop. 
 
 * announce "you have arrived at bus stop"
 * call out all available buses
 * call out buses when swiping (with direction)
 * call out when bus was selected
 * call out when badge menu closed 

*/

function Scenario1 () {
    var $scenario;
    var audioCtrl = new AudioController();
    var eventsCtrl = new EventsController();
    var badgeMenuCtrl = new BadgeMenuController();
    var menuCtrl = new MenuController();

    var scenarioInfo = {
        selectorId: 'scenario1',
        surroundings: {
            audioSrc: '',
            length: 0
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
            // show menu 
            menuCtrl.open();                      
        } else {
            // close menu
            menuCtrl.close();
        }
    };

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
            console.log('you selected: ', activeItem);
        } else {
            audioCtrl.play(scenarioInfo.surroundings.audioSrc);
        }
    };

    function setupEventHandlers () {
        eventsCtrl.setupHandler(TCDEMO.EVENTS.singleTap, onSingleTap);        
        eventsCtrl.setupHandler(TCDEMO.EVENTS.swipe, (ev) => onSwipe(ev));                
        eventsCtrl.setupHandler(TCDEMO.EVENTS.press, onPress);                
        eventsCtrl.setupHandler(TCDEMO.EVENTS.doubleTap, onDoubleTap);        
    };

    function destroyEventHandlers () {
        eventsCtrl.removeHandler(TCDEMO.EVENTS.singleTap, onSingleTap);        
        eventsCtrl.removeHandler(TCDEMO.EVENTS.swipe, (ev) => onSwipe(ev));                
        eventsCtrl.removeHandler(TCDEMO.EVENTS.press, onPress);                
        eventsCtrl.removeHandler(TCDEMO.EVENTS.doubleTap, onDoubleTap);
    };

    function startScenario () {
        $scenario = $('#' + scenarioInfo.selectorId);
        $scenario.removeClass('hide');

        eventsCtrl.setupScenario(scenarioInfo.selectorId);
        eventsCtrl.setupAllEvents();
        setupEventHandlers();

        badgeMenuCtrl.show();

        // audio cues
    };

    function endScenario () {
        badgeMenuCtrl.hide();

        destroyEventHandlers();
        eventsCtrl.stopScenario();

        $scenario.addClass('hide');
        $scenario = null;
    }

    return {
        start: startScenario,
        end: endScenario
    }
};