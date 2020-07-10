import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { TermsOfUse } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState, AuthenticateAction } from './apiState'
import useAsyncReducer from './useAsyncReducer'
import { useAmphoraClients } from '../ApiClientContext'

interface FetchAction {
    type: 'fetch-terms'
}

interface CreateAction {
    type: 'create-terms'
    payload: {
        model: TermsOfUse
    }
}

type AllActions = FetchAction | CreateAction

type TermsDispatch = {
    dispatch: (action: AllActions) => void
}
interface TermsState extends ApiState {
    results: TermsOfUse[]
}
const StateContext = React.createContext<TermsState | undefined>({
    isAuthenticated: false,
    results: []
})
const DispatchContext = React.createContext<TermsDispatch | undefined>(
    undefined
)

const TermsApiProvider: React.FunctionComponent = (props) => {
    const clients = useAmphoraClients()
    const reducer = async (
        state: TermsState,
        action: AllActions | AuthenticateAction
    ): Promise<TermsState> => {
        if (!state) {
            return {
                isAuthenticated: clients.isAuthenticated,
                results: []
            }
        } else if (action.type === 'isAuthenticated') {
            return {
                isAuthenticated: action.payload.value,
                results: state.results
            }
        } else if (action.type === 'create-terms') {
            const createResult = await clients.termsOfUseApi.termsOfUseCreate(
                action.payload.model
            )
            return {
                isAuthenticated: clients.isAuthenticated,
                results: [...state.results, createResult.data],
                isLoading: false,
                error: createResult.status > 299 && createResult.statusText
            }
        } else if (action.type === 'fetch-terms') {
            const listResult = await clients.termsOfUseApi.termsOfUseList()
            return {
                isAuthenticated: clients.isAuthenticated,
                isLoading: false,
                results: listResult.data,
                error: listResult.status > 299 && listResult.statusText
            }
        } else {
            return state
        }
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
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={{ dispatch }}>
                {props.children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

function useTermsState(): TermsState {
    const context = React.useContext(StateContext)

    if (context === undefined) {
        throw new Error('useCountState must be used within a CountProvider')
    }

    return context
}

function useTermsDispatch(): TermsDispatch {
    const context = React.useContext(DispatchContext)

    if (context === undefined) {
        throw new Error('useCountDispatch must be used within a CountProvider')
    }

    return context
}

const withTermsState = (Component: any) => {
    return (props: any) => {
        return (
            <StateContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </StateContext.Consumer>
        )
    }
}
const withTermsDispatch = (Component: any) => {
    return (props: any) => {
        return (
            <DispatchContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </DispatchContext.Consumer>
        )
    }
}
const withTerms = (Component: any) => {
    return withTermsState(withTermsDispatch(Component))
}

export {
    TermsApiProvider,
    TermsState,
    TermsDispatch,
    useTermsState,
    useTermsDispatch,
    withTerms,
    withTermsState,
    withTermsDispatch
}