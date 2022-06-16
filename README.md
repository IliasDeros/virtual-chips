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

All actions and reducers are unit-tested. Execute tests by running `yarn test`.

**Note:** A recent update to firebase has broken all the mocks, so it is not possible to run unit tests at the moment

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

[reactjs]: https://reactjs.org/
[redux]: https://redux.js.org/
[firebase]: https://firebase.google.com/products/realtime-database/
[parcel]: https://parceljs.org/
[tailwind]: https://tailwindcss.com/
[daisyui]: https://daisyui.com/
[scss]: https://sass-lang.com/
[framer motion]: https://www.framer.com/motion/

## Deploying

This application was set up to automatically push to firebase on `master` commits using:

```
npm install -g firebase-tools
firebase login --no-localhost
firebase init hosting
```

**Reference:** https://firebase.google.com/docs/hosting/quickstart#before_you_begin
