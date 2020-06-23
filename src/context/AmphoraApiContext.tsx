import React, { useEffect } from 'react'
import * as a10a from 'amphoradata'
import axios from 'axios'
import { useIdentityState } from './AmphoraIdentityContext'

type ApiState = {
    token?: string
    search: a10a.SearchApi
}
type ApiProviderProps = {
    children?: JSX.Element
    configuration: a10a.Configuration
}

const axiosClient = axios.create()

const search = (config: a10a.Configuration) =>
    new a10a.SearchApi(config, config.basePath, axiosClient)

const AmphoraApiContext = React.createContext<ApiState | undefined>({
    search: search(new a10a.Configuration())
})

const AmphoraApiProvider: React.FunctionComponent<ApiProviderProps> = (
    props
) => {
    const identityState = useIdentityState()
    const [state, dispatch] = React.useState({
        configuration: props.configuration,
        token: '',
        search: search(props.configuration)
    })
    useEffect(() => {
        if (
            identityState.user &&
            state.token !== identityState.user.access_token
        ) {
            dispatch({
                token: identityState.user.access_token,
                configuration: state.configuration,
                search: search(state.configuration)
            })
            axiosClient.defaults.headers.common.Authorization =
                'Bearer ' + identityState.user.access_token
            console.log(axios.defaults.headers.common)
        }
    })
    return (
        <AmphoraApiContext.Provider value={state}>
            {props.children}
        </AmphoraApiContext.Provider>
    )
}

const withAmphora = (Component: any) => {
    return (props: any) => {
        return (
            <AmphoraApiContext.Consumer>
                {(contexts) => <Component {...props} {...contexts} />}
            </AmphoraApiContext.Consumer>
        )
    }
}

function useApiState(): ApiState {
    const context = React.useContext(AmphoraApiContext)

    if (context === undefined) {
        throw new Error('useCountState must be used within a CountProvider')
    }

    return context
}

export { AmphoraApiProvider, useApiState, withAmphora, ApiState }
