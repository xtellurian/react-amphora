import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { User, UserManager } from 'oidc-client'
import { useEffect } from 'react'
import { useIdentityDispatch } from '../context/IdentityContext'

interface CallbackPageProps {
    onSignIn?: (user: User) => void
    onSignInError?: (e: Error) => void
    userManager: UserManager
    signInParams: string
    clearStateOnInitialise?: boolean
}

export const CallbackPage: React.FC<CallbackPageProps> = (props) => {
    if (props.clearStateOnInitialise) {
        props.userManager
            .clearStaleState()
            .then(() => console.log('Cleared state state'))
            .catch((e) => console.log(e))
    }
    const context = useIdentityDispatch()
    const successCallback = (user: User): void => {
        context({ type: 'authentication:login', payload: user })
        if (props.onSignIn) {
            props.onSignIn(user)
        }
    }

    const errorCallback = (error: Error): void => {
        console.log(error)
        props.userManager
            .clearStaleState()
            .then(() => console.log('User Manager state was cleared'))
            .catch((e) =>
                console.log(`Error clearning User Manager state: ${e}`)
            )
        if (props.onSignInError) {
            props.onSignInError(error)
        }
    }

    // by default userManager gets params from the current route
    // eg. 'localhost:5100/callback#token_id=...&session_state=...
    //                              ------------------------------
    // this doesn't work when using hash history as the first hash messed up the process
    // eg. 'localhost:5100/#/callback#token_id=...&session_state=...
    // need to pass the token manually to signinRedirectCallback function

    useEffect(() => {
        props.userManager
            .signinRedirectCallback(props.signInParams)
            .then((user) => successCallback(user))
            .catch((error) => errorCallback(error))
    })

    return <React.Fragment>{props.children || 'Loading...'}</React.Fragment>
}
