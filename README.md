# RAG-2 frontend

## License

This project is available under the AGPL License. See [LICENSE](./LICENSE) for more information.

The application was created as part of the work of the Human-Computer Interaction Scientific Club "GEST" at the Rzeszów University of Technology.

## Compliance and distribution

If you modify this code and make it available to others, you must also make the modified source code available under the same AGPL-3.0 License. This applies especially if you deploy the modified software on a server or otherwise make it available over a network, in which case you must provide access to the modified source code to the users who interact with your version of the application.

Failure to comply with the terms of the AGPL license may result in legal consequences. It is important to follow the license terms when modifying, distributing, or deploying this software. Please ensure you understand and follow the obligations set forth in the [LICENSE](LICENSE) file.

## Description

A web application with mini-games that collects game data and connects AI models to game agents via WebSocket. Users can interact with game data, view statistics, and manage game history through dashboard panel. The system supports different user roles and simplifies adding new game titles.

An external service with minigames used exclusively in this repository is avalaible [here](https://github.com/KN-GEST-ongit/rag-2-games/). To import the library you need to build it and export. Then it depends on export's type (it is described in the repository of external games service). Link it locally using `npm run games:import` or install it using npm from `.tgz` file.

## Features

- Game data collecting and saving
- Real-time websocket connection with custom AI models
- Real-time game data preview in built-in console
- Users management with storage limits
- Data and account management in the dashboard

## Tech stack

- TypeScript 5.4
- Angular 18.0
- TailwindCSS 3.1
- FeatherIcons 4.29
- Karma 6.4
- Cypress 13.5
- ESLint 9.3
