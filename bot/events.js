const isURL = require('validator/lib/isURL');
const firebase = require('../storage/firebase');

// common functions
const utils = {
  validArray(data) {
    return Array.isArray(data) && data.length > 0;
  },
  currentDayTimestamp() {
    const date = new Date();
    return date.toISOString().slice(0,10).replace(/-/g,'');
  },
};

const getEventsElems = (events) => {
  const elems = [];
  events.forEach((event) => {
    const elem = {
      title: event.title,
      image_url: isURL(String(event.cover_img)) ? String(event.cover_img) : process.env.DEFAULT_EVENT_IMG,
      subtitle: event.description,
      buttons: [
        {
          type: 'web_url',
          url: isURL(String(event.url)) ? String(event.url) : process.env.FACEBOOK_GROUP_URL,
          title: 'View Event',
        },
        {
          type: 'postback',
          title: '♡ Interested',
          payload: `event:interest:${event.timestamp}`, // TODO
        },
      ],
    };
    elems.push(elem);
  });
  return elems;
};

const upcomingEvents = (payload, chat) => {
  const timestamp = utils.currentDayTimestamp();
  firebase.listEvents(timestamp, (data) => {
    if (utils.validArray(data)) {
      const elems = getEventsElems(data);
      chat.sendGenericTemplate(elems);
    }
    else {
      chat.say('No events to display');
    }
  });
};

module.exports = {
  upcomingEvents,
};
