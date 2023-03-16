$(function() {
    const navButtons = [];
    let headers = [];
    let oldScroll = 0;
    let lockedSelection = false;

    $(window)
        .on('load', () => {
            headers = $('h2');
            const nav = $('.edit__nav > ul');

            headers.each((i, el) => {
                html = $(`
				 	<li>
				 		<a href="#${ el.id }">${ $(el).html() }</a>
				 	</li>`);

                $(nav).append(html);
                navButtons.push(html)
            });

            $(navButtons).each((i, btn) => {
                $(btn).on('click', function() {
                    lockedSelection = true;
                    const id = $(btn).find("a[href]").attr('href').slice(1);
                    selectButton(id);
                })
            })

            $(window)
                .on('scroll', () => {
                    const isScrollingDown = oldScroll < window.scrollY;
                    oldScroll = window.scrollY;

                    if (!lockedSelection) {
                        scrollAction();
                    }
                });

            scrollAction();
        });

    const selectButton = (id) => {
        btn = $(`a[href$="#${id}"]`).parent('li');

        $(navButtons).each((i, el) => {
            if ($(el) !== btn) $(el).removeClass('active');
        });

        btn.addClass('active');

        setTimeout(() => lockedSelection = false, 200);
    }

    const scrollAction = () => {
        const headerOffset = $(document).height() - $(headers)[$(headers).length - 1].offsetTop - 50;

        let nearestHeaderDistance = 0;
        let nearestHeader;

        $(headers).each((i, header) => {
            const headerPosition = $(header).offset().top;
            const scrollPosition = $(window).scrollTop() + $(window).height();

            if ((nearestHeaderDistance < scrollPosition - headerOffset) && (headerPosition > nearestHeaderDistance) && (headerPosition < scrollPosition - headerOffset)) {
                nearestHeaderDistance = headerPosition;
                nearestHeader = header;
            }
        });

        if (!!nearestHeader) console.log(nearestHeader.id)

        if (!!nearestHeader) selectButton(nearestHeader.id);
    }
});