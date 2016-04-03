/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');

        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
    "use strict";

    var model = {
        attendance: null,
        init: function() {
            this.attendance = JSON.parse(localStorage.attendance);
        }
    };

    var octopus = {

        init: function() {
            model.init();
            view.init(model.attendance);
            this.bindAllCheckboxes();
        },
        bindAllCheckboxes: function() {
            // When a checkbox is clicked, update localStorage
            view.$allCheckboxes.on('click', function() {
                var studentRows = $('tbody .student'),
                    newAttendance = {};

                studentRows.each(function() {
                    var name = $(this).children('.name-col').text(),
                        studentCheckboxes = $(this).children('td').children('input');

                    newAttendance[name] = [];

                    studentCheckboxes.each(function() {
                        newAttendance[name].push($(this).prop('checked'));
                    });
                });
                view.countMissing();
                localStorage.attendance = JSON.stringify(newAttendance);
            });

        }
    };

    var view = {
        $allMissed: $('tbody .missed-col'),
        $allCheckboxes: $('tbody input'),
        init: function(attendance) {
            this.checkBoxes(attendance);
            this.countMissing();
        },
        checkBoxes: function(attendance) {
            // Check boxes, based on attendace records
            $.each(attendance, function(name, days) {
                var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                    dayChecks = $(studentRow).children('.attend-col').children('input');

                dayChecks.each(function(i) {
                    $(this).prop('checked', days[i]);
                });
            });
        },
        countMissing: function() {
            // Count a student's missed days
            this.$allMissed.each(function() {
                var studentRow = $(this).parent('tr'),
                    dayChecks = $(studentRow).children('td').children('input'),
                    numMissed = 0;

                dayChecks.each(function() {
                    if (!$(this).prop('checked')) {
                        numMissed++;
                    }
                });

                $(this).text(numMissed);
            });
        }
    };

    octopus.init();

}());
