function Demo () {    
    var eventsCtrl = new EventsController();
    var menuCtrl = new MenuController();
    var onboardingCtrl = new Onboarding();
    var scenario1Ctrl = new Scenario1();


   
    $(document).on(TCDEMO.ONBOARDING.finishedEvent, (data) => {
        // Move on to scenario1
    });
    $(document).on(TCDEMO.SCENARIO1.finishedEvent, (data) => {
        // Finish Demo


    });

    var onboardingBtn = $('#onboardingStart');
    onboardingBtn.on('click', function () {
        onboardingBtn.addClass('hide');
        onboardingCtrl.start();        
    });


    onboardingBtn.addClass('hide');
    var instructions1 = $('#instructions1');

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
