$(document).ready(function () {
	multiselectors.init();
});


var multiselectors;
multiselectors = {
	init: function () {
		var that = this;
		$('.make-multiselector[multiple]').not('.inited').addClass('inited').each(function () {
			that._init($(this));
		});
	},
	_init: function ($select) {
		var $table = $('<table />').addClass('multiselector-table').css({width: '100%'}),
			$select1 = $('<select />').css({width:'100%', height: "300px"}).attr('multiple', 'multiple'),
			$select2 = $('<select />').css({width:'100%', height: "300px"}).attr('multiple', 'multiple'),
			$tr = $('<tr />').appendTo($table),
			that = this;
		var $topTr = $('<tr />').insertBefore($tr),
			$topTd = $('<td />').appendTo($topTr)

			$div = $('<div />').addClass('field__input field__input-text').appendTo($topTd);

			$searchInput = $('<input />').attr('placeholder', 'Поиск').attr('type', 'text').appendTo($div);
			$searchInput.on('input', function () {
				that.synchronize($select);
			});
		$select.data('select1', $select1).data('select2', $select2).data('input', $searchInput);
		$('<td style="width:49%" />').addClass('multiselector__select-block').append($('<div />').append($select1)).appendTo($tr);

		var $td = $('<td style="vertical-align: middle" />').appendTo($tr),
			$addButton = $('<button />').addClass('multiselector__button').attr({disabled:'disabled', type: 'button'}).click(function() {
				$('option:selected', $select1).each(function(){
					$(this).data('original').prop('selected', true);
				});
				that.synchronize($select);
				$(this).attr('disabled', 'disabled');
			}).appendTo($td);
		//$td.append('<br /><br />');
		var $removeButton = $('<button />').addClass('multiselector__button multiselector__button-reverse').attr({disabled:'disabled', type: 'button'}).click(function() {
				$('option:selected', $select2).each(function () {
					$(this).data('original').prop('selected', false);
				});
				that.synchronize($select);
				$(this).attr('disabled', 'disabled');
			}).appendTo($td);

		$('<td style="width:49%" />').addClass('multiselector__select-block').append($('<div />').append($select2)).appendTo($tr);
		$table.insertAfter($select);
		$select.hide();
		this.synchronize($select);

		$select1.change(function (e) {
			$addButton.removeAttr('disabled');
		});
		$select2.change(function (e) {
			$removeButton.removeAttr('disabled');
		});
		$select1.dblclick(function (e) {
			var $target = $(e.target);
			if ($target.is('option') && !$target.is(':disabled')){
				$target.data('original').prop('selected', true);
				$addButton.attr('disabled', 'disabled');
				that.synchronize($select);
			}
		});
		$select2.dblclick(function (e) {
			var $target = $(e.target);
			if ($target.is('option') && !$target.is(':disabled')){
				$target.data('original').prop('selected', false);
				$removeButton.attr('disabled', 'disabled');
				that.synchronize($select);
			}
		});
	},
	getParent: function ($source_option, $target_select) {
		var $optgroup = $source_option.closest('optgroup');
		if ($optgroup.length) {
			var $target_optgroup = $('optgroup[label="' + $optgroup.attr('label') + '"]', $target_select);
			if (!$target_optgroup.length) {
				$target_optgroup = $('<optgroup />').attr('label', $optgroup.attr('label')).appendTo($target_select);
			}
			return $target_optgroup;
		}

		return $target_select;
	},
	synchronize: function ($select) {
		if (!$select.data('select1')) {
			return false;
		}
		var $select1 = $select.data('select1'),
			scroll1 = $select1.scrollTop(),
			$select2 = $select.data('select2'),
			scroll2 = $select2.scrollTop(),
			$input = $select.data('input'),
			that = this,
			filter = $.trim($input.val().toLowerCase()),
			synchronizeAfter = null;
		if ($select.data('disabled')) {
			var $disabled_select = $('select' + $select.data('disabled'));
			if ($disabled_select[0]) {
				$('option', $select).each(function () {
					if ($(this).is(':selected')) {
						var $target_option = $('option[value="' + $(this).val() + '"]', $disabled_select);
						if (!$target_option.attr('disabled')) {
							$target_option.attr('disabled', 'disabled');
							synchronizeAfter = $disabled_select;
						}
					} else {
						var $target_option = $('option[value="' + $(this).val() + '"]', $disabled_select);
						if ($target_option.attr('disabled')) {
							$target_option.removeAttr('disabled');
							synchronizeAfter = $disabled_select;
						}
					}
				});
			}
		}
		$('option, optgroup', $select1).remove();
		$('option, optgroup', $select2).remove();
		$('option', $select).each(function () {
			var $target,
				isAppend = true;
			if ($(this).prop('selected')) {
				$target = that.getParent($(this), $select2);
			} else {
				$target = that.getParent($(this), $select1);
				if (filter !== '') {
					if ($(this).text().toLowerCase().indexOf(filter) == -1) {
						isAppend = false;
					}
				}
			}
			if (isAppend) {
				$(this).clone().data('original', $(this)).appendTo($target);
			}
		});
		if (filter !== '') {
			$('optgroup', $select1).each(function () {
				if (!$('option', this).length) $(this).remove();
			});
		}
		$select1.scrollTop(scroll1);
		$select2.scrollTop(scroll2);
		$('option:selected', $select1).removeProp('selected');
		$('option:selected', $select2).removeProp('selected');
		if (synchronizeAfter) {
			this.synchronize(synchronizeAfter);
		}
	}
};