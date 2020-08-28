// Contexts
import * as IdentityContext from './context/IdentityContext'
import {
    CallbackPage,
    UserInformationComponent,
    createUserManager
} from './auth'
import { useAmphoraClients } from './context/ApiClientContext'
import * as TermsOfUseContext from './context/apis/TermsOfUseContext'
import * as SearchContext from './context/apis/search'
import * as MyAmphoraContext from './context/apis/myAmphora'
import * as AmphoraOperationsContext from './context/apis/AmphoraOperationsContext'
import { AmphoraProvider } from './context/Provider'
import {
    useConfigState,
    withConfiguration
} from './context/ConfigurationContext'

// theme
// eslint-disable-next-line no-unused-vars
import { AmphoraTheme } from './theme'

// actions
import * as Actions from './context/actions'
// Components
import {
    GeoLookupComponent,
    PurchaseButton,
    SignInButton,
    SignOutButton,
    SignalsChart,
    SignalsChartErrorBoundary,
    EnsurePurchased,
    FileList,
    FileRenderer
} from './components'

export type Theme = AmphoraTheme
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
    createUserManager,
    useConfigState,
    SearchContext,
    MyAmphoraContext,
    AmphoraOperationsContext,
    TermsOfUseContext,
    // Components
    GeoLookupComponent,
    PurchaseButton,
    SignInButton,
    SignOutButton,
    SignalsChart,
    SignalsChartErrorBoundary,
    EnsurePurchased,
    FileList,
    FileRenderer
}
