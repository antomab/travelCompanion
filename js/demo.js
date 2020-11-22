function Demo () {    
    var eventsCtrl = new EventsController();
    var menuCtrl = new MenuController();
    var audioCtrl = new AudioController();
    var onboardingCtrl = new Onboarding();
    var scenario1Ctrl = new Scenario1();
    var scenario2Ctrl = new Scenario2();

    var scenes = {
        welcome: {
            elementId: 'welcome',
            audioSrc: 'assets/audios/instructions/welcome.mp3',
            length: 7000
        },
        onboarding: {
            elementId: 'onboarding',
            audioSrc: '',
            length: 0
        },
        instructions1: {
            elementId: 'instructions1',
            audioSrc: 'assets/audios/instructions/instructions1.mp3',
            length: 14000
        },
        scenario1: {
            elementId: 'scenario1',
            audioSrc: '',
            length: 0
        },
        instructions2: {
            elementId: 'instructions2',
            audioSrc: 'assets/audios/instructions/instructions2.mp3',
            length: 20000
        },
        instructions3: {
            elementId: 'instructions3',
            audioSrc: 'assets/audios/instructions/instructions3.mp3',
            length: 16000
        },
        scenario2: {
            elementId: 'scenario2',
            audioSrc: '',
            length: 0
        },
        instructions4: {
            elementId: 'instructions4',
            audioSrc: 'assets/audios/instructions/instructions4.mp3',
            length: 19000
        },
        end: {
            elementId: 'endTest',
            audioSrc: 'assets/audios/instructions/end.mp3',
            length: 2000
        }
    };

    function showScene (elementId, audioSrc) {
        var $element = $('#' + elementId);
        $element.removeClass('hide');

        // play audio
        if (audioSrc && audioSrc !== '') {
            audioCtrl.play(audioSrc);
        }

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
        audioCtrl.setup();
        showScene(scenes.welcome.elementId, scenes.welcome.audioSrc);
    });
   
    // EXIT TEST
    var quitBtn = $('.quit');
    quitBtn.on('click', function () {
        hideAll();        
        showScene(scenes.end.elementId, scenes.end.audioSrc);
    });

    // START ONBOARDING
    var onboardingBtn = $('#onboardingStart');
    onboardingBtn.on('click', function () {
        hideScene(scenes.welcome.elementId);
        showScene(scenes.onboarding.elementId, scenes.onboarding.audioSrc);

        onboardingCtrl.start();        
    });
    
    // SKIP ONBOARDING
    var skipOnboardingBtn = $('#skipOnboarding');
    skipOnboardingBtn.on('click', function () {
        onboardingCtrl.stop(true);
    });


    // START SCENARIO #1
    var scenario1Btn =  $('#scenario1Start');
    scenario1Btn.on('click', function () {
        hideScene(scenes.instructions1.elementId);
        showScene(scenes.scenario1.elementId, scenes.scenario1.audioSrc);

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
        showScene(scenes.instructions3.elementId, scenes.instructions3.audioSrc);
    });

    // START SCENARIO #2
    var scenario2Btn =  $('#scenario2Start');
    scenario2Btn.on('click', function () {
        hideScene(scenes.instructions3.elementId);
        showScene(scenes.scenario2.elementId, scenes.scenario2.audioSrc);
 
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
        showScene(scenes.instructions1.elementId, scenes.instructions1.audioSrc);
    });
    $(document).on(TCDEMO.SCENARIO1.finishedEvent, (data) => {
        hideScene(scenes.scenario1.elementId);
        showScene(scenes.instructions2.elementId, scenes.instructions2.audioSrc);
    });    
    $(document).on(TCDEMO.SCENARIO2.finishedEvent, (data) => {
        hideScene(scenes.scenario2.elementId);
        showScene(scenes.instructions4.elementId, scenes.instructions4.audioSrc);
    });

    
    // $(document).on(TCDEMO.MENU.itemChangedEvent, (data) => {
    //     console.log('item changed! ' + data.index);
    // });

}

Demo();
