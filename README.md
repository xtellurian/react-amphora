# react-amphora

> React Components for Amphora Data

[![NPM](https://img.shields.io/npm/v/react-amphora.svg)](https://www.npmjs.com/package/react-amphora) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) ![Node.js Package](https://github.com/xtellurian/react-amphora/workflows/Node.js%20Package/badge.svg)

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
import {
    IdentityContextProvider,
    AmphoraApiProvider,
    createUserManager
} from 'react-amphora'
import { Configuration } from 'amphoradata'

// your application
import App from './App'

const userManager = createUserManager({
    clientId: 'your-client-id',
    redirectUri: 'http://localhost:3000/#/callback'
})

const initalConfiguration = new Configuration()

ReactDOM.render(
    <IdentityContextProvider userManager={userManager}>
        <AmphoraApiProvider configuration={initalConfiguration}>
            <App />
        </AmphoraApiProvider>
    </IdentityContextProvider>,
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

## Example Site

There is an example application under /example. You can see the deployed app [here](https://react-amphora-example.xtellurian.vercel.app/)

## How it works

### IdentityContextProvider

Identity Context Provider uses the [React Context API](https://reactjs.org/docs/context.html) to wrap the OAUTH and OIDC functionality of Amphora Data. Basically, it allows your users to login to your app with their Amphora Data account.

### AmphoraApiProvider

Amphora API Provider also uses the [React Context API](https://reactjs.org/docs/context.html). This time the Amphora Data Javascript SDK is wrapped in a provider. The API provider must be the child of an Identity Context provider.

## License

MIT © [xtellurian](https://github.com/xtellurian)
