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
    maxPermissionLevel: number
    terms?: TermsOfUse | null | undefined
}
const AmphoraOperationsStateContext = React.createContext<
    AmphoraOperationState | undefined
>({
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
    if (amphora.termsOfUseId) {
        const response = await permissionApi.permissionGetPermissions({
            accessQueries: getAccessQueries(amphora.id || '')
        })
        if (response.data.accessResponses) {
            return Math.max(
                ...response.data.accessResponses
                    .filter((_) => _.isAuthorized)
                    .map((_) => _.accessLevel || 0)
            )
        } else {
            return 0
        }
    } else {
        return 0
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
            return {
                maxPermissionLevel: 0
            }
        } else if (action.type === 'amphora-operation-create') {
            const createResponse = await apiContext.amphoraeApi.amphoraeCreate(
                action.payload.model
            )
            const terms = await loadTermsIfExist(
                createResponse.data,
                apiContext.termsOfUseApi
            )
            return {
                current: createResponse.data,
                maxPermissionLevel: 128,
                terms,
                isLoading
            }
        } else if (action.type === 'amphora-operation-read') {
            const readResponse = await apiContext.amphoraeApi.amphoraeRead(
                action.payload.id
            )
            return {
                current: readResponse.data,
                maxPermissionLevel: await loadMaxPermissionLevel(
                    readResponse.data,
                    apiContext.permissionApi
                ),
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
                maxPermissionLevel: await loadMaxPermissionLevel(
                    action.payload.model,
                    apiContext.permissionApi
                ),
                terms: await loadTermsIfExist(
                    updateResponse.data,
                    apiContext.termsOfUseApi
                ),
                isLoading: false
            }
        } else if (action.type === 'amphora-operation-delete') {
            await apiContext.amphoraeApi.amphoraeDelete(action.payload.id)
            return { isLoading, maxPermissionLevel: 0 }
        } else {
            return state
        }
    }

    const [state, dispatch] = useAsyncReducer(asyncReducer, {
        maxPermissionLevel: 0
    })

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
