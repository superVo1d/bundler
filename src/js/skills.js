$(function() {
    var config = {
        '.chosen-select': {no_results_text: "������ �� �������"}
    }
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }
});

