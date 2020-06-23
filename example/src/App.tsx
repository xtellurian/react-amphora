import React from 'react'
import { withRouter } from 'react-router-dom'
import Information from './Information'
import {
    UserInformationComponent,
    SignInButton,
    CallbackPage,
    SignOutButton
} from 'react-amphora'
import { userManager } from './userManager'
import 'react-amphora/dist/index.css'
import './index.css'

import SearchBar from './examples/SearchBar'
import SearchResults from './examples/SearchResults'

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
            <Information />

            <div>
                <h3>Try the sign in button below to see how it works...</h3>
                <br />
            </div>
            <div>
                <div className='row'>
                    <div className='col'>
                        <h4>Sign In/Out Button Components</h4>
                        <SignInButton />
                        <SignOutButton />
                    </div>

                    <div className='col'>
                        <h4>User Information Component</h4>
                        <UserInformationComponent />
                    </div>
                </div>
            </div>
            <hr/>
            <SearchBar />
            <SearchResults />
        </React.Fragment>
    )
}

export default withRouter(App)
