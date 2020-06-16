import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { useAuthState } from '../context/AmphoraAuthContext'
import styles from './auth.module.css'

interface LoginButtonProps {
    children?: JSX.Element
}

export const SignInButton = (props: LoginButtonProps): JSX.Element => {
    const context = useAuthState()
    if (context.user && !context.user.expired) {
        // user is already signed in
        return (
            <div className={styles.signIn}>
                Hello {context.user && context.user.profile.name}!
            </div>
        )
    }
    const signIn = () => {
        context.userManager &&
            context.userManager.signinRedirect({ data: { path: '/' } })
    }
    return (
        <div className={styles.signIn} onClick={() => signIn()}>
            {props.children || 'Sign In with Amphora'}
        </div>
    )
}
