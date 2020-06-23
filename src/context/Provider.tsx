/* eslint-disable no-unused-vars */
import * as React from 'react'
import {
    IdentityContextProps,
    IdentityContextProvider
} from './IdentityContext'
import {
    ConfigurationProviderProps,
    ConfigurationProvider
} from './ConfigurationContext'
import { SearchApiProvider } from './api/SearchContext'

type AmphoraProviderProps = IdentityContextProps & ConfigurationProviderProps

const AmphoraProvider: React.FunctionComponent<AmphoraProviderProps> = (
    props
) => {
    return (
        <IdentityContextProvider userManager={props.userManager}>
            <ConfigurationProvider configuration={props.configuration}>
                <SearchApiProvider>{props.children}</SearchApiProvider>
            </ConfigurationProvider>
        </IdentityContextProvider>
    )
}

export { AmphoraProvider }
