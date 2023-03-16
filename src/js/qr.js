
$(function() {
    let showCode = false;


    $('.code__close, .code')
        .on('click', (e) => {
            if ($(e.target).hasClass('code__img') || $(e.target).hasClass('code__label')) return;
            e.preventDefault();
            $('.code').css({
                'opacity': 0,
                'pointer-events': 'none'
            });
            showCode = !showCode;
        });

    $('.person-code')
        .on('click', (e) => {
            e.preventDefault();
            $('.code').css({
                'opacity': 1,
                'pointer-events': 'all'
            });
            showCode = !showCode;
        });
});