TCDEMO.MENU = {
    itemChangedEvent: 'menu::itemChanged'
};

function MenuController () {
    var menu = $('#menu');    
    var isOpen = false;    
    var slider;

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

    function captureCenterItem (info, index) {
        info.slideItems[index].classList.add("center");

        // capture actual item index 
        var menuIndex = $(info.slideItems[index]).data("index");
        $.event.trigger({
            type: TCDEMO.MENU.itemChangedEvent,
            index: menuIndex
        });
    }

    function itemChanged (info, eventName) {
        info.slideItems[info.indexCached + 1].classList.remove("center");

        captureCenterItem(info, info.index + 1);
    };

    function openMenu () {        
        menu.removeClass('hide');
        isOpen = true;
        slider.rebuild();

        var sliderInfo = slider.getInfo();
        captureCenterItem(sliderInfo, sliderInfo.index - 1);
        
        // bind function to event
        slider.events.on('transitionEnd', itemChanged);
    }

    function closeMenu () {
        menu.addClass('hide');
        isOpen = false;
        slider.destroy();

        // remove function binding
        slider.events.off('transitionEnd', itemChanged);
    };

    function toggleMenu() {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    setUpMenu();

    return {
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu
    }
}; 