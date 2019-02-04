const fb = require('./config').firebase;
const User = require('../bot/user');

module.exports = {
  saveUser(psid, user, cb) {
    // psid: page-scored ID
    const userRef = fb.database().ref('/users/' + psid);
    userRef.set(user)
        .then((snapshot) => {
          if (cb) cb(snapshot);
        })
        .catch((err) => {
          console.log('Firebase Error:', err);
        });
  },

  updateUser(psid, user) {
    const userRef = fb.database().ref('/users/' + psid);
    userRef.update(user);
  },

  checkIfUserExists(psid, chat) {
    const userRef = fb.database().ref(`/users/${psid}`);
    userRef.once('value').then((snapshot) => {
      const exists = (snapshot.val() !== null);
      if (!exists) {
        User.askIfToRegister(chat, (user) => {
          this.saveUser(psid, user, () => {
            User.register(chat, (userPatch) => {
              this.updateUser(psid, userPatch);
            });
          });
        });
      } else {
        const user = snapshot.val();
        chat.say(`Welcome ${user.first_name}, you are already registered.`);
      }
    });
  },

  eventRSVP(psid, eventId, chat) {
    const eventRef = fb.database().ref(`/RSVPs/${eventId}/${psid}`);
    const userRef = fb.database().ref(`/users/${psid}`);
    userRef.once('value').then((snapshot) => {
      const user = snapshot.val();
      if (user !== null) {
        eventRef.set(user);
        chat.say(`Thanks, you've been RSVP'd successfully for today's event :)`);
      } else {
        chat.say({
          text: `Please register first.`,
          quickReplies: [
            { content_type: 'text', title: 'Register' },
          ],
        });
      }
    });
  },

  listEvents(timestamp, callback) {
    // TODO: add query to get events >= timestamp once
    // it is provided
    const eventsRef = fb.database().ref('/events/');
    eventsRef.once('value').then(snapshot => {
      const object = snapshot.val();
      // convert to array
      const data = Object.values(object);
      callback(data);
    });
  },

  saveEventInterest(psid, eventId, chat) {
    const eventRef = fb.database().ref(`/event_interests/${eventId}/${psid}`);
    const userRef = fb.database().ref(`/users/${psid}`);
    userRef.once('value').then((snapshot) => {
      const user = snapshot.val();
      if (user !== null) {
        eventRef.set(user);
        chat.say(`Thanks, your response is recorded`);
      } else {
        chat.say({
          text: `Please register first.`,
          quickReplies: [
            { content_type: 'text', title: 'Register' },
          ],
        });
      }
    });
  }
};
