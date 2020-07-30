import * as React from 'react'
import * as amphoradata from 'amphoradata'
import * as axios from 'axios'
import { useConfigState } from './ConfigurationContext'

type Action = { type: 'set_authenticated' } | { type: 'set_unauthenticated' }
export interface ApiClientState {
    isAuthenticated: boolean
    axios: axios.AxiosInstance
    activitiesApi: amphoradata.ActivitiesApi
    amphoraeApi: amphoradata.AmphoraeApi
    geoApi: amphoradata.GeoApi
    organisationsApi: amphoradata.OrganisationsApi
    permissionApi: amphoradata.PermissionApi
    searchApi: amphoradata.SearchApi
    termsOfUseApi: amphoradata.TermsOfUseApi
    timeSeriesApi: amphoradata.TimeSeriesApi
    usersApi: amphoradata.UsersApi
}
const ApiClientStateContext = React.createContext<ApiClientState | undefined>({
    isAuthenticated: false,
    axios: axios.default,
    amphoraeApi: new amphoradata.AmphoraeApi(),
    activitiesApi: new amphoradata.ActivitiesApi(),
    geoApi: new amphoradata.GeoApi(),
    organisationsApi: new amphoradata.OrganisationsApi(),
    permissionApi: new amphoradata.PermissionApi(),
    searchApi: new amphoradata.SearchApi(),
    termsOfUseApi: new amphoradata.TermsOfUseApi(),
    timeSeriesApi: new amphoradata.TimeSeriesApi(),
    usersApi: new amphoradata.UsersApi()
})

const ApiClientProvider: React.FunctionComponent = (props) => {
    const configContext = useConfigState()

    const initialState = {
        isAuthenticated: configContext.isAuthenticated,
        axios: configContext.axiosClient,
        amphoraeApi: new amphoradata.AmphoraeApi(
            configContext.configuration,
            configContext.configuration.basePath,
            configContext.axiosClient
        ),
        activitiesApi: new amphoradata.ActivitiesApi(
            configContext.configuration,
            configContext.configuration.basePath,
            configContext.axiosClient
        ),
        geoApi: new amphoradata.GeoApi(
            configContext.configuration,
            configContext.configuration.basePath,
            configContext.axiosClient
        ),
        organisationsApi: new amphoradata.OrganisationsApi(
            configContext.configuration,
            configContext.configuration.basePath,
            configContext.axiosClient
        ),
        permissionApi: new amphoradata.PermissionApi(
            configContext.configuration,
            configContext.configuration.basePath,
            configContext.axiosClient
        ),
        searchApi: new amphoradata.SearchApi(
            configContext.configuration,
            configContext.configuration.basePath,
            configContext.axiosClient
        ),
        termsOfUseApi: new amphoradata.TermsOfUseApi(
            configContext.configuration,
            configContext.configuration.basePath,
            configContext.axiosClient
        ),
        timeSeriesApi: new amphoradata.TimeSeriesApi(
            configContext.configuration,
            configContext.configuration.basePath,
            configContext.axiosClient
        ),
        usersApi: new amphoradata.UsersApi(
            configContext.configuration,
            configContext.configuration.basePath,
            configContext.axiosClient
        )
    }

    const reducer: (state: ApiClientState, action: Action) => ApiClientState = (
        state,
        action
    ) => {
        if (!state) {
            return initialState
        }

        switch (action.type) {
            case 'set_authenticated': {
                return {
                    ...state,
                    isAuthenticated: true
                }
            }
            case 'set_unauthenticated': {
                return {
                    ...state,
                    isAuthenticated: false
                }
            }
            default:
                return state
        }
    }

    const [state, dispatch] = React.useReducer(reducer, initialState)

    React.useEffect(() => {
        if (state.isAuthenticated && !configContext.isAuthenticated) {
            dispatch({
                type: 'set_unauthenticated'
            })
        } else if (!state.isAuthenticated && configContext.isAuthenticated) {
            dispatch({
                type: 'set_authenticated'
            })
        }
    }, [configContext.isAuthenticated, state.isAuthenticated])

    return (
        <ApiClientStateContext.Provider value={state}>
            {props.children}
        </ApiClientStateContext.Provider>
    )
}

function useAmphoraClients(): ApiClientState {
    const context = React.useContext(ApiClientStateContext)

    if (context === undefined) {
        throw new Error(
            'withAmphoraClients must be used within an ApiClientProvider'
        )
    }

    return context
}

export { ApiClientProvider, useAmphoraClients }
