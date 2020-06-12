var infoDiv = $('.w3-block.w3-btn.w3-animate-opacity.w3-white.w3-hover-white.fontBold.hashtag');
var firstClick = true;

if (infoDiv) {
    infoDiv.click(function () {
        if (firstClick) {
            var container = $(this);
            var hashtag = container[0].innerHTML;
            console.time("getStatsHTML()");
            container.append("<div class='statsDiv'>" + getStatsHTML(hashtag) + "</div>");
            console.timeEnd("getStatsHTML()");
            firstClick = false;
        } else {
             $(".statsDiv").remove();
             firstClick = true;
         }
    });
}

function getStatsHTML(hashtag) {
    var statistics = JSON.parse($('#statistics')[0].innerHTML); //JSON.parse changes a json string into an object
    var hashtagStatsHTML;
    for (var i = 0; i < statistics.length; i++) {
        if (hashtag === statistics[i].text) {
            hashtagStatsHTML = "<br>\
                                <div class='w3-leftbar w3-border-purple'>\
                                    <div class='w3-margin-left fontLighter'>\
                                        <strong>Date</strong>: " + statistics[i].stats.created_at + "<br>\
                                        <strong>Tweet ID</strong>: " + statistics[i].stats.id_str + "<br>\
                                        <strong>Retweets</strong>: " + statistics[i].stats.retweets + "<br>\
                                        <strong>Favorites</strong>: " + statistics[i].stats.favorites +
                                   "</div>\
                                </div>\
                                <br>\
                                <div class='w3-center'>\
                                    <a class='w3-btn w3-purple w3-ripple w3-round-large' href=http://www.twitter.com/search?q=" + getFormattedHashtag(statistics[i].text) + " target='_blank' style='font-weight:lighter;'>\
                                    <i class='fa fa-external-link fa-lg fontLighter' aria-hidden='true'></i> Link to trend</a>\
                                </div>";
        }
    }
    return hashtagStatsHTML;
}

function getFormattedHashtag(hashtag) {
    var hashtagFormatted = "";
    var strArray = hashtag.split(" ");
    for (var i = 0; i < strArray.length; i++) {
        hashtagFormatted += strArray[i];
        if ( i !== (strArray.length-1) ) hashtagFormatted += "%20";
    }
    if (hashtag.substr(0, 1) === '#') {
        hashtagFormatted = hashtagFormatted.substr(1); // remove #
        hashtagFormatted = "%23" + hashtagFormatted; // add %23 instead
    }
    return hashtagFormatted;
}
