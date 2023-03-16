function people_edit_validate() {
	var result = true;
	var email = /^[-\w.]+@(design|artlebedev|tema|theatre|cafeterius)\.ru$/
	if (document.forms[0].lname && document.forms[0].lname.value == "") {
		alert("Не задана фамилия!");
		document.forms[0].lname.focus();
		result = false;
	}
	else if (document.forms[0].fname && document.forms[0].fname.value == "") {
		alert("Не задано имя!");
		document.forms[0].fname.focus();
		result = false;
	}
	else if (document.forms[0].parent_company && document.forms[0].parent_company.value == "") {
		alert("Не задана компания!");
		document.forms[0].parent_company.focus();
		result = false;
	}
	else if (document.forms[0].email && document.forms[0].email.value.search(email) == -1) {
		if (document.forms[0].email.value == "" || document.forms[0].email.value == "NULL") {
			result = confirm("Не задана электронная почта! Продолжить?");
			if (!result) document.forms[0].email.focus();
		}
		else {
			result = alert("Основной адрес электронной почты должен быть в домене design.ru или artlebedev.ru!");
			document.forms[0].email.focus();
			result = false;
		}
	}
	if (result && document.forms[0].login && document.forms[0].login.value == "") {
		alert("Не задан логин!");
		document.forms[0].login.focus();
		result = false;
	}
	return result;
}

$(document).ready(function () {
	day = $('select[name="birthday_day"]');
	month = $('select[name="birthday_month"]');
	year = $('input[name="birthday_year"]');

	year.change(function () {
		validateDate();
	});
	month.change(function () {
		validateDate();
	});

	$('.snetwork').focusout(function () {
		validateSocialNetwork($(this));
	});

	$('#url').focusout(function () {
		validateUrl($(this));
	});

	$('#live_journal').focusout(function () {
		validateLJ($(this));
	});

	$('#plus').click(function (e) {
		e.preventDefault();
		addCalendarRow();
	});

	$('#minus').click(function (e) {
		e.preventDefault();
		removeCalendarRow();
	});

	var $contract = $('[name="contract_dateInput"]');
	if ($contract.val() == '-') {
		var old_contract_val = '-';

		$('[name="start_dateInput"]').change(function () {
			var val = $.trim($(this).val())
			var dt = string2date(val);
			if (dt) {
				var newDt = new Date(dt.setMonth(dt.getMonth() + 3)),
					sNewDt = date2string(newDt);
				if ($contract.val() == '-' || $contract.val() == old_contract_val) {
					$contract.val(sNewDt).trigger('blur');
					old_contract_val = sNewDt;
				}
			} else {
				$contract.val('-').trigger('blur');
				old_contract_val = '-';
			}
		});
	}

});

function validateDate() {
	if (month.val() == 04 || month.val() == 06 || month.val() == 09 || month.val() == 11) {
		if (day.val() == 31) {
			day.val(30);
		}
		day.find('option[value=31]').attr('disabled', 'disabled');
	} else if (month.val() == 02) {
		if (day.val() == 31 || day.val() == 30) {
			day.val(29);
		}
		day.find('option[value=31]').attr('disabled', 'disabled');
		day.find('option[value=30]').attr('disabled', 'disabled');
		year_val = year.val();
		if ((year_val % 4 != 0 || year_val % 100 == 0) && year_val % 400 != 0) {
			if (day.val() == 29) {
				day.val(28);
			}
			day.find('option[value=29]').attr('disabled', 'disabled');
		} else {
			day.find('option[value=29]').removeAttr('disabled');
		}
	} else {
		day.find('option[value=29]').removeAttr('disabled');
		day.find('option[value=30]').removeAttr('disabled');
		day.find('option[value=31]').removeAttr('disabled');
	}
}
function validateSocialNetwork(object) {
	value = object.val();

	if (value != '') {
		if (value.indexOf('plus.google.com') > -1) {
			object.val(value.replace('/about', ''));
		}

		if (value.indexOf('www.') > -1 || value.indexOf('http:') > -1 || value.indexOf('https:') > -1 || value.indexOf('/') > -1) {
			split = value.split('/');

			if (split[split.length - 1] != 'posts' && split[split.length - 1] != '') {
				value = split[split.length - 1];
			} else if (split[split.length - 2] != 'posts') {
				value = split[split.length - 2];
			} else {
				value = split[split.length - 3];
			}
		}

		if (object.attr('data-url') != '') {
			if (value.indexOf('@') > -1) {
				value = value.replace('@', '');
			}

			value = object.attr('data-url') + value;

			if (object.attr('data-url2')) {
				value = value + object.attr('data-url2');
			}
		}

		object.val(value);
	}
}

function validateLJ(object) {
	value = object.val();
	if (value != '') {
		if (value.indexOf('livejournal.') > -1 || value.indexOf('lj.') > -1) {
			split = value.split('/');
			if (split[split.length - 1] != '')
				value = split[split.length - 1];
			else
				value = split[split.length - 2];
			if (value.indexOf('livejournal.') > -1 || value.indexOf('lj.') > -1) {
				split = value.split('.');
				if (split[0] != '') {
					value = split[0];
				}
			}
			value = object.attr('data-url') + value + object.attr('data-url2');
		} else if (value.indexOf('www.') > -1 || value.indexOf('http:') > -1 || value.indexOf('https:') > -1) {
			validateSocialNetwork(object);
			//value = object.val();
		} else {
			value = object.attr('data-url') + value + object.attr('data-url2');
		}
		object.val(value);
	}
}

function validateUrl(object) {
	value = object.val();
	if (value != '') {
		if (value.indexOf('http:') == -1 && value.indexOf('https:') == -1) {
			value = 'http://' + value;
		}
		object.val(value);
	}
}