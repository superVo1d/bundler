$(function() {
    const $input = $('input[type="text"]');

    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const mediaQueryMin = window.matchMedia('(min-width: 768px)')

    const setPlaceholders = () => {
        $input.each(function(i) {
            const input = $input[i];
            const $name = $(input).closest('.field__item').find('.field__name');

            if (!!input.dataset && !!input.dataset.name) {
                if (mediaQuery.matches) {
                    if ($name.length) {
                        $(input).attr("placeholder", input.dataset.name);
                        $name.addClass('desktop-visible');
                    }
                }
                if (mediaQueryMin.matches) {
                    if ($name.length) {
                        $(input).attr("placeholder", "");
                        $name.removeClass('desktop-visible');
                    }
                }
            }
        });
    }

    setPlaceholders();

    $(window).on('resize', () => setPlaceholders());
});