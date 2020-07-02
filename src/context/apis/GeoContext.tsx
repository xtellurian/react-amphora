import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { FuzzySearchResponse } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState, AuthenticateAction } from './apiState'
import useAsyncReducer from './useAsyncReducer'
import { useAmphoraClients } from '../ApiClientContext'

type LookupAction = {
    type: 'geolookup'
    payload: {
        query?: string
    }
}

type ClearAction = {
    type: 'geolookup-clear'
}

type GeoDispatch = {
    dispatch: (action: LookupAction | ClearAction) => void
}
interface GeoState extends ApiState {
    fuzzySearchResponse: FuzzySearchResponse
}
const GeoContext = React.createContext<GeoState | undefined>({
    isAuthenticated: false,
    fuzzySearchResponse: {}
})
const DispatchContext = React.createContext<GeoDispatch | undefined>(undefined)

const GeoApiProvider: React.FunctionComponent = (props) => {
    const clients = useAmphoraClients()
    const reducer = async (
        state: GeoState,
        action: LookupAction | ClearAction | AuthenticateAction
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
        } else if (action.type === 'geolookup') {
            const r = await clients.geoApi.geoLookupLocation(
                action.payload.query
            )
            return {
                isAuthenticated: state.isAuthenticated,
                fuzzySearchResponse: r.data,
                isLoading: false
            }
        } else {
            return {
                isAuthenticated: state.isAuthenticated,
                fuzzySearchResponse: {}
            }
        }
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
        throw new Error('useCountState must be used within a CountProvider')
    }

    return context
}

function useGeoDispatch(): GeoDispatch {
    const context = React.useContext(DispatchContext)

    if (context === undefined) {
        throw new Error('useCountDispatch must be used within a CountProvider')
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
    GeoState,
    GeoDispatch,
    useGeoState,
    useGeoDispatch,
    withGeo,
    withGeoState,
    withGeoDispatch
}
