# react-amphora

> React Components for Amphora Data

[![NPM](https://img.shields.io/npm/v/react-amphora.svg)](https://www.npmjs.com/package/react-amphora) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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
import { IdentityContextProvider, AmphoraApiProvider, createUserManager } from 'react-amphora'
import { Configuration } from 'amphoradata'

// your application
import App from './App'

const userManager = createUserManager({
    clientId: 'your-client-id',
    redirectUri: 'http://localhost:3000/#/callback',
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

## How it works

### IdentityContextProvider

Identity Context Provider uses the [React Context API](https://reactjs.org/docs/context.html) to wrap the OAUTH and OIDC functionality of Amphora Data. Basically, it allows your users to login to your app with their Amphora Data account.

### AmphoraApiProvider

Amphora API Provider also uses the [React Context API](https://reactjs.org/docs/context.html). This time the Amphora Data Javascript SDK is wrapped in a provider. The API provider must be the child of an Identity Context provider.

## License

MIT © [xtellurian](https://github.com/xtellurian)
