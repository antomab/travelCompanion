var TCDEMO = TCDEMO || {};
TCDEMO.BADGEMENU = {
    itemSelectedEvent: 'badgeMenu::itemSelected'
};

function BadgeMenuController (info, items) {
    var $badgeMenu;
    var audioCtrl = new AudioController();

    var badgeMenuInfo = info || {
        selectorId: 'badgeMenu',
        chime: {
            audioSrc: 'assets/audios/badgeMenu/beepShort.mp3',
            length: 1000
        },
        onMenuClosed: {
            audioSrc: 'assets/audios/badgeMenu/menuClosed.mp3',
            length: 1000
        }
    };

    var menuItems = items || [
        {
            index: 0,
            description: 'bus 158',            
            itemSelector: '.badge-158',
            toSelector: '.to158',
            slideOut: 'slide-out-158',
            slideIn: 'slide-in',
            audio: {                
                onActive: {
                    audioSrc: 'assets/audios/badgeMenu/active158.mp3',
                    length: 2000
                },
                onSelected: {
                    audioSrc: 'assets/audios/badgeMenu/selected158.mp3',
                    length: 3000
                }
            }
        },
        {
            index: 1,
            description: 'bus 6A',
            itemSelector: '.badge-6A',
            toSelector: '.to6A',
            slideOut: 'slide-out-6A',
            slideIn: 'slide-in',
            audio: {                
                onActive: {
                    audioSrc: 'assets/audios/badgeMenu/active6A.mp3',
                    length: 1000,
                },
                onSelected: {
                    audioSrc: 'assets/audios/badgeMenu/selected6A.mp3',
                    length: 2000,
                }
            }
        }
    ];

    // Check if any item is currently active
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
        audioCtrl.play(menuItems[index].audio.onActive.audioSrc, false);
    };

    function getActiveItem () {        
        // get active item
        if ($(menuItems[0].itemSelector).hasClass('active')) {
            return menuItems[0];
        } else if ($(menuItems[1].itemSelector).hasClass('active')) {
            return menuItems[1];
        }

        // no item is active
        return;
    };

    function onItemNotActive(index) {
        var itemInfo = menuItems[index];
        var $item = $(itemInfo.itemSelector);

        // it wasn't active, do nothing
        if (!$item.hasClass('active')) return;

        // de-activate item
        $item.removeClass('active');

        // slide in destination info ("To")        
        var $toInfo = $item.find(itemInfo.toSelector);
        $toInfo.removeClass(itemInfo.slideOut);
        $toInfo.addClass(itemInfo.slideIn);
    };

    function onItemActive(index) {
        var itemInfo = menuItems[index];
        var $item = $(itemInfo.itemSelector);
        
        // it's already active, do nothing
        if ($item.hasClass('active')) return;

        // activate item
        $item.addClass('active');     

        // slide out destination info ("To")
        var $toInfo = $item.find(itemInfo.toSelector);
        $toInfo.removeClass(itemInfo.slideIn);
        $toInfo.addClass(itemInfo.slideOut);
    }
   
    function activateFirstItem () {
        onItemNotActive(1);
        onItemActive(0);
        readOutMenuItem(0);
    };
    function activateSecondItem () {
        onItemNotActive(0);
        onItemActive(1);
        readOutMenuItem(1);
    };
    
    function activateBadgeMenu () {
        activateFirstItem();
    };

    function deactivateBadgeMenu () {
        // deactivate all items
        for (var i=0; i<menuItems.length;i++) {
            onItemNotActive(i);
        }

        audioCtrl.play(badgeMenuInfo.onMenuClosed.audioSrc, false);
    };

    function showBadgeMenu () {
        $badgeMenu = $('#' + badgeMenuInfo.selectorId)
        $badgeMenu.removeClass('hide');

        // announce a badge is available
        audioCtrl.play(badgeMenuInfo.chime.audioSrc);
    };

    function hideBadgeMenu () {
        $badgeMenu.addClass('hide');
        deactivateBadgeMenu();
        $badgeMenu = null;
    };

    return {
        show: showBadgeMenu,
        hide: hideBadgeMenu,  
        activate: activateBadgeMenu,
        deactivate: deactivateBadgeMenu,
        isActive: isMenuActive,
        activateFirst: activateFirstItem,
        activateSecond: activateSecondItem,
        getActive: getActiveItem
    }
};