$(function() {
    const $status = $('.person__status');
    const id = $status.attr('data-id');

    const update = () => {
        fetch('/people2/status.html?id=' + id)
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                const { in_studio, person_id, title, type } = data;
                
                if (typeof in_studio === 'undefined' || in_studio === '0') {
                    $('.person-online').css('display', 'none');
                } else {
                    $('.person-online').css('display', 'block');
                }
                if (Object.keys(data).length) {
                    $status.html(title);
                    $status.addClass(type);
                }
            });
    }

    update();

    setInterval(function(){
        update();
    }, 1000 * 60 * 5);
});