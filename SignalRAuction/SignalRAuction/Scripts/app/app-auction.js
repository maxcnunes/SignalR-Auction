
// Define the auction module
ns_sra.app.auction = (function (appMain, utilTimer) {

    // Private members
    var
        // Get the proxy
        auctionHub = $.connection.auctionHub,

        // Initiialize
        init = function () {
            
        },

        refreshAuction = function (model) {
            $('#prod-value-bid').val(model.ValueNextBid);
            $('#total-bids span').text(model.BidsTotal);

            $('#value-time').text(utilTimer.getRemainingTime(new Date(model.EndTimeFullText)));

            utilTimer.initializeDecrementTimeRemaining();
        },

        notifyNewBid = function (notification) {
            $('#recent-bids ul').prepend('<li>' + notification + '</li>');
        },


        validBid = function () {
            var value = $('#prod-value-bid').val(),
                user = $('#user input:text').val();

            return value !== '' && user !== '';
        };

    // Call when a instance of the module is created
    init();

    // Public members
    return {
        validBid: validBid,
        refreshAuction: refreshAuction,
        notifyNewBid: notifyNewBid
    };
});







$(function () {
    var appMain = ns_sra.app.main(),
        utilTimer = ns_sra.util.timer(),
        appAuction = ns_sra.app.auction(appMain, utilTimer);


    // Declare a function on the chat hub so the server can invoke it
    auctionHub.client.auctionRefresh = function (model) {
        appAuction.refreshAuction(model);
    };

    auctionHub.client.notifyNewBid = function (notification) {
        appAuction.notifyNewBid(notification);
    };

    auctionHub.client.addMessage = function (message) {
        $('#message').append('<p>' + message + '</p>');
    };

    $("#prod-btn-bid").click(function () {
        if (!appAuction.validBid()) {
            appMain.showMessageNotification('Who are you?');
            return;
        }

        auctionHub.server
            .placeBid($('#prod-value-bid').val(), $('#user input:text').val())
            .done(function () {
                appMain.showMessageNotification('Done');
            });

        auctionHub.server
            .reset().done(function () {
                appMain.showMessageNotification('Auction was reseted');
            });
    });

    $("#btn-reset").click(function (e) {

        auctionHub.server
            .resetCurrentAuction().done(function () {
                appMain.showMessageNotification('Auction was reseted');
            });

        e.preventDefault();
    });

    // Start connection
    $.connection.hub.start().done(function () {
        auctionHub.server.callRefresh();
    });
});