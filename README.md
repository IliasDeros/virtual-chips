# Only Chips [![CircleCI](https://circleci.com/gh/IliasDeros/virtual-chips.svg?style=svg)](https://circleci.com/gh/IliasDeros/virtual-chips)

No chips? No problem.

![only chips](https://i.imgur.com/Qjj5Zcw.png)

## Getting Started

If you are using [Codespaces], a dev server is automatically run when a codespace starts.

1. `git clone git@github.com:IliasDeros/virtual-chips.git`
2. `yarn && yarn start` or `./start.sh`
3. Visit app at http://localhost:1234/

[codespaces]: https://github.com/features/codespaces

## Testing

```
yarn test
yarn test --watch Chip.test
```

### Mocking

For unit tests, firebase is mocked with an in-memory realtime database. See `jest-mock-firebase.js`

### Set Up

To enable `jest` in a parcel project, we need to do the following:

1. Install Babel

```sh
yarn add -D jest babel-jest @babel/core @babel/preset-env
```

2. Configure Babel

```
// .babelrc
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

3. Disable babel on runtime

```
// .parcelrc
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{js,mjs,jsx,cjs,ts,tsx}": [
      "@parcel/transformer-js",
      "@parcel/transformer-react-refresh-wrap"
    ]
  }
}
```

4. For absolute imports, see `moduleNameMapper` in [jest.config.js](./jest.config.js)

### Debugging

In VSCode, add this configuration to your launch.json, and you can run a test file in debug mode

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Test",
      "program": "${workspaceFolder}/node_modules/jest/bin/jest",
      "args": ["--ci", "${file}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "sourceMaps": true
    }
  ]
}

```

## Contributing

This Front-End application groups code by feature.
It is inspired by the [Vertical Slice Architecture].

- `core/**` imports from `features` and `shared`
- `feature/**` imports from `shared`
- `shared/**` only imports from within `shared`

```
src/
  core/             // Business logic
  shared/           // No business logic.
  features/
    FeatureName/
      components/   // UI elements
        Feature.js
      modules/      // Logic that doesn't impact the UI
      constants.js  // Put magic values here
      utils.js      // Extract functions here
```

[vertical slice architecture]: https://www.youtube.com/watch?v=cVVMbuKmNes

## Tech Stack

Here's a non-exhaustive list of the technologies used in this project:

| Name                           | Use                                    |
| ------------------------------ | -------------------------------------- |
| [ReactJS]                      | DOM manipulation                       |
| [Redux]                        | State Management                       |
| [Firebase]                     | Sync data accross devices in real-time |
| [Parcel]                       | Bundling & Dev server                  |
| [Tailwind], [DaisyUI] & [SCSS] | Styling                                |
| [Framer Motion]                | Animations                             |
| [Jest] & [RTL] & [Babel]       | Testing                                |

[babel]: https://babeljs.io/
[daisyui]: https://daisyui.com/
[firebase]: https://firebase.google.com/products/realtime-database/
[framer motion]: https://www.framer.com/motion/
[jest]: https://jestjs.io/
[parcel]: https://parceljs.org/
[reactjs]: https://reactjs.org/
[redux]: https://redux.js.org/
[rtl]: https://testing-library.com/docs/react-testing-library/intro
[scss]: https://sass-lang.com/
[tailwind]: https://tailwindcss.com/

## Deploying

This application was set up to automatically push to firebase on `master` commits using:

```
npm install -g firebase-tools
firebase login --no-localhost
firebase init hosting
```

**Reference:** https://firebase.google.com/docs/hosting/quickstart#before_you_begin
