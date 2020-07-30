import * as React from 'react'
import { SearchState, SearchDispatch } from './searchModel'
import { getReducer } from './searchReducer'
import useAsyncReducer from '../useAsyncReducer'
import { useAmphoraClients } from '../../ApiClientContext'

// eslint-disable-next-line no-unused-vars
import { ContextProps, publish, publishResult } from '../../props'

const SearchStateContext = React.createContext<SearchState | undefined>({
    isAuthenticated: false,
    results: []
})
const DispatchContext = React.createContext<SearchDispatch | undefined>(
    undefined
)

const SearchApiProvider: React.FunctionComponent<ContextProps> = (props) => {
    const clients = useAmphoraClients()
    const searchReducer = getReducer(
        clients,
        (a) => publish(props, a),
        (ar) => publishResult(props, ar)
    )
    const [state, dispatch] = useAsyncReducer(searchReducer, {
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
        <SearchStateContext.Provider value={state}>
            <DispatchContext.Provider value={{ dispatch }}>
                {props.children}
            </DispatchContext.Provider>
        </SearchStateContext.Provider>
    )
}

function useSearchState(): SearchState {
    const context = React.useContext(SearchStateContext)

    if (context === undefined) {
        throw new Error(
            'useSearchState must be used within a SearchStateContext Provider'
        )
    }

    return context
}

function useSearchDispatch(): SearchDispatch {
    const context = React.useContext(DispatchContext)

    if (context === undefined) {
        throw new Error(
            'useSearchDispatch must be used within a SearchStateContext Provider'
        )
    }

    return context
}

const withSearchState = (Component: any) => {
    return (props: any) => {
        return (
            <SearchStateContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </SearchStateContext.Consumer>
        )
    }
}
const withSearchDispatch = (Component: any) => {
    return (props: any) => {
        return (
            <DispatchContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </DispatchContext.Consumer>
        )
    }
}
const withSearch = (Component: any) => {
    return withSearchState(withSearchDispatch(Component))
}

export {
    SearchApiProvider,
    SearchState,
    SearchDispatch,
    useSearchState,
    useSearchDispatch,
    withSearch,
    withSearchState,
    withSearchDispatch
}
