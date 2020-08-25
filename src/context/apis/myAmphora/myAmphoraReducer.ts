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

const getLoadings = (
    state: MyAmphoraState,
    action: FetchMyAmphora,
    isFetching: boolean
) => {
    return {
        isSelfCreatedLoading:
            action.payload.accessType === 'created' &&
            action.payload.scope === 'self'
                ? isFetching
                : state.isSelfCreatedLoading,
        isSelfPurchasedLoading:
            action.payload.accessType === 'purchased' &&
            action.payload.scope === 'self'
                ? isFetching
                : state.isSelfPurchasedLoading,
        isOrganisationCreatedLoading:
            action.payload.accessType === 'created' &&
            action.payload.scope === 'organisation'
                ? isFetching
                : state.isOrganisationCreatedLoading,
        isOrganisationPurchasedLoading:
            action.payload.accessType === 'purchased' &&
            action.payload.scope === 'organisation'
                ? isFetching
                : state.isOrganisationPurchasedLoading
    }
}

export const isLoadingReducer = (
    state: MyAmphoraState,
    action: FetchMyAmphora
): MyAmphoraState => {
    const loadings = getLoadings(state, action, true)
    console.log(loadings)
    return {
        ...state,
        ...loadings,
        isLoading:
            loadings.isOrganisationCreatedLoading ||
            loadings.isOrganisationPurchasedLoading ||
            loadings.isSelfCreatedLoading ||
            loadings.isSelfPurchasedLoading // is loading if any are loading
    }
}

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
                    action.payload.accessType,
                    action.payload.take,
                    action.payload.skip
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
                    ...getLoadings(state, action, false),
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
