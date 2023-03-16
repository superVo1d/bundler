$(function() {
    const $input = $('#SearchInput');

    const setInputStyles = () => {
        if ($input.val() !== '') {
            $input.parent().addClass('non-empty');
        } else {
            $input.parent().removeClass('non-empty');
        }
    }

    $input.on('input change', function(e) {
        setInputStyles();
    });

    setInputStyles();
});