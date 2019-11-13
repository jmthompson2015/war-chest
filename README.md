# War Chest Board Game

Play the game: [War Chest](https://cdn.jsdelivr.net/gh/jmthompson2015/war-chest/app/src/WarChestApp.html)

## Built With

- [ESLint](https://eslint.org/) - Find and fix problems in your JavaScript code.
- [QUnit](https://qunitjs.com/) - JavaScript unit testing.
- [Ramda](https://ramdajs.com) - A practical functional library for JavaScript programmers.
- [React](http://facebook.github.io/react/) - A JavaScript library for building user interfaces.
- [Redux](https://redux.js.org/) - A predictable state container for JavaScript apps.
- [Seamless-Immutable](https://github.com/rtfeldman/seamless-immutable) - Immutable JS data structures which are backwards-compatible with normal Arrays and Objects.
- [Tachyons](http://tachyons.io) - An atomic CSS library.

## Architecture

#### Artifact

Contains game data implemented as constant enumerations. (e.g. Phase, Team, UnitCoin, etc.)

#### State

Provides a serializable game state using Redux.

#### Model

Provides the game rules and processes.

#### View

Provides the GUI components using React.

#### Container

Provides bindings from Redux state to React views.

#### App

Provides integration of components to form the application.

## License

War Chest Board Game is released under the terms of the [MIT License](https://github.com/jmthompson2015/war-chest/blob/master/LICENSE).

---

War Chest and all related properties, images and text are owned by [Alderac Entertainment Group](https://www.alderac.com/warchest/).
