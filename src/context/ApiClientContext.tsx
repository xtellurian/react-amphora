import * as React from 'react'
import * as amphoradata from 'amphoradata'
import * as axios from 'axios'
import { useApiState } from './ConfigurationContext'

interface ApiClientState {
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
    const apiContext = useApiState()

    const [state] = React.useState<ApiClientState>({
        axios: apiContext.axiosClient,
        amphoraeApi: new amphoradata.AmphoraeApi(
            apiContext.configuration,
            apiContext.configuration.basePath,
            apiContext.axiosClient
        ),
        activitiesApi: new amphoradata.ActivitiesApi(
            apiContext.configuration,
            apiContext.configuration.basePath,
            apiContext.axiosClient
        ),
        geoApi: new amphoradata.GeoApi(
            apiContext.configuration,
            apiContext.configuration.basePath,
            apiContext.axiosClient
        ),
        organisationsApi: new amphoradata.OrganisationsApi(
            apiContext.configuration,
            apiContext.configuration.basePath,
            apiContext.axiosClient
        ),
        permissionApi: new amphoradata.PermissionApi(
            apiContext.configuration,
            apiContext.configuration.basePath,
            apiContext.axiosClient
        ),
        searchApi: new amphoradata.SearchApi(
            apiContext.configuration,
            apiContext.configuration.basePath,
            apiContext.axiosClient
        ),
        termsOfUseApi: new amphoradata.TermsOfUseApi(
            apiContext.configuration,
            apiContext.configuration.basePath,
            apiContext.axiosClient
        ),
        timeSeriesApi: new amphoradata.TimeSeriesApi(
            apiContext.configuration,
            apiContext.configuration.basePath,
            apiContext.axiosClient
        ),
        usersApi: new amphoradata.UsersApi(
            apiContext.configuration,
            apiContext.configuration.basePath,
            apiContext.axiosClient
        )
    })

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
