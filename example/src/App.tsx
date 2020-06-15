import React from 'react'
import { withRouter } from 'react-router-dom'
import {
    ExampleComponent,
    SignInButton,
    CallbackPage
} from 'react-amphora'
import { userManager } from './userManager'
import 'react-amphora/dist/index.css'

interface AppProps {
    location: any
}

const App = (props: AppProps) => {
    if (props.location.hash.substring(0, 10) === '#/callback') {
        console.log('Loading callback page')
        const rest = props.location.hash.substring(10)
        return (
            <CallbackPage
                {...props}
                userManager={userManager}
                signInParams={`${rest}`}
            />
        )
    }
    return (
        <React.Fragment>
            <SignInButton />
            <ExampleComponent text='Create React Library Example 😄' />
        </React.Fragment>
    )
}

export default withRouter(App)
