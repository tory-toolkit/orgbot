# Pronoun bot

The purpose of this bot is to assign people roles with pronouns.

## Discordjs

The main functionality for this project comes from [discordjs](https://discord.js.org/#/docs/main/stable/general/welcome)

## Running Requirements

The server should have roles that match the pronouns listed in `src/pronounsList.json`, the implementation can be modified to create these automatically on startup and could be modified to create new ones out of approved combinations if required in future.

### Environment variables

Requires a discord token to start

```
$ export DISCORD_API_TOKEN=123potato
```

## Tests

Testing is with [mocha](https://mochajs.org/api/), [chai](https://www.chaijs.com/api/) and [sinon](https://sinonjs.org/).

You can run tests with `make test` or `npm test`
