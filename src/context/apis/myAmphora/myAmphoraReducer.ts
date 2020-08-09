// eslint-disable-next-line no-unused-vars
import { MyAmphoraState, emptyState } from './myAmphoraModel'
import {
    // eslint-disable-next-line no-unused-vars
    FetchMyAmphora,
    // eslint-disable-next-line no-unused-vars
    ActionPublisher,
    // eslint-disable-next-line no-unused-vars
    ActionResultPublisher
} from '../../actions'
// eslint-disable-next-line no-unused-vars
import { AuthenticateAction } from '../apiState'
// eslint-disable-next-line no-unused-vars
import { ApiClientState } from '../../ApiClientContext'
import { fromStatus } from '../../props'

export const getReducer = (
    clients: ApiClientState,
    publish: ActionPublisher,
    publishResult: ActionResultPublisher
) => {
    const asyncReducer = async (
        state: MyAmphoraState,
        action: FetchMyAmphora | AuthenticateAction
    ): Promise<MyAmphoraState> => {
        if (!state) {
            return {
                ...emptyState,
                isAuthenticated: clients.isAuthenticated
            }
        } else if (action.type === 'isAuthenticated') {
            return {
                ...state,
                isAuthenticated: action.payload.value
            }
        } else if (action.type === 'my-amphora:fetch-list') {
            publish(action)
            try {
                const r = await clients.amphoraeApi.amphoraeList(
                    action.payload.scope,
                    action.payload.accessType
                )
                const results = Array.isArray(r.data) ? r.data : []
                publishResult({
                    type: fromStatus(action, r),
                    error: null,
                    action,
                    response: r,
                    payload: results
                })
                return {
                    isAuthenticated: state.isAuthenticated,
                    scope: action.payload.scope,
                    accessType: action.payload.accessType,
                    results,
                    selfCreatedResults:
                        action.payload.scope === 'self' &&
                        action.payload.accessType === 'created'
                            ? results
                            : state.selfCreatedResults,
                    selfPurchasedResults:
                        action.payload.scope === 'self' &&
                        action.payload.accessType === 'purchased'
                            ? results
                            : state.selfPurchasedResults,
                    organisationCreatedResults:
                        action.payload.scope === 'organisation' &&
                        action.payload.accessType === 'created'
                            ? results
                            : state.organisationCreatedResults,
                    organisationPurchasedResults:
                        action.payload.scope === 'organisation' &&
                        action.payload.accessType === 'purchased'
                            ? results
                            : state.organisationPurchasedResults,
                    isLoading: false,
                    error: r.status > 299
                }
            } catch (error) {
                publishResult({
                    type: `${action.type}:failed`,
                    error: error,
                    action: action,
                    response: error
                })
            }
        }
        return state
    }

    return asyncReducer
}
