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
interface MyAmphoraState extends ApiState {
    scope?: Scope
    accessType?: AccessType
    results: DetailedAmphora[]
}
const StateContext = React.createContext<MyAmphoraState | undefined>({
    isAuthenticated: false,
    results: []
})
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
                isAuthenticated: clients.isAuthenticated,
                results: []
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

            return {
                isAuthenticated: state.isAuthenticated,
                scope: action.payload.scope,
                accessType: action.payload.accessType,
                results: Array.isArray(r.data) ? r.data : [],
                isLoading: false,
                error: r.status > 299
            }
        }
    }

    const [state, dispatch] = useAsyncReducer(asyncReducer, {
        isAuthenticated: clients.isAuthenticated,
        results: []
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
