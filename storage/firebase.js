const fb = require('./config').firebase;

module.exports = {
  eventRSVP(eventName, user, cb) {
    const eventRef = fb.database().ref('/events/' + eventName);
    eventRef.set(user)
        .then((snapshot) => {
          if (cb) cb(snapshot);
        })
        .catch((err) => {
          console.log('Firebase Error:', err);
        });
  },

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

  updateUser(psid, user, cb) {
    const userRef = fb.database().ref('/users/' + psid);
    userRef.update(user);
  }
};
