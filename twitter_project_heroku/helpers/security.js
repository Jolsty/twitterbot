const crypto = require('crypto');

/**
 * Creates a HMAC SHA-256 hash created from the app TOKEN and
 * your app Consumer Secret.
 * @param  token  the token provided by the incoming GET request
 * @return string
 */
module.exports.get_challenge_response = function(crc_token, consumer_secret) {

  //Compare created hash with the base64 encoded x-twitter-webhooks-signature value.
  //Use a method like compare_digest to reduce the vulnerability to timing attacks.

  hmac = crypto.createHmac('sha256', consumer_secret.toString()).update(crc_token).digest('base64');
  return hmac;
}
