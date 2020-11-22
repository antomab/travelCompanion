/*
Following a walking guide 
Task: Activate the live card
Task: Exit by tapping menu item "exit"
*/
var TCDEMO = TCDEMO || {};
TCDEMO.SCENARIO2 = {
    finishedEvent: 'scenario2::finished'
};

function Scenario2 () {
    var $scenario;
    var activeTimeouts = [];
    var parallaxScenario2;
    var interruptedAudio;
    var audioCtrl = new AudioController();
    var eventsCtrl = new EventsController();
    var menuCtrl = new MenuController();    

    var scenarioInfo = {
        selectorId: 'scenario2',
        surroundings: {
            audioSrc: 'assets/audios/scenario2/surroundings.mp3',
            length: 10000
        },
        chime: {
            audioSrc: 'assets/audios/scenario2/beepShort.mp3',
            length: 1000
        },
        tourGuide: {
            audioSrc: 'assets/audios/scenario2/tourguide.mp3',
            length: 15000
        },
        liveCard: {
            audioSrc: 'assets/audios/scenario2/twin-churches.mp3',
            length: 11000,
            selector: 'live-card'
        },
        walkingGuide: {            
            audioSrc: 'assets/audios/scenario2/walkingDirections.mp3',
            length: 5000
        }
    };
    
    function startPlayingMainAudioThread () {
        audioCtrl.play(scenarioInfo.chime.audioSrc);        
    };
    function interruptMainAudioThread (audioSrc) {
        audioCtrl.pause();
        interruptedAudio = audioCtrl.getCurrent();
        
        audioCtrl.stop();
        audioCtrl.play(audioSrc, true);
    };
    function resumeMainAudioThread (event) {
        switch (event.audioSrc) {
            case scenarioInfo.chime.audioSrc:
                audioCtrl.play(scenarioInfo.walkingGuide.audioSrc);
                break;
            case scenarioInfo.walkingGuide.audioSrc:
                audioCtrl.play(scenarioInfo.tourGuide.audioSrc, true);
                break;                
            case scenarioInfo.liveCard.audioSrc:
            case scenarioInfo.surroundings.audioSrc:
                // if there was no interruption, do nothing
                if (!interruptedAudio || interruptedAudio.audioSrc === '') break;

                audioCtrl.playAt(interruptedAudio.audioSrc, interruptedAudio.currentTime, true);
                interruptedAudio = null;
                break;
        }
    };

    function onMenuItemSelected (data) {        
        if (data.selectedItem === TCDEMO.MENU.items.exit) {
            menuCtrl.close();
            endScenario();
        }
    };

    function clearActiveTimeouts () {
        for (var i=0; i<activeTimeouts.length; i++) {
            clearTimeout(activeTimeouts[i]);
        }
    };

    // single tap to activate badge or
    // select item if menu is open
    function onSingleTap () {
        if (menuCtrl.isOpen()) {
            // select item
            menuCtrl.selectItem();
        } else {
            // activate live card
            interruptMainAudioThread(scenarioInfo.liveCard.audioSrc);
        }
    };

    // Show menu on double tap 
    function onDoubleTap () {
        if (!menuCtrl.isOpen()) {
            // deactivate all other events, but double tap and event listener
            //destroyEventHandlers();       
            //eventsCtrl.setupHandler(TCDEMO.EVENTS.doubleTap, onDoubleTap);               
            //$(document).on(TCDEMO.MENU.itemSelectedEvent, (data) => onMenuItemSelected(data));

            menuCtrl.open();                      
        } else {
            menuCtrl.close();

            // reactivate events for this scenario
            //setupEventHandlers();
        }
    };

    // Pause audio
    function onTwoFingerTap () {
        audioCtrl.toggle();
    }

    // describe surroundings
    function onPress () {       
        // pause handler for single tap
        eventsCtrl.removeHandler(TCDEMO.EVENTS.singleTap, onSingleTap);  

        interruptMainAudioThread(scenarioInfo.surroundings.audioSrc);

        // resume listening for single tap when audio stops
        activeTimeouts.push(setTimeout(() => {
            eventsCtrl.setupHandler(TCDEMO.EVENTS.singleTap, onSingleTap);   
        }, scenarioInfo.surroundings.length));       
    };

    function setupEventHandlers () {
        $(document).on(TCDEMO.MENU.itemSelectedEvent, (data) => onMenuItemSelected(data));
        $(document).on(TCDEMO.AUDIO.audioEndedEvent, (data) => resumeMainAudioThread(data));

        eventsCtrl.setupHandler(TCDEMO.EVENTS.singleTap, onSingleTap);                    
        eventsCtrl.setupHandler(TCDEMO.EVENTS.press, onPress);                
        eventsCtrl.setupHandler(TCDEMO.EVENTS.doubleTap, onDoubleTap);    
        eventsCtrl.setupHandler(TCDEMO.EVENTS.twoFingerTap, onTwoFingerTap);    
    };

    function destroyEventHandlers () {
        $(document).off(TCDEMO.MENU.itemSelectedEvent, (data) => onMenuItemSelected(data));
        $(document).off(TCDEMO.AUDIO.audioEndedEvent, (data) => resumeMainAudioThread(data));

        eventsCtrl.removeHandler(TCDEMO.EVENTS.singleTap, onSingleTap);                  
        eventsCtrl.removeHandler(TCDEMO.EVENTS.press, onPress);                
        eventsCtrl.removeHandler(TCDEMO.EVENTS.doubleTap, onDoubleTap);
        eventsCtrl.removeHandler(TCDEMO.EVENTS.twoFingerTap, onTwoFingerTap);
    };

    function startScenario () {
        $scenario = $('#' + scenarioInfo.selectorId);
        $scenario.removeClass('hide');

        audioCtrl.setup();
        eventsCtrl.setupScenario(scenarioInfo.selectorId);
        eventsCtrl.setupAllEvents();
        setupEventHandlers();
               
        // set up parallax
        parallaxScenario2 = new Parallax($scenario[0], {
            relativeInput: true,
            pointerEvents: true
        });

        // audio cues
        startPlayingMainAudioThread();

        // show live card
        $scenario.find('.' + scenarioInfo.liveCard.selector).removeClass('hide');
    };

    function endScenario () {
        audioCtrl.stop();

        clearActiveTimeouts();
        destroyEventHandlers();
        eventsCtrl.stopScenario();

        parallaxScenario2.disable();
        parallaxScenario2.destroy();

        $scenario.addClass('hide');
        $scenario = null;
        
        $.event.trigger({
            type: TCDEMO.SCENARIO2.finishedEvent
        });
    }

    return {
        start: startScenario,
        stop: endScenario
    }
};