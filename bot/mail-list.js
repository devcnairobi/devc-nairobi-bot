const request = require('request');

const subscribeUser = (user, callback) => {
  const url = `${process.env.MC_BASE_URL}/lists/${process.env.MC_LIST_ID}/members`;
  const opts = {
    url,
    auth: {
      user: 'x',
      pass: process.env.MC_API_KEY,
    },
    json: {
      email_address: user.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: user.first_name,
        LNAME: user.last_name,
      },
    },
  };
  request.post(opts, callback);
};

module.exports = {
  subscribeUser,
};
