import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AmphoraProvider } from 'react-amphora'
import { userManager } from './userManager'

ReactDOM.render(
    <Router>
        <AmphoraProvider userManager={userManager}>
            <App />
        </AmphoraProvider>
    </Router>,
    document.getElementById('root')
)
