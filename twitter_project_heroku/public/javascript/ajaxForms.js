/*
 * AJAX is better because we can send form without having to refresh the page
 * and the data will be sent in the background with an async request
*/

var contactForm = $("#contact");
contactForm.on('submit', function(e) {
    e.preventDefault(); // stop the browser from submitting normally
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function() {
        if (xHttp.readyState == 4) { // if request is loaded
            if (xHttp.status === 200 || xHttp.status === 304) { // 200 ok or 304 not modified
                alert(xHttp.responseText);
            }
        }
    };
    var name = $('#name')[0].value;
    var email = $('#email')[0].value;
    var subject = $('#subject')[0].value;
    var message = $('#message')[0].value;
    var data = JSON.stringify(
        {
            "name": name,
            "email": email,
            "subject": subject,
            "message": message
        }
    );
    // Clear the form
    $('#name').val('');
    $('#email').val('');
    $('#subject').val('');
    $('#message').val('');
    // Send the data to the spceified URL
    xHttp.open("POST", "/message", true);
    xHttp.setRequestHeader("Content-type", "application/json");
    xHttp.send(data);
});

var deleteTweetsForm = $("#deleteTweets");
deleteTweetsForm.on('submit', function(e) {
    e.preventDefault(); // stop the browser from submitting normally
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function() {
        if (xHttp.readyState == 4) { // if request is loaded
            if (xHttp.status === 200 || xHttp.status === 304) { // 200 ok or 304 not modified
                alert(xHttp.responseText);
            }
        }
    };
    var amount = $('#amountToDelete')[0].value;
    console.log(amount);
    var data = JSON.stringify(
        {
            "amount": amount
        }
    );
    // Bring the form back to default value
    $('#amountToDelete').val(10);
    // Send the data to specified URL
    xHttp.open("POST", "/deleteTweets", true);
    xHttp.setRequestHeader("Content-type", "application/json");
    xHttp.send(data);
});
