function Demo () {    
    var eventsCtrl = new EventsController();
    var menuCtrl = new MenuController();
    var onboardingCtrl = new Onboarding();
    var scenario1Ctrl = new Scenario1();
    var scenario2Ctrl = new Scenario2();

    var scenes = {
        welcome: {
            elementId: 'welcome',
            audioSrc: '',
            length: 0
        },
        onboarding: {
            elementId: 'onboarding',
            audioSrc: '',
            length: 0
        },
        instructions1: {
            elementId: 'instructions1',
            audioSrc: '',
            length: 0
        },
        scenario1: {
            elementId: 'scenario1',
            audioSrc: '',
            length: 0
        },
        instructions2: {
            elementId: 'instructions2',
            audioSrc: '',
            length: 0
        },
        instructions3: {
            elementId: 'instructions3',
            audioSrc: '',
            length: 0
        },
        scenario2: {
            elementId: 'scenario2',
            audioSrc: '',
            length: 0
        },
        end: {
            elementId: 'endTest',
            audioSrc: '',
            length: 0
        }
    };

    function showScene (elementId, audioSrc) {
        var $element = $('#' + elementId);
        $element.removeClass('hide');

        // play audio

        // show skip option, if any
        var skipBtn = $(document).find('#' + elementId + ' + .skip');
        if (skipBtn && skipBtn.length > 0) {
            $(skipBtn).removeClass('hide')
        }
    };

    function hideScene (elementId) {
        var $element = $('#' + elementId);
        $element.addClass('hide');
        
        // hide skip option, if any
        $(document).find('#' + elementId + ' ~ .skip').addClass('hide');
    };

    function hideAll () {
        var children = $('body > div');
        $.map(children, (elem) => $(elem).addClass('hide'));    
        
        var skipButtons = $('.skip');
        $.map(skipButtons, (btn) => $(btn).addClass('hide'));
    }

    // START TEST
    $(document).ready(function () {
       // showScene(scenes.welcome.elementId);
       showScene(scenes.instructions3.elementId);
    });
   
    // EXIT TEST
    var quitBtn = $('.quit');
    quitBtn.on('click', function () {
        hideAll();        
        showScene(scenes.end.elementId);
    });

    // START ONBOARDING
    var onboardingBtn = $('#onboardingStart');
    onboardingBtn.on('click', function () {
        hideScene(scenes.welcome.elementId);
        showScene(scenes.onboarding.elementId);

        onboardingCtrl.start();        
    });
    
    // SKIP ONBOARDING
    var skipOnboardingBtn = $('#skipOnboarding');
    skipOnboardingBtn.on('click', function () {
        onboardingCtrl.stop();
    });


    // START SCENARIO #1
    var scenario1Btn =  $('#scenario1Start');
    scenario1Btn.on('click', function () {
        hideScene(scenes.instructions1.elementId);
        showScene(scenes.scenario1.elementId);

        scenario1Ctrl.start();        
    });

    // SKIP SCENARIO #1
    var skipScenario1Btn = $('#skipScenario1');
    skipScenario1Btn.on('click', function () {
        scenario1Ctrl.stop();
    });

    // SHOW INSTRUCTIONS SCENARIO #2
    var instructions3Btn = $('#showInstructions3');
    instructions3Btn.on('click', function () {
        hideScene(scenes.instructions2.elementId);
        showScene(scenes.instructions3.elementId);
    });

    // START SCENARIO #2
    var scenario2Btn =  $('#scenario2Start');
    scenario2Btn.on('click', function () {
        hideScene(scenes.instructions3.elementId);
        showScene(scenes.scenario2.elementId);
 
        scenario2Ctrl.start();        
    });

    // SKIP SCENARIO #2
    var skipScenario2Btn = $('#skipScenario2');
    skipScenario2Btn.on('click', function () {
        scenario2Ctrl.stop();
    });

    // EVENTS - ON SCENES COMPLETED
    $(document).on(TCDEMO.ONBOARDING.finishedEvent, (data) => {
        hideScene(scenes.onboarding.elementId);
        showScene(scenes.instructions1.elementId);
    });
    $(document).on(TCDEMO.SCENARIO1.finishedEvent, (data) => {
        hideScene(scenes.scenario1.elementId);
        showScene(scenes.instructions2.elementId);
    });    
    $(document).on(TCDEMO.SCENARIO2.finishedEvent, (data) => {
        hideScene(scenes.scenario2.elementId);
        showScene(scenes.end.elementId);
    });

    


    // onboardingBtn.addClass('hide');
    // var instructions1 = $('#instructions1');
    // instructions1.removeClass('hide');
    // read out instructions
   

    // var scenario1Btn = $('#scenario1Start');
    // scenario1Btn.on('click', function () {
    //     scenario1Btn.addClass('hide');
    //     scenario1Ctrl.start();
    // });

    // $(document).on(TCDEMO.MENU.itemChangedEvent, (data) => {
    //     console.log('item changed! ' + data.index);
    // });

    // var badgeMenuInfo = {
    //     selectorId: 'badgeMenuOnboarding',
    //     chime: {
    //         audioSrc: 'assets/audios/onboarding/beepShort.mp3',
    //         length: 1000
    //     },
    //     onMenuClosed: {
    //         audioSrc: 'assets/audios/onboarding/badgeDismissed.mp3',
    //         length: 1000
    //     }
    // };
    // var badgeMenuItems = [
    //     {
    //         index: 0,
    //         description: 'first item',            
    //         itemSelector: '.badge-1',
    //         toSelector: '.to1',
    //         slideOut: 'slide-out-158',
    //         slideIn: 'slide-in',
    //         audio: {                
    //             onActive: {
    //                 audioSrc: 'assets/audios/onboarding/badgeFirstItem.mp3',
    //                 length: 100
    //             },
    //             onSelected: {
    //                 audioSrc: 'assets/audios/onboarding/badgeFirstItemSelected.mp3',
    //                 length: 1000
    //             }
    //         }
    //     },
    //     {
    //         index: 1,
    //         description: 'second item',
    //         itemSelector: '.badge-2',
    //         toSelector: '.to2',
    //         slideOut: 'slide-out-6A',
    //         slideIn: 'slide-in',
    //         audio: {                
    //             onActive: {
    //                 audioSrc: 'assets/audios/onboarding/badgeSecondItem.mp3',
    //                 length: 100,
    //             },
    //             onSelected: {
    //                 audioSrc: 'assets/audios/onboarding/badgeSecondItemSelected.mp3',
    //                 length: 1000,
    //             }
    //         }
    //     }
    // ];
    // var badgeMenuCtrl = new BadgeMenuController(badgeMenuInfo, badgeMenuItems);
    // var onboardingBtn = $('#onboardingStart');
    // onboardingBtn.on('click', function () {
    //     onboardingBtn.addClass('hide');
        
    //     var $onboardingElem = $('#onboarding');
    //     $onboardingElem.removeClass('hide');
    //     badgeMenuCtrl.show();      
    // });
}

Demo();
