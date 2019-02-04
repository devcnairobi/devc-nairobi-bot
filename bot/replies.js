const defaultReply = chat => {
  chat.getUserProfile().then((user) => {
    chat.say(`Hello ${user.first_name}! This is the DevC Nairobi bot. You can reply with: register, survey, rsvp, etc.`);
  });
};

module.exports = {
  defaultReply,
};
