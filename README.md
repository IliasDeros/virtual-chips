# Virtual Chips [![CircleCI](https://circleci.com/gh/IliasDeros/virtual-chips.svg?style=svg)](https://circleci.com/gh/IliasDeros/virtual-chips)

Always have your poker chips on you. [Installation guide](#installation)

![virtual chips](https://i.imgur.com/Qjj5Zcw.png)

### Installation

1. `git clone git@github.com:IliasDeros/virtual-chips.git`
2. `yarn`

### Running

1. `yarn start`
2. visit app at http://localhost:1234/

### Testing

All actions and reducers are unit-tested. Execute tests by running `yarn test`.

**Note:** A recent update to firebase has broken all the mocks, so it is not possible to run unit tests at the moment

### Deploying

This application was set up to automatically push to firebase on `master` commits using:

```
npm install -g firebase-tools
firebase login --no-localhost
firebase init hosting
```

**Reference:** https://firebase.google.com/docs/hosting/quickstart#before_you_begin
