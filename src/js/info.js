$(function() {
	var $projects_participation = $('#projects-participation');
	if ($projects_participation.length) {
		var ac_person_id = $projects_participation.attr('data-ac-person-id'),
			person_id = $projects_participation.attr('data-person-id');
		$.ajax({
			type: 'GET',
			url: './info.pxml?type=involved&id=' + ac_person_id +'&person_id=' + person_id,
			cache: false,
			success: function (data) {
				var res = JSON.parse(data);

				if (res) {
					var html_cnt = 0;
					for(var key in res) {
						var item = res[key],
							$html = null;
						if(key == 'ac' && item.data) {
							var _p = item.data,
								projects = [];
							for(var _k in _p) {
								projects.push(_p[_k]);
							}
							if (projects.length) {
								var project_text_ending = parseInt(projects.length % 10) === 1 && projects.length !== 11 ? "проекте" : "проектах";

								$html = $('<span />');
								$html.append('участвует в&nbsp;<a href="" data-toggle="true" class="dashed">' + projects.length + ' ' + project_text_ending + '</a>');
								var $container = $('<div />').addClass('people-info__container').appendTo($html);
								var $div = $('<div />').appendTo($container);

								var $ul = $('<ul />').addClass('people-info__popup').appendTo($div);

								for (var i = 0; i < projects.length; i++) {
									let className = projects[i].completed_on && projects[i].completed_on !== '' ? 'completed' : '';
									$("<li " + (className.length ? ("class='" + className + "'") : "") + "><a target='_blank' href='https://ac.design.ru/projects/" + projects[i].id + "'><span>" + projects[i].name + "</span></a></li>").appendTo($ul);
								}
							}
						} else if (item.html) {
							$html = $('<span />').html(item.html);
						}

						if ($html) {
							html_cnt++;
							if ($.trim($projects_participation.text()) != '') $html.append(', ');
							$projects_participation.append($html);
						}
					}

					if (html_cnt) $projects_participation.children('span').last().html($projects_participation.children('span').last().html().slice(0, -2));

					$('[data-toggle]', $projects_participation).click(function (e) {
						var $ul = $(this).closest('span').find('.people-info__container'),
							$a = $(this);
						$('.people-info__container').hide();
						if($ul.is(':hidden')) {
							$ul.show();
							$('body').bind('click.hideInfoPopup', function (e) {
								var $target = $(e.target);
								if (!$target.closest($ul).length && !$target.closest($a).length) {
									$ul.hide();
									$('body').unbind('click.hideInfoPopup');
								}
							});
						} else {
							$ul.hide();
						}
						e.preventDefault();
					});
				}
			}
		});
	}



	// Приглашение в СЛАК (отправка письма)
	// из режима редактирования профиля, если еще не заполнено поле
	if ($('.btn-invite-to').length) {
		$('.btn-invite-to').each(function() {
			var $btn = $(this);

			$btn.on('click', function(e) {
				e.preventDefault();
				$btn.prop('disabled', true);

				$.ajax({
					type: "POST",
					url: '/people/api/invite.pxml',
					data: {
						"invite_to": $btn.attr('data-invite-to'),
						"person_id": $btn.attr('data-person-id'),
						"invite_from": $btn.attr('data-invite-from'),
					},
					success: function() {
						console.log(arguments);
					}
				});
			});
		});
	}
});