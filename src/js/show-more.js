$(function() {
    const symbolsToShow = 300;

    $('.show-more').each( function(i, more) {
        const $more = $(more);
        const text = $more.data().text.replace( /<script.*?>.*?<\/script>/igm, "").replace( /<style.*?>.*?<\/style>/igm, "").replace( /<br(.| |\/|| \/)>( ){1,}/igm, '<br/>').replace(/(<br\/>){2,}/igm, "<br/><br/>");

        //const button = `<button class="button button-3 button-show-more" onclick="click()">Раскрыть</button>`;

        function fixHtml(html) {
            var div = document.createElement('div');
            div.innerHTML = html
            return (div.innerHTML);
        }

        function addHidden() {
            let i = 0;
            if (!!text.slice(0, symbolsToShow + i).match(/</g)) {
                while ((text.slice(0, symbolsToShow + i).match(/</g).length + text.slice(0, symbolsToShow + i).match(/>/g).length) % 2 !== 0 && text[symbolsToShow + i] !== ' ' && i < 20) {
                    i++;
                }
            }
            let part = text.slice(0, symbolsToShow + i);
            const lastIndex = part.lastIndexOf(" ");
            part = part.substring(0, lastIndex);

            $more.html(fixHtml(part) + '&nbsp;<span class="show-more-ellipsis"><...></span>');
            //$more.parent().append(button);
        }

        if (text.replace(/<[^>]*>?/gm, '').length >= symbolsToShow + 50) {
            addHidden();
        } else {
            $more.html(text);
        }

        $more.find('.show-more-ellipsis').live('click', function () {
            const $this = $(this);
            const $textContainer = $this.closest('.show-more');

            const fullText = $textContainer.data().text.replace( /<script.*?>.*?<\/script>/igm, "").replace( /<style.*?>.*?<\/style>/igm, "");

            if ($this.text() === '<...>') {
                $textContainer.html(fullText + '&nbsp;<span class="show-more-ellipsis show-more-close">>...<</span>');
            } else {
                addHidden();
            }
        });
    });
});
