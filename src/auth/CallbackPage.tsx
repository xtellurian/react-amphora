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
}

export const CallbackPage = (props: CallbackPageProps) => {
    const context = useIdentityDispatch()
    const successCallback = (user: User): void => {
        if (props.onSignIn) {
            props.onSignIn(user)
        }
        context({ type: 'authentication:login', payload: user })
    }

    const errorCallback = (error: Error): void => {
        console.log(error)
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

    return <div>Loading...</div>
}
