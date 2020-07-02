/* eslint-disable no-unused-vars */
import * as React from 'react'
import {
    IdentityContextProps,
    IdentityContextProvider
} from './IdentityContext'
import { ApiClientProvider } from './ApiClientContext'
import { MyAmphoraApiProvider } from './apis/MyAmphoraContext'
import { TermsApiProvider } from './apis/TermsOfUseContext'
import { GeoApiProvider } from './apis/GeoContext'
import {
    ConfigurationProviderProps,
    ConfigurationProvider
} from './ConfigurationContext'
import { SearchApiProvider } from './apis/SearchContext'
import { AmphoraOperationsProvider } from './apis/AmphoraOperationsContext'

type AmphoraProviderProps = IdentityContextProps & ConfigurationProviderProps

const AmphoraProvider: React.FunctionComponent<AmphoraProviderProps> = (
    props
) => {
    return (
        <IdentityContextProvider userManager={props.userManager}>
            <ConfigurationProvider configuration={props.configuration}>
                <ApiClientProvider>
                    <TermsApiProvider>
                        <MyAmphoraApiProvider>
                            <AmphoraOperationsProvider>
                                <SearchApiProvider>
                                    <GeoApiProvider>
                                        {props.children}
                                    </GeoApiProvider>
                                </SearchApiProvider>
                            </AmphoraOperationsProvider>
                        </MyAmphoraApiProvider>
                    </TermsApiProvider>
                </ApiClientProvider>
            </ConfigurationProvider>
        </IdentityContextProvider>
    )
}

export { AmphoraProvider }
