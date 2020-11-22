var TCDEMO = TCDEMO || {};
TCDEMO.MENU = {
    itemChangedEvent: 'menu::itemChanged',
    itemSelectedEvent: 'menu::itemSelected',
    items: {
        camera: 'camera',
        landmarks: 'landmarks',
        exit: 'exitNavigation',
        restaurants: 'restaurants',
        stories: 'stories'
    }
};

function MenuController () {
    var menu = $('#menu');   
    var isOpen = false;    
    var slider;
    var activeItemIndex;
    var audioCtrl = new AudioController(); 

    var menuItems = [
        {
            index: 0,
            description: TCDEMO.MENU.items.camera,            
            audioSrc: 'assets/audios/menu/menu_picture.mp3',
            length: 100,
            onSelected: {
                audioSrc: 'assets/audios/menu/menu_picture_selected.mp3',
                length: 1000
            }
        },
        {
            index: 1,
            description: TCDEMO.MENU.items.landmarks,
            audioSrc: 'assets/audios/menu/menu_landmarks.mp3',
            length: 1000,
            onSelected: {
                audioSrc: 'assets/audios/menu/menu_landmarks_selected.mp3',
                length: 1000
            }
        },
        {
            index: 2,
            description: TCDEMO.MENU.items.restaurants,
            audioSrc: 'assets/audios/menu/menu_restaurants.mp3',
            length: 2000,
            onSelected: {
                audioSrc: 'assets/audios/menu/menu_restaurants_selected.mp3',
                length: 1000
            }
        },
        {
            index: 3,
            description: TCDEMO.MENU.items.exit,
            audioSrc: 'assets/audios/menu/menu_exitNav.mp3',
            length: 1000,
            onSelected: {
                audioSrc: 'assets/audios/menu/menu_exitNav_selected.mp3',
                length: 1000
            }
        },
        {
            index: 4,
            description: TCDEMO.MENU.items.stories,
            audioSrc: 'assets/audios/menu/menu_stories.mp3',
            length: 1000,
            onSelected: {
                audioSrc: 'assets/audios/menu/menu_stories_selected.mp3',
                length: 1000
            }
        }
    ];

    function setUpMenu () {        
        slider = new tns({
            container: '.menu-tiny-slider',
            items: 3,
            axis: 'vertical',
            gutter: 5,
            center: true,
            controls: false,
            startIndex: 2,
            nav: false,
            edgePadding: 15
        });
    };

    function isMenuOpen () {
        return isOpen;
    }

    function readOutMenuItem (index) {
        audioCtrl.play(menuItems[index].audioSrc, false);
    };

    function captureCenterItem (info, index) {        
        info.slideItems[index].classList.add("center");

        // capture actual item index 
        var menuIndex = $(info.slideItems[index]).data("index");
        activeItemIndex = menuIndex;
        $.event.trigger({
            type: TCDEMO.MENU.itemChangedEvent,
            index: menuIndex
        });

        readOutMenuItem(menuIndex);
    }

    function onItemChanged (info, eventName) {
        info.slideItems[info.indexCached].classList.remove("center");

        captureCenterItem(info, info.index);
    };

    function openMenu () {
        setUpMenu();

        menu.removeClass('hide');
        isOpen = true;

        var sliderInfo = slider.getInfo();
        captureCenterItem(sliderInfo, sliderInfo.index);
        
        // bind function to event
        slider.events.on('transitionEnd', onItemChanged);
        
    }

    function closeMenu () {        
        menu.addClass('hide');
        isOpen = false;
        activeItemIndex = null;
        
        // remove function binding
        slider.events.off('transitionEnd', onItemChanged);

        slider.destroy();
    };

    function toggleMenu() {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    function selectActiveItem () {
        if (!activeItemIndex) return;

        audioCtrl.play(menuItems[activeItemIndex].onSelected.audioSrc, false);
        $.event.trigger({
            type: TCDEMO.MENU.itemSelectedEvent,
            selectedItem: menuItems[activeItemIndex].description
        });
    };

    return {
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu,
        isOpen: isMenuOpen,
        selectItem: selectActiveItem
    }
}; 