/* eslint-disable no-unused-vars */
import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import { defaultTheme, AmphoraTheme } from '../theme/index'
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

interface ThemeProps {
    theme?: AmphoraTheme
}

type AmphoraProviderProps = IdentityContextProps &
    ConfigurationProviderProps &
    ThemeProps

const AmphoraProvider: React.FunctionComponent<AmphoraProviderProps> = (
    props
) => {
    return (
        <ThemeProvider theme={props.theme || defaultTheme}>
            <IdentityContextProvider {...props}>
                <ConfigurationProvider {...props}>
                    <ApiClientProvider>
                        <TermsApiProvider {...props}>
                            <MyAmphoraApiProvider {...props}>
                                <AmphoraOperationsProvider {...props}>
                                    <SearchApiProvider {...props}>
                                        <GeoApiProvider {...props}>
                                            {props.children}
                                        </GeoApiProvider>
                                    </SearchApiProvider>
                                </AmphoraOperationsProvider>
                            </MyAmphoraApiProvider>
                        </TermsApiProvider>
                    </ApiClientProvider>
                </ConfigurationProvider>
            </IdentityContextProvider>
        </ThemeProvider>
    )
}

export { AmphoraProvider }
