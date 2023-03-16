$(function() {
    let mouseOverTimeoutID;
    let mouseLeaveTimeoutID;

    const $likes =  $('.like-btn');

    let person = {
        id: null,
        name: '',
        photo: null,
    };

    $likes.each(function (i, el) {
        const $this = $(this);
        const $el = $(el);
        person = {
            id: $(el).data().person,
            name:  $(el).data().name,
            photo:  $(el).data().photo,
        };

        const likes_list = [];

        $el.find('.likes-list__content ul li').toArray().each((li) => {
            if ($(li).data().person === person.id) {
                $this.addClass('active');
            }

            likes_list.push({
                person_id: $(li).data().person,
                name: $(li).text()
            });
        });
    })
    $likes
        .on('mouseover', function() {
            const $this = $(this);

            clearTimeout(mouseLeaveTimeoutID);
            mouseLeaveTimeoutID = null;

            if (!mouseOverTimeoutID) {
                $this.addClass('mouseover');

                mouseOverTimeoutID = setTimeout(() => {
                    $this.find('.likes-list').css('display', 'block');
                    $this.addClass('show');
                    mouseOverTimeoutID = null;
                }, 1500);
            }
        })
        .on('mouseleave', function() {
            const $this = $(this);

            if (!mouseLeaveTimeoutID) {
                mouseLeaveTimeoutID = setTimeout(() => {
                    if ($this.find('.likes-list:hover').length === 0) {
                        clearTimeout(mouseOverTimeoutID);
                        mouseOverTimeoutID = null;
                        $this.find('.likes-list').css('display', 'none');
                        $this.removeClass('show');
                        $this.removeClass('mouseover');
                    }
                    mouseLeaveTimeoutID = null;
                }, 500);
            }
        })
        .on('click', function(e) {
            if (e.target.closest('.likes-list__content')) return;

            const $this = $(this);

            $this.mouseover();

            if ($this.hasClass('active')) {
                $likes.removeClass('active');
                $likes.find('.value').text(parseInt($this.find('.value').text()) - 1);

                $likes.find('.likes-list__content ul li:last').remove();
            } else {
                $likes.addClass('active');
                $likes.find('.value').text(parseInt($this.find('.value').text()) + 1);
            }

            fetch($this.find('button').data().action)
                .then(res => res.json())
                .then(data => {
                    $likes.find('.likes-list').remove();

                    $likes.append('<div class="likes-list"><div class="likes-list__content"><ul></ul></div></div>');

                    data.forEach((person) => {
                        $likes.find('.likes-list__content ul').append(`
                        <li class="likes-list__person" data-person="${person.person_id}" data-photo="">
                            <a href="/people2/${person.login}">
                                <img src="https://i2.design.ru/people/i/${person.person_id}/photo.jpg" onerror="this.onerror=null;this.src='https://i2.design.ru/people/i/no_photo_m.gif';" />
                                <div>
                                    <span>${person.fname + ' ' + person.lname}</span>
                                </div>
                            </a>
                        </li>`);
                    });
                });
        });
});