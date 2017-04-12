import http from 'request';

const ORG = process.env.GH_ORG;
const headers = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': ORG,
};

export function checkUsername(username){
  return new Promise(function(resolve, reject){

    console.log(`checking username: ${username}`);

    const opts = {
      url: `https://api.github.com/users/${username}`,
      headers,
    };

    http.get(opts, (err, res) => {
      if (res.statusCode !== 200) return reject();
      resolve();
    });

  });
}


export function addToOrg(username){
  return new Promise(function(resolve, reject){

    console.log(`adding ${username} to ${ORG} org`);

    const opts = {
      url: `https://api.github.com/users/orgs/${ORG}/memberships/${username}`,
      headers,
    };

    http.put(opts, (err, res) => {
      if (res.statusCode !== 200) return reject();
      resolve();
    });

  });
}
