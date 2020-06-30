import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { CreateAmphora, DetailedAmphora } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState } from './apiState'
import useAsyncReducer from './useAsyncReducer'
import { useAmphoraClients } from '../ApiClientContext'

type CreateAction = {
    type: 'amphora-operation-create'
    payload: {
        model: CreateAmphora
    }
}

type AllActions = CreateAction

type AmphoraOperationsDispatch = { dispatch: (action: CreateAction) => void }
interface AmphoraOperationState extends ApiState {
    current?: DetailedAmphora
}
const AmphoraOperationsStateContext = React.createContext<
    AmphoraOperationState | undefined
>({})
const DispatchContext = React.createContext<
    AmphoraOperationsDispatch | undefined
>(undefined)

const AmphoraOperationsProvider: React.FunctionComponent = (props) => {
    const apiContext = useAmphoraClients()
    const asyncReducer = async (
        state: AmphoraOperationState,
        action: AllActions
    ): Promise<AmphoraOperationState> => {
        if (!state) {
            return {}
        } else if (action.type === 'amphora-operation-create') {
            const r = await apiContext.amphoraeApi.amphoraeCreate(
                action.payload.model
            )
            return {
                current: r.data,
                isLoading: false
            }
        } else {
            return state
        }
    }

    const [state, dispatch] = useAsyncReducer(asyncReducer, {})

    return (
        <AmphoraOperationsStateContext.Provider value={state}>
            <DispatchContext.Provider value={{ dispatch }}>
                {props.children}
            </DispatchContext.Provider>
        </AmphoraOperationsStateContext.Provider>
    )
}

function useAmphoraOperationsState(): AmphoraOperationState {
    const context = React.useContext(AmphoraOperationsStateContext)

    if (context === undefined) {
        throw new Error('useCountState must be used within a CountProvider')
    }

    return context
}

function useAmphoraOperationsDispatch(): AmphoraOperationsDispatch {
    const context = React.useContext(DispatchContext)

    if (context === undefined) {
        throw new Error('useCountDispatch must be used within a CountProvider')
    }

    return context
}

const withAmphoraOperationsState = (Component: any) => {
    return (props: any) => {
        return (
            <AmphoraOperationsStateContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </AmphoraOperationsStateContext.Consumer>
        )
    }
}
const withAmphoraOperationsDispatch = (Component: any) => {
    return (props: any) => {
        return (
            <DispatchContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </DispatchContext.Consumer>
        )
    }
}
const withAmphoraOperations = (Component: any) => {
    return withAmphoraOperationsState(withAmphoraOperationsDispatch(Component))
}

export {
    AmphoraOperationsProvider,
    AmphoraOperationState,
    AmphoraOperationsDispatch,
    useAmphoraOperationsState,
    useAmphoraOperationsDispatch,
    withAmphoraOperations,
    withAmphoraOperationsState,
    withAmphoraOperationsDispatch
}
