$(function() {
	const $body = $('body');

	$('.modal__close')
		.on('click', function(e) {
			e.preventDefault();

			const $this = $(this);

			$this.closest('.modal').css('display', 'none');
			$body.removeClass("modal-visible");
		});

	$('.modal__open')
		.on('click', function(e){
			e.preventDefault();

			const m = $(this).data().modal;
			const $m = $(`.${m}`);

			$m.css('display', 'block');
			$body.addClass("modal-visible");
		});
});
