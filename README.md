## Getting Started

#### 1. Get the latest version

You can start by cloning the latest version of project on your
local machine by running:

```shell
$ git clone https://github.com/sanjay1407/node-express-starter.git MyApp
$ cd MyApp
```
#### 2. Run `yarn install` or `npm install`

This will install both run-time project dependencies and developer tools listed
in [package.json](package.json) file.

#### 3. Run `yarn start` or `npm start`

This command will start the server at
> [http://localhost:3000/](http://localhost:3000/)

or port specified in `process.env.PORT`

Whenever you modify any of the source files inside the project folder, the app will recompile.

#### 4. Build, Lint, Test

##### - Build the app:

```shell
$ yarn run build
```
or
`npm run build`

After running this command, the `/dist` folder will contain the compiled version of the app.

##### - Check the source code against lint rules:

```shell
$ yarn run lint
```
or
`npm run lint`

##### - Execute unit tests:

```shell
$ yarn test
```
or
`npm test`