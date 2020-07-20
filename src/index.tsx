// Contexts
import * as IdentityContext from './context/IdentityContext'
import {
    CallbackPage,
    UserInformationComponent,
    SignInButton,
    SignOutButton,
    createUserManager
} from './auth'
import { useAmphoraClients } from './context/ApiClientContext'
import * as TermsOfUseContext from './context/apis/TermsOfUseContext'
import * as SearchContext from './context/apis/SearchContext'
import * as MyAmphoraContext from './context/apis/MyAmphoraContext'
import * as AmphoraOperationsContext from './context/apis/AmphoraOperationsContext'
import { AmphoraProvider } from './context/Provider'
import {
    useConfigState,
    withConfiguration
} from './context/ConfigurationContext'

// actions
import * as Actions from './context/actions'
// Components
import GeoLookupComponent from './components/GeoLookup'
import * as Components from './components'

export {
    // actions
    Actions,
    // Contexts
    useAmphoraClients,
    AmphoraProvider,
    withConfiguration,
    IdentityContext,
    CallbackPage,
    UserInformationComponent,
    SignInButton,
    SignOutButton,
    createUserManager,
    useConfigState,
    SearchContext,
    MyAmphoraContext,
    AmphoraOperationsContext,
    TermsOfUseContext,
    // Components
    Components,
    GeoLookupComponent // todo: remove from high level export
}
