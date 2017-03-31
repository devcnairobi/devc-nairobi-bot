const fb = require('./config').firebase;

module.exports = {
    eventRSVP(eventName, user, cb) {
        let eventRef = fb.database().ref('/events/' + eventName);
        eventRef.set(user)
            .then((snapshot) => {
                cb(snapshot);
            })
            .catch((err) => {
                console.log('Firebase Error:', err);
            });
    },

}