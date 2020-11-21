var TCDEMO = TCDEMO || {};
TCDEMO.ONBOARDING = {
    finishedEvent: 'onboarding::finished'
};
function Onboarding () {
    var onboardingElemId = 'onboarding';
    var onboardingElem = document.getElementById(onboardingElemId);
    var $onboardingElem = $('#' + onboardingElemId);
    var parallaxOnboarding;
    var audioController = new AudioController();
    var eventsController = new EventsController();    
    var menuCtrl = new MenuController();

    var badgeMenuInfo = {
        selectorId: 'badgeMenuOnboarding',
        chime: {
            audioSrc: 'assets/audios/onboarding/beepShort.mp3',
            length: 1000
        },
        onMenuClosed: {
            audioSrc: 'assets/audios/onboarding/badgeDismissed.mp3',
            length: 1000
        }
    };
    var badgeMenuItems = [
        {
            index: 0,
            description: 'first item',            
            itemSelector: '.badge-1',
            toSelector: '.to1',
            slideOut: 'slide-out-158',
            slideIn: 'slide-in',
            audio: {                
                onActive: {
                    audioSrc: 'assets/audios/onboarding/badgeFirstItem.mp3',
                    length: 100
                },
                onSelected: {
                    audioSrc: 'assets/audios/onboarding/badgeFirstItemSelected.mp3',
                    length: 1000
                }
            }
        },
        {
            index: 1,
            description: 'second item',
            itemSelector: '.badge-2',
            toSelector: '.to2',
            slideOut: 'slide-out-6A',
            slideIn: 'slide-in',
            audio: {                
                onActive: {
                    audioSrc: 'assets/audios/onboarding/badgeSecondItem.mp3',
                    length: 100,
                },
                onSelected: {
                    audioSrc: 'assets/audios/onboarding/badgeSecondItemSelected.mp3',
                    length: 1000,
                }
            }
        }
    ];
    var badgeMenuCtrl = new BadgeMenuController(badgeMenuInfo, badgeMenuItems);

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
            description: 'live cards with multiple items',
            audioSrc: 'assets/audios/onboarding/activeCardsMultiple.mp3',
            element: 'badge-menu',
            length: 9000
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
        $onboardingElem.removeClass('hide');
        eventsController.setupScenario(onboardingElemId);
        currentStep = 1;
        
        // set up parallax
        parallaxOnboarding = new Parallax(onboardingElem, {
            relativeInput: true,
            pointerEvents: true
        });

        playCurrentStepAudio();

        // move to the next step when audio finishes
        setTimeout(nextStep, steps[currentStep - 1].length + 1000);
    };

    function stopOnboarding () {
        // audioController.play(audiosOther.onboardingEnd.audioSrc);
        // setTimeout(eventsController.stopScenario, audiosOther.onboardingEnd.length);

        audioController.stop();

        parallaxOnboarding.disable();
        parallaxOnboarding.destroy();

        eventsController.stopScenario();
        
        $onboardingElem.addClass('hide');

        $.event.trigger({ 
            type: TCDEMO.ONBOARDING.finishedEvent
        });
    };

    function reminderCallback (flagHappened) {
        if (!flagHappened) {
            playCurrentStepAudio();
        }
    };

    function onCardTapCallback (refreshIntervalId, liveCard) {                        
        clearInterval(refreshIntervalId);

        // play live-card audio
        audioController.play(audiosOther.liveCard.audioSrc);

        // remove Tap handler
        eventsController.removeHandler(TCDEMO.EVENTS.singleTap, onCardTapCallback);

        // allow audio to play out before hiding again
        setTimeout(() => liveCardFinalizeCallback(liveCard), audiosOther.liveCard.length + 3000);                            
    };
    function liveCardFinalizeCallback (element) {
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
            
            // move to step 5
            currentStep = 4;
        } else {
            // close menu
            menuCtrl.close();

            // move to step 6
            currentStep = 5;
        }

        nextStep();
    };
    
    function onDescriptionPressCallback (refreshIntervalId) {
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

    function onBadgeTapCallback (refreshIntervalId, badgeElement) {
        clearInterval(refreshIntervalId);

        if (!badgeMenuCtrl.isActive()) {
            badgeMenuCtrl.activate();
        } else {                        
            // remove all badge menu handlers
            eventsController.removeHandler(TCDEMO.EVENTS.singleTap, onBadgeTapCallback);
            eventsController.removeHandler(TCDEMO.EVENTS.swipe, (ev) => onBadgeSwipeCallback(ev));                
            eventsController.removeHandler(TCDEMO.EVENTS.press, onBadgePressCallback); 

            // hide badge menu
            badgeMenuCtrl.hide();            

            // move to the next step
            setTimeout(nextStep, badgeMenuInfo.onMenuClosed.length + 2000);
        }
    };
    function onBadgeSwipeCallback (event) {
        if (event.additionalEvent === TCDEMO.EVENTS.swipeDown) {
            badgeMenuCtrl.activateSecond();
        } else if (event.additionalEvent === TCDEMO.EVENTS.swipeUp) {
            badgeMenuCtrl.activateFirst();
        }
    };
    function onBadgePressCallback () {
        if (badgeMenuCtrl.isActive()) {
            var activeItem = badgeMenuCtrl.getActive();
            audioController.play(activeItem.audio.onSelected.audioSrc, false);
        } 
    };

    function nextStep () {
        currentStep += 1;

        switch (currentStep) {            
            case 2: 
                var wasTapped = false;
                var step2RefreshIntervalId;
                var liveCard = $onboardingElem.find('.' + steps[currentStep - 1].element);

                // set up Tap event
                eventsController.setupEvent(TCDEMO.EVENTS.singleTap);
                eventsController.setupHandler(TCDEMO.EVENTS.singleTap, () => onCardTapCallback(step2RefreshIntervalId, liveCard));                

                // play instructions
                playCurrentStepAudio(true);

                // allow instructions to start playing before continuing
                setTimeout(function () {
                    
                    // show live card sample, with chime                
                    liveCard.removeClass('hide');
                    audioController.play(audiosOther.chime.audioSrc);
                    
                    // play a reminder to Tap if nothing happens after every 5s
                    step2RefreshIntervalId = setInterval(() => reminderCallback(wasTapped), 10000);
                
                }, steps[currentStep - 1].length + 3000);

                break;
            case 3:
                var wasTapped = false;
                var step3RefreshIntervalId;
                var badgeMenu = $onboardingElem.find('.' + steps[currentStep - 1].element);
                
                // set up events
                eventsController.setupEvent(TCDEMO.EVENTS.singleTap);
                eventsController.setupEvent(TCDEMO.EVENTS.swipe);
                eventsController.setupEvent(TCDEMO.EVENTS.press);
                eventsController.setupHandler(TCDEMO.EVENTS.singleTap, () => onBadgeTapCallback(step3RefreshIntervalId, badgeMenu));        
                eventsController.setupHandler(TCDEMO.EVENTS.swipe, (ev) => onBadgeSwipeCallback(ev));                
                eventsController.setupHandler(TCDEMO.EVENTS.press, onBadgePressCallback); 

                // play instructions
                playCurrentStepAudio(true);

                // allow instructions to start playing before continuing
                setTimeout(function () {
                    
                    // show badge menu sample
                    badgeMenuCtrl.show();
                    
                    // play a reminder to Tap if nothing happens after every 5s
                    step3RefreshIntervalId = setInterval(() => reminderCallback(wasTapped), 10000);
                
                }, steps[currentStep - 1].length + 5000);
                
                break;
            case 4:  
                var wasDoubleTapped = false;
                var step4RefreshIntervalId;

                // set up double-tap event to bring up menu
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
            case 5:  
                if (menuCtrl.isOpen()) {
                    // play instructions 
                    playCurrentStepAudio(); 
                } 
                break;
            case 6:  
                var wasPressed = false;
                var step6RefreshIntervalId;

                // set up Press event
                eventsController.setupEvent(TCDEMO.EVENTS.press);
                eventsController.setupHandler(TCDEMO.EVENTS.press, () => onDescriptionPressCallback(step6RefreshIntervalId));                
                
                // play instructions
                playCurrentStepAudio(true);

                // play a reminder to Tap if nothing happens after every 5s
                step6RefreshIntervalId = setInterval(() => reminderCallback(wasPressed), 10000);

                break;
            case 7: 
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
        start: startOnboarding,
        stop: stopOnboarding
    }
}