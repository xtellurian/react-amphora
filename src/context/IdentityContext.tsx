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
interface IdentityContextProps extends ContextProps {
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
