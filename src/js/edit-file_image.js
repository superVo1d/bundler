$(function() {
    const $inputPhoto = $('.input-photo');
    const $drop = $('.input-photo').parent().parent().parent();

    console.log('init')

    $inputPhoto.on('change', function(e) {
        if (e.target.files[0]) {
            const name = $(e.target).prop('name');
            const output = $(this).parent().find('img')[0];
            const $delete = $(`#${name}_delete`);
            const $label = $(this).parent().find('.field__input-label');
            const $error = $(`#${name}_error`);

            if ($error.length) {
                $error.remove();
            }

            console.log('changed')

            output.src = URL.createObjectURL(e.target.files[0]);
            output.onload = function() {
                URL.revokeObjectURL(output.src);
            }

            $label.removeClass('input-photo-empty');
            $delete.css('display', 'block');
            $(output).css('display', 'block');
        }
    });

    $inputPhoto.each((i, el) => {
        const $el = $(el);
        const name = $el.prop('name');
        const output = $el.parent().find('img')[0];
        const $label = $el.parent().find('.field__input-label');

        if (!$el.val()) {
            $label.addClass('input-photo-empty');
        }

        $(`#${name}_delete`).on('click', function() {
            $(this).css('display', 'none');
            $el.val('');
            output.src = '';
            $(output).css('display', 'none');
            $label.addClass('input-photo-empty');
        })
    });

    $drop.on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();

        // const name = e.originalEvent.dataTransfer.files[0].name;
        // const src = URL.createObjectURL(e.originalEvent.dataTransfer.files[0]);

        const $delete = $(this).find('.field__input-delete');
        const $input = $(this).find('input[type="file"]');
        const $label = $(this).parent().find('.field__input-label');

        $input[0].files = e.originalEvent.dataTransfer.files;

        const output = $(this).find('img')[0];

        output.src = URL.createObjectURL(e.originalEvent.dataTransfer.files[0]);
        output.onload = function() {
            URL.revokeObjectURL(output.src);
        }

        $delete.css('display', 'block');
        $label.removeClass('input-photo-empty');
        $(output).css('display', 'block');
    });
});