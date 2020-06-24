import * as React from 'react'
import * as amphoradata from 'amphoradata'
import { useApiState } from './ConfigurationContext'

interface ApiClientState {
    amphoraeApi: amphoradata.AmphoraeApi
    searchApi: amphoradata.SearchApi
}
const ApiClientStateContext = React.createContext<ApiClientState | undefined>({
    amphoraeApi: new amphoradata.AmphoraeApi(),
    searchApi: new amphoradata.SearchApi()
})

const ApiClientProvider: React.FunctionComponent = (props) => {
    const apiContext = useApiState()

    const [state] = React.useState({
        amphoraeApi: new amphoradata.AmphoraeApi(
            apiContext.configuration,
            apiContext.configuration.basePath,
            apiContext.axiosClient
        ),
        searchApi: new amphoradata.SearchApi(
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
