const http = require('request');
const createLogger = require('bunyan').createLogger;

const ORG = process.env.GH_ORG;
const headers = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': ORG,
  'Authorization': `token ${process.env.GH_OAUTH_TOKEN}`
};

const log = createLogger({
  name: 'github',
  stream: process.stdout,
  level: 'info',
});

function checkUsername(username) {
  return new Promise(function(resolve, reject){

    const logc = log.child({
      username
    });

    logc.info(`checking username`);

    const opts = {
      url: `https://api.github.com/users/${username}`,
      headers,
    };

    http.get(opts, (err, res) => {
      if (res.statusCode !== 200) {
        logc.error('username check failed');
        return reject();
      }
      logc.info('validated username!');
      resolve();
    });

  });
}


function addToOrg(username) {
  return new Promise(function(resolve, reject){

    const logc = log.child({
      username,
      org: ORG
    });

    logc.info(`adding user to org`);

    const opts = {
      url: `https://api.github.com/orgs/${ORG}/memberships/${username}`,
      headers,
    };

    http.put(opts, (err, res) => {
      if (res.statusCode !== 200) {
        logc.error('failed to add user to org');
        return reject();
      }
      logc.info('added user to org!');
      resolve();
    });

  });
}

module.exports = {
  checkUsername,
  addToOrg,
};
