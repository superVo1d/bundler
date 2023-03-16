$(function() {
    const $input = $('input[type=file]');
    const reader  = new FileReader();
    const $drop = $('.field__input-file-drop');

    $('input[name="diplomas"], input[name="voennyi_bilet"]').each((i, el) => {
        const $el = $(el)

        const setEmptyCheckboxes = () => {
            const value = $el.val();
            const name = $el.attr('name');
            const emptyCheckbox = $(`input[name="${name}_empty"]`);

            emptyCheckbox.prop('checked', !value);
        }

        $el.on('change', setEmptyCheckboxes);
        setEmptyCheckboxes();
    });

    $input.on('change', function(e) {
        if (e.target.files[0]) {
            const name = e.target.files[0].name;
            const src = URL.createObjectURL(e.target.files[0]);
            const $fileLink = $(this).parent().find('.field__input-doc-upload');
            const $span = $(this).parent().find('span');
            const $delete = $(this).parent().parent().parent().find('.field__input-doc-delete');

            $delete.css('display', 'block');
            $fileLink.css('display', 'block').attr('href', src).html(name);
        }
    });

    const $fileDelete = $('.field__input-doc-delete');

    $fileDelete.on('click', function(e) {
        const id = $(this).attr('for').slice(0, -3);
        const $input = $(`#${id}`);
        const $fileLink = $input.parent().find('.field__input-doc-upload');


        $(this).css('display', 'none');
        $fileLink.css('display', 'none').attr('href', '');
        $input.val('');
    });

    $("html").on("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $("html").on("drop", function(e) { e.preventDefault(); e.stopPropagation(); });

    $drop.on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();

        const name = e.originalEvent.dataTransfer.files[0].name;
        const src = URL.createObjectURL(e.originalEvent.dataTransfer.files[0]);
        const $delete = $(this).find('.field__input-doc-delete');
        const $input = $(this).find('.field__input-file input');
        const $fileLink = $(this).parent().find('.field__input-doc-upload');

        $input[0].files = e.originalEvent.dataTransfer.files;
        $fileLink.css('display', 'block').attr('href', src).html(name);

        $delete.css('display', 'block');
    });
});