# Virtual Chips [![CircleCI](https://circleci.com/gh/IliasDeros/virtual-chips.svg?style=svg)](https://circleci.com/gh/IliasDeros/virtual-chips)

Always have your poker chips on you. [Installation guide](#installation)

![virtual chips](https://rlv.zcache.com/carbon_fiber_any_color_poker_chips_set-r2b608122bb2846e8a24dfdb0282f97b5_zrag1_8byvr_630.jpg?view_padding=%5B285%2C0%2C285%2C0%5D)

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
