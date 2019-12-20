# orgbot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The purpose of this bot is for people to invite themselves to a GitHub organisation. This is a nodejs application that
is happy to run in node:10 or later.

## Discordjs

The main functionality for this project comes from
[discordjs](https://discord.js.org/#/docs/main/stable/general/welcome).

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

We're using [pm2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) to run the node service for us for crash
recovery and on box monitoring.

On successful startup the bot will run a http server that can be used to check the status of the discord client, it runs
on port 3838.

### starting, stopping, etc

This is all managed through makefile targets

```bash
$ make bot-start
$ make bot-stop
$ make bot-status # Prints the status of the bot in pm2, memory and other useful things
$ make bot-kill # This will stop pm2 entirely
```

### Environment variables

Requires a Discord and GitHub API token to start

```
$ export DISCORD_API_TOKEN=123potato
$ export GITHUB_API_TOKEN=456banana
```

## Tests

Testing is with [mocha](https://mochajs.org/api/), [chai](https://www.chaijs.com/api/) and
[sinon](https://sinonjs.org/).

You can run tests with `make test` or `npm test`

# TODO

Help function needs writing.
