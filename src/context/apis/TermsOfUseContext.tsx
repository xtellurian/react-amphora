import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { TermsOfUse } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState, AuthenticateAction } from './apiState'
import useAsyncReducer from './useAsyncReducer'
import { useAmphoraClients } from '../ApiClientContext'
// eslint-disable-next-line no-unused-vars
import * as Actions from '../actions'
// eslint-disable-next-line no-unused-vars
import { ContextProps, publish, publishResult } from '../props'

type AllActions =
    | Actions.FetchTerms
    | Actions.FetchSingleTerms
    | Actions.CreateTerms

type TermsDispatch = {
    dispatch: (action: AllActions) => void
}
interface TermsState extends ApiState {
    results: TermsOfUse[]
}
const TermsStateContext = React.createContext<TermsState | undefined>({
    isAuthenticated: false,
    results: []
})
const DispatchContext = React.createContext<TermsDispatch | undefined>(
    undefined
)

const TermsApiProvider: React.FunctionComponent<ContextProps> = (props) => {
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
        } else if (action.type === 'terms:create') {
            publish(props, action)
            try {
                const createResult = await clients.termsOfUseApi.termsOfUseCreate(
                    action.payload.model
                )
                publishResult(props, {
                    type: `${action.type}:${
                        createResult.status > 299 ? 'failed' : 'succeeded'
                    }`,
                    error: null,
                    action: action,
                    payload: createResult.data,
                    response: createResult
                })
                return {
                    isAuthenticated: clients.isAuthenticated,
                    results: [...state.results, createResult.data],
                    isLoading: false,
                    error: createResult.status > 299 && createResult.statusText
                }
            } catch (error) {
                publishResult(props, {
                    type: `${action.type}:failed`,
                    error: error,
                    action: action,
                    response: error
                })
            }
        } else if (action.type === 'terms:fetch-list') {
            publish(props, action)
            try {
                const listResult = await clients.termsOfUseApi.termsOfUseList()
                publishResult(props, {
                    type: `${action.type}:${
                        listResult.status > 299 ? 'failed' : 'succeeded'
                    }`,
                    error: null,
                    action: action,
                    payload: listResult.data,
                    response: listResult
                })
                return {
                    isAuthenticated: clients.isAuthenticated,
                    isLoading: false,
                    results: listResult.data,
                    error: listResult.status > 299 && listResult.statusText
                }
            } catch (error) {
                publishResult(props, {
                    type: `${action.type}:failed`,
                    error: error,
                    action: action,
                    response: error
                })
            }
        } else if (action.type === 'terms:fetch-single') {
            publish(props, action)
            const current = state.results || []
            // remove from state if it's already there
            const filtered = current.filter((r) => r.id !== action.payload.id)
            try {
                const fetchResult = await clients.termsOfUseApi.termsOfUseRead(
                    action.payload.id
                )
                publishResult(props, {
                    type: `${action.type}:${
                        fetchResult.status > 299 ? 'failed' : 'succeeded'
                    }`,
                    error: null,
                    action: action,
                    payload: fetchResult.data,
                    response: fetchResult
                })
                return {
                    isAuthenticated: clients.isAuthenticated,
                    isLoading: false,
                    results: [...filtered, fetchResult.data],
                    error: fetchResult.status > 299 && fetchResult.statusText
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
        // fall through
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
        <TermsStateContext.Provider value={state}>
            <DispatchContext.Provider value={{ dispatch }}>
                {props.children}
            </DispatchContext.Provider>
        </TermsStateContext.Provider>
    )
}

function useTermsState(): TermsState {
    const context = React.useContext(TermsStateContext)

    if (context === undefined) {
        throw new Error(
            'useTermsState must be used within a TermsStateContext Provider'
        )
    }

    return context
}

function useTermsDispatch(): TermsDispatch {
    const context = React.useContext(DispatchContext)

    if (context === undefined) {
        throw new Error(
            'useTermsDispatch must be used within a TermsStateContext Provider'
        )
    }

    return context
}

const withTermsState = (Component: any) => {
    return (props: any) => {
        return (
            <TermsStateContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </TermsStateContext.Consumer>
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
