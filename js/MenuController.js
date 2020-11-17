function MenuController () {
    var menu = $('#menu');    
    var isOpen = false;    

    function setUpMenu () {
        menu.find('.menu-slider').slick({
            centerMode: true,
            centerPadding: '60px',
            slidesToShow: 3,
            arrows: false,
            touchMove: true,
            vertical: true,
            verticalSwiping: true
        });       
    };

    function openMenu () {        
        menu.removeClass('hide');
        isOpen = true;
    }

    function closeMenu () {
        menu.addClass('hide');
        isOpen = false;
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
        toggle: toggleMenu
    }
};