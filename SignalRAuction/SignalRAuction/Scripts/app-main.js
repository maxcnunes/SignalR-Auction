

$(function () {
    $("#dialog-message").dialog({
        modal: true,
        autoOpen: false,
    });
});



function showMessageNotification(message) {
    $('#dialog-message p em').text(message);
    $("#dialog-message").dialog("open");
}
