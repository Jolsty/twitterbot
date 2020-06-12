// DEPENDENCIES
const Twitter = require('twitter');

// GLOBAL VARIABLES
const twitter = new Twitter({
    consumer_key: "J9DoRfEw3X2NVIpJlSPpL6h4J",
    consumer_secret: "k2z5UkyMNHD0WlLQd6bp6Us5jHEd4GRMzDFQfjGnrIJF7M3F44",
    access_token_key: "1050875420881629184-3tkr9gOXapeDp8z1mtY41Z8vv7aLNd",
    access_token_secret: "aSbtmla8nKdshVBxPDD6KGKBGoxyXdXJeL2ke6ebtLLbH"
});

/*const twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});*/

// Verify credentials
twitter.get('account/verify_credentials',
    {
         include_entities: false,
         skip_status: true,
         include_email: false
     },
     (err, res) => {
         if (err) throw err;
         console.log('Authentication successful...\n');
     }
 );

// EXPORTS
module.exports.twitter = twitter;

module.exports.getWebhookID = function() {
    twitter.get('account_activity/all/accountactivity/webhooks', (err, body, res) => {
        if (err) console.log(err);
        if (res) console.log('Webhook ID: ' + body[0].id);
    });
}

module.exports.getWebhookSubscription = function() {
    twitter.get("account_activity/all/accountactivity/subscriptions", (err, body, res) => {
        if (err) console.log(err);
        if (res.statusCode === 204) {
            console.log("204 OK: User has an active subscription to webhook");
        } else {
            console.log("User does not have an active subscription");
            console.log(JSON.stringify(res));
        }
    });
}

// Gets a certain amount of tweets and places them into exported variables available for use in app.js
module.exports.getTweets = function(cnt, callback) {
    var myTweets = [];
    var count = {count: cnt};
    twitter.get('statuses/user_timeline', count, (err, data, res) => {
        if (err) throw err;
        if (res) {
            myTweets = filterTweets(data);
            module.exports.myTweets = myTweets;
            module.exports.tweetCount = myTweets.length;
            module.exports.updateTime = new Date().getTime();
            if (callback) callback(myTweets); // not every call we make uses the callback
        }
    });
}

module.exports.deleteTweets = function(amount) {
    var deleteTweets = [];
    this.getTweets(amount, (deleteTweets) => {
        for (var i = 0; i < deleteTweets.length; i++) {
            id = deleteTweets[i].stats.id_str;
            twitter.post('statuses/destroy/' + id, '', (err, data, res) => {
                if (err) throw err;
            });
            console.log("Deleted " + id);
        }
    });
}

// INTERVALS
// const getTweetsTimer = 1000; // update our tweet list every second

/*
* Update tweets manually. This is another way to do it.
*
setInterval( () => {
    getTweets(200, (myTweets) => {
        console.log("Updated the tweet list");
    });
}, getTweetsTimer);
*/
const tweetTimer = 12 * 300000; // update trends every hour and then tweet out
setInterval( () => {
    getTrendsAndTweet();
}, tweetTimer);

// FUNCTIONS
//createWebhook('https://unimitwitterbot.herokuapp.com/webhook/twitter');
function createWebhook(url) {
    urls = { url: url };
    twitter.post('account_activity/all/accountactivity/webhooks', urls, (err, body, res) => {
        if (err) console.log("Err" + JSON.stringify(err));
        if (res) {
            console.log("createWebhook " + JSON.stringify(body));
            console.log("response " + JSON.stringify(res));
        }
    });
}

//addWebhookSubscription();
function addWebhookSubscription() {
    twitter.post("account_activity/all/accountactivity/subscriptions", (err, body, res) => {
        if (err) console.log(err);
        if (res.statusCode === 204) console.log("Added webhook subscription");
        else console.log("Something happened with the webhook subscription");
    });
}

function getTrendsAndTweet() {
    getHashtags(1, (trendingHashtags) => {
        tweetOut(trendingHashtags);
    });
}

function getHashtags(id, callback) {
    var woeid = {id: id};
    var trendingHashtags = [];
    // GET TRENDING HASHTAGS FOR SPECIFIC WOEID
    twitter.get('trends/place', woeid, (err, data, res) => {
        if (err) throw err;
        for (var i = 0; i < data[0].trends.length; i++) {
            trendingHashtags.push(data[0].trends[i].name);
        }
        if (res) callback(trendingHashtags); else throw err;
    });
}

function tweetOut(trendingHashtags){
    // GET RAND TWEET
    var randomTweet = getRandInt(trendingHashtags.length);
    // BODY OF TWEET
    var status = { status: trendingHashtags[randomTweet] };
    // TWEET OUT STATUS
    twitter.post('statuses/update', status, (err, data, res) => {
        if (err) throw err;
        console.log("Tweeted out '" + status.status + "' on " + new Date());
    });
}

// Filters the tweet data in the argument and returns an array with only the necessary information
function filterTweets(data) {
    var tweetsFiltered = [];
    for (var i = 0; i < data.length; i++) {
        tweetsFiltered.push(
            {
                text: data[i].text,
                stats: {
                    created_at: filterDate(data[i].created_at),
                    id_str: data[i].id_str,
                    retweets: data[i].retweet_count,
                    favorites: data[i].favorite_count,
                }
            }
        );
    }
    return tweetsFiltered;
}

// Makes the date look more readable to humans
function filterDate(date) {
    dateFiltered = date.substr(0, 3) + ", " + // day of the week
                   date.substr(8, 2) + "-" + // day
                   date.substr(4, 3) + "-" + // month
                   date.substr(-4) + " at " + // year
                   new String(parseInt(date.substr(11, 2))+2) + // hour; +2 is because of timezone differences
                   date.substr(13,6); // minutes and seconds
    return dateFiltered;
}

// Get a random integer [0,max)
function getRandInt(max) {
    return Math.floor(Math.random() * max)
}
