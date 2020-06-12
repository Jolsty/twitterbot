// Get current elapsed time in MS from server
var updatedTimeMS = JSON.parse($('#updatedTimeMS')[0].innerHTML);
// Update immediately and then every second
updateTime();
setInterval(updateTime, 1000);

function updateTime() {
    var elapsedTimeMS = new Date().getTime() - updatedTimeMS;
    var formattedTime = formatTime(elapsedTimeMS);
    // append formattedTime to innerhtml
    var timeContainer = $(".formattedTime");
    timeContainer[0].innerHTML = formattedTime + " ago";
}

// Convert our time in ms to a human readable date
function convertMS(ms) {
    var day, hour, minute, seconds;
    seconds = Math.floor(ms / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}

// Show only what's necessary
function formatTime(ms) {
    var time = convertMS(ms);
    var timeFormatted = "";
    if (time.day > 0) {
        if (time.day == 1) timeFormatted = time.day + " day";
        else timeFormatted = time.day + " days";
    }
    else if (time.hour > 0 ) {
        if (time.hour == 1) timeFormatted = time.hour + " hour";
        else timeFormatted = time.hour + " hours";
    }
    else if (time.minute > 0) {
        if (time.minute == 1) timeFormatted = time.minute + " minute";
        else timeFormatted = time.minute + " minutes";
    } else {
        if (time.seconds == 1) timeFormatted = time.seconds + " second";
        else timeFormatted = time.seconds + " seconds";
    }
    return timeFormatted;
}
