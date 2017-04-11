/**
 * User Management
 */
const http = require('request');
const validator = require('validator');

module.exports = {
    register(chat, callback) {

        const askEmail = (convo) => {
            convo.ask(`What's your email?`, (payload, convo) => {
                const email = payload.message.text;
                if (!validator.isEmail(email)) {
                    // loop recursively until a valid email is provided
                    convo.say(`Oops, this doesn't look like a valid email :(`)
                        .then(() => askEmail(convo));
                } else {
                    convo.set('email', email);
                    convo.say(`Good!`)
                        .then(() => askTShirtSize(convo));
                }
            });
        };

        const askTShirtSize = (convo) => {
            const question = {
                text: `What's your t-shirt size?`,
                quickReplies: ['S', 'M', 'L', 'XL']
            };

            convo.ask(question, (payload, convo) => {
                convo.set('t_shirt_size', payload.message.text);
                askIfDeveloper(convo);
            });
        };

        const askIfDeveloper = (convo) => {
            const question = {
                text: `Are you a developer?`,
                quickReplies: ['Yes', 'No']
            };

            convo.ask(question, (payload, convo) => {
                const re = /yes/i;
                if (re.test(payload.message.text)) {
                    convo.set('occupation', 'developer');
                    end(convo);
                } else {
                    askOccupation(convo);
                }
            });
        };

        const askOccupation = (convo) => {
            convo.ask(`What's your occupation?`, (payload, convo) => {
                const text = payload.message.text
                if (text && text.length > 3) {
                    convo.set('occupation', payload.message.text);
                    end(convo);
                } else {
                    convo.say(`Sorry, I didn't get that.`)
                        .then(() => askOccupation(convo));
                }
            });
        };

        const end = (convo) => {
            chat.getUserProfile().then((user) => {
                convo.say(`Thanks ${user.first_name}! You are registered :) Welcome to Developer Circle: Nairobi - http://fb.com/groups/DevCNairobi`);
                convo.end();
                callback({
                    email: convo.get('email'),
                    occupation: convo.get('occupation'),
                    t_shirt_size: convo.get('t_shirt_size'),
                });
            })
        }

        chat.conversation((convo) => {
            askEmail(convo);
        });
    },

    addToGithub(chat, callback) {
        const askUsername = (convo, recursive) => {

            let question = recursive ? `Please try again` : `What's your Github username?`;

            convo.ask(question, (payload, convo) => {
                const psid = payload.sender.id;
                let username = payload.message.text;
                let validUsername = true;
                // clean up
                if (username[0] == '@') username = username.substring(1);
                // validate
                validUsername = username.length > 1;
                // check if it's a valid GH username
                if (validUsername) {
                    let options = {
                        url: `https://api.github.com/users/${username}`,
                        headers: {
                            Accept: 'application/vnd.github.v3+json',
                            'User-Agent': 'devcnairobi',
                        },
                    }
                    http.get(options, (err, res) => {
                        if (res.statusCode === 200) {
                            convo.set('github_username', username);
                            // update user on callback
                            convo.say(`Request accepted, you @${username} will be added shortly`);
                            convo.end();
                            callback({ psid, username: convo.get('github_username') });
                        } else {
                            // most likely it's 404
                            convo.say(`The username @${username} wasn't found, please provide a valid username`)
                                .then(() => askUsername(convo, true));
                        }
                    });
                } else {
                    convo.say(`The username you provided looks invalid, please check`)
                        .then(askUsername(convo, true));
                }
            });
        };

        chat.conversation((convo) => {
            askUsername(convo);
        });
    }
}