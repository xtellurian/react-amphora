import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { BasicAmphora } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState } from './apiState'
import useAsyncReducer from './useAsyncReducer'
import { useAmphoraClients } from '../ApiClientContext'

type Action = {
    type: 'search'
    payload: {
        term?: string
    }
}

type SearchDispatch = { dispatch: (action: Action) => void }
interface SearchState extends ApiState {
    results: BasicAmphora[]
}
const StateContext = React.createContext<SearchState | undefined>({
    results: []
})
const DispatchContext = React.createContext<SearchDispatch | undefined>(
    undefined
)

const SearchApiProvider: React.FunctionComponent = (props) => {
    const apiContext = useAmphoraClients()
    const reducer = async (
        state: SearchState,
        action: Action
    ): Promise<SearchState> => {
        if (!state) {
            return {
                results: []
            }
        } else {
            const r = await apiContext.searchApi.searchSearchAmphorae(
                action.payload.term
            )
            return { results: r.data, isLoading: false }
        }
    }

    const [state, dispatch] = useAsyncReducer(reducer, {
        results: []
    })

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={{ dispatch }}>
                {props.children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

function useSearchState(): SearchState {
    const context = React.useContext(StateContext)

    if (context === undefined) {
        throw new Error('useCountState must be used within a CountProvider')
    }

    return context
}

function useSearchDispatch(): SearchDispatch {
    const context = React.useContext(DispatchContext)

    if (context === undefined) {
        throw new Error('useCountDispatch must be used within a CountProvider')
    }

    return context
}

const withSearchState = (Component: any) => {
    return (props: any) => {
        return (
            <StateContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </StateContext.Consumer>
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
