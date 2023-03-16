$(function(){
  /*
   * Управление языками в профайле Интранета
   */
   
  function bakeLanguage(identifierx, level) {

    hideLanguage(identifierx);
  
    if(typeof(level) === 'undefined') {
      var level = 0;
    }

    //updateLanguageLevel(identifierx, level)
  
    var languagesListEl = $('#languages_list');
    // окей, здесь какая-то хрень с кодом, пользуемся DOM-функциями для построения
    
    // var newLanguage = $("<div id='langblock" + identifierx + "' style='margin-bottom:-10px;' />");
    // newLanguage.html('<br />' + identifierx + ' <small><a href="#" rel="'+identifierx+'" class="lang_del_button">удалить</a></small><input type="hidden" name="' + identifierx + '" id="field' + identifierx + '" value="0" /><table><tr><td style="padding-right:4px"><div class="plusminus" onselectstart="return false" style="cursor:pointer;cursor:hand" onclick="slider' + identifierx + '.setValueBy(-5)">-</div></td><td><div id="slidercontainer' + identifierx + '" class="slidercontainer"><div id="container' + identifierx + '" class="container"><div class="pointer_wrapper"></div><div id="pointer' + identifierx + '" class="pointer selected"><div class="scroller"><img src="/i/x.gif" width="16" height="20" /></div></div></div></div></td><td><div class="plusminus" onselectstart="return false" style="cursor:pointer;cursor:hand" onclick="slider' + identifierx + '.setValueBy(5)">+</div></td></tr></table><br style="clear:both" />');

    var newLanguage =
        `<li class="field__item" id='${"langblock" + identifierx}'>
            <div class="field__name"><span>${identifierx.charAt(0).toUpperCase() + identifierx.slice(1)}</span></div>
            <div class="field__input">
              <div class="edit-lang-block">
                ${'<input type="range" class="styled-slider slider-progress"' + 
                                'id="' + 'field' + identifierx + '"' +
                            'name="' + identifierx + '"' +
                            'data-name="' + identifierx + '"' +
                            'data-value="' + level + '" data-edit="true"' +
                            'style="--value:' + level + '; --min:0; --max:100;"' +
                  '           />' +
                '<div class="edit-delete"><a href="#" rel="'+identifierx+'" class="lang_del_button button button-2 button-delete">удалить</a></div>'}
              </div>
            </div>
          </li>`;


    languagesListEl.append(newLanguage);

    $(`#field${identifierx}`)
        .on('input', function() {
          updateLanguageLevel(identifierx, $(this).val());
        })
        .val(level);
    
    //eval('var slider'+ identifierx+' = new Control.Slider("pointer'+ identifierx + '","container' + identifierx + '",{range: $R(0,100),values: $R(0,100).toArray(),sliderValue: ' + level + ',trackLength: navigator.appName == "Microsoft Internet Explorer" ? 182 : false,onSlide: function(index){ptjs(\'field' + identifierx +'\').value = index;updateLanguageLevel(\''+identifierx+'\',index);},onChange: function(index){ptjs(\'field'+ identifierx +'\').value = index;updateLanguageLevel(\''+identifierx+'\',index);}});');
  }
  
  function bakeLanguageStatic(identifierx, level) {
    if(identifierx == 'русский')
      return;
  
    hideLanguage(identifierx);
  
    if(typeof(level) === 'undefined') {
      var level = 0;
    }
  
    var languagesListEl = $('#languages_list');
    // окей, здесь какая-то хрень с кодом, пользуемся DOM-функциями для построения
    
    var newLanguage = $("<div id='langblock" + identifierx + "' style=\"position:relative\" />");
    newLanguage.html('<span class="lang_identifier">' + identifierx + '</span> <input type="hidden" name="' + identifierx + '" id="field' + identifierx + '" value="0" /><table><tr><td><div id="slidercontainer' + identifierx + '" class="slidercontainer" style="margin-left:-10px"><div id="container' + identifierx + '" class="container"><div class="pointer_wrapper"></div><div id="pointer' + identifierx + '" class="pointer selected"><div class="scroller"><img src="/i/x.gif" width="16" height="20" /></div></div></div></div></td></tr></table><br style="clear:both" />');

    languagesListEl.append(newLanguage);
    
    eval('var slider'+ identifierx+' = new Control.Slider("pointer'+ identifierx + '","container' + identifierx + '",{range: $R(0,100),values: $R(0,100).toArray(),sliderValue: ' + level + ',trackLength: navigator.appName == "Microsoft Internet Explorer" ? 182 : false,disabled: true,onSlide: function(index){return false;},onChange: function(index){return false;}});');
  }
  
  var currentLanguages = $('input[name="languages"]').val();
  
  var availableLanguages = '';
  
  function hideLanguage(identifierx) {
    $('select[name="languages_add"] option').each(function(){
      if($(this).attr('value') == identifierx) {
        $(this).hide();
      }
    });
  }
  
  function showLanguage(identifierx) {
    var shown = 0;
    
    $('select[name="languages_add"] option').each(function(){
      if($(this).attr('value') == identifierx) {
        $(this).show();
        shown = 1;
      }
    });    
    
    if(!shown) {
      var prefixContainer = $('select[name="languages_add"] option[value=""]');
      $('<option value="' + identifierx + '">' + identifierx + '</option>').insertBefore(prefixContainer);
    }
  }
  
  function updateLanguageLevel(languageName, level) {
    console.log(currentLanguages, languageName, level)

    for(var i = 0; i < currentLanguages.length; i++) {
      if(currentLanguages[i].title == languageName) {
        currentLanguages[i].level = level;
      }
    }

    $('input[name="languages"]').val(JSON.stringify(currentLanguages.filter(l => l.level.toString() !== '0'), null, 0));
    // console.log(JSON.stringify(currentLanguages, null, 0))
  }
  
  function deleteLanguage(languageName) {
      if ($('#languages_list > .field__item').length <= 6) {
        $('#languages_add_submit').removeClass('disabled').removeAttr('disabled');
      }

      var newLanguages = [];
    
    for(var i = 0; i < currentLanguages.length; i++) {
      if(currentLanguages[i].title != languageName) {
        newLanguages.push(currentLanguages[i]);
      }
    }    
    
    currentLanguages = newLanguages.filter(l => l.level.toString() !== '0');

    $('input[name="languages"]').val(JSON.stringify(currentLanguages, null, 0));
    
    $('#langblock' + languageName).remove();
  }
  
  if(typeof(LANGUAGES_EDIT_TOOLCHAIN) !== 'undefined') {
    $.ajax({
      url: '/people/languages.pxml',
      dataType: 'json',
      async: false,
      success: function(data) {
        if (currentLanguages != '') {
          currentLanguages = $.parseJSON(currentLanguages);
        } else {
          currentLanguages = [];
        }

        data.sort();

        for (var i = 0; i < data.length; i++) {
          //availableLanguages += '<a class="dashed" href="#">' + data[i].language + '</a> ';
          var found = 0;

          for (var j = 0; j < currentLanguages.length; j++) {
            if (currentLanguages[j].title == data[i].language) {
              found = 1;
            }
          }

          if (!found) {
            availableLanguages += '<option value="' + data[i].language + '">' + data[i].language + '</option>';
          }
        }


        var languagesForm = $('<div/>').attr('id', 'languages-select');
        // var languagesContainer = $('<div/>').addClass('select select-inline').attr('id', 'languages-select');
        //languagesForm = languagesContainer.append($('<div/>').addClass('select-options'));

        // <div className="field__input people__selectors">
        //   <div className="select select-inline" style="margin-left: 0; color: #000;">
        //     <div className="select-options"><select name="citizenship">
        //       <option value=""></option>
        //       <option value="Россия" selected="">Россия</option>
        //     </select></div>
        //     <div className="select-selected">Россия</div>
        //     <div className="select-items select-hide">
        //       <div className="select-items-container">
        //         <div className="same-as-selected">Россия</div>
        //         <div>Украина</div>
        //       </div>
        //     </div>
        //   </div>
        // </div>

        languagesForm.append(
            '<div class="select select-inline"><div class="select-options"><select name="languages_add">' + availableLanguages + '<option value="">(другой)</option></select></div></div> ' +
            '<button id="languages_add_submit" class="button button-2">Добавить</button>' +
            '<div class="field__input-text" id="languages_add_span"></div>');

        languagesForm.insertAfter('input[name="languages"]');

        $('select[name="languages_add"]').live('change', function () {
          if ($(this).val() == "") {
            $("#languages_add_span").html('<input type="text" name="languages_add" id="languages_add" />');
          } else {
            $("#languages_add_span").html('');
          }
        });

        if ($('select[name="languages_add"] option').size() == 1) {
          $("#languages_add_span").html('<input type="text" name="languages_add" id="languages_add" />');
        }

        $('a.lang_del_button').live('click', function () {
          var languageName = $(this).attr('rel');
          showLanguage(languageName);
          deleteLanguage(languageName);
          return false;
        });

        for (var i = 0; i < currentLanguages.length; i++) {
          bakeLanguage(currentLanguages[i].title, currentLanguages[i].level);
        }

        if ($('#languages_list > .field__item').length === 6) {
          $('#languages_add_submit').addClass('disabled').attr('disabled', 'disabled')
        }

        $('#languages_add_submit').live('click', function (e) {
          var el = $('input[name="languages_add"]');
          var el_type = 'input';

          if ($('#languages_list > .field__item').length === 5) {
            $(this).addClass('disabled').attr('disabled', 'disabled')
          }

          if (el.size() == 0) {
            el = $('select[name="languages_add"]');
            el_type = 'select';
          }

          var languageName = el.val();

          var hasLanguage = false;

          for (var i = 0; i < currentLanguages.length; i++) {
            if (currentLanguages[i].title == languageName) {
              hasLanguage = true;
            }
          }

          if (!hasLanguage) {
            languageName = languageName.toLowerCase();

            if (languageName == 'русский')
              return;

            bakeLanguage(languageName);
            console.log(languageName)
            currentLanguages.push({"title": languageName, "level": 0});

            if (el_type == 'input') {
              $('input[name="languages_add"]').val("")
            }
          }

          e.preventDefault();

          return false;
        });
      }
    });
  } else {
      var languages_json = $("span.languages_placeholder").html();
      currentLanguages = $.parseJSON(languages_json);
      
      if($.isArray(currentLanguages)) {
        for(var i = 0; i < currentLanguages.length; i++) {
          bakeLanguageStatic(currentLanguages[i].title, currentLanguages[i].level);
        }
      }
  }
});