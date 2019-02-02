# devc-nairobi-bot

[![Code Climate](https://codeclimate.com/github/devcnairobi/devc-nairobi-bot/badges/gpa.svg)](https://codeclimate.com/github/devcnairobi/devc-nairobi-bot) [![Issue Count](https://codeclimate.com/github/devcnairobi/devc-nairobi-bot/badges/issue_count.svg)](https://codeclimate.com/github/devcnairobi/devc-nairobi-bot)

Messenger Bot for DevC Nairobi

## About

This is a Messenger Bot that helps with some ops, running the developer community. Some of the features are:

- Signing up members
- Adding members to the Github org
- Subscribing members on the mailinglist
- RSVPing for events
- Event listing (past and upcoming) - TBD
- Post-event surveys - TBD

## Architecture

<img width="1086" alt="screen shot 2019-02-02 at 2 53 50 pm" src="https://user-images.githubusercontent.com/261265/52169532-fa2fa380-274a-11e9-8fda-5d30a3aa16a1.png">

## Developing

### Pre-requisites

  - Node 6.9.0+
  - Git
  - [Ngrok](https://ngrok.com)

### Getting started

  - Set environment variables as follows:
      * Copy `.env.sample` to `.env` (all env settings will live on this file)
      * Register a Firebase test app and use the provided settings to update the `FB_` settings in the just created `.env` file. Ensure database rules are set to public write i.e.:
          ```
          {
            "rules": {
              ".read": false,
              ".write": true
            }
          }
          ```
      * On your Github settings page, create a new [_personal access token_](https://github.com/settings/tokens) with at least scope(`admin:org - write`) and update `GH_OAUTH_TOKEN` with the generated token.
      * You may need to create a test Github org in order to update `GH_ORG`.
      * Run `ngrok http 5000` and note the generated *https* url.
      * Set up your bot's [Facebook webhook](https://developers.facebook.com/docs/messenger-platform/guides/setup) using the ngrok url.
      * Use the provided Facebook developer app credentials to update `PAGE_TOKEN`, `VERIFY_TOKEN` and `APP_SECRET`.
  - Install required node packages with `npm install`.
  - Run the bot with `npm start`.

### Linting

  - The code is validated using [ESLint](http://eslint.org/).
  - If you are using Atom you should install the following plugins:
      * [linter](https://atom.io/packages/linter)
      * [linter-eslint](https://atom.io/packages/linter-eslint)

### Tests

  - TODO
