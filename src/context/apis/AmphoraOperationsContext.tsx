import * as React from 'react'
import {
    // eslint-disable-next-line no-unused-vars
    CreateAmphora,
    // eslint-disable-next-line no-unused-vars
    DetailedAmphora,
    // eslint-disable-next-line no-unused-vars
    EditAmphora,
    // eslint-disable-next-line no-unused-vars
    TermsOfUse,
    // eslint-disable-next-line no-unused-vars
    TermsOfUseApi
} from 'amphoradata'
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
type ReadAction = {
    type: 'amphora-operation-read'
    payload: {
        id: string
    }
}
type UpdateAction = {
    type: 'amphora-operation-update'
    payload: {
        id: string
        model: EditAmphora
    }
}
type DeleteAction = {
    type: 'amphora-operation-delete'
    payload: {
        id: string
    }
}

type AllActions = CreateAction | ReadAction | UpdateAction | DeleteAction

type AmphoraOperationsDispatch = { dispatch: (action: AllActions) => void }
interface AmphoraOperationState extends ApiState {
    current?: DetailedAmphora
    terms?: TermsOfUse | null | undefined
}
const AmphoraOperationsStateContext = React.createContext<
    AmphoraOperationState | undefined
>({})
const DispatchContext = React.createContext<
    AmphoraOperationsDispatch | undefined
>(undefined)

async function loadTermsIfExist(
    amphora: DetailedAmphora,
    termsApi: TermsOfUseApi
): Promise<TermsOfUse | null> {
    if (amphora.termsOfUseId) {
        const response = await termsApi.termsOfUseRead(amphora.termsOfUseId)
        return response.data
    } else {
        return null
    }
}
const isLoading = false

const AmphoraOperationsProvider: React.FunctionComponent = (props) => {
    const apiContext = useAmphoraClients()
    const asyncReducer = async (
        state: AmphoraOperationState,
        action: AllActions
    ): Promise<AmphoraOperationState> => {
        if (!state) {
            return {}
        } else if (action.type === 'amphora-operation-create') {
            const createResponse = await apiContext.amphoraeApi.amphoraeCreate(
                action.payload.model
            )
            const terms = await loadTermsIfExist(
                createResponse.data,
                apiContext.termsOfUseApi
            )
            return { current: createResponse.data, terms, isLoading }
        } else if (action.type === 'amphora-operation-read') {
            const readResponse = await apiContext.amphoraeApi.amphoraeRead(
                action.payload.id
            )
            return {
                current: readResponse.data,
                terms: await loadTermsIfExist(
                    readResponse.data,
                    apiContext.termsOfUseApi
                ),
                isLoading: false
            }
        } else if (action.type === 'amphora-operation-update') {
            const updateResponse = await apiContext.amphoraeApi.amphoraeUpdate(
                action.payload.id,
                action.payload.model as EditAmphora
            )
            return {
                current: updateResponse.data,
                terms: await loadTermsIfExist(
                    updateResponse.data,
                    apiContext.termsOfUseApi
                ),
                isLoading: false
            }
        } else if (action.type === 'amphora-operation-delete') {
            await apiContext.amphoraeApi.amphoraeDelete(action.payload.id)
            return { isLoading }
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
