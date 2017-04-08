const Bot = require('bootbot');

const replies = require('./replies');

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

module.exports = bot;