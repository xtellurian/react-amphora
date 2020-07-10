import React, { useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { UserManager, User } from 'oidc-client'

type Action = { type: 'login'; payload: User } | { type: 'logout' }
type Dispatch = (action: Action) => void
type IdentityContextState = {
    userManager?: UserManager
    user?: User
}
type IdentityContextProps = {
    userManager: UserManager
}

const AmphoraAuthStateContext = React.createContext<
    IdentityContextState | undefined
>({
    userManager: undefined,
    user: undefined
})
const AmphoraAuthDispatchContext = React.createContext<Dispatch | undefined>(
    undefined
)

function reducer(
    state: IdentityContextState,
    action: Action
): IdentityContextState {
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

const IdentityContextProvider: React.FunctionComponent<IdentityContextProps> = (
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
        if (state.user && state.user.expired) {
            props.userManager.removeUser()
            dispatch({
                type: 'logout'
            })
        }
    }, [props.userManager, state.user, state])

    return (
        <AmphoraAuthStateContext.Provider value={state}>
            <AmphoraAuthDispatchContext.Provider value={dispatch}>
                {props.children}
            </AmphoraAuthDispatchContext.Provider>
        </AmphoraAuthStateContext.Provider>
    )
}

function useIdentityState(): IdentityContextState {
    const context = React.useContext(AmphoraAuthStateContext)

    if (context === undefined) {
        throw new Error(
            'useIdentityState must be used within a AmphoraAuthStateContextProvider'
        )
    }

    return context
}

function useIdentityDispatch(): Dispatch {
    const context = React.useContext(AmphoraAuthDispatchContext)

    if (context === undefined) {
        throw new Error(
            'useIdentityDispatch must be used within a AmphoraAuthStateContextProvider'
        )
    }

    return context
}

export {
    IdentityContextProps,
    IdentityContextProvider,
    useIdentityState,
    useIdentityDispatch
}
