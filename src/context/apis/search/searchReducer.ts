// eslint-disable-next-line no-unused-vars
import { SearchState, AllSearchActions } from '.'
// eslint-disable-next-line no-unused-vars
import { AuthenticateAction } from '../apiState'
// eslint-disable-next-line no-unused-vars
import { ApiClientState } from '../../ApiClientContext'
// eslint-disable-next-line no-unused-vars
import { ActionPublisher, ActionResultPublisher } from '../../actions'
import { fromStatus } from '../../props'

export const getReducer = (
    clients: ApiClientState,
    publish: ActionPublisher,
    publishResult: ActionResultPublisher
) => {
    const searchReducer = async (
        state: SearchState,
        action: AllSearchActions | AuthenticateAction
    ): Promise<SearchState> => {
        if (!state) {
            return {
                isAuthenticated: clients.isAuthenticated,
                results: []
            }
        } else if (action.type === 'isAuthenticated') {
            return {
                isAuthenticated: action.payload.value,
                results: state.results,
                isLoading: state.isLoading
            }
        } else {
            publish(action)
            try {
                const r = await clients.searchApi.searchSearchAmphorae(
                    action.payload.term,
                    action.payload.labels,
                    action.payload.orgId,
                    action.payload.lat,
                    action.payload.lon,
                    action.payload.dist,
                    action.payload.take,
                    action.payload.skip
                )
                publishResult({
                    type: fromStatus(action, r),
                    error: null,
                    action,
                    response: r,
                    payload: r.data
                })
                return {
                    isAuthenticated: state.isAuthenticated,
                    results: r.data,
                    isLoading: false
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

    return searchReducer
}
