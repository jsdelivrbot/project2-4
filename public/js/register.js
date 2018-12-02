$(document).ready(function () {
    $("#email").blur(function () {
        //("This input field has lost its focus.");
        var email = $(this).val();
        var matchid = -1;
        $.getJSON("/getLogin?email=" + email, function (data) {
            matchid = data.user_account_id;
                //if exists, display message that email must be unique
                if (matchid != -1) {
                    $('#email_msg').text('This email is already in use.');
                    if (!($('#email_msg').hasClass('alertmsg'))) {
                        $('#email_msg').addClass('alertmsg');
                    }
                }
                else {
                    $('#email_msg').text("We'll never share your email with anyone else.");
                    if ($('#email_msg').hasClass('alertmsg')) {
                        $('#email_msg').removeClass('alertmsg');
                    }
                }
            },
            function (jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            });
    });

    $('#UserList').DataTable({
        "order": [[1, "asc"]]
    });
});

function isEmpty(obj) {
    if (!obj) {
        return true;
    }

    if (!(typeof (obj) === 'number') && !Object.keys(obj).length) {
        return true;
    }

    return false;
}