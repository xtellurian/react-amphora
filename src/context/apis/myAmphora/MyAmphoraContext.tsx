import * as React from 'react'
import {
    emptyState,
    MyAmphoraState,
    FetchMyAmphoraDispatch
} from './myAmphoraModel'
import { getReducer, isLoadingReducer } from './myAmphoraReducer'
import useAsyncReducer from '../../../utility/useAsyncReducer'
import { useAmphoraClients } from '../../ApiClientContext'

// eslint-disable-next-line no-unused-vars
import { ContextProps, publish, publishResult } from '../../props'

const MyAmphoraStateContext = React.createContext<MyAmphoraState | undefined>(
    emptyState
)
const DispatchContext = React.createContext<FetchMyAmphoraDispatch | undefined>(
    undefined
)

const MyAmphoraApiProvider: React.FunctionComponent<ContextProps> = (props) => {
    const clients = useAmphoraClients()
    const asyncReducer = getReducer(
        clients,
        (a) => publish(props, a),
        (ar) => publishResult(props, ar)
    )
    const [state, dispatch] = useAsyncReducer(
        asyncReducer,
        {
            ...emptyState,
            isAuthenticated: clients.isAuthenticated
        },
        isLoadingReducer
    )

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
