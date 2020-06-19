import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { IdentityContextProvider, AmphoraApiProvider } from 'react-amphora'
import { userManager } from './userManager'
import { Configuration } from 'amphoradata'

const initalConfiguration = new Configuration()

ReactDOM.render(
    <Router>
        <IdentityContextProvider userManager={userManager}>
            <AmphoraApiProvider configuration={initalConfiguration}>
                <App />
            </AmphoraApiProvider>
        </IdentityContextProvider>
    </Router>,
    document.getElementById('root')
)
