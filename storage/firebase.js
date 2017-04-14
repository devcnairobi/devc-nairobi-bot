const fb = require('./config').firebase;

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
  }
};
