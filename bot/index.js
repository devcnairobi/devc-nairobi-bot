const Bot = require('messenger-bot');

const replies = require('./replies');

let bot = new Bot({
    token: process.env.PAGE_TOKEN || '',
    verify: process.env.VERIFY_TOKEN || '',
});

bot.on('error', (err) => {
    console.log(err.message)
});

bot.on('message', (payload, reply) => {
    let text = payload.message.text;

    reply({ text: replies.default }, function(err) {
        if (err) console.log(err);
    });
});

module.exports = bot;