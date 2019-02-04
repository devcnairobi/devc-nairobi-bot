const BootBot = require('bootbot');
const createLogger = require('bunyan').createLogger;

const db = require('../storage/firebase');
const events = require('./events');
const replies = require('./replies');
const User = require('./user');

// load env variables
const env = require('dotenv'); // https://github.com/motdotla/dotenv/issues/114
env.config({ silent: true });

const log = createLogger({
  name: 'bot',
  stream: process.stdout,
  level: 'info',
});

const bot = new BootBot({
  accessToken: process.env.PAGE_TOKEN,
  verifyToken: process.env.VERIFY_TOKEN,
  appSecret: process.env.APP_SECRET
});

bot.on('error', (err) => {
  log.error(err.message);
});

bot.on('message', (payload) => {
  const ctx = {
    sender: payload.sender.id,
    message: payload.message.text,
  };
  log.child(ctx).info('message');
});

bot.hear([/hi/i, /hello/i, /get started/i], (payload, chat) => {
  replies.defaultReply(chat);
});

bot.hear([/register/i, /sign[- ]?up/i], (payload, chat) => {
  const psid = payload.sender.id; // Page scoped ID
  chat.getUserProfile().then((user) => {
    db.saveUser(psid, user, () => {
      User.register(chat, (userPatch) => {
        db.updateUser(psid, userPatch);
      });
    });
  });
});

bot.hear([/add [a-z ]* github/i, /github/i], (payload, chat) => {
  // phrase like 'add me to Github'
  User.addToGithub(chat, (userPatch) => {
    // okay to add redudant psid on the user object
    db.updateUser(userPatch.psid, userPatch);
  });
});

bot.hear([/^RSVP/i], (payload, chat) => {
  // use day's timestamp as eventID
  const eventId = Math.floor(new Date().getTime() / 1000);
  db.eventRSVP(payload.sender.id, eventId, chat);
});

/**
 * Display a list of upcoming events
 */
bot.hear([/upcoming events/i], (payload, chat) => {
  events.upcomingEvents(payload, chat);
});

// listen for postback
bot.on('postback', (payload, chat) => {
  // if it's the getting started CTA
  if (payload.postback.payload === 'start') {
    // 1. Check if user is registered
    replies.defaultReply(chat);
  }
});

// add getting started CTA
bot.setGetStartedButton("start");

module.exports = bot;
