import React from 'react'
import { withRouter } from 'react-router-dom'
import {
    UserInformationComponent,
    SignInButton,
    CallbackPage
} from 'react-amphora'
import { userManager } from './userManager'
import 'react-amphora/dist/index.css'

import SimpleSearch from './examples/SimpleAmphoraSearchComponent'

interface AppProps {
    location: any
    history: any
}

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
            <SignInButton />
            <SimpleSearch />
            <UserInformationComponent />
        </React.Fragment>
    )
}

export default withRouter(App)
