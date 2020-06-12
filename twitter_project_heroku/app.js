// DEPENDENCIES
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // simplify file paths
const twitt = require('./helpers/twitt.js');
const security = require('./helpers/security.js');

// GLOBALS
const app = express();
var timeout = 0;

// View Engine Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Body Parser Middleware (parsing json content)
* in order to read HTTP POST data , we have to use "body-parser" node module. body-parser
* is a piece of express middleware that reads a form's input and stores it as a javascript object accessible through req.body
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));


// Static Directory Middleware (public directory is the new root for css/images/javascript)
app.use(express.static(path.join(__dirname, 'public')));

// Catch 404: Page not found and forward to error handler ******** TO DO ************
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

// ROUTE HANDLERS
// INDEX PAGE
app.get('/', (req, res) => {
    res.render('index',
        {
            title: "Trending Hashtags Bot",
            tweetStatistics: twitt.myTweets,
            tweetStatisticsString: JSON.stringify(twitt.myTweets),
            tweetCount: twitt.tweetCount,
            updatedTimeMS: twitt.updateTime
        }
    );
});

/*
* Receives and processes the challenge response check (CRC)
* Twitter does it almost hourly
*/
app.get('/webhook/twitter', (req, res) => {
    var crc_token = req.query.crc_token;
    if (crc_token) {
        console.log("crc token: " + crc_token);
        var hash = security.get_challenge_response(crc_token, twitt.twitter.options.consumer_secret);
        console.log("HASH " + hash);
        res.status(200); // STATUS OK
        res.send(
            {
                response_token: 'sha256=' + hash
            }
        );
        console.log("Sent response token back to twitter");
    } else {
        res.status(400); // STATUS BAD REQUEST
        console.log("Error: crc_token missing from request.")
        res.send('Error: crc_token missing from request.');
    }
});


/*
* RECEIVES EVENT NOTIFICATIONS FROM TWITTER
* TWEET_CREATE_EVENTS: tweets, retweets, replies, @mentions, quotetweets
* FAVORITE_EVENTS
* TWEET_DELETE_EVENTS
*/
app.post('/webhook/twitter', (req, res) => {
    var payload = req.body;
    if (payload.tweet_create_events || payload.favorite_events || payload.tweet_delete_events) {
        console.log(payload);
        // update tweets (limit to one update per second if it's being spammed to avoid getting blacklisted)
        if (timeout === 0) {
            twitt.getTweets(200);
            console.log("Updated tweets list via webhook");
            timeout = 1;
            setTimeout( () => {
                timeout = 0;
            }, 1000);
        }
    }
    res.send('200 OK')
});

// Log the message sent via form
// could log to file ************* TO DO *****************************
app.post('/message', (req, res) => {
    var payload = req.body;
    if (payload.name && payload.email && payload.subject && payload.message) {
        console.log
        (
            "You have a new message!" +
            "\nFrom: " + payload.name +
            "\nE-Mail: " + payload.email +
            "\nSubject: " + payload.subject +
            "\nMessage: " + payload.message
        );
        res.status(200);
        res.send("Message received. Thank you.");
    } else {
        res.status(400); // BAD REQUEST
        res.send("Bad request");
    }

});

// Delete tweets via form
app.post('/deleteTweets', (req, res) => {
    var payload = req.body;
    twitt.deleteTweets(payload.amount);
    res.status(200);
    res.send("Deleted " + payload.amount + " tweets");
});

// SERVER UP AND RUNNING
var port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port, () => {
    console.log('Server listening on port ' + port);
    // first tweet list update
    twitt.getTweets(200); // 200 is the maximum amount we can get anyway, so we will display up to 200 tweets on the website
    console.log("App started and server is running: first tweet list update");
    //twitt.getWebhookID(); // commented because of limit for using the webhook APIs (15 calls every 15 min)
    //twitt.getWebhookSubscription(); // commented because of limits for using the webhook APIs (15 calls every 15min)
});
