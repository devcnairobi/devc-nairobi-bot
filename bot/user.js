/**
 * User Management
 */
const validator = require('validator');

module.exports = {
    register(chat, callback) {
        chat.conversation((convo) => {
            askEmail(convo);
        });

        const askEmail = (convo) => {
            convo.ask(`What's your email?`, (payload, convo) => {
                if (!validator.isEmail) {
                    // loop recursively until a valid email is provided
                    convo.say(`Oops, this doesn't look like a valid email :(`)
                        .then(() => askEmail(convo));
                } else {
                    convo.set('email', payload.message.text);
                    convo.say(`Thanks!`)
                        .then(() => askIfDeveloper(convo));
                }
            });
        };

        const askIfDeveloper = (convo) => {
            convo.ask(`Are you a developer?`, (payload, convo) => {
                const re = /yes/i;
                if (re.test(payload.message.text)) {
                    convo.set('occupation', 'developer');
                    convo.say(`Ok, good! Thanks.`);
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
                    convo.say('Thanks!');
                    end(convo);
                } else {
                    convo.say(`Sorry, I didn't get that.`)
                        .then(() => askOccupation(convo));
                }
            });
        };

        const end = (convo) => {
            convo.end();
            callback({
                email: convo.get('email'),
                occupation: convo.get('occupation')
            });
        }
    }
}