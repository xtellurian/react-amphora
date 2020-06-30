/* eslint-disable no-unused-vars */
import * as React from 'react'
import {
    IdentityContextProps,
    IdentityContextProvider
} from './IdentityContext'
import { ApiClientProvider } from './ApiClientContext'
import { MyAmphoraApiProvider } from './apis/MyAmphoraContext'
import { GeoApiProvider } from './apis/GeoContext'
import {
    ConfigurationProviderProps,
    ConfigurationProvider
} from './ConfigurationContext'
import { SearchApiProvider } from './apis/SearchContext'

type AmphoraProviderProps = IdentityContextProps & ConfigurationProviderProps

const AmphoraProvider: React.FunctionComponent<AmphoraProviderProps> = (
    props
) => {
    return (
        <IdentityContextProvider userManager={props.userManager}>
            <ConfigurationProvider configuration={props.configuration}>
                <ApiClientProvider>
                    <MyAmphoraApiProvider>
                        <SearchApiProvider>
                            <GeoApiProvider>{props.children}</GeoApiProvider>
                        </SearchApiProvider>
                    </MyAmphoraApiProvider>
                </ApiClientProvider>
            </ConfigurationProvider>
        </IdentityContextProvider>
    )
}

export { AmphoraProvider }
