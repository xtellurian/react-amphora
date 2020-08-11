# react-amphora

> React Components for Amphora Data

[![NPM](https://img.shields.io/npm/v/react-amphora.svg)](https://www.npmjs.com/package/react-amphora) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) ![Node.js Package](https://github.com/xtellurian/react-amphora/workflows/Node.js%20Package/badge.svg)

## Examples

You can see the example application [here](https://react-amphora-example.xtellurian.vercel.app/)

The application deployed there is under /example in this repo.


## Install

With NPM

```bash
npm install --save react-amphora
```

or with Yarn

```bash
yarn add react-amphora
```

## Usage

```tsx
import * as React from 'react'
import ReactDOM from 'react-dom'
import { AmphoraProvider, createUserManager } from 'react-amphora'
import { Configuration } from 'amphoradata'

// your application
import App from './App'

// make sure to import the css
import 'react-amphora/dist/index.css'

const userManager = createUserManager({
    clientId: 'your-client-id',
    redirectUri: 'http://localhost:3000/#/callback'
})

const initalConfiguration = new Configuration()

ReactDOM.render(
    <AmphoraProvider
        userManager={userManager}
        configuration={initalConfiguration}
    >
        <App />
    </AmphoraProvider>,
    document.getElementById('root')
)
```

## OAuth Callback

To login with Amphora, you need to be able to handle the OAuth callback to your application. `react-amphora` provides a component to handle this for you. When the callpath path is requested (e.g. `/#/callback/` ) you can render the <CallbackPage/> component.

```tsx
import * as React from 'react'
import { CallbackPage } from 'react-amphora'
import { userManager } from './userManager'

const App = (props: AppProps) => {
    if (props.location.hash.substring(0, 10) === '#/callback') {
        const rest = props.location.hash.substring(10)
        return (
            <CallbackPage
                onSignIn={props.history.push('/')}
                {...props}
                userManager={userManager}
                signInParams={`${rest}`}
            />
        )
    }
    return (
        <React.Fragment>
            <YourApplicationComponents />
        </React.Fragment>
    )
}
```

## Themes

`react-amphora` uses Styled Components to apply CSS to components. You can apply your own global themes by introducing your own `ThemeProvider`, or by passing a theme object into the AmphoraProvider

```tsx
import { AmphoraProvider, Theme } from 'react-amphora'
const myTheme: Theme = {
    colors: {
        highlight: 'red',
        main: 'blue',
        secondary: 'green'
    }
}

return (
    <AmphoraProvider theme={myTheme}>
        <App />
    </AmphoraProvider>
)
```

## Events

Callbacks are provided for you to response to API events. Pass a callback function into the provider to listen to actions (from the app) and action results (from the server)

```tsx
import { AmphoraProvider, Actions } from 'react-amphora'
const logAction = (action: Actions.Action) => {
    console.log(action.type)
}
const logActionResult = (actionResult: Actions.ActionResult) => {
    console.log(actionResult.type)
}
return (
    <AmphoraProvider onAction={logAction} onActionResult={logActionResult}>
        <App />
    </AmphoraProvider>
)
```

## Styling

`react-amphora` uses [Styled Components](https://github.com/styled-components/styled-components/). It is included as a dependency.

> NOTE: if you have trouble with styled components and react-native, you may need to incude a `.yarnclean` file in the root of your project.


[.yarnclean](.yarnclean)
```
@types/react-native
```

## How it works

### IdentityContextProvider

Identity Context Provider uses the [React Context API](https://reactjs.org/docs/context.html) to wrap the OAUTH and OIDC functionality of Amphora Data. Basically, it allows your users to login to your app with their Amphora Data account.

### AmphoraApiProvider

Amphora API Provider also uses the [React Context API](https://reactjs.org/docs/context.html). This time the Amphora Data Javascript SDK is wrapped in a provider. The API provider must be the child of an Identity Context provider.

## Releasing

When you want to release a new pre-release version, just run these commands:

```sh
yarn version --prerelease
git push
```

and a new version with be published to NPM

## License

MIT © [xtellurian](https://github.com/xtellurian)
