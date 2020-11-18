function Onboarding () {
    var onboardingElemId = 'onboarding';
    var $onboardingElem = $('#' + onboardingElemId);
    var audioController = new AudioController();
    var eventsController = new EventsController();    
    var menuCtrl = new MenuController();

    var currentStep = 1;
    var steps = [
        {
            step: '1',
            description: 'welcome and lets practice',
            audioSrc: 'assets/audios/onboarding/welcome.mp3',
            element: '',
            length: 7000
        },
        {
            step: '2',
            description: 'to activate a live card tap once',
            audioSrc: 'assets/audios/onboarding/activeCards.mp3',
            element: 'live-card',
            length: 5000
        },
        {
            step: '3',
            description: 'to bring up the menu double tap',
            audioSrc: 'assets/audios/onboarding/bringupmenu.mp3',
            element: 'menu',
            length: 2000
        },
        {
            step: '4',
            description: 'scroll up down menu and dismiss',
            audioSrc: 'assets/audios/onboarding/swipeanddismissmenu.mp3',
            element: 'menu',
            length: 2000
        },
        {
            step: '5',
            description: 'press and hold to get description',
            audioSrc: 'assets/audios/onboarding/presshold.mp3',
            element: '',
            length: 3000
        },
        {
            step: '6',
            description: 'you can pause audio',
            audioSrc: 'assets/audios/onboarding/pauseaudio.mp3',
            element: '',
            length: 4000
        }
    ];
    var audiosOther = {
        liveCard: {
            audioSrc: 'assets/audios/onboarding/twin-churches.mp3',
            length: 11000
        },
        guide: {
            audioSrc: 'assets/audios/onboarding/tourguide.mp3',
            length: 15000
        },
        surroundings: {
            audioSrc: 'assets/audios/onboarding/description.mp3',
            length: 3000
        },
        chime: {
            audioSrc: 'assets/audios/onboarding/beepShort.mp3',
            length: 1000
        },
        onboardingEnd: {
            audioSrc: 'assets/audios/onboarding/finished.mp3',
            length: 6000
        }
    }

    function playCurrentStepAudio (withPause) {
        if (typeof(withPause) === 'undefined') withPause = false;

        audioController.play(steps[currentStep - 1].audioSrc, withPause);
    };

    function startOnboarding() {
        eventsController.setupScenario(onboardingElemId);
        currentStep = 1;
        
        playCurrentStepAudio();

        // move to the next step when audio finishes
        setTimeout(nextStep, steps[currentStep - 1].length + 1000);
    };

    function stopOnboarding () {
        audioController.play(audiosOther.onboardingEnd.audioSrc);
        setTimeout(eventsController.stopScenario, audiosOther.onboardingEnd.length);
    };

    function reminderCallback (flagHappened) {
        if (!flagHappened) {
            playCurrentStepAudio();
        }
    };

    function onTapCallback (refreshIntervalId, liveCard) {                        
        clearInterval(refreshIntervalId);

        // play live-card audio
        audioController.play(audiosOther.liveCard.audioSrc);

        // remove Tap handler
        eventsController.removeHandler(TCDEMO.EVENTS.singleTap, onTapCallback);

        // allow audio to play out before hiding again
        setTimeout(() => step3FinalizeCallback(liveCard), audiosOther.liveCard.length + 3000);                            
    };
    function step3FinalizeCallback (element) {
        // hide live-card
        element.addClass('hide');

        // move to next step
        nextStep();
    };

    function onDoubleTapCallback (refreshIntervalId) {
        clearInterval(refreshIntervalId);

        if (!menuCtrl.isOpen()) {
            // show menu 
            menuCtrl.open();      
            
            // move to step 4
            currentStep = 3;
        } else {
            // close menu
            menuCtrl.close();

            // move to step 5
            currentStep = 4;
        }

        nextStep();
    };
    
    function onPressCallback (refreshIntervalId) {
        clearInterval(refreshIntervalId);

        // play surroundings audio
        audioController.play(audiosOther.surroundings.audioSrc);

        // allow audio to play out before moving on
        setTimeout(nextStep, audiosOther.surroundings.length + 2000);
    };

    function onTwoFingerTapCallback () {
        // pause/resume audio
        audioController.toggle();
    };

    function nextStep () {
        currentStep += 1;

        switch (currentStep) {            
            case 2: 
                var wasTapped = false;
                var step3RefreshIntervalId;
                var liveCard = $onboardingElem.find('.' + steps[currentStep - 1].element);

                // set up Tap event
                eventsController.setupEvent(TCDEMO.EVENTS.singleTap);
                eventsController.setupHandler(TCDEMO.EVENTS.singleTap, () => onTapCallback(step3RefreshIntervalId, liveCard));                


                // play instructions
                playCurrentStepAudio(true);

                // allow instructions to start playing before continuing
                setTimeout(function () {
                    
                    // show live card sample, with chime                
                    liveCard.removeClass('hide');
                    audioController.play(audiosOther.chime.audioSrc);
                    
                    // play a reminder to Tap if nothing happens after every 5s
                    step3RefreshIntervalId = setInterval(() => reminderCallback(wasTapped), 10000);
                
                }, steps[currentStep - 1].length + 3000);

                break;
            case 3:  
                var wasDoubleTapped = false;
                var step4RefreshIntervalId;

                // set up double-tap event to bring up menu
                // eventsController.setupEvent(TCDEMO.EVENTS.doubleTap);
                // eventsController.setupHandler(TCDEMO.EVENTS.doubleTap, function () { 
                //     onDoubleTapCallback(step4RefreshIntervalId)
                // }); 
                eventsController.setupDoubleClick(function () { 
                    onDoubleTapCallback(step4RefreshIntervalId)
                });

                // play instructions
                playCurrentStepAudio();

                // play a reminder to Double Tap if nothing happens after every 5s
                step4RefreshIntervalId = setInterval(function () { 
                    reminderCallback(wasDoubleTapped) 
                }, 10000);                   
                
                break;
            case 4:  
                if (menuCtrl.isOpen()) {
                    // play instructions 
                    playCurrentStepAudio(); 
                } 
                break;
            case 5:  
                var wasPressed = false;
                var step6RefreshIntervalId;

                // set up Press event
                eventsController.setupEvent(TCDEMO.EVENTS.press);
                eventsController.setupHandler(TCDEMO.EVENTS.press, () => onPressCallback(step6RefreshIntervalId));                
                
                // play instructions
                playCurrentStepAudio(true);

                // play a reminder to Tap if nothing happens after every 5s
                step6RefreshIntervalId = setInterval(() => reminderCallback(wasPressed), 10000);

                break;
            case 6: 
                // set up TwoFingerTap event
                eventsController.setupEvent(TCDEMO.EVENTS.twoFingerTap);
                eventsController.setupHandler(TCDEMO.EVENTS.twoFingerTap, onTwoFingerTapCallback);
                
                // play instructions
                playCurrentStepAudio();

                // allow instructions to start playing before continuing
                setTimeout(function () {                                    
                   
                    // play audio to test pausing and resuming
                    audioController.play(audiosOther.guide.audioSrc);
                    
                    // move to the next step when audio finishes
                    setTimeout(nextStep, audiosOther.guide.length + 4000);

                }, steps[currentStep - 1].length + 3000);            
              
                break;  
            default:
                stopOnboarding();
                break;
        }
    }

    return {
        start: startOnboarding
    }
}