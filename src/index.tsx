import * as React from 'react'
import {
    AmphoraProvider,
    useAuthDispatch,
    useAuthState
} from './context/AmphoraAuthContext'
import {
    CallbackPage,
    UserInformationComponent,
    SignInButton,
    createUserManager
} from './auth'
import styles from './styles.module.css'

interface Props {
    text: string
}

export const ExampleComponent = ({ text }: Props) => {
    return <div className={styles.test}>Example Component: {text}</div>
}

export {
    AmphoraProvider,
    useAuthDispatch,
    useAuthState,
    CallbackPage,
    UserInformationComponent,
    SignInButton,
    createUserManager
}
