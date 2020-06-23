import React, { useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { UserManager, User } from 'oidc-client'

type Action = { type: 'login'; payload: User } | { type: 'logout' }
type Dispatch = (action: Action) => void
type AuthState = {
    userManager?: UserManager
    user?: User
}
type AmphoraProviderProps = {
    userManager: UserManager
}

const AmphoraAuthStateContext = React.createContext<AuthState | undefined>({
    userManager: undefined,
    user: undefined
})
const AmphoraAuthDispatchContext = React.createContext<Dispatch | undefined>(
    undefined
)

function reducer(state: AuthState, action: Action): AuthState {
    if (!state) {
        return {}
    }

    switch (action.type) {
        case 'login': {
            return {
                userManager: state.userManager,
                user: action.payload
            }
        }
        case 'logout': {
            return {
                user: undefined,
                userManager: state.userManager
            }
        }
        default: {
            throw new Error(`Unhandled action: ${action}`)
        }
    }
}

const IdentityContextProvider: React.FunctionComponent<AmphoraProviderProps> = (
    props
) => {
    const [state, dispatch] = React.useReducer(reducer, {
        userManager: props.userManager
    })
    useEffect(() => {
        if (!state.user) {
            props.userManager
                .getUser()
                .then(
                    (payload) => payload && dispatch({ type: 'login', payload })
                )
                .catch((e) => console.log(`Error loading user, ${e}`))
        }
    })
    return (
        <AmphoraAuthStateContext.Provider value={state}>
            <AmphoraAuthDispatchContext.Provider value={dispatch}>
                {props.children}
            </AmphoraAuthDispatchContext.Provider>
        </AmphoraAuthStateContext.Provider>
    )
}

function useIdentityState(): AuthState {
    const context = React.useContext(AmphoraAuthStateContext)

    if (context === undefined) {
        throw new Error('useCountState must be used within a CountProvider')
    }

    return context
}

function useIdentityDispatch(): Dispatch {
    const context = React.useContext(AmphoraAuthDispatchContext)

    if (context === undefined) {
        throw new Error('useCountDispatch must be used within a CountProvider')
    }

    return context
}

export { IdentityContextProvider, useIdentityState, useIdentityDispatch }
