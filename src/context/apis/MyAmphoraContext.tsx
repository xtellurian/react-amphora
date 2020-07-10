import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { DetailedAmphora } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState, AuthenticateAction } from './apiState'
import useAsyncReducer from './useAsyncReducer'
import { useAmphoraClients } from '../ApiClientContext'

const SELF_SCOPE = 'self'
const ORG_SCOPE = 'organisation'
const ACCESS_TYPE_CREATED = 'created'
const ACCESS_TYPE_PURCHASED = 'purchased'
export type Scope = typeof SELF_SCOPE | typeof ORG_SCOPE
export type AccessType =
    | typeof ACCESS_TYPE_CREATED
    | typeof ACCESS_TYPE_PURCHASED

type Action = {
    type: 'fetch'
    payload: {
        scope?: Scope
        accessType?: AccessType
    }
}

type FetchMyAmphoraDispatch = { dispatch: (action: Action) => void }
const emptyState: MyAmphoraState = {
    isAuthenticated: false,
    results: [],
    selfCreatedResults: [],
    selfPurchasedResults: [],
    organisationCreatedResults: [],
    organisationPurchasedResults: []
}
interface MyAmphoraState extends ApiState {
    scope?: Scope
    accessType?: AccessType
    results: DetailedAmphora[]
    // and the specific scopes
    selfCreatedResults: DetailedAmphora[]
    selfPurchasedResults: DetailedAmphora[]
    organisationCreatedResults: DetailedAmphora[]
    organisationPurchasedResults: DetailedAmphora[]
}
const StateContext = React.createContext<MyAmphoraState | undefined>(emptyState)
const DispatchContext = React.createContext<FetchMyAmphoraDispatch | undefined>(
    undefined
)

const MyAmphoraApiProvider: React.FunctionComponent = (props) => {
    const clients = useAmphoraClients()
    const asyncReducer = async (
        state: MyAmphoraState,
        action: Action | AuthenticateAction
    ): Promise<MyAmphoraState> => {
        if (!state) {
            return {
                ...emptyState,
                isAuthenticated: clients.isAuthenticated
            }
        } else if (action.type === 'isAuthenticated') {
            return {
                ...state,
                isAuthenticated: action.payload.value
            }
        } else {
            const r = await clients.amphoraeApi.amphoraeList(
                action.payload.scope,
                action.payload.accessType
            )

            const results = Array.isArray(r.data) ? r.data : []

            return {
                isAuthenticated: state.isAuthenticated,
                scope: action.payload.scope,
                accessType: action.payload.accessType,
                results,
                selfCreatedResults:
                    action.payload.scope === 'self' &&
                    action.payload.accessType === 'created'
                        ? results
                        : state.selfCreatedResults,
                selfPurchasedResults:
                    action.payload.scope === 'self' &&
                    action.payload.accessType === 'purchased'
                        ? results
                        : state.selfPurchasedResults,
                organisationCreatedResults:
                    action.payload.scope === 'organisation' &&
                    action.payload.accessType === 'created'
                        ? results
                        : state.organisationCreatedResults,
                organisationPurchasedResults:
                    action.payload.scope === 'organisation' &&
                    action.payload.accessType === 'purchased'
                        ? results
                        : state.organisationPurchasedResults,
                isLoading: false,
                error: r.status > 299
            }
        }
    }

    const [state, dispatch] = useAsyncReducer(asyncReducer, {
        ...emptyState,
        isAuthenticated: clients.isAuthenticated
    })

    React.useEffect(() => {
        if (state.isAuthenticated !== clients.isAuthenticated) {
            dispatch({
                type: 'isAuthenticated',
                payload: { value: clients.isAuthenticated }
            })
        }
    }, [state.isAuthenticated, clients.isAuthenticated])

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={{ dispatch }}>
                {props.children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

function useMyAmphoraState(): MyAmphoraState {
    const context = React.useContext(StateContext)

    if (context === undefined) {
        throw new Error('useCountState must be used within a CountProvider')
    }

    return context
}

function useMyAmphoraDispatch(): FetchMyAmphoraDispatch {
    const context = React.useContext(DispatchContext)

    if (context === undefined) {
        throw new Error('useCountDispatch must be used within a CountProvider')
    }

    return context
}

function useMyAmphora(): MyAmphoraState & FetchMyAmphoraDispatch {
    const state = useMyAmphoraState()
    const dispatch = useMyAmphoraDispatch()
    return {
        ...state,
        ...dispatch
    }
}

const withMyAmphoraState = (Component: any) => {
    return (props: any) => {
        return (
            <StateContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </StateContext.Consumer>
        )
    }
}
const withFetchMyAmphoraDispatch = (Component: any) => {
    return (props: any) => {
        return (
            <DispatchContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </DispatchContext.Consumer>
        )
    }
}
const withMyAmphora = (Component: any) => {
    return withMyAmphoraState(withFetchMyAmphoraDispatch(Component))
}

export {
    MyAmphoraApiProvider,
    MyAmphoraState,
    FetchMyAmphoraDispatch,
    useMyAmphora,
    useMyAmphoraState,
    useMyAmphoraDispatch,
    withMyAmphora,
    withMyAmphoraState,
    withFetchMyAmphoraDispatch
}
