// $ID: history.js, Tue, 10 Dec 2019 14:01:11, Leonid 'n3o' Knyazev $
;$(function () {
    const person_id = $('input[name=_person_id_]').val();

    if (person_id) {
        $.ajax({
            url: '/people/history/fields/',
            data: {
                person_id: $('input[name=_person_id_]').val()
            },
            success: function (history) {
                if (Object.keys(history).length > 0) {
                    const $fields = $('[data-history]');

                    $.each($fields, function (i, field) {
                        const fieldName = field.getAttribute('data-history');
                        const fieldHistory = history[fieldName] || [];

                        if (fieldHistory.length > 0) {
                            const $value = $(field);

                            const $history = $('<span></span>', {
                                class: 'history'
                            }).html('<a href="#" onclick="e.preventDefault()">(история)</a> ');

                            const $table = $('<table></table>', {
                                class: 'history-table',
                                cellSpacing: 0,
                                cellPadding: 0
                            });

                            $('<thead></thead>').html(
                                '<tr>' +
                                '<th>кто</th>' +
                                '<th>когда</th>' +
                                '<th>было</th>' +
                                '<th>стало</th>' +
                                '</tr>'
                            ).appendTo($table);

                            const $tableBody = $('<tbody></tbody>');

                            fieldHistory.map(item => {
                                $(
                                    '<tr>' +
                                    '<td>' +
                                    '<a href="/people/show.pxml?id=' + item.user_id + '" target="_blank">' + item.user_login + '</a>' +
                                    '</td>' +
                                    '<td>' + item.dt_insert + '</td>' +
                                    '<td>' + item.from + '</td>' +
                                    '<td>' + item.to + '</td>' +
                                    '</tr>'
                                ).appendTo($tableBody);
                            });

                            $tableBody.appendTo($table);

                            $history.tooltipster({
                                content: $table,
                                theme: 'tooltipster-shadow',
                                //maxWidth: 400,
                                side: 'right',
                                trigger: 'click',
                                interactive: true
                            });

                            $history.appendTo($value);
                        }
                    });
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
    }
});