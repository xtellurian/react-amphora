import React, { useEffect } from 'react'
import * as a10a from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import axios, { AxiosInstance } from 'axios'
import { useIdentityState } from './IdentityContext'
// eslint-disable-next-line no-unused-vars
import * as Actions from './actions'
// eslint-disable-next-line no-unused-vars
import { publish, ContextProps } from './props'

export type ConfigurationState = {
    isAuthenticated: boolean
    configuration: a10a.Configuration
    axiosClient: AxiosInstance
    token?: string
}
export interface ConfigurationProviderProps extends ContextProps {
    configuration?: a10a.Configuration
}

const axiosClient = axios.create()
const configuration = new a10a.Configuration()

const ConfigurationContext = React.createContext<
    ConfigurationState | undefined
>({
    isAuthenticated: false,
    configuration,
    axiosClient
})

type Action = Actions.SetAuthToken | Actions.ResetAuthToken

const ConfigurationProvider: React.FunctionComponent<ConfigurationProviderProps> = (
    props
) => {
    const reducer = (
        state: ConfigurationState,
        action: Action
    ): ConfigurationState => {
        publish(props, action)
        if (!state) {
            return {
                isAuthenticated: false,
                configuration,
                axiosClient,
                token: ''
            }
        }

        switch (action.type) {
            case 'authentication:set_token': {
                console.log(
                    `Setting Amphora Authentication, length: ${action.payload.token.length}`
                )
                return {
                    isAuthenticated: true,
                    configuration: state.configuration,
                    token: action.payload.token,
                    axiosClient: state.axiosClient
                }
            }
            case 'authentication:reset_token': {
                console.log('Resetting Amphora Authentication')
                return {
                    isAuthenticated: false,
                    configuration: state.configuration,
                    token: '',
                    axiosClient: state.axiosClient
                }
            }
            default: {
                return state
            }
        }
    }

    const identityState = useIdentityState()

    const [state, dispatch] = React.useReducer(reducer, {
        isAuthenticated: false,
        configuration: props.configuration || configuration,
        axiosClient,
        token: ''
    })

    useEffect(() => {
        if (
            identityState.user &&
            !identityState.user.expired &&
            state.token !== identityState.user.access_token
        ) {
            dispatch({
                type: 'authentication:set_token',
                payload: {
                    token: identityState.user.access_token
                }
            })
            axiosClient.defaults.headers.common.Authorization =
                'Bearer ' + identityState.user.access_token
        }
    }, [identityState.user])

    return (
        <ConfigurationContext.Provider value={state}>
            {props.children}
        </ConfigurationContext.Provider>
    )
}

function useConfigState(): ConfigurationState {
    const context = React.useContext(ConfigurationContext)

    if (context === undefined) {
        throw new Error(
            'useConfigState must be used within a ConfigurationContextProvider'
        )
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

export { ConfigurationProvider, useConfigState, withConfiguration }
