TCDEMO.BADGEMENU = {
    itemSelectedEvent: 'badgeMenu::itemSelected'
};

function BadgeMenuController () {
    var badgeMenu = $('#badgeMenu');
    var audioCtrl = new AudioController();
    var slider;

    var menuItems = [
        {
            index: 0,
            description: 'bus 158',
            audioSrc: '',
            length: 0,
            itemSelector: 'badge-158',
            toSelector: '.to158'
        },
        {
            index: 0,
            description: 'bus 15',
            audioSrc: '',
            length: 0,
            itemSelector: 'badge-6A',
            toSelector: '.to6A'
        }
    ];

    function setUpBadgeMenu () {
        slider = new tns({
            container: '.badge-menu-tiny-slider',
            items: 2,
            axis: 'vertical',
            gutter: 5,
            controls: false,
            startIndex: 0,
            nav: false,
            edgePadding: 5,
            loop: false
        });
    };

    function isMenuActive () {        
        var isActive = false;
        for (var i=0; i<menuItems.length;i++) {
           if ($(menuItems[i].itemSelector).hasClass('active')) {
               isActive = true;
               break;
           }
        }
        return isActive;
    };

    function readOutMenuItem (index) {
        audioCtrl.play(menuItems[index].audioSrc, false);
    };

    function onItemNotActive(index) {
        var $item = $(menuItems[index].itemSelector);

        // it wasn't active, do nothing
        if (!$item.hasClass('active')) return;

        $item.removeClass('active');

        // set effect, options, duration (ms)
        $item.toggle('slide', { direction: 'left' }, 300);
    };

    function onItemActive(index) {
        $(menuItems[index].itemSelector).addClass('active');

        // set effect, options, duration (ms)
        $(menuItems[index].toSelector).toggle('slide', { direction: 'left' }, 300);
    }

    function onItemChanged (info, eventName) {
        var activeIndex = $(info.slideItems[index]).data("index");
        
        // deactivate other items
        for (var i=0; i<menuItems.length;i++) {
            if (activeIndex !== i) {
                onItemNotActive(i);
            }
        }

        readOutMenuItem(activeIndex);
        onItemActive(activeIndex);        
    };

    // function openBadgeMenu () {
    //     setUpBadgeMenu();

    //     badgeMenu.removeClass('hide');
    //     isActive = true;
        
    //     slider.events.on('transitionEnd', onItemChanged);
    // };

    // function closeBadgeMenu () {
    //     badgeMenu.addClass('hide');
    //     isActive = false;

    //     slider.events.off('transitionEnd', onItemChanged);
    //     slider.destroy();
    // };

    // swipe up/down events
    
    function onSelectFirst () {
        onItemNotActive(1);
        onItemActive(0);
        readOutMenuItem(0);
    };
    function onSelectSecond () {
        onItemNotActive(0);
        onItemActive(1);
        readOutMenuItem(1);
    };

    // activated on single tap
    // 1st item automatically activated
    function activateBadgeMenu () {
        onSelectFirst();
    };

    // deactivate on single tap
    function deactivateBadgeMenu () {
        // deactivate all items
        for (var i=0; i<menuItems.length;i++) {
            onItemNotActive(i);
        }
    };

    // hookElement: elem to hook events to
    function hookEvents () {
        // hookElement = body

        // singleTap: !isActive, activate badge

        // singleTap: isActive, deactivate badge

        // press: select item

        // swipe up: choose 1st item

        // swipe down: choose 2nd item
    };

    function destroyEvents () {

    };

    function showBadgeMenu () {
        badgeMenu.removeClass('hide');
        hookEvents();
    };

    function hideBadgeMenu () {
        badgeMenu.addClass('hide');
        destroyEvents();
    };

    return {
        show: showBadgeMenu,
        hide: hideBadgeMenu,  
        isActive: isMenuActive
    }
};