$(function() {
    const $footer = $('footer');
    const $save = $('.button_save__wrapper');

    const setButtonStyles = () => {
        const buttonOffset = $(window).scrollTop() + $(window).height() - $footer.offset().top;

        if (buttonOffset >= 0) {
            $save.addClass('static');
        } else {
            $save.removeClass('static');
        }
    }

    $(window).on('scroll', () => {
        setButtonStyles();
    });

    setButtonStyles();
});