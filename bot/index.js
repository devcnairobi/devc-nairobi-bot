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
    console.log(payload);
    chat.getUserProfile().then((user) => {
        db.saveUser(user.id, user, () => {
            User.register(chat, (userPatch) => {
                db.updateUser(user.id, userPatch);
            });
        });
    });
});

module.exports = bot;