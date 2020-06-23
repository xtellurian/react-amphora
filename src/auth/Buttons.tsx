import * as React from 'react'
import { useIdentityState } from '../context/IdentityContext'
import styles from './auth.module.css'

interface ButtonProps {
    alwaysOn?: boolean
}

const SignInButton: React.FunctionComponent<ButtonProps> = (props) => {
    const context = useIdentityState()
    const signIn = () => {
        context.userManager &&
            context.userManager.signinRedirect({ data: { path: '/' } })
    }
    if (!context.user || context.user.expired) {
        // can sign in
        return (
            <div className={styles.signIn} onClick={() => signIn()}>
                {props.children || 'Sign In with Amphora'}
            </div>
        )
    } else if (props.alwaysOn) {
        return (
            <div className={styles.signIn}>
                Hello {context.user && context.user.profile.name}!
            </div>
        )
    } else {
        return <React.Fragment />
    }
}

const SignOutButton: React.FunctionComponent<ButtonProps> = (props) => {
    const context = useIdentityState()
    const signOut = () => {
        context.userManager && context.userManager.signoutRedirect()
    }
    if (context.user) {
        // user is already signed in
        return (
            <div className={styles.signIn} onClick={() => signOut()}>
                {props.children || 'Sign Out'}
            </div>
        )
    } else if (props.alwaysOn) {
        return (
            <div className={styles.signIn}>
                {props.children || 'Signed Out'}
            </div>
        )
    } else {
        return <React.Fragment />
    }
}

export { SignInButton, SignOutButton }
