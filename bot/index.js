const BootBot = require('bootbot');

const replies = require('./replies');
const User = require('./user');
const db = require('./firebase');

const bot = new BootBot({
    accessToken: process.env.PAGE_TOKEN,
    verifyToken: process.env.VERIFY_TOKEN,
    appSecret: process.env.APP_SECRET
});

bot.on('error', (err) => {
    console.log(err.message)
});

bot.on('message', (payload, chat) => {
    let text = payload.message.text;

    chat({ text: replies.default }, function(err) {
        if (err) console.log(err);
    });
});

bot.hear([/register/i, /sign[- ]?up/i], (payload, chat) => {
    chat.getUserProfile().then((user) => {
        db.saveUser(user.id, user, () => {
            User.register(chat, (userPatch) => {
                db.updateUser(userPatch);
            });
        });
    });
});

module.exports = bot;