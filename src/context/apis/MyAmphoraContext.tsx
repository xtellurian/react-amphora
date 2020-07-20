import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { DetailedAmphora } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState, AuthenticateAction } from './apiState'
import useAsyncReducer from './useAsyncReducer'
import { useAmphoraClients } from '../ApiClientContext'
// eslint-disable-next-line no-unused-vars
import { FetchMyAmphora } from '../actions'
// eslint-disable-next-line no-unused-vars
import { ContextProps, publish, publishResult, fromStatus } from '../props'
const SELF_SCOPE = 'self'
const ORG_SCOPE = 'organisation'
const ACCESS_TYPE_CREATED = 'created'
const ACCESS_TYPE_PURCHASED = 'purchased'
export type Scope = typeof SELF_SCOPE | typeof ORG_SCOPE
export type AccessType =
    | typeof ACCESS_TYPE_CREATED
    | typeof ACCESS_TYPE_PURCHASED

type FetchMyAmphoraDispatch = { dispatch: (action: FetchMyAmphora) => void }
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
const MyAmphoraStateContext = React.createContext<MyAmphoraState | undefined>(
    emptyState
)
const DispatchContext = React.createContext<FetchMyAmphoraDispatch | undefined>(
    undefined
)

const MyAmphoraApiProvider: React.FunctionComponent<ContextProps> = (props) => {
    const clients = useAmphoraClients()
    const asyncReducer = async (
        state: MyAmphoraState,
        action: FetchMyAmphora | AuthenticateAction
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
        } else if (action.type === 'my-amphora:fetch-list') {
            publish(props, action)
            const r = await clients.amphoraeApi.amphoraeList(
                action.payload.scope,
                action.payload.accessType
            )
            const results = Array.isArray(r.data) ? r.data : []
            publishResult(props, {
                type: fromStatus(action, r),
                action,
                response: r,
                payload: results
            })
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
        } else {
            return state
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
        <MyAmphoraStateContext.Provider value={state}>
            <DispatchContext.Provider value={{ dispatch }}>
                {props.children}
            </DispatchContext.Provider>
        </MyAmphoraStateContext.Provider>
    )
}

function useMyAmphoraState(): MyAmphoraState {
    const context = React.useContext(MyAmphoraStateContext)

    if (context === undefined) {
        throw new Error(
            'useMyAmphoraState must be used within a MyAmphoraStateContextProvider'
        )
    }

    return context
}

function useMyAmphoraDispatch(): FetchMyAmphoraDispatch {
    const context = React.useContext(DispatchContext)

    if (context === undefined) {
        throw new Error(
            'useMyAmphoraDispatch must be used within a MyAmphoraStateContextProvider'
        )
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
            <MyAmphoraStateContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </MyAmphoraStateContext.Consumer>
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
