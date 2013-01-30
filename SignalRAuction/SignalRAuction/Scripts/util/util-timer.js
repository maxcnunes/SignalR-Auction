// Define the auction module
ns_sra.util.timer = (function () {

    // Private members
    var
        // Store interval function
        intervalTimeRemaining,

        // Initiialize
        init = function () {

        },


        getRemainingTime = function (endTime) {

            now = new Date();
            kickoff = endTime;// Date.parse("June 11, 2010 11:30:00");
            diff = kickoff - now;

            month = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
            days = Math.floor(diff / (1000 * 60 * 60 * 24));
            hours = Math.floor(diff / (1000 * 60 * 60));
            mins = Math.floor(diff / (1000 * 60));
            secs = Math.floor(diff / 1000);

            //MM = month;
            //dd = days -  month * 30;
            dd = days;
            hh = hours - days * 24;
            mm = mins - hours * 60;
            ss = secs - mins * 60;

            return formatHHMMSS(hh, mm, ss);
        },

        initializeDecrementTimeRemaining = function () {
            // Clear interval if already exists
            clearInterval(intervalTimeRemaining);

            // Set interval function
            intervalTimeRemaining = setInterval(decrementTimeRemaining, 1000);
        },

        decrementTimeRemaining = function () {

            var timeRemaining = decrementTimePerSeconds($('#value-time').text());

            $('#value-time').text(timeRemaining);

            if (isTimeCompleted(timeRemaining)) {
                clearInterval(intervalTimeRemaining);
            }
        },

        getTypeTime = function (secs) {
            if (secs > 86400) {
                return 'days';
            } else if (secs > 3600) {
                return 'hours';
            } else if (secs > 60) {
                return 'mins';
            } else {
                return 'secs';
            }
        },

        decrementTimePerSeconds = function (textTime) {

            var time = textTime.split(':');

            var hours = parseInt(time[0]),
                minutes = parseInt(time[1]),
                seconds = parseInt(time[2]);

            if (seconds == 0) {
                seconds = 59;

                if (minutes == 0) {
                    minutes = 59;

                    if (hours > 0) {
                        hours -= 1;
                    }
                } else {
                    minutes -= 1;
                }

            } else {
                seconds -= 1;
            }

            return formatHHMMSS(hours, minutes, seconds);
        },

        formatHHMMSS = function (hours, minutes, seconds) {
            if (hours < 10) { hours = "0" + hours; }
            if (minutes < 10) { minutes = "0" + minutes; }
            if (seconds < 10) { seconds = "0" + seconds; }

            return hours + ':' + minutes + ':' + seconds;
        },

        isTimeCompleted = function (textTime) {
            var time = textTime.split(':');

            var hours = parseInt(time[0]),
                minutes = parseInt(time[1]),
                seconds = parseInt(time[2]);

            return (hours == 0 && minutes == 0 && seconds == 0);
        };

    // Call when a instance of the module is created
    init();


    // Public members
    return {
        getRemainingTime: getRemainingTime,
        initializeDecrementTimeRemaining: initializeDecrementTimeRemaining,
        decrementTimeRemaining: decrementTimeRemaining,
        getTypeTime: getTypeTime,
        decrementTimePerSeconds: decrementTimePerSeconds,
        formatHHMMSS: formatHHMMSS,
        isTimeCompleted: isTimeCompleted
    };
});