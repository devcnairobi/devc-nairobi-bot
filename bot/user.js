/**
 * User Management
 */
const validator = require('validator');
const gh = require('./gh');
const mail = require('./mail-list');

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
          mailingList(convo);
        } else {
          askOccupation(convo);
        }
      });
    };

    const askOccupation = (convo) => {
      convo.ask(`What's your occupation?`, (payload, convo) => {
        const text = payload.message.text;
        if (text && text.length > 3) {
          convo.set('occupation', payload.message.text);
          mailingList(convo);
        } else {
          convo.say(`Sorry, I didn't get that.`)
            .then(() => askOccupation(convo));
        }
      });
    };

    /**
     * As user to be subscribed to the mailinglist
     */
    const mailingList = (convo) => {
      const question = {
        text: `Would you like to be added to our mailinglist?`,
        quickReplies: ['Yes', 'No']
      };

      convo.ask(question, (payload, convo) => {
        if (payload.message.text === 'Yes') {
          convo.set('mailing_list', true);
          chat.getUserProfile().then(user => {
            user.email = convo.get('email');
            mail.subscribeUser(user, (err, res, body) => {
              if (!err && body.id) {
                convo.say(`You have been subscribed!`)
                  .then(() => end(convo));
              } else {
                convo.say(`Snap, something went wrong. A human will subscribe you manually`)
                  .then(() => end(convo));
              }
            });
          });
        } else {
          convo.set('mailing_list', false);
          convo.say(`Ok, no worries :)`)
            .then(() => end(convo));
        }
      });
    };

    const end = (convo) => {
      chat.getUserProfile().then((user) => {
        convo.say(`Thanks ${user.first_name}! You are registered :) You can follow up on the latest conversations here - http://fb.com/groups/DevCNairobi`);
        convo.end();
        user.email = convo.get('email');
        user.occupation = convo.get('occupation');
        user.t_shirt_size = convo.get('t_shirt_size');
        callback(user);
      });
    };

    chat.conversation((convo) => {
      askEmail(convo);
    });
  },

  addToGithub(chat, callback) {
    const askUsername = (convo, recursive, count = 0) => {
      const question = recursive ? `Please try again` : `I will add you to our Gihub org. What's your Github username?`;

      convo.ask(question, (payload, convo) => {
        const psid = payload.sender.id;
        let username = payload.message.text;
        let validUsername = true;
        // clean up
        if (username[0] === '@') username = username.substring(1);
        // validate
        validUsername = username.length > 1;
        // check if it's a valid GH username
        if (validUsername) {
          gh.checkUsername(username)
            .then(() => {
              gh.addToOrg(username)
                .then(()=>{
                  convo.say(`An invite has been sent to @${username}, please accept it to join org - https://github.com/${process.env.GH_ORG}. Thanks!`);
                  convo.end();
                  callback({ psid, github_username: username });
                }, ()=>{
                  convo.say(`We couldn't add you to github org automatically so a human will add you manually soon.`);
                  convo.end();
                  callback({ psid, github_username: `failed_${username}` });
                });
            }, () => {
              if (count < 1) {
                convo
                  .say(`The username @${username} wasn't found, please provide a valid username`)
                  .then(() => askUsername(convo, true, ++count));
              } else {
                convo.say(`There seem to be something wrong, someone will add you manually`);
                convo.end();
                callback({ psid, github_username: `failed_${username}` });
              }
            });
        } else {
          convo
            .say(`The username you provided looks invalid, please check.`)
            .then(askUsername(convo, true));
        }
      });
    };

    chat.conversation((convo) => {
      askUsername(convo);
    });
  },

  askIfToRegister(chat, callback) {
    const question = {
      text: `Do you want to register?`,
      quickReplies: ['Yes', 'No']
    };

    const prompt = (convo) => {
      convo.ask(question, (payload, convo) => {
        const re = /Yes/i;
        if (re.test(payload.message.text)) {
          convo.end();
          this.register(chat, callback);
        } else {
          convo.say(`To register later, type 'register'`);
          convo.end();
        }
      });
    };
    chat.conversation((convo) => {
      prompt(convo);
    });
  }
};
