$(function() {
	var container = $('#diplomas');
	var input = $('#diplomas_input');
	let $fileDelete = container.find('.field__input-doc-delete');

	const html = `
			<li class="field__item">
				<div class="field__name"><span>Документ об образовании</span></div>
				<div class="field__input field__input-text"><input type="text" name="diploma_text" placeholder="диплом о высшем образовании по направлению..." value=""></div>
			</li>
			<li class="field__item">
				<div class="field__name"><span>Профиль</span></div>
				<div class="field__input">
					<div class="radio-input">
						<label class="radio" for="diploma_type_0_0">
							<input type="radio" name="diploma_type_0" id="diploma_type_0_0" value="0">
							<span class="checkmark"></span>
							<div class="radio-label">Дизайн</div>
						</label>
						<label class="radio" for="diploma_type_0_1">
							<input type="radio" name="diploma_type_0" id="diploma_type_0_1" value="1">
							<span class="checkmark"></span>
							<div class="radio-label">Технологии</div>
						</label>
						<label class="radio" for="diploma_type_0_2">
							<input type="radio" name="diploma_type_0" id="diploma_type_0_2" value="2">
							<span class="checkmark"></span>
							<div class="radio-label">Управление</div>
						</label>
						<label class="radio" for="diploma_type_0_3">
							<input type="radio" name="diploma_type_0" id="diploma_type_0_3" value="3" checked="checked">
							<span class="checkmark"></span>
							<div class="radio-label">Другое</div>
						</label>
					</div>
				</div>
			</li>
			<li class="field__item">
				<div class="field__name"><span>Без приложений, .jpg, .pdf</span></div>
				<div class="field__input">
					<div class="field__input-file-drop" id="diploma_file__drop">
						<input style="display:none;" type="checkbox" class="delete_diploma_file" name="diplomas_0_delete" id="diplomas_0_delete">
						<label for="diplomas_0_delete" class="field__input-doc-delete" style="display: none;"><a class="field__input-delete"></a></label>
						<label for="diploma_file_0">
							<div class="field__input-file field__input-doc">
								<a class="field__input-link field__input-doc-upload" style="display: none;" target="_blank">
									Загруженный файл
								</a>
								<input type="file" name="diploma_file_0" id="diploma_file_0" class="diploma_file" data-overwrite="1">
								<span>Перетащите файл или <a>выберите его в&nbsp;папке</a></span>
							</div>
						</label>
					</div>
				</div>
			</li>`;

	container.on('input change', 'input[type="text"]', updateInput);
	container.on('input change', 'input[type="radio"]', updateInput);
	container.on('input change', 'input.diploma_file', updateInput);

	$('#add_diploma').click(function(e) {
		e.preventDefault();
		addRow();
		$fileDelete = container.find('.field__input-doc-delete');
	});

	parseInput();

	function updateInput(old_file) {
		var json = [];
		var old_json = $.parseJSON(input.val()) || [];
		var i_ = 0;
		container.find('.diploma').each(function() {
			var text = $(this).find('input[name="diploma_text"]').val() || '';
			var type = $(this).find('input[type="radio"]:checked').val() || '';
			if (typeof old_json[i_] !== 'undefined' && typeof old_json[i_].file !== 'undefined' && old_json[i_].file !== '') {
				if ($(this).find('input.diploma_file').val() === '') {
					var file = $(this).find('.delete_diploma_file').attr('data-file') || '';
				} else {
					var file = old_json[i_].file;
				}
			} else {
				if (typeof old_file === 'string') {
					var file = old_file;
				} else {
					var file = $(this).find('input.diploma_file').val() || '';
					if (file !== '') {
						file = file.split('/').pop().split('\\').pop();
						var ext = file.split('.');
						ext = ext[ext.length-1];
						if (ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'pdf') {
							file = Math.ceil(Math.random()*Math.pow(10, 12)) + '.' + ext;
						} else {
							file = '';
						}
					}
				}
			}
			if ((text !== '' || file !== '') && type !== '') {
				json.push({ "text": text, "type": type, "file": file });
			}
			i_++;
		});
		input.val(JSON.stringify(json));
	};

	function parseInput() {
		var json = $.parseJSON(input.val());
		if (typeof json === 'undefined' || json === '' || json === null)
			json = [];
		for (var i = 0, l = json.length; i < l; i++) {
			if (i > 0)
				addRow();
			var tr = container.find('.diploma:nth-child(' + (i + 1) + ')');
			tr.find('input[name="diploma_text"]').val(json[i].text);
			tr.find('input[type="radio"]').removeAttr('checked');
			tr.find('input#diploma_type_' + i + '_' + json[i].type).attr('checked', 'checked');
			json[i].file = json[i].file || '';

			$(`input[name="diplomas_${i}_delete"]`).remove();
			$(`label[for="diplomas_${i}_delete"]`).remove();

			$('<input style="display:none;" type="checkbox" class="delete_diploma_file" name="diplomas_' + i + '_delete" data-num="' + i + '" data-file="' + json[i].file + '" id="diplomas_' + i + '_delete" />' +
				'<label for="diplomas_' + i + '_delete" class="field__input-doc-delete" style="display:none;" ><a class="field__input-delete"></a></label>').insertBefore(tr.find('input[type="file"]').parent().parent());

			if(json[i].file !== '') {
				tr.find('.field__input-link').attr('href', `/people/f/${window.subscribeId}/diplomas/${json[i].file}`).css('display', 'block');
				//$('<a class="field__input-link field__input-doc-upload" target="_blank" href="/people/f/' + window.subscribeId + '/diplomas/' + json[i].file + '" >Загруженный файл</a>').insertBefore(tr.find('input[type="file"]'));
				tr.find('input[type="file"]').attr('data-overwrite', '1');

				$(`label[for="diplomas_${i}_delete"]`).css('display', 'block');
			}

			$fileDelete = container.find('.field__input-doc-delete');

			$(`#diploma_file_${i}`).on('change', function(e) {
				if (e.target.files[0]) {
					const name = e.target.files[0].name;
					const src = URL.createObjectURL(e.target.files[0]);
					const $fileLink = $(this).parent().find('.field__input-doc-upload');
					const $delete = $(this).parent().parent().parent().find('.field__input-doc-delete');

					$delete.css('display', 'block');
					$fileLink.css('display', 'block').attr('href', src).html(name);
				}
			});

			const $drop = $(`#diploma_file_${i}`).parent().parent().parent();

			$drop.on('drop', function (e) {
				e.stopPropagation();
				e.preventDefault();

				const name = e.originalEvent.dataTransfer.files[0].name;
				const src = URL.createObjectURL(e.originalEvent.dataTransfer.files[0]);

				const $fileLink = $(this).find('.field__input-doc-upload');
				const $delete = $(this).find('.field__input-doc-delete');
				const $input = $(this).find('.field__input-file input');

				$input[0].files = e.originalEvent.dataTransfer.files;

				$delete.css('display', 'block')
				$fileLink.css('display', 'block').attr('href', src).html(name);

				updateInput();
			});
		};
	};

	function addRow() {
		var l = container.find('.diploma').length;
		container.append('<ul class="diploma">' + html.replace(/diploma_type_0/g, 'diploma_type_' + l).replace(/diploma_file_0/g, 'diploma_file_' + l).replace(/diplomas_0_delete/g, 'diplomas_' + l + '_delete') + '</ul>');

		$(`#diploma_file_${l}`).on('change', function(e) {
			if (e.target.files[0]) {
				const name = e.target.files[0].name;
				const src = URL.createObjectURL(e.target.files[0]);
				const $fileLink = $(this).parent().find('.field__input-doc-upload');
				const $delete = $(this).parent().parent().parent().find('.field__input-doc-delete');

				$delete.css('display', 'block');
				$fileLink.css('display', 'block').attr('href', src).html(name);
			}

			updateInput();
		});

		const $drop = $(`#diploma_file_${l}`).parent().parent().parent();

		$drop.on('drop', function (e) {
			e.stopPropagation();
			e.preventDefault();

			const name = e.originalEvent.dataTransfer.files[0].name;
			const src = URL.createObjectURL(e.originalEvent.dataTransfer.files[0]);

			const $fileLink = $(this).find('.field__input-doc-upload');
			const $delete = $(this).find('.field__input-doc-delete');
			const $input = $(this).find('.field__input-file input');

			$input[0].files = e.originalEvent.dataTransfer.files;

			$delete.css('display', 'block')
			$fileLink.css('display', 'block').attr('href', src).html(name);

			console.log('updateInput();')

			updateInput();
		});

		container.find('span.hint:last').remove();
		container.find('span.hint:last').remove();
		$fileDelete = container.find('.field__input-delete')
	};
	
	$('input.delete_diploma_file').on('change', function() {
		var i_ = parseInt($(this).attr('data-num'));
		if ($(this).parent().find('.diploma_file').val() === '') {
			var json = $.parseJSON(input.val());
			if ($(this).is(':checked')) {
				if (json[i_]) json[i_].file = '';
			} else {
				if (typeof json[i_] === 'undefined') {
					updateInput($(this).attr('data-file'));
					return;
				} else {
					if (json[i_]) json[i_].file = $(this).attr('data-file');
				}
			}
			input.val(JSON.stringify(json));
		}
		updateInput();
	});
	
	$('input[data-overwrite="1"]').on('change', function() {
		if ($(this).val() !== '' && !$(this).parent().parent().parent().parent().find('.error')[0]) {
			$('<div class="field__value error" style="display:block;"><span class="error">новый файл перезапишет существующий</span></div>').insertAfter($(this).parent());
		} else {
			$(this).parent().find('.error').remove();
		}
	});

	$fileDelete.live('click', function(e) {
		const id = $(this).attr('for');
		const $input = $(`input[name="${id}"]`);
		const $fileLink = $input.parent().find('.field__input-doc-upload');

		$input.parent().find('input[type="file"]').attr('data-overwrite', '0');
		$input.parent().find('input[type="file"]').val('');

		$(this).parent().find('.error').remove();

		$(this).css('display', 'none');
		$fileLink.css('display', 'none').attr('href', '');

		$input.val('');
	});
});
