// Javascript Project Namespace
var ns_sra = ns_sra || {};

// Define a common group for all application process
ns_sra.app = {};

// Define a common group for all application utilities
ns_sra.util = {};

// Define the main module
ns_sra.app.main = (function () {

    // Private members
    var
        // Initiialize Dialog Message
        initializeDialog = function () {
            $("#dialog-message").dialog({
                modal: true,
                autoOpen: false,
            });
        },

        // Show Dialog Message
        showMessageNotification = function (message) {
            $('#dialog-message p em').text(message);
            $("#dialog-message").dialog("open");
        };

    // Call when a instance of the module is created
    initializeDialog();

    // Public members
    return {
        showMessageNotification: showMessageNotification
    };
});


// Execute after the JQuery is ready
$(function () {
    var appmain = ns_sra.app.main();
});