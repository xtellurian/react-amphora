import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AmphoraProvider, Actions } from 'react-amphora'
import { userManager } from './userManager'
import { Configuration } from 'amphoradata'
import 'bootstrap/dist/css/bootstrap.min.css';
const initalConfiguration = new Configuration()

const logAction = (action: Actions.Action) => {
    console.log(action.type)
}
const logActionResult = (actionResult: Actions.ActionResult) => {
    console.log(actionResult.type)
}
ReactDOM.render(
    <Router>
        <AmphoraProvider
            userManager={userManager}
            configuration={initalConfiguration}
            onAction={logAction}
            onActionResult={logActionResult}
        >
            <App />
        </AmphoraProvider>
    </Router>,
    document.getElementById('root')
)
