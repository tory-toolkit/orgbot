# Pronoun bot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The purpose of this bot is for people to assign themselves roles which represent pronouns. This is a nodejs application that is happy to run in node:10 or later.

## Discordjs

The main functionality for this project comes from [discordjs](https://discord.js.org/#/docs/main/stable/general/welcome).

## Build

This project is using `make`, you can build with

```bash
$ make
or
$ make prepare
or 
$ make build
```

## Running the bot

We're using [pm2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) to run the node service for us for crash recovery and on box monitoring. 

On successful startup the bot will run a http server that can be used to check the status of the discord client, it runs on port 3838.

### starting, stopping, etc

This is all managed through makefile targets

```bash
$ make bot-start
$ make bot-stop
$ make bot-status # Prints the status of the bot in pm2, memory and other useful things
$ make bot-kill # This will stop pm2 entirely
```

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
