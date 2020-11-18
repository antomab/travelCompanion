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
            description: 'when you hear this sound on its own [chime]...',
            audioSrc: 'assets/audios/onboarding/chimeDescription.mp3',
            element: '',
            length: 6000
        },
        {
            step: '2',
            description: 'lets go over the gestures you can use',
            audioSrc: 'assets/audios/onboarding/letsgooverthegestures.mp3',
            element: '',
            length: 2000
        },
        {
            step: '3',
            description: 'to activate a live card tap once',
            audioSrc: 'assets/audios/onboarding/taponce.mp3',
            element: 'live-card',
            length: 3000
        },
        {
            step: '4',
            description: 'to bring up the menu double tap',
            audioSrc: 'assets/audios/onboarding/bringupmenu.mp3',
            element: 'menu',
            length: 2000
        },
        {
            step: '5',
            description: 'scroll up down menu and dismiss',
            audioSrc: 'assets/audios/onboarding/swipeanddismissmenu.mp3',
            element: 'menu',
            length: 2000
        },
        {
            step: '6',
            description: 'press and hold to get description',
            audioSrc: 'assets/audios/onboarding/presshold.mp3',
            element: '',
            length: 3000
        },
        {
            step: '7',
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
        }
    }

    function handleAudioStoppedEvent () {
        $(document).on('audioStopped', nextStep);
    };

    function stopHandlingAudioStoppedEvent () {
        $(document).off('audioStopped', nextStep);
    };

    function startOnboarding() {
        eventsController.setupScenario(onboardingElemId);
        handleAudioStoppedEvent();
        // currentStep = 1;
        
        // audioController.play(steps[currentStep - 1].audioSrc);

        currentStep = 3;
        nextStep();
    };

    function stopOnboarding () {
        stopHandlingAudioStoppedEvent();
        eventsController.stopScenario;
    };
    
    function reminderCallback (flagHappened) {
        if (!flagHappened) {
            audioController.play(steps[currentStep - 1].audioSrc, false);
        }
    };

    function step3OnTapCallback (refreshIntervalId, liveCard) {                        
        clearInterval(refreshIntervalId);

        // play live-card audio
        audioController.play(audiosOther.liveCard.audioSrc, false);

        // remove Tap handler
        eventsController.removeHandler(TCDEMO.EVENTS.singleTap, step3OnTapCallback);

        // allow audio to play out before hiding again
        setTimeout(() => step3FinalizeCallback(liveCard), audiosOther.liveCard.length + 3000);                            
    };
    function step3FinalizeCallback (element) {
        // hide live-card
        element.addClass('hide');
                                                        
        // resume handling of audioStopped event
        handleAudioStoppedEvent();

        // move to next step
        nextStep();
    };

    function step6OnPressCallback (refreshIntervalId) {
        clearInterval(refreshIntervalId);

        // play surroundings audio
        audioController.play(audiosOther.surroundings.audioSrc, false);

        // allow audio to play out before moving on
        setTimeout(() => nextStep(), audiosOther.surroundings.length + 2000);
    };

    function onDoubleTapCallback (refreshIntervalId) {
        clearInterval(refreshIntervalId);

        if (!menuCtrl.isOpen()) {
            // show menu 
            menuCtrl.open();      
            
            // PAUSE HERE TO LET MENU ITEM BE READ OUT

            // move to step 5
            currentStep = 4;
        } else {
            // close menu
            menuCtrl.close();

            // enable audio event again
            handleAudioStoppedEvent();

            // move to step 6
            currentStep = 5;
        }

        nextStep();
    };

    function nextStep () {
        currentStep += 1;

        switch (currentStep) {
            case 2:
                audioController.play(steps[currentStep - 1].audioSrc); 
                break;
            case 3: 
                // temporarily pause handling of audioStopped event
                stopHandlingAudioStoppedEvent();

                var wasTapped = false;
                var step3RefreshIntervalId;
                var liveCard = $onboardingElem.find('.' + steps[currentStep - 1].element);

                // play instructions
                audioController.play(steps[currentStep - 1].audioSrc, false);

                // allow instructions to start playing before continuing
                setTimeout(function () {
                    // set up Tap event
                    eventsController.setupEvent(TCDEMO.EVENTS.singleTap);
                    eventsController.setupHandler(TCDEMO.EVENTS.singleTap, () => step3OnTapCallback(step3RefreshIntervalId, liveCard));                

                    // show live card sample, with chime                
                    liveCard.removeClass('hide');
                    audioController.play(audiosOther.chime.audioSrc, false);
                    
                    // play a reminder to Tap if nothing happens after every 5s
                    step3RefreshIntervalId = setInterval(() => reminderCallback(wasTapped), 10000);
                
                }, steps[currentStep - 1].length + 3000);

                break;
            case 4:  
                // temporarily pause handling of audioStopped event
                stopHandlingAudioStoppedEvent();

                var wasDoubleTapped = false;
                var step4RefreshIntervalId;

                // play instructions
                audioController.play(steps[currentStep - 1].audioSrc, false);

                // allow instructins to start playing before continuing
                setTimeout(function () {
                    // set up double-tap event to bring up menu
                    eventsController.setupEvent(TCDEMO.EVENTS.doubleTap);
                    eventsController.setupHandler(TCDEMO.EVENTS.doubleTap, function () { 
                        onDoubleTapCallback(step4RefreshIntervalId)
                    });
                    
                    if (step4RefreshIntervalId === undefined) {
                        // play a reminder to Double Tap if nothing happens after every 5s
                        step4RefreshIntervalId = setInterval(function () { 
                            reminderCallback(wasDoubleTapped) 
                        }, 10000);
                    }

                }, steps[currentStep - 1].length + 2000);
                
                break;
            case 5:  
                if (menuCtrl.isOpen()) {
                    // play instructions 
                    audioController.play(steps[currentStep - 1].audioSrc, false); 
                } 
            break;
            case 6:  
                    // temporarily pause handling of audioStopped event
                    stopHandlingAudioStoppedEvent();

                    var wasPressed = false;
                    var step6RefreshIntervalId;

                    // play instructions
                    audioController.play(steps[currentStep - 1].audioSrc);

                    // allow instructions to start playing before continuing
                    setTimeout(function () {
                        // set up Tap event
                        eventsController.setupEvent(TCDEMO.EVENTS.press);
                        eventsController.setupHandler(TCDEMO.EVENTS.press, () => step6OnPressCallback(step6RefreshIntervalId));                
                        
                        // play a reminder to Tap if nothing happens after every 5s
                        step6RefreshIntervalId = setInterval(() => reminderCallback(wasPressed), 10000);

                    }, steps[currentStep - 1].length + 3000);

            case 7:  
                    /*
                    play audio
                    play secondary audio on loop
                    once paused trigger end of onboarding
                */
            stopOnboarding();
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