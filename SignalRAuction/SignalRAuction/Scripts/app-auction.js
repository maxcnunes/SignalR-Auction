
// Store interval function
var intervalTimeRemaining,
    endTime;


function getRemainingTime() {

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
}

$(function () {
    // Get the proxy
    var auctionHub = $.connection.auctionHub;


    // Declare a function on the chat hub so the server can invoke it
    auctionHub.client.auctionRefresh = function (model) {

        $('#prod-value-bid').val(model.ValueNextBid);
        $('#total-bids span').text(model.BidsTotal);
        //$('#value-time').text(model.TimeRemaining.toString().toHHMMSS());

        endTime = new Date(model.EndTimeFullText);

        $('#value-time').text(getRemainingTime());

        initializeDecrementTimeRemaining();
    };

    auctionHub.client.notifyNewBid = function (notification) {
        $('#recent-bids ul').prepend('<li>' + notification + '</li>');
    };

    auctionHub.client.addMessage = function (message) {
        $('#message').append('<p>' + message + '</p>');
    };

    $("#prod-btn-bid").click(function () {
        if (!validBid()) {
            showMessageNotification('Who are you?');
            return;
        }

        auctionHub.server
            .placeBid($('#prod-value-bid').val(), $('#user input:text').val())
            .done(function () {
                showMessageNotification('Done');
            });

        auctionHub.server
            .reset().done(function () {
                showMessageNotification('Auction was reseted');
            });
    });

    $("#btn-reset").click(function (e) {

        auctionHub.server
            .resetCurrentAuction().done(function () {
                showMessageNotification('Auction was reseted');
            });

        e.preventDefault();
    });

    // Start connection
    $.connection.hub.start().done(function () {
        auctionHub.server.callRefresh();
    });

    
});


function validBid() {
    var value = $('#prod-value-bid').val(),
        user = $('#user input:text').val();

    return value != '' && user != '';
}

function initializeDecrementTimeRemaining() {
    // Clear interval if already exists
    clearInterval(intervalTimeRemaining);

    // Set interval function
    intervalTimeRemaining = setInterval(decrementTimeRemaining, 1000);
}

function decrementTimeRemaining() {

    var timeRemaining = decrementTimePerSeconds($('#value-time').text());

    $('#value-time').text(timeRemaining);

    if (isTimeCompleted(timeRemaining)) {
        clearInterval(intervalTimeRemaining);
    }
}

function getTypeTime(secs) {
    if (secs > 86400) {
        return 'days';
    } else if (secs > 3600) {
        return 'hours';
    } else if (secs > 60) {
        return 'mins';
    } else {
        return 'secs';
    }
}

String.prototype.toHHMMSS = function () {
    sec_numb = parseInt(this);
    var hours = Math.floor(sec_numb / 3600);
    var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
    var seconds = sec_numb - (hours * 3600) - (minutes * 60);

    return formatHHMMSS(hours, minutes, seconds);
}

function decrementTimePerSeconds(textTime) {

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
}

function formatHHMMSS(hours, minutes, seconds) {
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }

    return hours + ':' + minutes + ':' + seconds;
}

function isTimeCompleted(textTime) {
    var time = textTime.split(':');

    var hours = parseInt(time[0]),
        minutes = parseInt(time[1]),
        seconds = parseInt(time[2]);

    return (hours == 0 && minutes == 0 && seconds == 0);
}