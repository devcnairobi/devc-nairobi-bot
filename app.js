const http = require('http');

const bot = require('./bot');

let port = process.env.PORT || 3000;
http.createServer(bot.middleware()).listen(port);