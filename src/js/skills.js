$(function() {
    var config = {
        '.chosen-select': {no_results_text: "Ничего не найдено"}
    }
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }
});

