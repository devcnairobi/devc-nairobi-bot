const BootBot = require('bootbot');

const replies = require('./replies');
const User = require('./user');
const db = require('../storage/firebase');

const bot = new BootBot({
    accessToken: process.env.PAGE_TOKEN,
    verifyToken: process.env.VERIFY_TOKEN,
    appSecret: process.env.APP_SECRET
});

bot.on('error', (err) => {
    console.log(err.message)
});

bot.hear([/hi/i, /hello/i], (payload, chat) => {
    chat.say(replies.default);
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

bot.hear([/add [a-z ]* github/i], (payload, chat) => {
    // phrase like 'add me to Github'
    User.addToGithub(chat, (userPatch) => {
        // okay to add redudant psid on the user object
        db.updateUser(userPatch.psid, userPatch);
    });
});

module.exports = bot;