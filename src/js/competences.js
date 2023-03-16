// $ID: competences.js.js, 07 Sep 2018, 12:31, Leonid 'n3o' Knyazev $

/*
 * Управление компетенциями в профайле Интранета
 */
;$(function() {
  const $root = $('.competences');

  if ($root.length) {
    const person_id = $root.attr('data-person');

    $.ajax({
      url: '/people/competence.pxml?person_id=' + person_id,
      dataType: 'json',
      async: false,
      success: data => {
        const {available} = data;

        let {competences} = data;

        const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        const MIN_YEAR = 2018;
        const MAX_YEAR = (new Date().getFullYear()) + 5;
        const EDIT = $root.hasClass('competences_edit');

        // make form
        const $form = $('<div/>').addClass('competences__form field__input people__selectors');
        const $select = $('<select class="competences__list" name="competences_list"/>');

        if (EDIT) {
          $select.append($('<option value="">&mdash;</option>'));

          $.map(available, function (competence) {
            $select.append($('<option value="' + competence.id + '">' + competence.name + '</option>'));
          });

          const $selectWrapper = $(`<div class="select select-inline" style="margin-left: 0; color: #000;">
          <div class="select-options">
              ${ $select.prop('outerHTML') }
          </div>
        </div>`);

          $form.append($selectWrapper);
          $form.append($('<button class="competences__add button button-2">Добавить</button>'));

          $root.append($form);
        }


        // make input
        const $competences = $('<input type="hidden" name="competences" value="" />');

        if (EDIT) {
          $root.append($competences);
        }


        // bind events
        $root.on('click', '.competences__add', function (e) {
          e.preventDefault();

          const value = $('select[name="competences_list"]').val();

          if (value === '') {
            return false;
          }

          const selected = available.filter(function (item) {
            return item.id === value;
          });

          if (selected.length) {
            const [ competence ] = selected;

            competences.push({
              ...competence,
              value: '',
              month: null,
              year: null
            });

            $competences.val(JSON.stringify(competences));

            render();
          }

          $select.val('');

          return false;
        });

        $root.on('click', '.competence__remove', function (e) {
          e.preventDefault();

          const $this = $(e.target);
          const $parent = $this.parents('.competence');
          const index = $parent.data('index');

          competences.splice(index, 1);

          $competences.val(JSON.stringify(competences));

          render();
        });

        $root.on('keyup', '.competence__input', function (e) {
          e.preventDefault();

          const $this = $(e.target);
          const $parent = $this.parents('.competence');

          const index = $parent.data('index');
          const value = parseFloat($this.val().replace(',', '.'));

          update(index, {
            value: value
          });
        });

        $root.on('change', '.competence__month', function (e) {
          e.preventDefault();

          const $this = $(e.target);
          const $parent = $this.parents('.competence');

          const index = $parent.data('index');
          const value = parseInt($this.val());

          update(index, {
            month: value
          });
        });

        $root.on('change', '.competence__year', function (e) {
          e.preventDefault();

          const $this = $(e.target);
          const $parent = $this.parents('.competence');

          const index = $parent.data('index');
          const value = parseInt($this.val());

          update(index, {
            year: value
          });
        });


        // make list
        const $used = $('<div/>', {
          'class': 'competences__used'
        }).appendTo($root);


        // update
        function update(index, data) {
          const competence = competences[index];

          competences.splice(index, 1, {
            ...competence,
            ...data
          });

          $competences.val(JSON.stringify(competences));
        }

        // render
        function render() {
          $used.html('');

          $.map(competences, function (competence, index) {
            $used.append(print(competence, index));
          });
        }

        function print(competence, index) {
          const $competence = $('<div/>', {
            'data-index': index
          }).addClass('competence');

          const $title = $('<div></div>').addClass('competence__title');

          if (EDIT) {
            $title.append('<div class="field__value"><span>' + competence.name + '</span></div>');
          } else {
            const title = [];

            title.push('<span>');
            title.push(competence.name);
            title.push('&nbsp;');

            title.push('<span class="'+ (parseFloat(competence.value) >= 4 ? 'green' : 'red') +'">');
            title.push(competence.value.replace('.', ','));
            title.push('</span>');

            title.push('</span>');

            title.push('<br/>');

            title.push('<small>');
            title.push((MONTHS[(parseInt(competence.month) - 1)]).toLowerCase());
            title.push('&nbsp;');
            title.push(competence.year);
            title.push('</small>');

            $title.append(title.join(''));
          }

          $competence.append($title);

          if (EDIT) {
            $title.append('<button class="competence__remove button button-2 button-delete" onclick="e.preventDefault();">удалить</button>');

            const $valueWrapper = $('<div></div>').addClass('competence__value');

            const $value = $('<div></div>').addClass('field__input people__selectors');

            // value
            $valueWrapper.append('<div class="field__input-text"><input class="competence__input" type="text" name="competence__input" value="' + competence.value + '" autocomplete="off"/></div>');

            // month
            const $months = $('<select class="competence__month" name="competence__month"/>');
            $months.append($('<option value="">&mdash;</option>'));

            $.map(MONTHS, function (month, index) {
              const $item = $('<option value="' + (index + 1) + '">' + month.toLowerCase() + '</option>');

              if (competence.month && parseInt(competence.month) === (index + 1)) {
                $item.prop('selected', true);
              }

              $months.append($item);
            });

            $value.append(`
                <div class="select select-inline">
                    ${$("<div />").append($months.clone()).html()}
                </div>
            `);

            // year
            const $years = $('<select class="competence__year" name="competence__year"/>');
            $years.append($('<option value="">&mdash;</option>'));

            for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
              const $item = $('<option value="' + year + '">' + year + '</option>');

              if (competence.year && parseInt(competence.year) === year) {
                $item.prop('selected', true);
              }

              $years.append($item);
            }

            $value.append(`
                <div class="select select-inline">
                    ${$("<div />").append($years.clone()).html()}
                </div>
            `);

            // append competence
            $competence.append($valueWrapper.append($value));
          }

          return $competence;
        }


        // init
        $competences.val(JSON.stringify(competences));

        render();
      }
    });
  }
});
