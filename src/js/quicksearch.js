jQuery(function ($) {
  var cur_class = [];
  var search_input = $('input#searchInput');
  var new_workers_header = $('.new_workers_header');
  var enable_photos = $('input.enable-photos');
  var occupations = $('select[name="occupation_id"]');
  var sort = $('select[name="sort"]');
  var have_photos = false;
  var result = $('#search-result');
  var mainForm = $('#mainForm');

  const $settingsButton = $('#search-settings');

  function updateResultText() {
    const n = document.querySelectorAll('.people__list .table__row:not(.hidden)').length - 1;
    result.text(workerCase(n));

    if (n === 0) {
      $('input[type="submit"]').attr('disabled', 'disabled').addClass('disabled');
    } else {
      $('input[type="submit"]').removeAttr('disabled').removeClass('disabled');
    }
  }

  if ($('.photoCell:first').find('img').length > 0) {
    have_photos = true;
  }

  search_input.focus();

  getCookies();
  updateTable(search_input.val() + ' ' + occupations.val());


  $('#SearchInput').on('input', function(e) {
    $(this).removeClass('emptySearch');

    updateTable($(this).val());

    updateResultText();
  });


  mainForm[0].addEventListener('keydown', function(e) {
    if (e.code === 'Enter') {
      e.preventDefault();

      var visible = $('.table__row.default:visible');

      if (visible.length === 1) {
        window.location = '/people/' + visible.attr('data-login');
      } else if (visible.length > 1) {
        mainForm.submit();
      }
    }
  });

  function search(value) {
    var values = value.split(/[\s,]+/);

    $('.people__list .table__row.default').each(function () {
      var found = true;
      var data_search = $(this).attr('data-search').toLowerCase();

      values.forEach(function (e) {
        if (data_search.indexOf(e.toLowerCase()) == -1 && data_search.indexOf(e.replace('-', '')) == -1)
          found = false;
      });

      if (found) {
        $(this).removeClass('hidden');
      } else {
        $(this).addClass('hidden');
      }
    });

    updateResultText();
  }

  function workerCase(n) {
    if (10 <= n && n <= 20) return `Найдено ${n} сотрудников`;
    switch (n % 10) {
      case 1:
        return `Найден ${n} сотрудник`;
        break;
      case 2:
      case 3:
      case 4:
        return `Найдено ${n} сотрудника`;
        break;
      default:
        return `Найдено ${n} сотрудников`;
        break;
    }
  }


  function getCookies() {
    if ($.cookie('disabled') == 1) {
      cur_class.push('.disabled');
      $('.id_c_disabled').removeAttr('checked');
    } else
      $('.id_c_disabled').attr('checked', '');
    if ($.cookie('trial') == 1) {
      cur_class.push('.trial');
      $('.id_c_trial').removeAttr('checked');
    } else
      $('.id_c_trial').attr('checked', '');
    if ($.cookie('work') == 1) {
      cur_class.push('.work');
      $('.id_c_work').removeAttr('checked');
    } else
      $('.id_c_work').attr('checked', '');
    if ($.cookie('probationer') == 1) {
      cur_class.push('.probationer');
      $('.id_c_probationer').removeAttr('checked');
    } else
      $('.id_c_probationer').attr('checked', '');
  }

  $('.filters input').change(function () {
    var name = $(this).attr('id').replace('id_c_', '');

    $(`.${$(this).attr('class')}`).attr('checked', Boolean($(this).attr('checked')));

    if ($(this).attr('checked')) {
      var position = cur_class.indexOf('.' + name, '');

      if (~position)
        cur_class.splice(position, 1);
      $.cookie(name, "0");
    } else {
      cur_class.push('.' + name);
      $.cookie(name, "1");
    }

    updateTable(search_input.val());

    document.body.scrollTop = 20000;
  });

  function updateTable(value) {
    if (value != '') {
      search(value);
    } else {
      $('.people__list .table__row.default').removeClass('hidden');
    }

    if (cur_class != '') {
      $('.people__list .table__row' + cur_class).addClass('hidden');
    }

    if ($('.thead').length > 1) {
      var new_workers = $('.people__list .table__row.default.new_workers');

      if (new_workers.length - new_workers.filter('.hidden').length == 0) {
        new_workers_header.addClass('hidden');
      } else {
        new_workers_header.removeClass('hidden');
      }
    }

    updateResultText();
  }

  function showPhotos() {
    if (!have_photos) {
      $('#photoCell').show();

      $('.photoCell').each(function (e) {
        var span = $(this).find('span');

        var url = span.text();

        if (url.indexOf('/') == -1) {
          url = url + '/photo.jpg';
        }

        $('<img width="100" height="100" border="0" src="' + url + '" />').insertBefore(span);
        span.remove();
        $(this).show();
      });

      have_photos = true;
    } else {
      $('#photoCell').show();
      $('.photoCell').show();
    }
  }

  enable_photos.each((index, item) => {
    $(item).change(function () {
      if ($(this).is(':checked')) {
        showPhotos();
        enable_photos.attr('checked', '');
      } else {
        $('.photoCell').hide();
        enable_photos.removeAttr('checked');
      }
    });
  });

  sort.change(function () {
    sort.each((i, el) => $(el).val($(this).val()));
  });

  occupations.change(function () {
    var $this = $(this);
    var value = $this.val();
    var text = '';

    occupations.each((i, el) => $(el).val($this.val()));
    search_input.trigger('change');

    if (value !== '') {
      text = $(this).find('option:selected').text();
    }

    search_input.val(text);

    updateQueryStringParam('filter', text);
    updateQueryStringParam('occupation_id', value);

    search(value);
  });


  function updateQueryStringParam(key, value) {
    var baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
    var urlQueryString = document.location.search;

    var newParam = key + '=' + value;
    var params = '?' + newParam;

    // If the "search" string exists, then build params from it
    if (urlQueryString) {
      $settingsButton.addClass('active');

      var keyRegex = new RegExp('([\?&])' + key + '[^&]*');

      // If param exists already, update it
      if (urlQueryString.match(keyRegex) !== null) {
        params = urlQueryString.replace(keyRegex, "$1" + newParam);
      } else { // Otherwise, add it to end of query string
        params = urlQueryString + '&' + newParam;
      }
    }

    window.history.replaceState({}, "", baseUrl + params);
  }
});
