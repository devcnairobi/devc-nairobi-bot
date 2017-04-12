# devc-nairobi-bot

Messenger Bot for DevC Nairobi

### Pre-requisites

  - Node 6.9.0+
  - Git
  - [Ngrok](https://ngrok.com)

### Getting started

  - Copy `.env.sample` to `.env`
  - Fill out the missing env settings
      * register with firebase to get the `FB_` settings
      * create a new _personal access token_ on github and ensure the following scope(`admin:org - write`), then use the token as `GH_OAUTH_TOKEN` env setting.
  - Run app with `npm start`
  - Run `ngrok http 5000`
  - Copy the *https* generated url and use it as your fb webhook.

### Linting

  - The code is validated using [ESLint](http://eslint.org/).
  - If you are using Atom you should install the following plugins:
      * [linter](https://atom.io/packages/linter)
      * [linter-eslint](https://atom.io/packages/linter-eslint)


### Tests

    - TODO
  
