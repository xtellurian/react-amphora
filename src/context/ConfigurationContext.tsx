import React, { useEffect } from 'react'
import * as a10a from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import axios, { AxiosInstance } from 'axios'
import { useIdentityState } from './IdentityContext'

type ConfigurationState = {
    token?: string
    configuration: a10a.Configuration
    axiosClient: AxiosInstance
}
type ConfigurationProviderProps = {
    configuration?: a10a.Configuration
}

const axiosClient = axios.create()
const configuration = new a10a.Configuration()

const ConfigurationContext = React.createContext<
    ConfigurationState | undefined
>({
    configuration,
    axiosClient
})

const ConfigurationProvider: React.FunctionComponent<ConfigurationProviderProps> = (
    props
) => {
    const identityState = useIdentityState()
    const [state, dispatch] = React.useState({
        configuration: props.configuration || configuration,
        axiosClient,
        token: ''
    })
    useEffect(() => {
        if (
            identityState.user &&
            state.token !== identityState.user.access_token
        ) {
            dispatch({
                axiosClient,
                token: identityState.user.access_token,
                configuration: state.configuration
            })
            axiosClient.defaults.headers.common.Authorization =
                'Bearer ' + identityState.user.access_token
        }
    })
    return (
        <ConfigurationContext.Provider value={state}>
            {props.children}
        </ConfigurationContext.Provider>
    )
}

function useApiState(): ConfigurationState {
    const context = React.useContext(ConfigurationContext)

    if (context === undefined) {
        throw new Error('useCountState must be used within a CountProvider')
    }

    return context
}

const withConfiguration = (Component: any) => {
    return (props: any) => {
        return (
            <ConfigurationContext.Consumer>
                {(contexts) => <Component {...props} {...contexts} />}
            </ConfigurationContext.Consumer>
        )
    }
}

export {
    ConfigurationProviderProps,
    ConfigurationProvider,
    useApiState,
    withConfiguration,
    ConfigurationState
}
