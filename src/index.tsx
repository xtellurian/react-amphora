import * as React from 'react'
import {
    IdentityContextProvider,
    useIdentityDispatch,
    useIdentityState
} from './context/AmphoraIdentityContext'
import {
    CallbackPage,
    UserInformationComponent,
    SignInButton,
    createUserManager
} from './auth'
import {
    AmphoraApiProvider,
    useApiState,
    withAmphora,
    ApiState
} from './context/AmphoraApiContext'
import styles from './styles.module.css'

interface Props {
    text: string
}

export const ExampleComponent = ({ text }: Props) => {
    return <div className={styles.test}>Example Component: {text}</div>
}

export {
    IdentityContextProvider,
    useIdentityDispatch,
    useIdentityState,
    CallbackPage,
    UserInformationComponent,
    SignInButton,
    createUserManager,
    AmphoraApiProvider,
    useApiState,
    withAmphora,
    ApiState
}
