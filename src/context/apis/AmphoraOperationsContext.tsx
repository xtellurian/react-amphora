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
    TermsOfUseApi,
    // eslint-disable-next-line no-unused-vars
    PermissionApi
} from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState, AuthenticateAction } from './apiState'
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
    maxPermissionLevel: number
    terms?: TermsOfUse | null | undefined
}
const AmphoraOperationsStateContext = React.createContext<
    AmphoraOperationState | undefined
>({
    isAuthenticated: false,
    maxPermissionLevel: 0
})
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
const getAccessQueries = (amphoraId: string) => [
    { accessLevel: 24, amphoraId }, // purchase
    { accessLevel: 32, amphoraId }, // read contents
    { accessLevel: 64, amphoraId }, // write contents
    { accessLevel: 128, amphoraId }, // update
    { accessLevel: 256, amphoraId } // administer
]

async function loadMaxPermissionLevel(
    amphora: DetailedAmphora,
    permissionApi: PermissionApi
): Promise<number> {
    const response = await permissionApi.permissionGetPermissions({
        accessQueries: getAccessQueries(amphora.id || '')
    })
    if (response.data.accessResponses) {
        const relevant = response.data.accessResponses
            .filter((_) => _.isAuthorized)
            .map((_) => _.accessLevel || 0)
        return Math.max(...relevant)
    } else {
        return 0
    }
}
const isLoading = false

const AmphoraOperationsProvider: React.FunctionComponent = (props) => {
    const clients = useAmphoraClients()
    const asyncReducer = async (
        state: AmphoraOperationState,
        action: AllActions | AuthenticateAction
    ): Promise<AmphoraOperationState> => {
        if (!state) {
            return {
                isAuthenticated: clients.isAuthenticated,
                maxPermissionLevel: 0
            }
        } else if (action.type === 'isAuthenticated') {
            return {
                ...state,
                isAuthenticated: action.payload.value
            }
        } else if (action.type === 'amphora-operation-create') {
            const createResponse = await clients.amphoraeApi.amphoraeCreate(
                action.payload.model
            )
            const terms = await loadTermsIfExist(
                createResponse.data,
                clients.termsOfUseApi
            )
            return {
                isAuthenticated: state.isAuthenticated,
                current: createResponse.data,
                maxPermissionLevel: 128,
                terms,
                isLoading
            }
        } else if (action.type === 'amphora-operation-read') {
            const readResponse = await clients.amphoraeApi.amphoraeRead(
                action.payload.id
            )
            return {
                isAuthenticated: state.isAuthenticated,
                current: readResponse.data,
                maxPermissionLevel: await loadMaxPermissionLevel(
                    readResponse.data,
                    clients.permissionApi
                ),
                terms: await loadTermsIfExist(
                    readResponse.data,
                    clients.termsOfUseApi
                ),
                isLoading: false
            }
        } else if (action.type === 'amphora-operation-update') {
            const updateResponse = await clients.amphoraeApi.amphoraeUpdate(
                action.payload.id,
                action.payload.model as EditAmphora
            )
            return {
                isAuthenticated: state.isAuthenticated,
                current: updateResponse.data,
                maxPermissionLevel: await loadMaxPermissionLevel(
                    action.payload.model,
                    clients.permissionApi
                ),
                terms: await loadTermsIfExist(
                    updateResponse.data,
                    clients.termsOfUseApi
                ),
                isLoading: false
            }
        } else if (action.type === 'amphora-operation-delete') {
            await clients.amphoraeApi.amphoraeDelete(action.payload.id)
            return {
                isAuthenticated: state.isAuthenticated,
                isLoading,
                maxPermissionLevel: 0
            }
        } else {
            return state
        }
    }

    const [state, dispatch] = useAsyncReducer(asyncReducer, {
        isAuthenticated: clients.isAuthenticated,
        maxPermissionLevel: 0
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
