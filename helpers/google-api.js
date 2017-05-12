/*jshint esversion: 6*/
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
require("dotenv").config();

var configJson={"installed":{"client_id":process.env.CLIENT_ID,"project_id":process.env.PROJECT_ID,"auth_uri":process.env.AUTH_URI,"token_uri":process.env.TOKEN_URI,"auth_provider_x509_cert_url":process.env.AUTH_PROVIDER,"client_secret":process.env.CLIENT_SECRET,"redirect_uris":[process.env.REDIRECT_URIS_ONE,process.env.REDIRECT_URIS_ONE]}};

var config =require('json-configurator')(configJson,'prod');

const path = require('path');

var SCOPES = ['https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR =  path.join(__dirname, '../credentials/');
var TOKEN_PATH = TOKEN_DIR + 'proyecto-ironhack.json';


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, data, callback) {
  console.log("hi9");
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    console.log("hi8");
    if (err) {
      getNewToken(oauth2Client, data, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client,data);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, data, callback) {
  console.log("hi7");
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client,data);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  console.log("hi6");
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

module.exports = {
  insertEventHelper: (data,cb)=>{
    // Load client secrets from a local file.
    fs.readFile("client_secret.json", function processClientSecrets(err, content) {
      if (err) {
        return cb(new Error('Error loading client secret file: ' + err));
      }
      // Authorize a client with the loaded credentials, then call the
      // Google Calendar API.
      authorize(JSON.parse(content), data, (auth,data,callback)=> {
        var calendar = google.calendar('v3');
        calendar.events.insert({
          auth: auth,
          calendarId: data.calendarId,
          resource: data.event,
        }, function(err, event) {
          if (err) {
            return cb(new Error('There was an error contacting the Calendar service: ' + err));
          }
          return cb(null,event);
        });
      });
    });
  },

  deleteEventHelper: (data,cb)=>{
    // Load client secrets from a local file.
    fs.readFile("client_secret.json", function processClientSecrets(err, content) {
      if (err) {
        return cb(new Error('Error loading client secret file: ' + err));
      }
      // Authorize a client with the loaded credentials, then call the
      // Google Calendar API.
      authorize(JSON.parse(content), data, (auth,data,callback)=> {
        var calendar = google.calendar('v3');
        calendar.events.delete({
          auth: auth,
          calendarId: data.calendarId,
          eventId: data.eventId
        }, function(err, event) {
          if (err) {
            return cb(new Error('There was an error contacting the Calendar service: ' + err));
          }
          return cb(null,event);
        });
      });
    });
  },

  updateEventHelper: (data,cb)=>{
    // Load client secrets from a local file.
    fs.readFile("client_secret.json", function processClientSecrets(err, content) {
      if (err) {
        return cb(new Error('Error loading client secret file: ' + err));
      }
      // Authorize a client with the loaded credentials, then call the
      // Google Calendar API.
      authorize(JSON.parse(content), data, (auth,data,callback)=>{
        var calendar = google.calendar('v3');
        calendar.events.update({
          auth: auth,
          // calendarId: 'scb42901388thsu2tbti76fie8@group.calendar.google.com',
          calendarId: data.calendarId,
          eventId: data.eventId,
          resource: data.event
        }, function(err, event) {
          if (err) {
            return cb(new Error('There was an error contacting the Calendar service: ' + err));
          }
          return cb(null,event);
        });
      });
    });
  },
};
