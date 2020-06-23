import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AmphoraProvider } from 'react-amphora'
import { userManager } from './userManager'
import { Configuration } from 'amphoradata'

const initalConfiguration = new Configuration()

ReactDOM.render(
    <Router>
        <AmphoraProvider
            userManager={userManager}
            configuration={initalConfiguration}
        >
            <App />
        </AmphoraProvider>
    </Router>,
    document.getElementById('root')
)
