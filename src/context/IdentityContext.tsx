import React, { useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { UserManager, User } from 'oidc-client'
// eslint-disable-next-line no-unused-vars
import { ContextProps, publish } from './props'
// eslint-disable-next-line no-unused-vars
import * as Actions from './actions'

type IdentityAction = Actions.Login | Actions.Logout
type Dispatch = (action: IdentityAction) => void
type IdentityContextState = {
    userManager?: UserManager
    user?: User
}
export interface IdentityContextProps extends ContextProps {
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

const IdentityContextProvider: React.FunctionComponent<IdentityContextProps> = (
    props
) => {
    const reducer = (
        state: IdentityContextState,
        action: IdentityAction
    ): IdentityContextState => {
        publish(props, action)
        if (!state) {
            return {}
        }

        switch (action.type) {
            case 'authentication:login': {
                return {
                    userManager: state.userManager,
                    user: action.payload
                }
            }
            case 'authentication:logout': {
                if (state.userManager) {
                    state.userManager
                        .removeUser()
                        .then(() => console.log('User removed'))
                        .catch((e) => console.log(e))
                }
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
    const [state, dispatch] = React.useReducer(reducer, {
        userManager: props.userManager
    })

    props.userManager.events.addUserLoaded((user) => {
        console.log('userLoaded was triggered.')
        if (state.user !== user) {
            console.log(
                'addUserLoaded triggered a authentiction:login dispatch.'
            )
            dispatch({ type: 'authentication:login', payload: user })
        }
    })

    props.userManager.events.addUserUnloaded(() => {
        console.log('userUnloaded was triggered.')
        if (state.user && state.user.expired) {
            console.log(
                'userUnloaded triggered an authentication:logout dispatch.'
            )
            dispatch({ type: 'authentication:logout' })
        }
    })

    useEffect(() => {
        if (!state.user) {
            props.userManager
                .getUser()
                .then(
                    (payload) =>
                        payload &&
                        dispatch({ type: 'authentication:login', payload })
                )
                .catch((e) => console.log(`Error loading user, ${e}`))
        }
        if (state.user && state.user.expired) {
            props.userManager.removeUser()
            dispatch({
                type: 'authentication:logout'
            })
        }
    }, [props.userManager])

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

export { IdentityContextProvider, useIdentityState, useIdentityDispatch }
