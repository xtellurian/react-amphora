import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { BasicAmphora } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState, AuthenticateAction } from './apiState'
import useAsyncReducer from './useAsyncReducer'
import { useAmphoraClients } from '../ApiClientContext'
// eslint-disable-next-line no-unused-vars
import * as Actions from '../actions'
// eslint-disable-next-line no-unused-vars
import { ContextProps, publish, publishResult, fromStatus } from '../props'

type AllActions = Actions.Search

type SearchDispatch = { dispatch: (action: AllActions) => void }
interface SearchState extends ApiState {
    results: BasicAmphora[]
}
const SearchStateContext = React.createContext<SearchState | undefined>({
    isAuthenticated: false,
    results: []
})
const DispatchContext = React.createContext<SearchDispatch | undefined>(
    undefined
)

const SearchApiProvider: React.FunctionComponent<ContextProps> = (props) => {
    const clients = useAmphoraClients()
    const reducer = async (
        state: SearchState,
        action: AllActions | AuthenticateAction
    ): Promise<SearchState> => {
        if (!state) {
            return {
                isAuthenticated: clients.isAuthenticated,
                results: []
            }
        } else if (action.type === 'isAuthenticated') {
            return {
                isAuthenticated: action.payload.value,
                results: state.results,
                isLoading: state.isLoading
            }
        } else {
            publish(props, action)
            try {
                const r = await clients.searchApi.searchSearchAmphorae(
                    action.payload.term
                )
                publishResult(props, {
                    type: fromStatus(action, r),
                    error: null,
                    action,
                    response: r,
                    payload: r.data
                })
                return {
                    isAuthenticated: state.isAuthenticated,
                    results: r.data,
                    isLoading: false
                }
            } catch (error) {
                publishResult(props, {
                    type: `${action.type}:failed`,
                    error: error,
                    action: action,
                    response: error
                })
            }
        }

        return state
    }

    const [state, dispatch] = useAsyncReducer(reducer, {
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
