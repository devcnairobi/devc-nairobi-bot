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
      }
    });
  }
};
