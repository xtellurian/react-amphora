import React, { useEffect } from 'react'
import * as a10a from 'amphoradata'
// eslint-disable-next-line no-unused-vars
import axios, { AxiosInstance } from 'axios'
import { useIdentityState } from './IdentityContext'

type ConfigurationState = {
    isAuthenticated: boolean
    configuration: a10a.Configuration
    axiosClient: AxiosInstance
    token?: string
}
type ConfigurationProviderProps = {
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

type Action =
    | {
          type: 'set_token'
          payload: {
              token: string
          }
      }
    | { type: 'reset_token' }

function reducer(
    state: ConfigurationState,
    action: Action
): ConfigurationState {
    if (!state) {
        return {
            isAuthenticated: false,
            configuration,
            axiosClient,
            token: ''
        }
    }

    switch (action.type) {
        case 'set_token': {
            return {
                isAuthenticated: true,
                configuration: state.configuration,
                token: action.payload.token,
                axiosClient: state.axiosClient
            }
        }
        case 'reset_token': {
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

const ConfigurationProvider: React.FunctionComponent<ConfigurationProviderProps> = (
    props
) => {
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
                type: 'set_token',
                payload: {
                    token: identityState.user.access_token
                }
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

export {
    ConfigurationProviderProps,
    ConfigurationProvider,
    useConfigState,
    withConfiguration,
    ConfigurationState
}
