// путь к картинкам
var imagesFolder = '/i/';

// имена месяцев и т.п.
var calendarNamesHash = new Array();

calendarNamesHash.ru = new Array();
calendarNamesHash.en = new Array();

calendarNamesHash.ru.month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
calendarNamesHash.ru.monthShort = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
calendarNamesHash.ru.weekday = ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'];
calendarNamesHash.ru.today= 'сегодня';
calendarNamesHash.en.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
calendarNamesHash.en.monthShort = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
calendarNamesHash.en.weekday = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
calendarNamesHash.en.today= 'today';

var calendarNames = calendarNamesHash[ tasksLanguage == 'en' ? 'en':'ru'];

// функция инициализации

function calendar(name,value,options) {
	writeInFields(name,value,options);
	updateCalendar(name);
}

// служебные функции

function zeroFill(value){
	return (value<10 ? '0':'')+value;
}

function date2string(date){
	return date.getDate() + ' ' + calendarNames.monthShort[date.getMonth()] + ' ' + date.getFullYear();
}
function string2date(string){
	var re = /([\d+]{1,2})\s+(.{3})\s+([\d+]{4})/i;
	if (!re.test(string)) return null;
	var vals = re.exec(string),
		index = calendarNames.monthShort.indexOf(vals[2]);
	if (index == -1) return null;
	return new Date(parseInt(vals[3]), index, parseInt(vals[1]));
}

function date2value(date){
	if (date == null)
		return '';
	else
		return date.getFullYear()+'-'+zeroFill(date.getMonth()+1)+'-'+zeroFill(date.getDate())+' '+
			zeroFill(date.getHours())+':'+zeroFill(date.getMinutes())+':00';
}

function value2date(value){
	if (value && value != '0000-00-00 00:00:00'){
		var re = /(\d+)-(\d+)-(\d+)\s+(\d+):(\d+):(\d+)/i;
		var date = re.exec(value);
		if (date) return(new Date(date[1],date[2]-1,date[3],date[4],date[5],date[6]));
	}
	return null;
}

// интерфейсные функции

function updateCalendar(name){
	var date = getCalendarDateUnchecked(name);

	var dateInput = document.getElementsByName(name + 'Input')[0];
	var hoursInput = document.getElementsByName(name + 'Hours')[0];
	var minutesInput = document.getElementsByName(name + 'Minutes')[0];

	if (dateInput) dateInput.value = date ? date2string(date) : '-';
	if (hoursInput) hoursInput.value = date ? date.getHours() : '-';
	if (minutesInput) minutesInput.value = date ? zeroFill(date.getMinutes()) : '-';
	if (window.jQuery) {
		var e = $('[name="' + name + 'Input"]');
		if (e) {
			e.change();
		}
	}
}

function getCalendarDateUnchecked(name) {
	var hiddenValue = document.getElementsByName(name)[0];
	return hiddenValue ? value2date(hiddenValue.value) : null;
}

function getCalendarDate(name) {
	var date=getCalendarDateUnchecked(name);
	return date ? date : new Date();
}

function putCalendarDate(name, date) {
	var hiddenValue = document.getElementsByName(name)[0];
	if (hiddenValue){
		hiddenValue.value = date2value(date);
		updateCalendar(name);
	}
}

function putCalendarValue(name,value){
	var hiddenValue = document.getElementsByName(name)[0];
	if (hiddenValue){
		hiddenValue.value = value;
		updateCalendar(name);
	}
}

function calendarCallback(name, date, mode){
}

function changeCalendarDate(name, date, mode){
	var current=getCalendarDate(name);

	putCalendarDate(name,date);

	if (date2value(date) != date2value(current)){
		calendarCallback(name, date, mode);
	}
}

//
//  служебные функции, вычисления, HTML и т.д.
//

var closeCalendarTimeOut = 0;

// все-таки придется где-нибудь хранить какой именно календарик открыть (его имя)
var activeCalendarName = '';

// функция вызывается при клике на дату в календаре

function setDateFromCalendar(dayToSet, monthToSet, yearToSet) {
	var dateToSet = getCalendarDate(activeCalendarName);
	dateToSet.setFullYear(yearToSet);
	dateToSet.setDate(1);
	dateToSet.setMonth(monthToSet);
	dateToSet.setDate(dayToSet);
	changeCalendarDate(activeCalendarName, dateToSet, 'date');
	// закрываем календарь
	hideCalendar();
}

function setTodayFromCalendar() {
	var date=new Date();
	setDateFromCalendar(date.getDate(),date.getMonth(),date.getFullYear());
  calendarCallback(activeCalendarName, date, 'date');
}

function getCalendarTimeFromString(fieldName) {
	var hoursInput = document.getElementsByName(fieldName + 'Hours')[0];
	var minutesInput = document.getElementsByName(fieldName + 'Minutes')[0];

	if (hoursInput && minutesInput){
		var newDate = getCalendarDate(fieldName);
		var thisHour=parseInt(hoursInput.value);
		var thisMinutes=parseInt(minutesInput.value);
		if (!isNaN(thisHour)) newDate.setHours(thisHour);
		if (!isNaN(thisMinutes)) newDate.setMinutes(thisMinutes);
		changeCalendarDate(fieldName, newDate, 'time');
	}
}

function getCalendarDateFromString(fieldName) {
	var dateInput = document.getElementsByName(fieldName + 'Input')[0];
	var re = /^\s*(\d+)[\s|\/|.]+([^\s]+)[\s|\/|.]+(\d+)\s*$/i;
	var results = re.exec(dateInput.value);
	if (results){
		// если небыло ошибки регекспа

		var newDate = getCalendarDate(fieldName);
		// определяем год
		var newYear = parseInt(results[3]);
		if (newYear < 30) newYear += 2000;
		else if (newYear < 100) newYear += 1900;
		else if (newYear < 1930) newYear += 2000;
		// что при последнем может получиться - никто не знает
		newDate.setFullYear(newYear);
		newDate.setDate(1);

		if (isNaN(parseInt(results[2]))) {
			var monthStr = results[2].toLowerCase();
			// в качестве месяца - строка
			// 
			for (var i = 0; i < 12; i++) {
				if (
					calendarNamesHash.ru.month[i].toLowerCase().indexOf(monthStr) == 0 ||
						calendarNamesHash.ru.monthShort[i].toLowerCase().indexOf(monthStr) == 0 ||
						calendarNamesHash.en.month[i].toLowerCase().indexOf(monthStr) == 0 ||
						calendarNamesHash.en.monthShort[i].toLowerCase().indexOf(monthStr) == 0
					) {
					newDate.setMonth(i);
					break;
				}
			}
		} else {
			// пришло число в качестве месяца
			// если нужно проверять не на американский манер
			// ли была передана дата, то это здесь
			newDate.setMonth(parseInt(results[2]) - 1);
		}
		newDate.setDate(parseInt(results[1]));
		changeCalendarDate(fieldName, newDate, 'date');
	} else if(dateInput.value == '-' || dateInput.value == '') {
		// пустая дата
		changeCalendarDate(fieldName, null, 'date');
	} else {
		// если по какой-то причине регексп не сработал
		alert('Не понял, что это за дата такая, возвращаю старую...');
		updateCalendar(fieldName);
	}
}

// внешний вид и поведение

var pixelSpacer = '<div style="width: 1px; height: 1px;"><spacer type="block" width="1" height="1" /><\/div>';

function writeInFields(name, value, options) {
	// Вставляет HTML-код с необходимыми полями...
	document.write('<input type="hidden" name="' + name + '" value="' + value + '" />');
	document.write('<table cellpadding="0" cellspacing="0" border="0"><tr valign="bottom">');
	document.write('<td class="field__input-text"><input type="text" name="' + name + 'Input" size="13" onBlur="getCalendarDateFromString(\'' + name + '\');" /><\/td>');
	document.write('<td><button class="calBtn button button-2 button-secondary" name="' + name + 'Btn" onClick="showCalendarForElement(\'' + name + '\', event); return false;">');
	document.write('&nbsp;<img src="' + imagesFolder + 'dayselect.gif" width="24" height="10" />&nbsp;<\/button><\/td>');
	document.write('<td>' + pixelSpacer + '<\/td>');
	if (options == 1) {
		document.write('<td valign="middle">&nbsp;&nbsp;<\/td>');
		document.write('<td class="field__input-text"><input type="text" name="' + name + 'Hours" size="2" onBlur="getCalendarTimeFromString(\'' + name + '\');" style="text-align: right;" /><\/td>');
		document.write('<td valign="middle"><small>&nbsp;:&nbsp;<\/small><\/td>');
		document.write('<td class="field__input-text"><input type="text" name="' + name + 'Minutes" size="2" onBlur="getCalendarTimeFromString(\'' + name + '\');" /><\/td>');
		document.write('<td valign="middle">&nbsp;&nbsp;<\/td>');
	}
	document.write('<\/tr><tr><td colspan="2">' + pixelSpacer + '<\/td>');
	document.write('<td><div id="' + name + 'Ptr" style="width: 1px; height: 1px;"><spacer type="block" width="1" height="1" /><\/div><\/td><\/tr>');
	document.write('<\/table>');
}

function showCalendarForElement(elemName, evt) {
	var calPtr = document.getElementById(elemName + 'Ptr');
	if (calPtr) {
		// показывает календарь в слое (создает слой, если необходимо)
		var calLeer = document.getElementById('candarLeer');
		if (!calLeer) {
			calLeer = document.createElement('div');
			calLeer.id = 'candarLeer';
			document.getElementsByTagName('body')[0].appendChild(calLeer);
		}
		// проверяем показан ли слой, если да - скрываем
		if (calLeer.style.visibility == 'visible' && activeCalendarName == elemName) {
			calLeer.style.visibility = 'hidden';
		} else {
			activeCalendarName = elemName;
			// скрываем слой
			calLeer.style.visibility = 'hidden';
			// вычисляем где именно должен быть этот календарь.
			var calPosition = new getElementPosition(calPtr);
			// заполняем нужным кодом...
			// смотрим какая дата нас интересует
			var currDate = getCalendarDate(elemName);
			// собственно вызываем код
			calLeer.innerHTML = calendarHTML(currDate.getMonth(), currDate.getFullYear(), currDate);
			// ставим слой на место
			calLeer.style.left = calPosition.x - calLeer.offsetWidth;
			calLeer.style.top = calPosition.y;
			// и показываем
			calLeer.style.visibility = 'visible';

			// наконец, прекращаем баблинг (может, кто-то открыл без event'а)
			if (evt) evt.cancelBubble = true;
			// и ставим свой обработчик на клик на календаре (чтобы не скрывался)
			addEvent(calLeer, 'click', calendarClick);
			// и на mouseout (чтобы скрывался, но через некоторое время ;-)
			addEvent(calLeer, 'mouseover', calendarMouseOver);
			addEvent(calLeer, 'mouseout', calendarMouseOut);
		}
	}
}

function calendarClick(e) {
	evt = (e)? e : window.event;
	evt.cancelBubble = true;
}

function calendarMouseOver(e) {
	if (closeCalendarTimeOut) {
		clearTimeout(closeCalendarTimeOut);
		closeCalendarTimeOut = 0;
	}
}

function calendarMouseOut(e) {
	if (closeCalendarTimeOut) {
		clearTimeout(closeCalendarTimeOut);
	}
	closeCalendarTimeOut = setTimeout('hideCalendar()', 5000);
}

function hideCalendar() {
	var calLeer = document.getElementById('candarLeer');
	if (calLeer) calLeer.style.visibility = 'hidden';
	closeCalendarTimeOut = 0;
}


function switchMonthTo(month, year) {
	var calLeer = document.getElementById('candarLeer');
	if (calLeer) {
		// заполняем нужным кодом...
		// смотрим какая дата нас интересует
		var currDate = getCalendarDate(activeCalendarName);
		// собственно вызываем код
		calLeer.innerHTML = calendarHTML(month, year, currDate);
	}
}

function calendarHTML(month, year, currDate) {
	// смотрим этот ли месяц показываем
	var isThisMonth = (currDate)? (currDate.getMonth() == month && currDate.getFullYear() == year) : false;

	// генерирует html-код для указанного месяца

	// устанавливаем месяц, который будем рисовать
	var drawMonth = new Date(); drawMonth.setMonth(month, 1); drawMonth.setYear(year); drawMonth.setDate(1);

	// переменные для кнопок навигации по месяцам/годам
	var thisMonth = drawMonth.getMonth();
	var nextMonth = (thisMonth == 11)? 0 : thisMonth + 1;
	var prevMonth = (thisMonth == 0)? 11 : thisMonth - 1;
	var thisYear = drawMonth.getFullYear();
	var nextMonthYear = (thisMonth == 11)? thisYear + 1 : thisYear;
	var nextYear = thisYear + 1;
	var prevMonthYear = (thisMonth == 0)? thisYear - 1 : thisYear;
	var prevYear = thisYear - 1;

	// запихиваем в строку весь код - открываем таблицы...
	var calendarCode = '<table cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #000000;">';
	calendarCode += '<tr><td class="purpleCell"><table cellpadding="0" cellspacing="3" border="0" width="100%">';
	// здесь указываем клик на прошлый год
	calendarCode += '<tr><td><img src="' + imagesFolder + 'arr-prev.gif" width="12" height="12" border="0" onClick="switchMonthTo(' + thisMonth + ', ' + prevYear + ')" style="cursor: pointer; cursor: hand;" /><\/td>';
	// текущий (показываемый) год
	calendarCode += '<td align="center" class="purpleCell">' + thisYear + '<\/td>';
	// клик на следующий год
	calendarCode += '<td align="right"><img src="' + imagesFolder + 'arr-next.gif" width="12" height="12" border="0" onClick="switchMonthTo(' + thisMonth + ', ' + nextYear + ')" style="cursor: pointer; cursor: hand;" /><\/td><\/tr>';
	// клик на предыдущий месяц
	calendarCode += '<tr><td><img src="' + imagesFolder + 'arr-prev.gif" width="12" height="12" border="0" onClick="switchMonthTo(' + prevMonth + ', ' + prevMonthYear + ')" style="cursor: pointer; cursor: hand;" /><\/td>';
	// текущий месяц
	calendarCode += '<td align="center" class="purpleCell">' + calendarNames.month[thisMonth] + '<\/td>';
	// клик на следующий месяц
	calendarCode += '<td align="right"><img src="' + imagesFolder + 'arr-next.gif" width="12" height="12" border="0" onClick="switchMonthTo(' + nextMonth + ', ' + nextMonthYear + ')" style="cursor: pointer; cursor: hand;" /><\/td><\/tr>';
	calendarCode += '<\/table><\/td><\/tr>';

	// начинаем таблицу самого месяца
	calendarCode += '<tr><td style="border-top: 1px solid #808080;" bgcolor="#ffffff"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>';
	calendarCode += '<td class="whiteCell">&nbsp;<\/td><td class="whiteCell">&nbsp;<\/td>';
	for (var i = 0; i < calendarNames.weekday.length; i++) {
		var styleClass = (i < calendarNames.weekday.length - 1)? 'whiteCell' : 'sundayCell';
		calendarCode += '<td class="' + styleClass + '" align="right">' + calendarNames.weekday[i] + '<\/td>';
	}
	calendarCode += '<td class="whiteCell">&nbsp;<\/td><td class="whiteCell">&nbsp;<\/td><\/tr>';

	// разделительная полоска
	calendarCode += '<tr><td height="1" nowrap="nowrap">' + pixelSpacer + '<\/td>';
	calendarCode += '<td height="1" nowrap="nowrap" colspan="9" bgcolor="#808080">' + pixelSpacer + '<\/td>';
	calendarCode += '<td height="1" nowrap="nowrap">' + pixelSpacer + '<\/td><\/tr>';

	// сам месяц
	calendarCode += '<tr><td class="whiteCell"><br /><\/td><td class="whiteCell"><br /><\/td>';

	// рисуем пустые ячейки если нужно...
	var daysToStart = (drawMonth.getDay() == 0)? 7 : drawMonth.getDay();

	var tmpDate = new Date(drawMonth);
	tmpDate.setDate(0);
	var prevMonthMaxDate = tmpDate.getDate();

	for (var i = 0; i < daysToStart - 1; i++){
		var datePrev = prevMonthMaxDate - (daysToStart -2 -i);
		calendarCode += '<td class="greyCell" onClick="setDateFromCalendar(' + datePrev + ', ' + prevMonth + ', ' + prevMonthYear + ');" style="cursor: pointer; cursor: hand;" onMouseOver="this.className = \'greyCell overCell\';" onMouseOut="this.className = \'greyCell\';">'
			+ datePrev
			+ '<\/td>';
	}

	// собственно циферки
	for (var i = 1; i < 33; i++) {
		drawMonth.setDate(i);
		if (isThisMonth && i == currDate.getDate()) {
			calendarCode += '<td class="blackCell" align="right">' + i + '<\/td>';
		} else {
			if (drawMonth.getMonth() == thisMonth) {
				var styleClass = (drawMonth.getDay() == 0)? 'sundayCell' : 'whiteCell';
				calendarCode += '<td class="' + styleClass + '" align="right" onMouseOver="this.className = \'overCell\';" onMouseOut="this.className = \'' + styleClass + '\';" onClick="setDateFromCalendar(' + i + ', ' + month + ', ' + year + ');" style="cursor: pointer; cursor: hand;">' + i + '<\/td>';
			} else break;
		}
		if (drawMonth.getDay() == 0) calendarCode += '<td class="whiteCell"><br /><\/td><td class="whiteCell"><br /><\/td><\/tr><tr><td class="whiteCell"><br /><\/td><td class="whiteCell"><br /><\/td>';
	}

	// опять рисуем пустые ячейки
	if (drawMonth.getDay() != 1) {
		var daysToEnd = 8 - ((drawMonth.getDay() == 0)? 7 : drawMonth.getDay());

		for (var i = 0; i < daysToEnd; i++){
			var dateNext = i + 1;
			calendarCode += '<td class="greyCell" onClick="setDateFromCalendar(' + dateNext + ', ' + nextMonth + ', ' + nextMonthYear + ');" style="cursor: pointer; cursor: hand;" onMouseOver="this.className = \'greyCell overCell\';" onMouseOut="this.className = \'greyCell\';">'
				+ dateNext
				+ '<\/td>';
		}
	}

	calendarCode += '<td class="whiteCell"><br /><\/td><td class="whiteCell"><br /><\/td><\/tr><\/table><\/td><\/tr>';

	// ссылка на сегодня
	calendarCode += '<tr><td class="whiteCell" onMouseOver="this.className = \'overCell\';" onMouseOut="this.className = \'whiteCell\';" style="border-top: 1px solid #000000; padding: 3px; cursor: pointer; cursor: hand;" align="center" onClick="setTodayFromCalendar();">'+calendarNames.today+'<\/td><\/tr>';

	// конец
	calendarCode += '<\/table>';

	return calendarCode;
}

function getElementPosition(elemPtr) {
	var posX = elemPtr.offsetLeft;
	var posY = elemPtr.offsetTop;
	while (elemPtr.offsetParent != null) {
		elemPtr = elemPtr.offsetParent;
		posX += elemPtr.offsetLeft;
		posY += elemPtr.offsetTop;
	}
	this.x = posX;
	this.y = posY;
	return this;
}

function addEvent(elementPtr, eventType, eventFunc) {
	if (elementPtr.addEventListener) {
		elementPtr.addEventListener(eventType, eventFunc, false);
	} if (elementPtr.attachEvent) {
		elementPtr.attachEvent('on' + eventType, eventFunc);
	} else {
		// что делать если ни то ни другое не поддерживается
	}
}

addEvent(document, 'click', hideCalendar);
addEvent(window, 'resize', hideCalendar);
addEvent(window, 'scroll', hideCalendar);
