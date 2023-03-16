$(function() {
    const $comments = $('.epitaph__comments');
    const $form = $('.epitaph__form');
    const $inputContainer = $('.epitaph__input');
    const $textarea = $('.epitaph__textarea')
    const $input = $('.epitaph__textarea + input');
    const $button = $('.epitaph__button');

    if ($inputContainer.data()) {
        const initialText = $inputContainer.data().self;
        let myEpitaphIndex = null;

        $comments.data().epitaph !== '' && $comments.data().epitaph.forEach((ep, i) => {
            if (initialText.length && ep.text && (initialText === ep.text)) myEpitaphIndex = i + 1;

            $comments.append(`
                <div class="epitaph">`
                + (ep.name ? `<div class="epitaph__name"><span>${ep.name}</span></div>` : '')
                + (ep.text ? `<div class="epitaph__text">
                                <p>${ep.text}</p>
                             </div>` : '')
                + (initialText.length && ep.text && (initialText === ep.text) ? `<div class="epitaph__edit">
                    <button class="button button-2 button-alter">Изменить</button>
                    <button class="button button-2 button-delete">Удалить</button>
                  </div>` : '')
                + `</div>`);
        });

        if (initialText.length === 0) {
            $inputContainer.css('display', 'block');
        }

        $('.button-delete').on('click', function () {
            $input.val('');
            $form.submit();
        });

        $('.button-alter').on('click', function () {
            $input.val(initialText);
            $inputContainer.css('display', 'block');
            $textarea.addClass('active');
            $button.removeClass('disabled');
            $button.prop("disabled", false);
            $(`.epitaph:nth-child(${myEpitaphIndex}) .epitaph__edit`).css('display', 'none');
        });

        $button.on('click', function () {
            $input.val($textarea.html());
            $(this).prev('form').submit();
        });

        $textarea
            .on('focus', function () {
                const $this = $(this);
                if ($this.html().length) {
                    $textarea.addClass('active');
                } else {
                    $textarea.removeClass('active');
                }
            })
            .on('blur', function () {
                const $this = $(this);
                if ($this.html().length === 0) {
                    $textarea.removeClass('active');
                }
            })
            .on('input', function () {
                const $this = $(this);
                $input.val($this.innerHTML);

                if ($this.html().length) {
                    $textarea.addClass('active');
                    $button.removeClass('disabled');
                    $button.prop("disabled", false);
                } else {
                    $textarea.removeClass('active');
                    $button.addClass('disabled');
                    $button.prop("disabled", true);
                }
            });
    }
});