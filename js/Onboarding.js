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
            description: 'scroll up down menu',
            audioSrc: 'assets/audios/onboarding/scrollmenu.mp3',
            element: 'menu',
            length: 2000
        },
        {
            step: '6',
            description: 'double tap again to dismiss it',
            audioSrc: 'assets/audios/onboarding/dismissmenu.mp3',
            element: 'menu',
            length: 1000
        },
        {
            step: '7',
            description: 'press and hold to get description',
            audioSrc: 'assets/audios/onboarding/presshold.mp3',
            element: '',
            length: 3000
        },
        {
            step: '8',
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

    function step4OnDoubleTapCallback (refreshIntervalId) {
        clearInterval(refreshIntervalId);

        // show menu 
        menuCtrl.open();

        // enable audio event again
        handleAudioStoppedEvent();

        // move to next step
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
                var refreshIntervalId;
                var liveCard = $onboardingElem.find('.' + steps[currentStep - 1].element);

                // play instructions
                audioController.play(steps[currentStep - 1].audioSrc, false);

                // allow instructions to start playing before continuing
                setTimeout(function () {
                    // set up Tap event
                    eventsController.setupEvent(TCDEMO.EVENTS.singleTap);
                    eventsController.setupHandler(TCDEMO.EVENTS.singleTap, () => step3OnTapCallback(refreshIntervalId, liveCard));                

                    // show live card sample, with chime                
                    liveCard.removeClass('hide');
                    audioController.play(audiosOther.chime.audioSrc, false);
                    
                    // play a reminder to Tap if nothing happens after every 5s
                    refreshIntervalId = setInterval(() => reminderCallback(wasTapped), 10000);
                
                }, steps[currentStep - 1].length + 3000);

                break;
            case 4:  
                // temporarily pause handling of audioStopped event
                stopHandlingAudioStoppedEvent();

                var wasDoubleTapped = false;
                var refreshIntervalId;

                // play instructions
                audioController.play(steps[currentStep - 1].audioSrc, false);

                // allow instructins to start playing before continuing
                setTimeout(function () {
                    // set up double-tap event to bring up menu
                    eventsController.setupEvent(TCDEMO.EVENTS.doubleTap);
                    eventsController.setupHandler(TCDEMO.EVENTS.doubleTap, () => step4OnDoubleTapCallback(refreshIntervalId));
                    
                    // play a reminder to Double Tap if nothing happens after every 5s
                    refreshIntervalId = setInterval(() => reminderCallback(wasDoubleTapped), 10000);

                }, steps[currentStep - 1].length + 2000)
                
                break;
            case 5:  
            /*
            menu should be visible
            play audio
            straight to step 6
            */
            break;
            case 6:  
            /*
            play audio
            go to step 7 when menu disappears
            */
                break;
            case 7:  
            /*
            play audio 
            if after 5s press&hold wasn't triggered, prompt again
            after press&hold finishes go to step 8
            */
                break;  
            case 8:  
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