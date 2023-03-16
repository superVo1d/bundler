$(function() {
	
	calendar_input = $('#previous_dates_input');
	calendar_html = $('#previous_dates .calendar').html();
			
	updateCalendar();
	
	$('.control_plus').click(function(e) {
	   e.preventDefault();
	   addCalendarRow();
	});
	
	$(document).on('click', '.control_minus', function(e) {
	   e.preventDefault();
	   removeCalendarRow($(this));
	});
	
	$('#previous_dates').on('change', 'input', function() {
		updateInput();
	});
	
	$('#retired').change(function() {
		if (!$(this).is(':checked')) {
			var start = $('input[name="start_date"]').val().substring(0, 10);
			var end = $('input[name="retired_date"]').val().substring(0, 10);
			
			if (start != '' && end != '') {
				var input = $('#previous_dates_input');
				var value = input.val();
				if (value.length == 0) {
					value = [];
				}
				value.push({ 'start': start, 'end': end });
				$('#previous_dates_input').val(JSON.stringify(value));
				
				if (value.length > $('.calendar').length) {
					addCalendarRow();
				}
	
				var name = value.length-1;			
				$('.calendar:last input[name=""]')
				updateCalendar();
			}
		}
	});
	
	function updateCalendar() {
		var value = $.parseJSON(calendar_input.val());
		if (typeof value != 'undefined' && value != null) {
			if (value.length > 1) {
				for (var i = 1, l = value.length; i < l; i++)
					addCalendarRow();
			}
			for (var i = 0, l = value.length; i < l; i ++) {
				$('input[name="start_date' + i + '"]').val(value[i].start + ' 00:00:00');
				$('input[name="end_date' + i + '"]').val(value[i].end + ' 00:00:00');
				changeCalendarDate('start_date' + i, new Date(value[i].start), 'date');
				changeCalendarDate('end_date' + i, new Date(value[i].end), 'date');
			}
		} 

	}
});

function addCalendarRow() {
	var l = $('#previous_dates .calendar').length;
	$('#previous_dates').append('<div class="calendar" id="temp_id"></div>');
	var temp = calendar_html.replace(/start_date0/g, 'start_date' + l).replace(/end_date0/g, 'end_date' + l);
	temp = temp.replace('control_plus">+', 'control_minus">&minus;');
	document.getElementById('temp_id').innerHTML = temp;
	$('#temp_id').removeAttr('id');
};

function removeCalendarRow(this_) {
	if ($('#previous_dates .calendar').length > 1) {
		var div = this_.parent().parent();
		div.remove();
		
		var i = 0;
		$('#previous_dates .calendar').each(function() {
			var html = $(this).html();
			var name = $(this).find('input[type="hidden"]').attr('name').replace('start_date', '');
			
			if (i != name) {
				var start_date = $(this).find('input[name="start_date' + name + 'Input"]').val();
				var end_date = $(this).find('input[name="end_date' + name + 'Input"]').val();
				
				html = html.replace(new RegExp('start_date' + name, 'g'), 'start_date' + i).replace(new RegExp('end_date' + name, 'g'), 'end_date' + i);
				$(this).attr('id', 'temp_id');
				document.getElementById('temp_id').innerHTML = html;
				$(this).removeAttr('id');
				
				$(this).find('input[name="start_date' + i + 'Input"]').val(start_date);
				$(this).find('input[name="end_date' + i + 'Input"]').val(end_date);	
			}
			i++; 
		});
	}
		
	updateInput();
};

function updateInput() {
	var value = [], i = 0;
	$('#previous_dates div.calendar').each(function() {
		var start = $(this).find('input[name="start_date' + i + '"]').val().split(' ')[0];
		var end = $(this).find('input[name="end_date' + i + '"]').val().split(' ')[0];
		if (start != '0000-00-00' && start.trim() != '' && end != '0000-00-00' && end.trim() != '') {
			value.push({ "start": start, "end": end });
		}
		i++;
	});
	$('#previous_dates_input').val(JSON.stringify(value));
};