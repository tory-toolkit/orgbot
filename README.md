# Pronoun bot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The purpose of this bot is for people to assign themselves roles which represent pronouns.

## Discordjs

The main functionality for this project comes from [discordjs](https://discord.js.org/#/docs/main/stable/general/welcome)

## Running Requirements

### Discord developer application

We will need a discord developer account with a bot setup on it so that this application can auth, then we'll need an administrator to install the bot into the discord server. Neither should be public details and should be somewhat tightly controlled, as if a bot is taken over it's bad for everyone.

### Roles

The server should have roles that match the pronouns listed in `src/pronounsList.json`, the implementation can be modified to create these automatically on startup and could be modified to create new ones out of approved combinations if required in future.

### Environment variables

Requires a discord token to start

```
$ export DISCORD_API_TOKEN=123potato
```

## Tests

Testing is with [mocha](https://mochajs.org/api/), [chai](https://www.chaijs.com/api/) and [sinon](https://sinonjs.org/).

You can run tests with `make test` or `npm test`
