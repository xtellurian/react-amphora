import * as React from 'react'
import {
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
import useAsyncReducer from '../../utility/useAsyncReducer'
import { useAmphoraClients } from '../ApiClientContext'
// eslint-disable-next-line no-unused-vars
import * as Actions from '../actions'
// eslint-disable-next-line no-unused-vars
import { ContextProps, fromStatus, publish, publishResult } from '../props'

type AllActions =
    | Actions.CreateAmphora
    | Actions.ReadAmphora
    | Actions.UpdateAmphora
    | Actions.DeleteAmphora

export type AmphoraOperationsDispatch = {
    dispatch: (action: AllActions) => void
}
export interface AmphoraOperationState extends ApiState {
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

const AmphoraOperationsProvider: React.FunctionComponent<ContextProps> = (
    props
) => {
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
        } else if (action.type === 'amphora-operation:create') {
            publish(props, action)
            try {
                const createResponse = await clients.amphoraeApi.amphoraeCreate(
                    action.payload.model
                )
                publishResult(props, {
                    type: fromStatus(action, createResponse),
                    error: null,
                    action,
                    response: createResponse,
                    payload: createResponse.data
                })
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
            } catch (error) {
                publishResult(props, {
                    type: `${action.type}:failed`,
                    error: error,
                    action: action,
                    response: error
                })
            }
        } else if (action.type === 'amphora-operation:read') {
            publish(props, action)
            try {
                const readResponse = await clients.amphoraeApi.amphoraeRead(
                    action.payload.id
                )
                publishResult(props, {
                    type: fromStatus(action, readResponse),
                    error: null,
                    action,
                    response: readResponse,
                    payload: readResponse.data
                })
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
            } catch (error) {
                publishResult(props, {
                    type: `${action.type}:failed`,
                    error: error,
                    action: action,
                    response: error
                })
            }
        } else if (action.type === 'amphora-operation:update') {
            publish(props, action)
            try {
                const updateResponse = await clients.amphoraeApi.amphoraeUpdate(
                    action.payload.id,
                    action.payload.model as EditAmphora
                )
                publishResult(props, {
                    type: fromStatus(action, updateResponse),
                    error: null,
                    action,
                    response: updateResponse,
                    payload: updateResponse.data
                })
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
            } catch (error) {
                publishResult(props, {
                    type: `${action.type}:failed`,
                    error: error,
                    action: action,
                    response: error
                })
            }
        } else if (action.type === 'amphora-operation:delete') {
            publish(props, action)
            try {
                const deleteResponse = await clients.amphoraeApi.amphoraeDelete(
                    action.payload.id
                )
                publishResult(props, {
                    type: fromStatus(action, deleteResponse),
                    error: null,
                    action,
                    response: deleteResponse
                })
                return {
                    isAuthenticated: state.isAuthenticated,
                    isLoading,
                    maxPermissionLevel: 0
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
        throw new Error(
            'useAmphoraOperationsState must be used within a AmphoraOperationsStateContext Provider'
        )
    }

    return context
}

function useAmphoraOperationsDispatch(): AmphoraOperationsDispatch {
    const context = React.useContext(DispatchContext)

    if (context === undefined) {
        throw new Error(
            'useAmphoraOperationsDispatch must be used within a AmphoraOperationsStateContext Provider'
        )
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
    useAmphoraOperationsState,
    useAmphoraOperationsDispatch,
    withAmphoraOperations,
    withAmphoraOperationsState,
    withAmphoraOperationsDispatch
}
