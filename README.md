# Only Chips [![CircleCI](https://circleci.com/gh/IliasDeros/virtual-chips.svg?style=svg)](https://circleci.com/gh/IliasDeros/virtual-chips)

*No chips? No problem.*

This web application connects you and your friends through a realtime firebase database so you can play poker, in real life, when you only have a pack of cards.

## Features

- [x] Connect to a private table and see player actions in real-time
- [ ] Invite players to your table, or join an existing one (https://github.com/IliasDeros/virtual-chips/issues/28)
- [ ] Customize your name and avatar (https://github.com/IliasDeros/virtual-chips/issues/29)

![only chips](https://i.imgur.com/Qjj5Zcw.png)

## How It Works

1. When you load a table, you start polling data from [Firebase](https://firebase.google.com/)
2. Any time the data is updated, compare the table state to what it should be, according to:
    - Current round
    - Current Turn (Pre-Flop, flop, river...) 
    - Player States (Idle/Bet/Checked + total bet)
3. Update table state according to #2, or with user input (Bet, Fold...)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for documentation on architecture, testing & deploying. 

**TLDR:** Here's how to run the app locally, using [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable):

```
git clone git@github.com:IliasDeros/virtual-chips.git
yarn && yarn start # or ./start.sh
# Visit app at http://localhost:1234/
```
