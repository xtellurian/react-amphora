import React from 'react'
// eslint-disable-next-line no-unused-vars
import * as a10a from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { UserManager } from 'oidc-client'
// import { getUserManager, OAuthConfig } from './userManager'

type Action = { type: 'login'; config: OAuthConfig } | { type: 'logout' }
type Dispatch = (action: Action) => void
type State = {
    userManager: UserManager
    amphoraApi?: a10a.AmphoraeApi
}
type CountProviderProps = { children: React.ReactNode }

const AmphoraStateContext = React.createContext<State | undefined>(undefined)
const AmphoraDispatchContext = React.createContext<Dispatch | undefined>(
    undefined
)

function reducer(state: State, action: Action) {
    switch (action.type) {
      // TODO: handle the actions
        case 'login': {
            return state
        }
        case 'logout': {
            return state
        }
        default: {
            throw new Error(`Unhandled action: ${action}`)
        }
    }
}

function AmphoraProvider({ children }: CountProviderProps) {
    const [state, dispatch] = React.useReducer(reducer, {})

    return (
        <AmphoraStateContext.Provider value={state}>
            <AmphoraDispatchContext.Provider value={dispatch}>
                {children}
            </AmphoraDispatchContext.Provider>
        </AmphoraStateContext.Provider>
    )
}

function useCountState() {
    const context = React.useContext(AmphoraStateContext)

    if (context === undefined) {
        throw new Error('useCountState must be used within a CountProvider')
    }

    return context
}

function useCountDispatch() {
    const context = React.useContext(AmphoraDispatchContext)

    if (context === undefined) {
        throw new Error('useCountDispatch must be used within a CountProvider')
    }

    return context
}

export { AmphoraProvider, useCountState, useCountDispatch }
