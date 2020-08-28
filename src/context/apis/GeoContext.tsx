import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { FuzzySearchResponse } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState, AuthenticateAction } from './apiState'
import useAsyncReducer from '../../utility/useAsyncReducer'
import { useAmphoraClients } from '../ApiClientContext'
// eslint-disable-next-line no-unused-vars
import { ContextProps, fromStatus, publish, publishResult } from '../props'
// eslint-disable-next-line no-unused-vars
import { GeoLookup } from '../actions'

type ClearAction = {
    type: 'geolookup-clear'
}

export type GeoDispatch = {
    dispatch: (action: GeoLookup | ClearAction) => void
}
export interface GeoState extends ApiState {
    fuzzySearchResponse: FuzzySearchResponse
}
const GeoContext = React.createContext<GeoState | undefined>({
    isAuthenticated: false,
    fuzzySearchResponse: {}
})
const DispatchContext = React.createContext<GeoDispatch | undefined>(undefined)

const GeoApiProvider: React.FunctionComponent<ContextProps> = (props) => {
    const clients = useAmphoraClients()
    const reducer = async (
        state: GeoState,
        action: GeoLookup | ClearAction | AuthenticateAction
    ): Promise<GeoState> => {
        if (!state) {
            return {
                isAuthenticated: clients.isAuthenticated,
                fuzzySearchResponse: {}
            }
        } else if (action.type === 'isAuthenticated') {
            return {
                ...state,
                isAuthenticated: action.payload.value
            }
        } else if (action.type === 'geolookup-clear') {
            return {
                isAuthenticated: state.isAuthenticated,
                fuzzySearchResponse: {}
            }
        } else if (action.type === 'geo:lookup') {
            publish(props, action)
            try {
                const r = await clients.geoApi.geoLookupLocation(
                    action.payload.query
                )
                publishResult(props, {
                    type: fromStatus(action, r),
                    error: null,
                    action,
                    response: r,
                    payload: r.data
                })
                return {
                    isAuthenticated: state.isAuthenticated,
                    fuzzySearchResponse: r.data,
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
        }

        return state
    }

    const [state, dispatch] = useAsyncReducer(reducer, {
        isAuthenticated: clients.isAuthenticated,
        fuzzySearchResponse: {}
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
        <GeoContext.Provider value={state}>
            <DispatchContext.Provider value={{ dispatch }}>
                {props.children}
            </DispatchContext.Provider>
        </GeoContext.Provider>
    )
}

function useGeoState(): GeoState {
    const context = React.useContext(GeoContext)

    if (context === undefined) {
        throw new Error('useGeoState must be used within a GeoContext Provider')
    }

    return context
}

function useGeoDispatch(): GeoDispatch {
    const context = React.useContext(DispatchContext)

    if (context === undefined) {
        throw new Error(
            'useGeoDispatch must be used within a GeoContext Provider'
        )
    }

    return context
}

const withGeoState = (Component: any) => {
    return (props: any) => {
        return (
            <GeoContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </GeoContext.Consumer>
        )
    }
}
const withGeoDispatch = (Component: any) => {
    return (props: any) => {
        return (
            <DispatchContext.Consumer>
                {(c) => <Component {...props} {...c} />}
            </DispatchContext.Consumer>
        )
    }
}

const withGeo = (Component: any) => {
    return withGeoState(withGeoDispatch(Component))
}

export {
    GeoApiProvider,
    useGeoState,
    useGeoDispatch,
    withGeo,
    withGeoState,
    withGeoDispatch
}
