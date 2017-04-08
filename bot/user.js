/**
 * User Management
 */
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
                convo.say(`Got it!`)
                    .then(askIfDeveloper(convo));
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
                occupation: convo.get('occupation'),
                t_shirt_size: convo.get('t_shirt_size'),
            });
        }

        chat.conversation((convo) => {
            askEmail(convo);
        });
    }
}