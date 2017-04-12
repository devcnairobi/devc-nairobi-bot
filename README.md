# devc-nairobi-bot

Messenger Bot for DevC Nairobi

### Pre-requisites

  - Node 6.9.0+
  - Git
  - [Ngrok](https://ngrok.com)

### Getting started

  - Copy `.env.sample` to `.env`
  - Fill out the missing env settings (register with firebase to get the `FB_` settings)
  - Run app with `npm start`
  - Run `ngrok http 5000`
  - Copy the url generated and use it as you fb webhook.

### Linting

  - The code is validated using [ESLint](http://eslint.org/).
  - If you are using Atom you should install the following plugins:
      * [linter](https://atom.io/packages/linter)
      * [linter-eslint](https://atom.io/packages/linter-eslint)
