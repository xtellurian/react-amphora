import * as React from 'react'
import {
    Switch,
    Route,
    withRouter,
    RouteComponentProps
} from 'react-router-dom'
import { CallbackPage, UserInformationComponent } from 'react-amphora'
import { userManager } from './userManager'

import { Menu } from './Menu'
import { Components } from './Components'
import { Examples } from './Examples'
import Information from './Information'

const App: React.FunctionComponent<RouteComponentProps> = (props) => {
    if (props.location.hash.substring(0, 10) === '#/callback') {
        const rest = props.location.hash.substring(10)
        return (
            <CallbackPage
                {...props}
                signInParams={`${rest}`}
                userManager={userManager}
                onSignIn={() => props.history.push('/')}
                onSignInError={() => props.history.replace('/')}
            />
        )
    }
    return (
        <div>
            <Menu />
            <Switch>
                <Route exact path='/'>
                    <Information />
                    <UserInformationComponent />
                </Route>
                <Route path='/examples'>
                    <Examples />
                </Route>
                <Route path='/components'>
                    <Components />
                </Route>
            </Switch>
        </div>
    )
}

export default withRouter(App)
