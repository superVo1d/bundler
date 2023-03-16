$(function() {
    const $tabs = $('.people__filters-mobile .people__content .people__tab');
    const $title = $('.people__filters-mobile .people__nav .title h3');
    const $back = $('.people__filters-mobile .people__nav .modal__back');
    const $close = $('.people__filters-mobile .people__nav .modal__close');

    const $settingsButton = $('#search-settings');

    const isAnySearchParam = () => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        return Object.values(params).filter((value) => value.length > 0).length > 0;
    };

    if (isAnySearchParam()) {
        $settingsButton.addClass('active');
    }

    $('.settings__button select').attr('dir', 'rtl');

    $('.settings__button.filters').click(function() {
        setTab(1);
    });

    const closeOnResize = () => {
        const width = $(window).width();

        if (width >= 1350) {
            $close.click();
        }
    }

    $(window).on("resize", () => closeOnResize());

    $back.on('click', () => setTab(0));
    $close.on('click', () => setTab(0));

    const setTab = (n) => {
        $tabs.removeClass('active');
        $(`#people__tab-${n}`).addClass('active');

        let title = '';

        switch (n) {
            case 0:
                title = '<br/>';
                break;
            case 1:
                title = 'Сотрудник';
                break;
            default:
                break;
        }

        if (n) {
            $title.html(title);
            $back.css('display', 'block');
        } else {
            $title.html(title);
            $back.css('display', 'none');
        }
    }
});
