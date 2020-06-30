import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import { FuzzySearchResponse } from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import { ApiState } from './apiState'
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

type GeoDispatch = { dispatch: (action: LookupAction | ClearAction) => void }
interface GeoState extends ApiState {
    fuzzySearchResponse: FuzzySearchResponse
}
const GeoContext = React.createContext<GeoState | undefined>({
    fuzzySearchResponse: {}
})
const DispatchContext = React.createContext<GeoDispatch | undefined>(undefined)

const GeoApiProvider: React.FunctionComponent = (props) => {
    const apiContext = useAmphoraClients()
    const reducer = async (
        state: GeoState,
        action: LookupAction | ClearAction
    ): Promise<GeoState> => {
        if (!state) {
            return {
                fuzzySearchResponse: {}
            }
        } else if (action.type === 'geolookup-clear') {
            return { fuzzySearchResponse: {} }
        } else if (action.type === 'geolookup') {
            const r = await apiContext.geoApi.geoLookupLocation(
                action.payload.query
            )
            return { fuzzySearchResponse: r.data, isLoading: false }
        } else {
            return { fuzzySearchResponse: {} }
        }
    }

    const [state, dispatch] = useAsyncReducer(reducer, {
        fuzzySearchResponse: {}
    })

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
